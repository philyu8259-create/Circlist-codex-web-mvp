import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getSafeNextPath } from "@/lib/auth";
import type { Database } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const locale = requestUrl.searchParams.get("lang") === "en" ? "en" : "zh";
  const next = getSafeNextPath(requestUrl.searchParams.get("next") ?? undefined);
  const redirectUrl = new URL(next, requestUrl.origin);
  redirectUrl.searchParams.set("lang", locale);
  const response = NextResponse.redirect(redirectUrl);

  if (tokenHash) {
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(
            cookiesToSet: {
              name: string;
              value: string;
              options: CookieOptions;
            }[]
          ) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          }
        }
      }
    );

    await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email"
    });
  }

  return response;
}
