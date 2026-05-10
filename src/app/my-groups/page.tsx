import { AppHeader } from "@/components/AppHeader";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Json } from "@/lib/supabase/types";
import {
  compactDetailItems,
  parseSubmissionPayload
} from "@/lib/submission-payload";

type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

type UserSubmission = {
  id: string;
  proposed_name: string;
  proposed_platform: string;
  proposed_join_method: string | null;
  proposed_join_value: string | null;
  proposed_payload: Json;
  moderation_status: string;
  moderator_notes: string | null;
  created_at: string | null;
  categories: { slug: string | null; name_zh: string | null; name_en: string | null } | null;
};

type UserClaim = {
  id: string;
  claim_status: string;
  evidence: string;
  moderator_notes: string | null;
  created_at: string | null;
  groups: { name: string | null; slug: string | null } | null;
};

type MyGroupData = {
  submissions: UserSubmission[];
  claims: UserClaim[];
  setupMissing: boolean;
  authMissing: boolean;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function formatDate(value: string | null | undefined, locale: Locale): string {
  if (!value) return "";

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

async function getMyGroupData(): Promise<MyGroupData> {
  const emptyData = {
    submissions: [],
    claims: [],
    setupMissing: false,
    authMissing: false
  };

  if (!hasSupabaseEnv()) {
    return { ...emptyData, setupMissing: true };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { ...emptyData, authMissing: true };
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const [submissionsResult, claimsResult] = await Promise.all([
      supabase
        .from("group_submissions")
        .select(
          `
          id,
          proposed_name,
          proposed_platform,
          proposed_join_method,
          proposed_join_value,
          proposed_payload,
          moderation_status,
          moderator_notes,
          created_at,
          categories(slug, name_zh, name_en)
        `
        )
        .eq("submitter_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20),
      supabase
        .from("ownership_claims")
        .select(
          "id, claim_status, evidence, moderator_notes, created_at, groups(name, slug)"
        )
        .eq("claimant_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20)
    ]);

    if (submissionsResult.error || claimsResult.error) {
      return emptyData;
    }

    return {
      ...emptyData,
      submissions: (submissionsResult.data as UserSubmission[] | null) ?? [],
      claims: (claimsResult.data as UserClaim[] | null) ?? []
    };
  } catch {
    return emptyData;
  }
}

export default async function MyGroupsPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const locale = await getRequestLocale(firstParam(params?.lang));
  const submitted = firstParam(params?.submitted);
  const copy = getDictionary(locale);
  const data = await getMyGroupData();

  const pendingCount =
    data.submissions.filter((item) => item.moderation_status === "pending")
      .length +
    data.claims.filter((item) => item.claim_status === "pending").length;
  const needsUpdateCount = data.submissions.filter(
    (item) => item.moderation_status === "changes_requested"
  ).length;

  const stats = [
    { label: copy.myGroups.submitted, value: String(data.submissions.length) },
    {
      label: copy.myGroups.owned,
      value: String(
        data.claims.filter((item) => item.claim_status === "approved").length
      )
    },
    { label: copy.myGroups.pending, value: String(pendingCount) },
    { label: copy.myGroups.needsUpdate, value: String(needsUpdateCount) }
  ];
  const hasRecords = data.submissions.length > 0 || data.claims.length > 0;
  const myGroupsCopy = copy.myGroups;

  return (
    <>
      <AppHeader locale={locale} pathname="/my-groups" />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-5 py-7">
        <section>
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {copy.myGroups.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/68">
            {copy.myGroups.intro}
          </p>
        </section>

        {submitted ? (
          <p className="rounded-lg border border-leaf/25 bg-leaf/10 px-4 py-3 text-sm font-medium text-leaf">
            {copy.myGroups.submittedSuccess}
          </p>
        ) : null}

        {data.setupMissing || data.authMissing ? (
          <p className="rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-medium text-ink/65">
            {data.setupMissing
              ? copy.myGroups.setupRequired
              : copy.myGroups.authRequired}
          </p>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
              key={item.label}
            >
              <span className="block text-3xl font-semibold text-leaf">
                {item.value}
              </span>
              <span className="mt-2 block text-sm font-medium text-ink/65">
                {item.label}
              </span>
            </div>
          ))}
        </section>

        {hasRecords ? (
          <div className="grid gap-5 lg:grid-cols-2">
            <section className="grid content-start gap-3">
              <h2 className="text-lg font-semibold text-ink">
                {copy.myGroups.submissionsTitle}
              </h2>
              {data.submissions.map((item) => (
                <RecordCard
                  description={item.proposed_platform}
                  details={buildSubmissionDetails(item, myGroupsCopy, locale)}
                  key={item.id}
                  locale={locale}
                  notes={item.moderator_notes}
                  notesLabel={copy.myGroups.notes}
                  status={item.moderation_status}
                  timestamp={item.created_at}
                  title={item.proposed_name}
                />
              ))}
            </section>

            <section className="grid content-start gap-3">
              <h2 className="text-lg font-semibold text-ink">
                {copy.myGroups.claimsTitle}
              </h2>
              {data.claims.map((item) => (
                <RecordCard
                  description={item.evidence}
                  key={item.id}
                  locale={locale}
                  notes={item.moderator_notes}
                  notesLabel={copy.myGroups.notes}
                  status={item.claim_status}
                  timestamp={item.created_at}
                  title={item.groups?.name ?? item.groups?.slug ?? item.id}
                />
              ))}
            </section>
          </div>
        ) : (
          <section className="rounded-lg border border-dashed border-ink/15 bg-white px-5 py-10 text-center">
            <h2 className="text-lg font-semibold text-ink">
              {copy.myGroups.emptyTitle}
            </h2>
            <p className="mt-2 text-sm text-ink/60">
              {copy.myGroups.emptyDescription}
            </p>
          </section>
        )}
      </main>
    </>
  );
}

function RecordCard({
  title,
  description,
  details = [],
  status,
  timestamp,
  notes,
  notesLabel,
  locale
}: {
  title: string;
  description: string;
  details?: { label: string; value: string }[];
  status: string;
  timestamp: string | null;
  notes: string | null;
  notesLabel: string;
  locale: Locale;
}) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <p className="mt-1 line-clamp-3 text-sm leading-6 text-ink/60">
            {description}
          </p>
        </div>
        <span className="rounded-full bg-leaf/10 px-2.5 py-1 text-xs font-semibold text-leaf">
          {status}
        </span>
      </div>
      {timestamp ? (
        <p className="mt-3 text-xs text-ink/45">{formatDate(timestamp, locale)}</p>
      ) : null}
      {details.length > 0 ? (
        <dl className="mt-4 grid gap-2 rounded-md bg-paper px-3 py-3 text-xs sm:grid-cols-2">
          {details.map((item) => (
            <div className="min-w-0" key={`${item.label}:${item.value}`}>
              <dt className="font-medium text-ink/45">{item.label}</dt>
              <dd className="mt-1 break-words leading-5 text-ink/75">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}
      {notes ? (
        <p className="mt-3 rounded-md bg-sky px-3 py-2 text-xs leading-5 text-ink/70">
          {notesLabel}: {notes}
        </p>
      ) : null}
    </article>
  );
}

function buildSubmissionDetails(
  item: UserSubmission,
  copy: ReturnType<typeof getDictionary>["myGroups"],
  locale: Locale
) {
  const payload = parseSubmissionPayload(item.proposed_payload);
  const category =
    (locale === "en" ? item.categories?.name_en : item.categories?.name_zh) ??
    payload.categoryLabel ??
    item.categories?.slug ??
    payload.categorySlug;
  const qrCode =
    payload.qrCodeName ||
    payload.qrCodeStoragePath ||
    payload.qrCodeUploadStatus;

  return compactDetailItems([
    { label: copy.platformLabel, value: item.proposed_platform },
    { label: copy.categoryLabel, value: category },
    { label: copy.joinMethodLabel, value: item.proposed_join_method },
    { label: copy.joinValueLabel, value: payload.joinMethodValue },
    { label: copy.groupLinkLabel, value: payload.groupLink },
    { label: copy.qrCodeLabel, value: qrCode },
    { label: copy.languageLabel, value: payload.language },
    { label: copy.regionLabel, value: payload.region },
    { label: copy.descriptionLabel, value: payload.description },
    { label: copy.rulesLabel, value: payload.rulesSummary }
  ]);
}
