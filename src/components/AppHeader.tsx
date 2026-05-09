import Link from "next/link";

import { getDictionary, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";

type AppHeaderProps = {
  locale: Locale;
  pathname?: string;
  query?: Record<string, string | undefined>;
};

export function AppHeader({
  locale,
  pathname = "/",
  query = {}
}: AppHeaderProps) {
  const copy = getDictionary(locale);
  const langQuery = locale === "zh" ? "?lang=zh" : "?lang=en";

  return (
    <header className="border-b border-ink/10 bg-paper/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link className="min-w-0" href={`/${langQuery}`}>
          <span className="block text-lg font-semibold leading-tight text-ink">
            {copy.appName}
          </span>
          <span className="block text-xs text-ink/60">{copy.subtitle}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            className="hidden text-sm font-medium text-ink/70 transition hover:text-leaf sm:inline"
            href={`/${langQuery}`}
          >
            {copy.nav.browse}
          </Link>
          <LanguageSwitch locale={locale} pathname={pathname} query={query} />
        </div>
      </div>
    </header>
  );
}
