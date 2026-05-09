import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/AppHeader";
import { claimGroup } from "@/lib/actions/groups";
import { reportGroup } from "@/lib/actions/reports";
import { getApprovedGroupBySlug } from "@/lib/data/groups";
import { getCategoryLabel, getGroupText, getPlatformLabel } from "@/lib/domain";
import {
  getOwnerTrustStatus,
  isExternalJoinValue,
  shouldShowInvestmentRisk
} from "@/lib/group-detail";
import { getDictionary } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

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
  const locale = await getRequestLocale(firstParam(resolvedSearchParams?.lang));
  const reportState = firstParam(resolvedSearchParams?.report);
  const claimState = firstParam(resolvedSearchParams?.claim);
  const copy = getDictionary(locale);
  const group = await getApprovedGroupBySlug(slug);

  if (!group) {
    notFound();
  }

  const approvedJoinMethods = group.joinMethods.filter(
    (method) =>
      method.reviewStatus === "approved" && method.visibility === "public"
  );
  const ownerTrustStatus = getOwnerTrustStatus(group);
  const ownerTrustCopy =
    ownerTrustStatus === "verified"
      ? copy.detail.officialMaintained
      : copy.detail.publicUnofficial;
  const showInvestmentRisk = shouldShowInvestmentRisk(group.categorySlug);

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
            {getGroupText(group, "shortDescription", locale)}
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <TrustSummaryItem label={copy.detail.officialStatus}>
              {ownerTrustCopy}
            </TrustSummaryItem>
            <TrustSummaryItem label={copy.fields.lastVerified}>
              {group.lastVerifiedAt ?? "-"}
            </TrustSummaryItem>
            <TrustSummaryItem label={copy.fields.joinPolicy}>
              {copy.joinPolicies[group.joinPolicy]}
            </TrustSummaryItem>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_20rem]">
          <div className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-ink">
              {copy.detail.about}
            </h2>
            <p className="mt-3 text-sm leading-7 text-ink/70">
              {getGroupText(group, "description", locale)}
            </p>
            <h3 className="mt-6 text-sm font-semibold text-ink">
              {copy.detail.suitableFor}
            </h3>
            <p className="mt-2 text-sm leading-6 text-ink/70">
              {getGroupText(group, "suitableFor", locale)}
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
                {getGroupText(group, "language", locale)}
              </DetailRow>
              <DetailRow label={copy.fields.region}>
                {getGroupText(group, "region", locale)}
              </DetailRow>
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
                      {isExternalJoinValue(method.value) ? (
                        <a
                          className="inline-flex min-h-11 items-center justify-center rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral"
                          href={method.value}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {copy.detail.joinNow}
                        </a>
                      ) : (
                        method.value
                      )}
                    </p>
                    {isExternalJoinValue(method.value) ? (
                      <>
                        <p className="mt-2 break-words text-xs leading-5 text-ink/50">
                          {method.value}
                        </p>
                        <p className="mt-2 text-xs leading-5 text-ink/50">
                          {copy.detail.externalLinkHint}
                        </p>
                      </>
                    ) : null}
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
            <Link
              className="mt-4 inline-flex text-sm font-semibold text-leaf transition hover:text-coral"
              href="#report-group"
            >
              {copy.detail.reportLinkIssue}
            </Link>
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
                {ownerTrustCopy}
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

        {showInvestmentRisk ? (
          <section className="rounded-lg border border-coral/25 bg-coral/5 p-5">
            <h2 className="text-lg font-semibold text-ink">
              {copy.detail.investmentRiskTitle}
            </h2>
            <p className="mt-2 text-sm leading-7 text-ink/70">
              {copy.detail.investmentRiskBody}
            </p>
          </section>
        ) : null}

        <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-ink">
            {copy.detail.rules}
          </h2>
          <p className="mt-3 text-sm leading-7 text-ink/70">
            {getGroupText(group, "rulesSummary", locale)}
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <form
            action={claimGroup}
            className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
          >
            <input name="lang" type="hidden" value={locale} />
            <input name="groupSlug" type="hidden" value={group.slug} />
            <h2 className="text-lg font-semibold text-ink">
              {copy.detail.claimTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              {copy.detail.claimIntro}
            </p>
            {claimState === "sent" ? (
              <p className="mt-3 rounded-md bg-leaf/10 px-3 py-2 text-sm font-medium text-leaf">
                {copy.detail.claimSent}
              </p>
            ) : null}
            <label className="mt-4 grid gap-2 text-sm font-medium text-ink">
              {copy.detail.claimEvidence}
              <textarea
                className="min-h-24 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
                name="evidence"
                required
              />
            </label>
            <button
              className="mt-4 rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral"
              type="submit"
            >
              {copy.detail.claimButton}
            </button>
          </form>

          <form
            action={reportGroup}
            className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
            id="report-group"
          >
            <input name="lang" type="hidden" value={locale} />
            <input name="groupSlug" type="hidden" value={group.slug} />
            <input
              autoComplete="off"
              className="hidden"
              name="website"
              tabIndex={-1}
              type="text"
            />
            <h2 className="text-lg font-semibold text-ink">
              {copy.detail.reportTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              {copy.detail.reportIntro}
            </p>
            {reportState === "sent" ? (
              <p className="mt-3 rounded-md bg-leaf/10 px-3 py-2 text-sm font-medium text-leaf">
                {copy.detail.reportSent}
              </p>
            ) : null}
            <label className="mt-4 grid gap-2 text-sm font-medium text-ink">
              {copy.detail.reportType}
              <select
                className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
                name="reportType"
              >
                {Object.entries(copy.reportTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="mt-4 grid gap-2 text-sm font-medium text-ink">
              {copy.detail.reportMessage}
              <textarea
                className="min-h-24 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
                name="message"
              />
            </label>
            <button
              className="mt-4 rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral"
              type="submit"
            >
              {copy.detail.reportButton}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}

function TrustSummaryItem({
  label,
  children
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-md border border-ink/10 bg-white px-4 py-3 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/45">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-5 text-ink">
        {children}
      </p>
    </div>
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
