import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AppFooter } from "@/components/AppFooter";
import { getDictionary } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { absoluteUrl, siteConfig } from "@/lib/site";
import "./globals.css";

const copy = getDictionary("zh");

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/"),
    languages: {
      en: absoluteUrl("/?lang=en"),
      "zh-CN": absoluteUrl("/?lang=zh")
    }
  },
  applicationName: copy.appName,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    description: siteConfig.description,
    locale: "zh_CN",
    siteName: copy.appName,
    title: siteConfig.defaultTitle,
    type: "website",
    url: absoluteUrl("/")
  },
  title: {
    default: siteConfig.defaultTitle,
    template: `%s | ${copy.appName}`
  },
  twitter: {
    card: "summary",
    description: siteConfig.description,
    title: siteConfig.defaultTitle
  }
};

export default async function RootLayout({
  children
}: {
  children: ReactNode;
}) {
  const locale = await getRequestLocale(undefined);

  return (
    <html lang={locale === "en" ? "en" : "zh-CN"}>
      <body>
        {children}
        <AppFooter />
      </body>
    </html>
  );
}
