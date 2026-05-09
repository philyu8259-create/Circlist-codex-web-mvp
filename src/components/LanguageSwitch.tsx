import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

type LanguageSwitchProps = {
  locale: Locale;
  pathname: string;
  query?: Record<string, string | undefined>;
};

function buildHref(
  pathname: string,
  query: Record<string, string | undefined>,
  locale: Locale
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(query)) {
    if (value) {
      params.set(key, value);
    }
  }

  params.set("lang", locale);
  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function LanguageSwitch({
  locale,
  pathname,
  query = {}
}: LanguageSwitchProps) {
  const copy = getDictionary(locale);
  const languages: { locale: Locale; label: string }[] = [
    { locale: "zh", label: copy.nav.chinese },
    { locale: "en", label: copy.nav.english }
  ];

  return (
    <nav
      aria-label={copy.nav.languageLabel}
      className="inline-flex rounded-full border border-ink/10 bg-white p-1 text-xs font-medium shadow-sm"
    >
      {languages.map((item) => (
        <Link
          aria-current={locale === item.locale ? "page" : undefined}
          className={[
            "rounded-full px-3 py-1.5 transition",
            locale === item.locale
              ? "bg-ink text-white"
              : "text-ink/65 hover:bg-paper hover:text-ink"
          ].join(" ")}
          href={buildHref(pathname, query, item.locale)}
          key={item.locale}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
