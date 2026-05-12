import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";
import { chromium } from "playwright";

import type { Database } from "../src/lib/supabase/types";

function loadEnvFile(path: string) {
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) continue;

    const match = /^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/.exec(trimmed);

    if (!match || process.env[match[1]]) continue;

    process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, "");
  }
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required. Add it to .env.local or export it.`);
  }

  return value;
}

function normalizeEmail(value: string | undefined): string {
  const email = value?.trim().toLowerCase();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Usage: npm run e2e:verify-recovery -- user@example.com [baseUrl]");
  }

  return email;
}

function dateOnly(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function dateOnlyToIso(value: string): string {
  return new Date(`${value}T23:59:59.999Z`).toISOString();
}

async function generateLoginLink({
  email,
  siteUrl,
  supabase
}: {
  email: string;
  siteUrl: string;
  supabase: ReturnType<typeof createClient<Database>>;
}): Promise<string> {
  const { data, error } = await supabase.auth.admin.generateLink({
    email,
    type: "magiclink",
    options: {
      redirectTo: `${siteUrl}/auth/callback?lang=zh&next=%2F`
    }
  });

  if (error) throw error;

  const tokenHash = data.properties.hashed_token;

  return typeof tokenHash === "string" && tokenHash
    ? `${siteUrl}/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}&type=email&lang=zh&next=%2F`
    : data.properties.action_link;
}

async function seedStaleJoinState({
  groupSlug,
  reportMessage,
  supabase
}: {
  groupSlug: string;
  reportMessage: string;
  supabase: ReturnType<typeof createClient<Database>>;
}) {
  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .select("id, trust_signals")
    .eq("slug", groupSlug)
    .maybeSingle();
  const group = groupData as { id: string; trust_signals: string[] | null } | null;

  if (groupError || !group) {
    throw groupError ?? new Error(`Missing test group ${groupSlug}`);
  }

  const { data: joinMethodData, error: joinMethodError } = await supabase
    .from("group_join_methods")
    .select("id")
    .eq("group_id", group.id)
    .eq("visibility", "public")
    .eq("review_status", "approved")
    .limit(1)
    .maybeSingle();
  const joinMethod = joinMethodData as { id: string } | null;

  if (joinMethodError || !joinMethod) {
    throw joinMethodError ?? new Error(`Missing public join method for ${groupSlug}`);
  }

  const staleSignals = Array.from(
    new Set([
      ...(group.trust_signals ?? []).filter((signal) => signal !== "join_method_fresh"),
      "needs_update"
    ])
  );

  const { error: groupUpdateError } = await supabase
    .from("groups")
    .update({
      trust_signals: staleSignals,
      updated_at: new Date().toISOString()
    } as never)
    .eq("id", group.id);

  if (groupUpdateError) throw groupUpdateError;

  const { error: joinUpdateError } = await supabase
    .from("group_join_methods")
    .update({
      expires_at: dateOnlyToIso(dateOnly(-1)),
      updated_at: new Date().toISOString()
    } as never)
    .eq("id", joinMethod.id);

  if (joinUpdateError) throw joinUpdateError;

  const { error: reportError } = await supabase.from("reports").insert({
    group_id: group.id,
    join_method_id: joinMethod.id,
    report_type: "invalid_join_method",
    details: reportMessage,
    status: "pending"
  } as never);

  if (reportError) throw reportError;

  return { groupId: group.id, joinMethodId: joinMethod.id };
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));

  const adminEmail = normalizeEmail(process.argv[2]);
  const baseUrl =
    process.argv[3] ?? process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "http://127.0.0.1:3000";
  const groupSlug = process.argv[4] ?? "langchain-community-slack";
  const reportMessage = `Playwright恢复闭环-${Date.now()}`;
  const futureDate = dateOnly(30);
  const supabase = createClient<Database>(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
  const { groupId, joinMethodId } = await seedStaleJoinState({
    groupSlug,
    reportMessage,
    supabase
  });
  const loginLink = await generateLoginLink({
    email: adminEmail,
    siteUrl: baseUrl,
    supabase
  });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(loginLink, { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/?lang=zh**", { timeout: 20000 });

    await page.goto(`${baseUrl}/admin/groups/${groupId}/edit?lang=zh`, {
      waitUntil: "domcontentloaded"
    });
    await page.locator('input[name="joinMethodExpiresAt"]').fill(futureDate);
    await page.getByRole("button", { name: "保存修改" }).click();
    const confirmButton = page.getByRole("button", { name: "确认保存" });

    try {
      await confirmButton.waitFor({ state: "visible", timeout: 2500 });
      await confirmButton.click();
    } catch {
      // On a cold headless run the server action can submit before hydration opens
      // the client confirmation dialog. In that case the URL assertion below is
      // the source of truth for the completed save.
    }

    await page.waitForURL(`**/admin/groups/${groupId}/edit**edit=updated**`, {
      timeout: 20000
    });

    await page.goto(`${baseUrl}/groups/${groupSlug}?lang=zh`, {
      waitUntil: "domcontentloaded"
    });
    const groupText = await page.locator("body").innerText();

    const { count: pendingReportCount, error: pendingReportError } = await supabase
      .from("reports")
      .select("id", { count: "exact", head: true })
      .eq("group_id", groupId)
      .eq("join_method_id", joinMethodId)
      .eq("status", "pending")
      .in("report_type", ["invalid_join_method", "outdated_info"]);

    if (pendingReportError) throw pendingReportError;

    const { data: refreshedGroup, error: refreshedGroupError } = await supabase
      .from("groups")
      .select("trust_signals")
      .eq("id", groupId)
      .maybeSingle();

    if (refreshedGroupError) throw refreshedGroupError;

    const trustSignals =
      (refreshedGroup as { trust_signals: string[] | null } | null)?.trust_signals ?? [];

    console.log(
      "E2E_RECOVERY_RESULT",
      JSON.stringify(
        {
          adminEmail,
          futureDate,
          frontWarningCleared: !groupText.includes("部分加入方式可能已失效"),
          freshSignalRestored: trustSignals.includes("join_method_fresh"),
          needsUpdateCleared: !trustSignals.includes("needs_update"),
          pendingFreshnessReports: pendingReportCount ?? 0
        },
        null,
        2
      )
    );
  } finally {
    await browser.close();
  }
}

main().catch((error: unknown) => {
  console.error("E2E_RECOVERY_ERROR", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
