import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeNextPath } from "@/lib/auth";
import { sendMagicLinkEmail } from "@/lib/auth-email";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: FormDataEntryValue | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function localeParam(value: FormDataEntryValue | null): "zh" | "en" {
  return text(value) === "en" ? "en" : "zh";
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

export async function sendMagicLink(formData: FormData) {
  "use server";

  const locale = localeParam(formData.get("lang"));
  const email = text(formData.get("email")).toLowerCase();
  const next = getSafeNextPath(text(formData.get("next")));
  const params = new URLSearchParams({ lang: locale, next });

  if (!isValidEmail(email)) {
    params.set("auth", "error");
    redirect(`/login?${params.toString()}`);
  }

  const headerStore = await headers();
  const origin = headerStore.get("origin") ?? "http://127.0.0.1:3000";
  const callbackParams = new URLSearchParams({ next, lang: locale });
  const result = await sendMagicLinkEmail({
    email,
    locale,
    redirectTo: `${origin}/auth/callback?${callbackParams.toString()}`
  });

  params.set("auth", result);
  redirect(`/login?${params.toString()}`);
}

export async function signOut(formData: FormData) {
  "use server";

  const locale = localeParam(formData.get("lang"));
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  await supabase.auth.signOut();
  redirect(`/?lang=${locale}`);
}
