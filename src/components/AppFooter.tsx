import Link from "next/link";

import { getDictionary } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

export async function AppFooter() {
  const locale = await getRequestLocale(undefined);
  const copy = getDictionary(locale);
  const langQuery = locale === "zh" ? "?lang=zh" : "?lang=en";

  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-sm text-ink/60 sm:flex-row sm:items-center sm:justify-between">
        <p>{copy.footer.tagline}</p>
        <nav aria-label={copy.footer.label} className="flex flex-wrap gap-4">
          <Link className="transition hover:text-leaf" href={`/privacy${langQuery}`}>
            {copy.footer.privacy}
          </Link>
          <Link className="transition hover:text-leaf" href={`/terms${langQuery}`}>
            {copy.footer.terms}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
