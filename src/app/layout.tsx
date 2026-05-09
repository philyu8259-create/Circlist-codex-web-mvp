import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getDictionary } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
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
  const locale = await getRequestLocale(undefined);

  return (
    <html lang={locale === "en" ? "en" : "zh-CN"}>
      <body>{children}</body>
    </html>
  );
}
