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
    throw new Error("Usage: npm run e2e:verify-expired:auto -- user@example.com [baseUrl]");
  }

  return email;
}

async function generateLoginLink(email: string, siteUrl: string): Promise<string> {
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

async function runVerification({
  adminEmail,
  loginLink,
  baseUrl,
  groupSlug,
  joinMethodId
}: {
  adminEmail: string;
  loginLink: string;
  baseUrl: string;
  groupSlug: string;
  joinMethodId: string;
}) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const uniqueMessage = `Playwright自动上报-${Date.now()}`;
  const groupUrl = `${baseUrl}/groups/${groupSlug}`;
  const adminUrl = `${baseUrl}/admin?lang=zh`;

  try {
    await page.goto(loginLink, { waitUntil: "domcontentloaded" });
    await page.waitForURL("**/?lang=zh**", { timeout: 20000 });

    await page.goto(groupUrl, { waitUntil: "domcontentloaded" });
    const groupText = await page.locator("body").innerText();

    const warningVisible =
      groupText.includes("部分加入方式可能已失效") &&
      groupText.includes("已失效");

    const reportForm = page.locator("form#report-group");
    await reportForm.locator('select[name="reportType"]').selectOption("invalid_join_method");
    await reportForm.locator('select[name="joinMethodId"]').selectOption(joinMethodId);
    await reportForm.locator("textarea[name=\"message\"]").fill(uniqueMessage);

    await Promise.all([
      page.waitForURL(`**/groups/${groupSlug}*report=sent*`, { timeout: 20000 }),
      reportForm.locator("button[type=\"submit\"]").click()
    ]);

    await page.goto(adminUrl, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);
    const adminText = await page.locator("body").innerText();

    const result = {
      adminEmail,
      loginSuccess: page.url().startsWith(`${baseUrl}/admin`),
      warningVisible,
      joinWarningShownInReportQueue: adminText.includes("加入方式失效"),
      joinLabelInReportQueue: adminText.includes("Official Slack application"),
      joinValueInReportQueue: adminText.includes("https://www.langchain.com/join-community"),
      detailsInReportQueue: adminText.includes(uniqueMessage)
    };

    console.log("E2E_RESULT", JSON.stringify(result, null, 2));
  } finally {
    await browser.close();
  }
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));

  const adminEmail = normalizeEmail(process.argv[2]);
  const baseUrl = process.argv[3] ?? process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "http://127.0.0.1:3000";
  const groupSlug = process.argv[4] ?? "langchain-community-slack";
  const joinMethodId =
    process.argv[5] ?? "f4542a80-0bf7-43ef-9225-30d31a689cb7";

  const loginLink = await generateLoginLink(adminEmail, baseUrl);
  await runVerification({
    adminEmail,
    loginLink,
    baseUrl,
    groupSlug,
    joinMethodId
  });
}

main().catch((error: unknown) => {
  console.error("E2E_ERROR", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
