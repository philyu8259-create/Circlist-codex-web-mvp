import type { Metadata } from "next";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { getDictionary, normalizeLocale } from "@/lib/i18n";
import "./globals.css";

const copy = getDictionary("zh");

export const metadata: Metadata = {
  title: copy.appName,
  description: copy.subtitle
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const locale = normalizeLocale((await headers()).get("x-circlist-locale"));

  return (
    <html lang={locale === "en" ? "en" : "zh-CN"}>
      <body>{children}</body>
    </html>
  );
}
