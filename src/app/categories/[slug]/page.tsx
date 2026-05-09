import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/AppHeader";
import { GroupCard } from "@/components/GroupCard";
import { getApprovedGroups } from "@/lib/data/groups";
import { categories, getCategoryLabel, type CategorySlug } from "@/lib/domain";
import { getDictionary, normalizeLocale } from "@/lib/i18n";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((category) => category.slug === value);
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  const [{ slug }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);
  const locale = normalizeLocale(firstParam(resolvedSearchParams?.lang));
  const copy = getDictionary(locale);

  if (!isCategorySlug(slug)) {
    notFound();
  }

  const groups = await getApprovedGroups({ category: slug });
  const categoryLabel = getCategoryLabel(slug, locale);

  return (
    <>
      <AppHeader locale={locale} pathname={`/categories/${slug}`} />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-7 px-5 py-7">
        <section>
          <Link
            className="text-sm font-semibold text-leaf transition hover:text-coral"
            href={`/?lang=${locale}`}
          >
            {copy.category.backHome}
          </Link>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {copy.category.titlePrefix}: {categoryLabel}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/68">
            {copy.category.intro}
          </p>
        </section>

        {groups.length > 0 ? (
          <section className="grid gap-4" aria-label={categoryLabel}>
            {groups.map((group) => (
              <GroupCard group={group} key={group.id} locale={locale} />
            ))}
          </section>
        ) : (
          <section className="rounded-lg border border-dashed border-ink/15 bg-white px-5 py-10 text-center">
            <h2 className="text-lg font-semibold text-ink">
              {copy.category.emptyTitle}
            </h2>
          </section>
        )}
      </main>
    </>
  );
}
