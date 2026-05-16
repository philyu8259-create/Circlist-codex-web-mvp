import { NextResponse, type NextRequest } from "next/server";

import { localeFromSearchOrHeader } from "@/lib/i18n";

const CANONICAL_HOST = "circlist.xufanzhilian.com";
const WWW_HOST = "www.circlist.xufanzhilian.com";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host")?.split(":")[0];

  if (host === WWW_HOST) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.protocol = "https:";
    redirectUrl.hostname = CANONICAL_HOST;
    redirectUrl.port = "";

    return NextResponse.redirect(redirectUrl, 308);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-circlist-locale",
    localeFromSearchOrHeader(
      request.nextUrl.searchParams.get("lang"),
      request.headers.get("accept-language")
    )
  );

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
