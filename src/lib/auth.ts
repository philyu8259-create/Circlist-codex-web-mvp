import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type RequireUserOptions = {
  lang?: string;
  next?: string;
};

export async function getCurrentUser() {
  if (!hasSupabaseEnv()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    return null;
  }

  return user;
}

function safeNextPath(value: string | undefined): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }

  return value;
}

export async function requireUser(options: RequireUserOptions = {}) {
  const user = await getCurrentUser();

  if (!user) {
    const params = new URLSearchParams({ auth: "required" });
    const lang = options.lang === "en" ? "en" : options.lang === "zh" ? "zh" : null;
    const next = safeNextPath(options.next);

    if (lang) params.set("lang", lang);
    if (next) params.set("next", next);

    redirect(`/?${params.toString()}`);
  }

  return user;
}
