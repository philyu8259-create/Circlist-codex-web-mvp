import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { createClient } from "@supabase/supabase-js";

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
    throw new Error("Usage: npm run auth:link -- user@example.com");
  }

  return email;
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));

  const email = normalizeEmail(process.argv[2]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://127.0.0.1:3000";
  const next = "/";
  const redirectTo = `${siteUrl}/auth/callback?lang=zh&next=${encodeURIComponent(next)}`;
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
      redirectTo
    }
  });

  if (error) throw error;

  console.log(`Open this one-time local login link for ${email}:`);
  const tokenHash = data.properties.hashed_token;
  const confirmUrl =
    typeof tokenHash === "string" && tokenHash
      ? `${siteUrl}/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}&type=email&lang=zh&next=${encodeURIComponent(next)}`
      : data.properties.action_link;

  console.log(confirmUrl);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
