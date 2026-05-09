import Link from "next/link";

import {
  getPlatformLabel,
  platforms,
  type Group,
  type JoinPolicy,
  type Platform
} from "@/lib/domain";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import type { GroupSort } from "@/lib/search";

type SearchPanelProps = {
  locale: Locale;
  query?: string;
  filters?: {
    platform?: Platform | "all";
    price?: Group["price"] | "all";
    joinPolicy?: JoinPolicy | "all";
    sort?: GroupSort;
  };
};

const prices: Group["price"][] = ["free", "paid", "unknown"];
const joinPolicies: JoinPolicy[] = [
  "open",
  "approval_required",
  "invite_only",
  "admin_contact"
];
const sortOptions: GroupSort[] = ["recent", "activity", "name"];

export function SearchPanel({
  locale,
  query = "",
  filters = {}
}: SearchPanelProps) {
  const copy = getDictionary(locale);

  return (
    <form
      action="/"
      className="grid gap-3 rounded-lg border border-ink/10 bg-white p-3 shadow-sm sm:p-4"
    >
      <input name="lang" type="hidden" value={locale} />
      <div className="flex flex-col gap-3 sm:flex-row">
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
          className="min-h-12 shrink-0 rounded-md bg-leaf px-6 text-sm font-semibold text-white transition hover:bg-leaf/90 focus:outline-none focus:ring-2 focus:ring-leaf/30 sm:min-w-28"
          type="submit"
        >
          {copy.search.button}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-ink/45">
          {copy.search.platform}
          <select
            className="min-h-11 min-w-0 rounded-md border border-ink/10 bg-paper px-3 text-sm font-medium normal-case tracking-normal text-ink outline-none transition focus:border-leaf focus:bg-white"
            defaultValue={filters.platform ?? "all"}
            name="platform"
          >
            <option value="all">{copy.search.allPlatforms}</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {getPlatformLabel(platform, locale)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-ink/45">
          {copy.search.price}
          <select
            className="min-h-11 min-w-0 rounded-md border border-ink/10 bg-paper px-3 text-sm font-medium normal-case tracking-normal text-ink outline-none transition focus:border-leaf focus:bg-white"
            defaultValue={filters.price ?? "all"}
            name="price"
          >
            <option value="all">{copy.search.allPrices}</option>
            {prices.map((price) => (
              <option key={price} value={price}>
                {copy.prices[price]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-ink/45">
          {copy.search.joinPolicy}
          <select
            className="min-h-11 min-w-0 rounded-md border border-ink/10 bg-paper px-3 text-sm font-medium normal-case tracking-normal text-ink outline-none transition focus:border-leaf focus:bg-white"
            defaultValue={filters.joinPolicy ?? "all"}
            name="joinPolicy"
          >
            <option value="all">{copy.search.allJoinPolicies}</option>
            {joinPolicies.map((joinPolicy) => (
              <option key={joinPolicy} value={joinPolicy}>
                {copy.joinPolicies[joinPolicy]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold uppercase tracking-wide text-ink/45">
          {copy.search.sort}
          <select
            className="min-h-11 min-w-0 rounded-md border border-ink/10 bg-paper px-3 text-sm font-medium normal-case tracking-normal text-ink outline-none transition focus:border-leaf focus:bg-white"
            defaultValue={filters.sort ?? "recent"}
            name="sort"
          >
            {sortOptions.map((sort) => (
              <option key={sort} value={sort}>
                {copy.search.sortOptions[sort]}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Link
        className="justify-self-start text-sm font-medium text-ink/55 transition hover:text-leaf"
        href={`/?lang=${locale}`}
      >
        {copy.search.clear}
      </Link>
    </form>
  );
}
