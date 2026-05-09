import { headers } from "next/headers";

import { localeFromSearchOrHeader, type Locale } from "@/lib/i18n";

export async function getRequestLocale(
  searchLang: string | undefined
): Promise<Locale> {
  return localeFromSearchOrHeader(
    searchLang,
    (await headers()).get("x-circlist-locale")
  );
}
