import Link from "next/link";

import { AppHeader } from "@/components/AppHeader";
import { GroupCard } from "@/components/GroupCard";
import { Pagination } from "@/components/Pagination";
import { SearchPanel } from "@/components/SearchPanel";
import { getApprovedGroups } from "@/lib/data/groups";
import {
  categories,
  getCategoryLabel,
  platforms,
  type Group,
  type JoinPolicy,
  type Platform
} from "@/lib/domain";
import { getDictionary } from "@/lib/i18n";
import { paginate, parsePageParam } from "@/lib/pagination";
import { getRequestLocale } from "@/lib/request-locale";
import { searchGroups, type GroupSort } from "@/lib/search";

type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePlatform(value: string | undefined): Platform | "all" {
  return value && platforms.includes(value as Platform)
    ? (value as Platform)
    : "all";
}

function parsePrice(value: string | undefined): Group["price"] | "all" {
  return value === "free" || value === "paid" || value === "unknown"
    ? value
    : "all";
}

function parseJoinPolicy(value: string | undefined): JoinPolicy | "all" {
  return value === "open" ||
    value === "approval_required" ||
    value === "admin_contact" ||
    value === "invite_only"
    ? value
    : "all";
}

function parseSort(value: string | undefined): GroupSort {
  return value === "activity" || value === "name" ? value : "recent";
}

function queryValue(value: string, fallback: string): string | undefined {
  return value === fallback ? undefined : value;
}

export default async function HomePage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const locale = await getRequestLocale(firstParam(params?.lang));
  const query = firstParam(params?.q) ?? "";
  const platform = parsePlatform(firstParam(params?.platform));
  const price = parsePrice(firstParam(params?.price));
  const joinPolicy = parseJoinPolicy(firstParam(params?.joinPolicy));
  const sort = parseSort(firstParam(params?.sort));
  const requestedPage = parsePageParam(firstParam(params?.page));
  const copy = getDictionary(locale);
  const approvedGroups = await getApprovedGroups();
  const groups = searchGroups(approvedGroups, {
    query,
    platform,
    price,
    joinPolicy,
    sort
  });
  const page = paginate(groups, requestedPage);
  const activeQuery = {
    q: query,
    platform: queryValue(platform, "all"),
    price: queryValue(price, "all"),
    joinPolicy: queryValue(joinPolicy, "all"),
    sort: queryValue(sort, "recent")
  };

  return (
    <>
      <AppHeader locale={locale} pathname="/" query={activeQuery} />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-7 px-5 py-7">
        <section className="grid gap-5 rounded-lg border border-ink/10 bg-white px-5 py-6 shadow-sm lg:grid-cols-[1fr_14rem] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {copy.home.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-ink/68">
              {copy.home.intro}
            </p>
          </div>
          <div className="rounded-md bg-leaf/10 px-4 py-3 text-sm text-ink/70">
            <span className="block text-2xl font-semibold text-leaf">
              {approvedGroups.length}
            </span>
            {copy.home.approvedCount}
          </div>
        </section>

        <SearchPanel
          filters={{ platform, price, joinPolicy, sort }}
          locale={locale}
          query={query}
        />

        <section aria-labelledby="categories-title">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2
              className="text-sm font-semibold uppercase tracking-wide text-ink/50"
              id="categories-title"
            >
              {copy.home.categoriesTitle}
            </h2>
            <Link
              className="text-sm font-medium text-leaf transition hover:text-coral"
              href={`/?lang=${locale}`}
            >
              {copy.home.allCategories}
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-leaf/40 hover:text-leaf"
                href={`/categories/${category.slug}?lang=${locale}`}
                key={category.slug}
              >
                {getCategoryLabel(category.slug, locale)}
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="results-title">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-xl font-semibold text-ink" id="results-title">
              {copy.home.resultsTitle}
            </h2>
            <span className="text-sm text-ink/55">
              {groups.length} {copy.home.approvedCount}
            </span>
          </div>

          {groups.length > 0 ? (
            <>
              <div className="grid gap-4">
                {page.items.map((group) => (
                  <GroupCard group={group} key={group.id} locale={locale} />
                ))}
              </div>
              <Pagination
                locale={locale}
                pathname="/"
                query={activeQuery}
                state={page}
              />
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-ink/15 bg-white px-5 py-10 text-center">
              <h3 className="text-lg font-semibold text-ink">
                {copy.home.emptyTitle}
              </h3>
              <p className="mt-2 text-sm text-ink/60">
                {copy.home.emptyDescription}
              </p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
