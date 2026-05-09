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
    throw new Error("Usage: npm run admin:promote -- user@example.com");
  }

  return email;
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));
  loadEnvFile(resolve(process.cwd(), ".env"));

  const email = normalizeEmail(process.argv[2]);
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
  const {
    data: { users },
    error: usersError
  } = await supabase.auth.admin.listUsers();

  if (usersError) throw usersError;

  const user = users.find((item) => item.email?.toLowerCase() === email);

  if (!user) {
    throw new Error(
      `No Supabase auth user found for ${email}. Sign in once first, then rerun this command.`
    );
  }

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    display_name:
      (typeof user.user_metadata.name === "string" && user.user_metadata.name) ||
      email.split("@")[0],
    avatar_url:
      typeof user.user_metadata.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null,
    role: "admin",
    updated_at: new Date().toISOString()
  } as never);

  if (error) throw error;

  console.log(`Promoted ${email} to admin.`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
