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
    throw new Error(
      "Usage: npm run e2e:verify-admin-report-queue -- user@example.com [baseUrl]"
    );
  }

  return email;
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

async function seedReportQueueItem({
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
    .select("id")
    .eq("slug", groupSlug)
    .maybeSingle();
  const group = groupData as { id: string } | null;

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

  const { data: reportData, error: reportError } = await supabase
    .from("reports")
    .insert({
      group_id: group.id,
      join_method_id: joinMethod.id,
      report_type: "invalid_join_method",
      details: reportMessage,
      status: "pending"
    } as never)
    .select("id")
    .single();
  const report = reportData as { id: string } | null;

  if (reportError || !report) {
    throw reportError ?? new Error("Failed to seed report queue item.");
  }

  return { groupId: group.id, joinMethodId: joinMethod.id, reportId: report.id };
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));

  const adminEmail = normalizeEmail(process.argv[2]);
  const baseUrl =
    process.argv[3] ?? process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "http://127.0.0.1:3000";
  const groupSlug = process.argv[4] ?? "langchain-community-slack";
  const reportMessage = `Playwright报告队列-${Date.now()}`;
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
  const { groupId, joinMethodId, reportId } = await seedReportQueueItem({
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

    await page.goto(
      `${baseUrl}/admin?lang=zh&reportStatus=pending&reportType=invalid_join_method`,
      { waitUntil: "domcontentloaded" }
    );

    const bodyText = await page.locator("body").innerText();
    const editLink = page.getByRole("link", { name: "去编辑加入方式" }).first();
    const editHref = await editLink.getAttribute("href");

    if (!bodyText.includes("反馈状态") || !bodyText.includes("反馈类型")) {
      throw new Error("Report queue filters did not render.");
    }

    if (!bodyText.includes(reportMessage)) {
      throw new Error("Seeded report was not visible in the filtered queue.");
    }

    if (!bodyText.includes("保存后系统会重新检查失效提醒")) {
      throw new Error("Join freshness notice was not visible.");
    }

    if (editHref !== `/admin/groups/${groupId}/edit?lang=zh`) {
      throw new Error(`Unexpected edit link href: ${editHref ?? "<missing>"}`);
    }

    await Promise.all([
      page.waitForURL(`**/admin/groups/${groupId}/edit?lang=zh`, {
        timeout: 20000
      }),
      editLink.click()
    ]);

    console.log(
      "E2E_ADMIN_REPORT_QUEUE_RESULT",
      JSON.stringify(
        {
          adminEmail,
          editLinkOpened: true,
          groupId,
          joinMethodId,
          reportId,
          reportVisible: true
        },
        null,
        2
      )
    );
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("E2E_ADMIN_REPORT_QUEUE_ERROR", error);
  process.exit(1);
});
