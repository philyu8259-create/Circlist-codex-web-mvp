import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { getSafeNextPath } from "@/lib/auth";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
type AuthResult = "sent" | "error" | "network" | "rate_limited";

function text(value: FormDataEntryValue | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function localeParam(value: FormDataEntryValue | null): "zh" | "en" {
  return text(value) === "en" ? "en" : "zh";
}

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

function classifyAuthError(error: unknown): Exclude<AuthResult, "sent"> {
  const message =
    error && typeof error === "object" && "message" in error
      ? String(error.message)
      : String(error ?? "");
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("rate") ||
    normalizedMessage.includes("security purposes") ||
    normalizedMessage.includes("too many")
  ) {
    return "rate_limited";
  }

  if (
    normalizedMessage.includes("fetch failed") ||
    normalizedMessage.includes("timeout") ||
    normalizedMessage.includes("network")
  ) {
    return "network";
  }

  return "error";
}

async function sendOtpWithRetry({
  email,
  redirectTo
}: {
  email: string;
  redirectTo: string;
}): Promise<AuthResult> {
  const { createClient } = await import("@/lib/supabase/server");
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (!error) return "sent";

      lastError = error;

      if (classifyAuthError(error) !== "network") {
        break;
      }
    } catch (error) {
      lastError = error;
    }
  }

  const result = classifyAuthError(lastError);
  console.error("Magic link send failed", {
    emailDomain: email.split("@")[1] ?? "unknown",
    result
  });

  return result;
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
  const result = await sendOtpWithRetry({
    email,
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
