import { createClient } from "@supabase/supabase-js";

import type { Locale } from "@/lib/i18n";
import type { Database } from "@/lib/supabase/types";

export type AuthEmailChannel = "resend" | "supabase";
export type AuthEmailResult = "sent" | "error" | "network" | "rate_limited";

type MagicLinkEmailInput = {
  email: string;
  locale: Locale;
  redirectTo: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required.`);
  }

  return value;
}

function hasResendAuthEmailEnv(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY?.trim() &&
      process.env.AUTH_EMAIL_FROM?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() &&
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  );
}

export function getAuthEmailChannel(): AuthEmailChannel {
  return hasResendAuthEmailEnv() ? "resend" : "supabase";
}

export function classifyAuthError(error: unknown): Exclude<AuthEmailResult, "sent"> {
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

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    switch (character) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return character;
    }
  });
}

function buildMagicLinkEmail({
  confirmationUrl,
  locale
}: {
  confirmationUrl: string;
  locale: Locale;
}) {
  const isEnglish = locale === "en";
  const subject = isEnglish
    ? "Your Circlist sign-in link"
    : "你的 Circlist 登录链接";
  const title = isEnglish ? "Sign in to Circlist" : "登录 Circlist";
  const body = isEnglish
    ? "Use this one-time link to sign in. If you did not request it, you can ignore this email."
    : "点击这个一次性链接完成登录。如果不是你本人操作，可以忽略这封邮件。";
  const cta = isEnglish ? "Sign in" : "登录";
  const escapedLink = escapeHtml(confirmationUrl);

  return {
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #17211c;">
        <h1 style="font-size: 24px; margin: 0 0 12px;">${title}</h1>
        <p style="margin: 0 0 20px;">${body}</p>
        <p style="margin: 0 0 20px;">
          <a href="${escapedLink}" style="display: inline-block; border-radius: 8px; background: #2f7d59; color: #ffffff; padding: 10px 16px; text-decoration: none; font-weight: 700;">${cta}</a>
        </p>
        <p style="font-size: 13px; color: #66736d; word-break: break-all;">${escapedLink}</p>
      </div>
    `,
    subject,
    text: `${title}\n\n${body}\n\n${confirmationUrl}`
  };
}

function buildConfirmationUrl({
  locale,
  redirectTo,
  tokenHash
}: {
  locale: Locale;
  redirectTo: string;
  tokenHash: string;
}): string {
  const redirectUrl = new URL(redirectTo);
  const confirmationUrl = new URL("/auth/confirm", redirectUrl.origin);
  const next = redirectUrl.searchParams.get("next") ?? "/";

  confirmationUrl.searchParams.set("token_hash", tokenHash);
  confirmationUrl.searchParams.set("type", "email");
  confirmationUrl.searchParams.set("lang", locale);
  confirmationUrl.searchParams.set("next", next);

  return confirmationUrl.toString();
}

function shouldFallbackToSupabase(error: unknown): boolean {
  const message = (() => {
    if (error && typeof error === "object" && "message" in error) {
      return String(error.message).toLowerCase();
    }

    return String(error).toLowerCase();
  })();

  return (
    message.includes("validation_error") ||
    message.includes("only send testing emails") ||
    message.includes("verify a domain") ||
    message.includes("from address")
  );
}

async function sendMagicLinkWithResend({
  email,
  locale,
  redirectTo
}: MagicLinkEmailInput): Promise<AuthEmailResult> {
  const supabase = createClient<Database>(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
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

  if (error) {
    throw error;
  }

  const tokenHash = data.properties.hashed_token;
  const confirmationUrl =
    typeof tokenHash === "string" && tokenHash
      ? buildConfirmationUrl({ locale, redirectTo, tokenHash })
      : data.properties.action_link;
  const emailContent = buildMagicLinkEmail({ confirmationUrl, locale });
  const response = await fetch("https://api.resend.com/emails", {
    body: JSON.stringify({
      from: requiredEnv("AUTH_EMAIL_FROM"),
      html: emailContent.html,
      reply_to: process.env.AUTH_EMAIL_REPLY_TO?.trim() || undefined,
      subject: emailContent.subject,
      text: emailContent.text,
      to: email
    }),
    headers: {
      Authorization: `Bearer ${requiredEnv("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID()
    },
    method: "POST"
  });

  if (!response.ok) {
    const detail = await response.text();

    throw new Error(`Resend email failed: ${response.status} ${detail}`);
  }

  return "sent";
}

async function sendMagicLinkWithSupabase({
  email,
  redirectTo
}: MagicLinkEmailInput): Promise<AuthEmailResult> {
  const { createClient: createServerSupabaseClient } = await import(
    "@/lib/supabase/server"
  );
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectTo
    }
  });

  if (error) {
    throw error;
  }

  return "sent";
}

export async function sendMagicLinkEmail(
  input: MagicLinkEmailInput
): Promise<AuthEmailResult> {
  const hasResendChannel = getAuthEmailChannel() === "resend";
  const sender =
    hasResendChannel
      ? sendMagicLinkWithResend
      : sendMagicLinkWithSupabase;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      return await sender(input);
    } catch (error) {
      lastError = error;

      if (
        hasResendChannel &&
        classifyAuthError(error) === "error" &&
        shouldFallbackToSupabase(error)
      ) {
        try {
          return await sendMagicLinkWithSupabase(input);
        } catch (fallbackError) {
          lastError = fallbackError;
        }
      }

      if (classifyAuthError(error) !== "network") {
        break;
      }
    }
  }

  const result = classifyAuthError(lastError);
  const detail = lastError
    ? String(
        lastError && typeof lastError === "object" && "message" in lastError
          ? lastError.message
          : lastError
      )
    : "unknown";
  console.error("Magic link send failed", {
    channel: getAuthEmailChannel(),
    emailDomain: input.email.split("@")[1] ?? "unknown",
    detail,
    result
  });

  return result;
}
