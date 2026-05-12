import { chromium } from "playwright";

async function main() {
  const adminEmail = process.argv[2] ?? "67238615@qq.com";
  const loginLink = process.argv[3] ?? process.env.ADMIN_LOGIN_LINK;
  const baseUrl = process.argv[4] ?? "http://127.0.0.1:3000";
  const groupSlug = process.argv[5] ?? "langchain-community-slack";
  const joinMethodId =
    process.argv[6] ?? "f4542a80-0bf7-43ef-9225-30d31a689cb7";

  if (!loginLink || !adminEmail) {
    console.error("Usage: npm run e2e:verify-expired -- <adminEmail> <loginLink> [baseUrl] [groupSlug] [joinMethodId]");
    process.exitCode = 1;
    return;
  }

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

main().catch((error) => {
  console.error("E2E_ERROR", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
