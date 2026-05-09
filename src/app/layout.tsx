import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getDictionary } from "@/lib/i18n";
import "./globals.css";

const copy = getDictionary("zh");

export const metadata: Metadata = {
  title: copy.appName,
  description: copy.subtitle
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
