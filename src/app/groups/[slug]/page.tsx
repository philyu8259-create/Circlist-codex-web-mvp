import Link from "next/link";

import { AppHeader } from "@/components/AppHeader";
import { getCategoryLabel, getPlatformLabel } from "@/lib/domain";
import { getDictionary, normalizeLocale } from "@/lib/i18n";
import { sampleGroups } from "@/lib/mock-data";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function GroupDetailPage({
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
  const group = sampleGroups.find(
    (item) => item.slug === slug && item.moderationStatus === "approved"
  );

  if (!group) {
    return (
      <>
        <AppHeader locale={locale} pathname={`/groups/${slug}`} />
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-14">
          <Link
            className="text-sm font-semibold text-leaf transition hover:text-coral"
            href={`/?lang=${locale}`}
          >
            {copy.detail.backToBrowse}
          </Link>
          <h1 className="mt-6 text-3xl font-semibold text-ink">
            {copy.detail.notFoundTitle}
          </h1>
          <p className="mt-3 text-base leading-7 text-ink/65">
            {copy.detail.notFoundDescription}
          </p>
        </main>
      </>
    );
  }

  const approvedJoinMethods = group.joinMethods.filter(
    (method) =>
      method.reviewStatus === "approved" && method.visibility === "public"
  );

  return (
    <>
      <AppHeader locale={locale} pathname={`/groups/${group.slug}`} />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-7 px-5 py-7">
        <section>
          <Link
            className="text-sm font-semibold text-leaf transition hover:text-coral"
            href={`/?lang=${locale}`}
          >
            {copy.detail.backToBrowse}
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-full bg-sky px-2.5 py-1 text-ink">
              {getPlatformLabel(group.platform, locale)}
            </span>
            <span className="rounded-full bg-leaf/10 px-2.5 py-1 text-leaf">
              {getCategoryLabel(group.categorySlug, locale)}
            </span>
          </div>
          <h1 className="mt-4 max-w-4xl text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {group.name}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/68">
            {group.shortDescription}
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">
              {copy.detail.about}
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              {group.description}
            </p>
            <h3 className="mt-6 text-sm font-semibold text-ink">
              {copy.detail.suitableFor}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              {group.suitableFor}
            </p>
          </div>

          <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">
              {copy.detail.publicDetails}
            </h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <DetailRow label={copy.fields.platform}>
                {getPlatformLabel(group.platform, locale)}
              </DetailRow>
              <DetailRow label={copy.fields.category}>
                {getCategoryLabel(group.categorySlug, locale)}
              </DetailRow>
              <DetailRow label={copy.fields.language}>
                {group.language}
              </DetailRow>
              <DetailRow label={copy.fields.region}>{group.region}</DetailRow>
              <DetailRow label={copy.fields.joinPolicy}>
                {copy.joinPolicies[group.joinPolicy]}
              </DetailRow>
              <DetailRow label={copy.fields.price}>
                {copy.prices[group.price]}
              </DetailRow>
              <DetailRow label={copy.fields.lastVerified}>
                {group.lastVerifiedAt ?? "-"}
              </DetailRow>
            </dl>
          </aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm lg:col-span-2">
            <h2 className="text-lg font-semibold text-ink">
              {copy.detail.joinMethods}
            </h2>
            {approvedJoinMethods.length > 0 ? (
              <div className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {approvedJoinMethods.map((method) => (
                  <div
                    className="py-4 first:pt-3 last:pb-3"
                    key={method.id}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-ink">
                        {method.label}
                      </h3>
                      <span className="text-xs font-medium text-leaf">
                        {copy.joinMethodTypes[method.type]}
                      </span>
                    </div>
                    <p className="mt-2 break-words text-sm leading-6 text-ink/70">
                      {method.value}
                    </p>
                    <p className="mt-3 text-xs text-ink/50">
                      {copy.fields.lastVerified}:{" "}
                      {method.lastVerifiedAt ?? group.lastVerifiedAt ?? "-"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink/60">
                {copy.detail.noJoinMethods}
              </p>
            )}
          </div>

          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">
              {copy.detail.freshness}
            </h2>
            <dl className="mt-4 grid gap-3 text-sm">
              <DetailRow label={copy.card.activity}>
                {copy.activityLevels[group.activityLevel]}
              </DetailRow>
              <DetailRow label={copy.detail.ownerStatus}>
                {group.ownerVerified
                  ? copy.ownerStatuses.verified
                  : copy.ownerStatuses.unverified}
              </DetailRow>
            </dl>
            <h3 className="mt-5 text-sm font-semibold text-ink">
              {copy.detail.trustSignals}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {group.trustSignals.map((signal) => (
                <li
                  className="rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-medium text-leaf"
                  key={signal}
                >
                  {copy.trustSignals[signal]}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">
            {copy.detail.rules}
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            {group.rulesSummary}
          </p>
        </section>
      </main>
    </>
  );
}

function DetailRow({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink/45">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-ink">{children}</dd>
    </div>
  );
}
