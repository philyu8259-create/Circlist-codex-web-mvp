import type { ReactNode } from "react";

import { AppHeader } from "@/components/AppHeader";
import { resubmitGroupSubmission } from "@/lib/actions/groups";
import { getCurrentUser } from "@/lib/auth";
import {
  categories,
  getCategoryLabel,
  getPlatformLabel,
  platforms
} from "@/lib/domain";
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
  const resubmit = firstParam(params?.resubmit);
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

        {resubmit === "sent" ? (
          <p className="rounded-lg border border-leaf/25 bg-leaf/10 px-4 py-3 text-sm font-medium text-leaf">
            {copy.myGroups.resubmittedSuccess}
          </p>
        ) : null}

        {resubmit === "error" || resubmit === "validation" ? (
          <p className="rounded-lg border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
            {resubmit === "validation"
              ? copy.myGroups.resubmitValidationError
              : copy.myGroups.resubmitError}
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
                >
                  {item.moderation_status === "changes_requested" ? (
                    <ResubmitSubmissionForm
                      copy={copy}
                      item={item}
                      locale={locale}
                    />
                  ) : null}
                </RecordCard>
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
  locale,
  children
}: {
  title: string;
  description: string;
  details?: { label: string; value: string }[];
  status: string;
  timestamp: string | null;
  notes: string | null;
  notesLabel: string;
  locale: Locale;
  children?: ReactNode;
}) {
  const isNeedsChanges = status === "changes_requested";

  return (
    <article
      className={`rounded-lg border bg-white p-4 shadow-sm ${
        isNeedsChanges ? "border-coral/30" : "border-ink/10"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          <p className="mt-1 line-clamp-3 text-sm leading-6 text-ink/60">
            {description}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            isNeedsChanges
              ? "bg-coral/10 text-coral"
              : "bg-leaf/10 text-leaf"
          }`}
        >
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
      {children ? (
        <div className="mt-4 border-t border-ink/10 pt-4">{children}</div>
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

function ResubmitSubmissionForm({
  copy,
  item,
  locale
}: {
  copy: ReturnType<typeof getDictionary>;
  item: UserSubmission;
  locale: Locale;
}) {
  const payload = parseSubmissionPayload(item.proposed_payload);

  return (
    <form action={resubmitGroupSubmission} className="grid gap-4">
      <input name="lang" type="hidden" value={locale} />
      <input name="submissionId" type="hidden" value={item.id} />
      <input
        name="existingQrCodeStoragePath"
        type="hidden"
        value={payload.qrCodeStoragePath}
      />

      <div className="rounded-md bg-coral/10 px-3 py-3">
        <h3 className="text-sm font-semibold text-coral">
          {copy.myGroups.needsActionTitle}
        </h3>
        <p className="mt-1 text-xs leading-5 text-ink/65">
          {copy.myGroups.needsActionDescription}
        </p>
      </div>

      <h3 className="text-sm font-semibold text-ink">
        {copy.myGroups.editTitle}
      </h3>

      <TextField
        defaultValue={item.proposed_name}
        label={copy.submit.name}
        name="name"
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          {copy.submit.platform}
          <select
            className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
            defaultValue={item.proposed_platform}
            name="platform"
            required
          >
            {platforms.map((platform) => (
              <option key={platform} value={platform}>
                {getPlatformLabel(platform, locale)}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm font-medium text-ink">
          {copy.submit.category}
          <select
            className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
            defaultValue={payload.categorySlug || item.categories?.slug || "ai"}
            name="categorySlug"
            required
          >
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {getCategoryLabel(category.slug, locale)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <TextField
        defaultValue={payload.shortDescription}
        label={copy.submit.shortDescription}
        name="shortDescription"
        required
      />
      <TextareaField
        defaultValue={payload.description}
        label={copy.submit.description}
        minHeight="min-h-28"
        name="description"
        required
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium text-ink">
          {copy.submit.joinMethodType}
          <select
            className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
            defaultValue={item.proposed_join_method ?? "invite_link"}
            name="joinMethodType"
            required
          >
            {Object.entries(copy.joinMethodTypes).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <TextField
          defaultValue={payload.joinMethodValue}
          label={copy.submit.joinMethodValue}
          name="joinMethodValue"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          defaultValue={payload.groupLink}
          label={copy.submit.groupLink}
          name="groupLink"
          placeholder="https://"
          type="url"
        />
        <label className="grid gap-2 text-sm font-medium text-ink">
          {copy.submit.qrCode}
          <input
            accept="image/png,image/jpeg,image/webp"
            className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-leaf/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-leaf focus:border-leaf focus:ring-2 focus:ring-leaf/15"
            name="qrCode"
            type="file"
          />
          {payload.qrCodeStoragePath ? (
            <span className="text-xs font-normal leading-5 text-ink/55">
              {copy.myGroups.keepExistingQr}
            </span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          defaultValue={payload.language}
          label={copy.submit.language}
          name="language"
        />
        <TextField
          defaultValue={payload.region}
          label={copy.submit.region}
          name="region"
        />
      </div>
      <TextareaField
        defaultValue={payload.rulesSummary}
        label={copy.submit.rulesSummary}
        minHeight="min-h-20"
        name="rulesSummary"
      />

      <button
        className="min-h-11 w-full rounded-md bg-leaf px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-coral focus:outline-none focus:ring-2 focus:ring-leaf/30 sm:w-fit"
        type="submit"
      >
        {copy.myGroups.resubmitButton}
      </button>
    </form>
  );
}

function TextField({
  defaultValue,
  label,
  name,
  placeholder,
  required,
  type = "text"
}: {
  defaultValue?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <input
        className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
        defaultValue={defaultValue}
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
    </label>
  );
}

function TextareaField({
  defaultValue,
  label,
  minHeight,
  name,
  required
}: {
  defaultValue?: string;
  label: string;
  minHeight: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <textarea
        className={`${minHeight} rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15`}
        defaultValue={defaultValue}
        name={name}
        required={required}
      />
    </label>
  );
}
