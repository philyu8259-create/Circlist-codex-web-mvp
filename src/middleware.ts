import { NextResponse, type NextRequest } from "next/server";

import { localeFromSearchOrHeader } from "@/lib/i18n";

export function middleware(request: NextRequest) {
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
