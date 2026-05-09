import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

type SearchPanelProps = {
  locale: Locale;
  query?: string;
};

export function SearchPanel({ locale, query = "" }: SearchPanelProps) {
  const copy = getDictionary(locale);

  return (
    <form
      action="/"
      className="flex flex-col gap-3 rounded-lg border border-ink/10 bg-white p-3 shadow-sm sm:flex-row"
    >
      <input name="lang" type="hidden" value={locale} />
      <label className="sr-only" htmlFor="group-search">
        {copy.search.label}
      </label>
      <input
        className="min-h-12 flex-1 rounded-md border border-ink/10 bg-paper px-4 text-base text-ink outline-none transition placeholder:text-ink/45 focus:border-leaf focus:bg-white focus:ring-2 focus:ring-leaf/15"
        defaultValue={query}
        id="group-search"
        name="q"
        placeholder={copy.search.placeholder}
        type="search"
      />
      <button
        className="min-h-12 rounded-md bg-leaf px-6 text-sm font-semibold text-white transition hover:bg-leaf/90 focus:outline-none focus:ring-2 focus:ring-leaf/30"
        type="submit"
      >
        {copy.search.button}
      </button>
    </form>
  );
}
