import { NextResponse, type NextRequest } from "next/server";

import { normalizeLocale } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(
    "x-circlist-locale",
    normalizeLocale(request.nextUrl.searchParams.get("lang"))
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
