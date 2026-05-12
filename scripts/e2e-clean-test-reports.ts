import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

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

function looksLikeTestReport(value: string | null): boolean {
  if (!value) return false;
  return /^Playwright\u81ea\u52a8\u4e0a\u62a5-\d+$/.test(value);
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY")
  );

  const now = new Date();
  const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayStart.getDate() + 1);

  const { data, error } = await supabase
    .from("reports")
    .select("id,details,created_at")
    .gte("created_at", dayStart.toISOString())
    .lt("created_at", dayEnd.toISOString())
    .like("details", "Playwright%e")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("CLEAN_ERROR", error.message);
    process.exit(1);
  }

  const candidates = (data ?? []).filter((item) => looksLikeTestReport(item.details));

  if (candidates.length === 0) {
    console.log("CLEAN_SUMMARY", JSON.stringify({ removed: 0 }));
    return;
  }

  const ids = candidates.map((item) => item.id);

  const { error: deleteError, count } = await supabase
    .from("reports")
    .delete({ count: "exact" })
    .in("id", ids);

  if (deleteError) {
    console.error("CLEAN_ERROR", deleteError.message);
    process.exit(1);
  }

  console.log(
    "CLEAN_SUMMARY",
    JSON.stringify({
      removed: count ?? candidates.length,
      sample: candidates.slice(0, 10).map((item) => item.id)
    })
  );
}

main().catch((error: unknown) => {
  console.error("CLEAN_ERROR", error instanceof Error ? error.message : String(error));
  process.exit(1);
});
