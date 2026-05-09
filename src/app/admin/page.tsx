import { AppHeader } from "@/components/AppHeader";
import { AdminQueue } from "@/components/AdminQueue";
import {
  reviewOwnershipClaim,
  reviewReport,
  reviewSubmission
} from "@/lib/actions/admin";
import { getCurrentUser } from "@/lib/auth";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import { hasSupabaseEnv } from "@/lib/supabase/env";

type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

type QueueItem = {
  id: string;
  title: string;
  description: string;
  status: string;
  meta?: string;
};

type SubmissionQueueRow = {
  id: string;
  proposed_name: string;
  proposed_platform: string;
  moderation_status: string;
  created_at: string | null;
};

type ClaimQueueRow = {
  id: string;
  claim_status: string;
  evidence: string;
  created_at: string | null;
};

type ReportQueueRow = {
  id: string;
  report_type: string;
  details: string | null;
  status: string;
  created_at: string | null;
};

type AdminQueues = {
  submissions: QueueItem[];
  claims: QueueItem[];
  reports: QueueItem[];
  canLoadLive: boolean;
  liveUnavailable: boolean;
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

async function getAdminQueues(locale: Locale): Promise<AdminQueues> {
  const emptyQueues: AdminQueues = {
    submissions: [],
    claims: [],
    reports: [],
    canLoadLive: false,
    liveUnavailable: !hasSupabaseEnv()
  };

  if (!hasSupabaseEnv()) {
    return emptyQueues;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const user = await getCurrentUser();

    if (!user) {
      return emptyQueues;
    }

    const supabase = await createClient();
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();
    const profile = profileData as { role: string } | null;

    if (profileError || profile?.role !== "admin") {
      return emptyQueues;
    }

    const [submissionsResult, claimsResult, reportsResult] = await Promise.all([
      supabase
        .from("group_submissions")
        .select("id, proposed_name, proposed_platform, moderation_status, created_at")
        .eq("moderation_status", "pending")
        .order("created_at", { ascending: true })
        .limit(10),
      supabase
        .from("ownership_claims")
        .select("id, claim_status, evidence, created_at")
        .eq("claim_status", "pending")
        .order("created_at", { ascending: true })
        .limit(10),
      supabase
        .from("reports")
        .select("id, report_type, details, status, created_at")
        .eq("status", "pending")
        .order("created_at", { ascending: true })
        .limit(10)
    ]);

    const queryError =
      submissionsResult.error || claimsResult.error || reportsResult.error;

    if (queryError) {
      return { ...emptyQueues, canLoadLive: true, liveUnavailable: true };
    }

    const submissionRows =
      (submissionsResult.data as SubmissionQueueRow[] | null) ?? [];
    const claimRows = (claimsResult.data as ClaimQueueRow[] | null) ?? [];
    const reportRows = (reportsResult.data as ReportQueueRow[] | null) ?? [];

    return {
      canLoadLive: true,
      liveUnavailable: false,
      submissions: submissionRows.map((item) => ({
        id: item.id,
        title: item.proposed_name,
        description: item.proposed_platform,
        status: item.moderation_status,
        meta: formatDate(item.created_at, locale)
      })),
      claims: claimRows.map((item) => ({
        id: item.id,
        title: item.id,
        description: item.evidence,
        status: item.claim_status,
        meta: formatDate(item.created_at, locale)
      })),
      reports: reportRows.map((item) => ({
        id: item.id,
        title: copyReportType(item.report_type, locale),
        description: item.details ?? item.report_type,
        status: item.status,
        meta: formatDate(item.created_at, locale)
      }))
    };
  } catch {
    return { ...emptyQueues, liveUnavailable: true };
  }
}

function copyReportType(value: string, locale: Locale): string {
  const dictionary = getDictionary(locale);

  return value in dictionary.reportTypes
    ? dictionary.reportTypes[value as keyof typeof dictionary.reportTypes]
    : value;
}

function ReviewButtons({
  approveLabel,
  rejectLabel,
  requestChangesLabel,
  showRequestChanges = true
}: {
  approveLabel: string;
  rejectLabel: string;
  requestChangesLabel: string;
  showRequestChanges?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className="rounded-md bg-leaf px-3 py-2 text-xs font-semibold text-white transition hover:bg-leaf/85"
        name="decision"
        type="submit"
        value="approved"
      >
        {approveLabel}
      </button>
      <button
        className="rounded-md bg-coral px-3 py-2 text-xs font-semibold text-white transition hover:bg-coral/85"
        name="decision"
        type="submit"
        value="rejected"
      >
        {rejectLabel}
      </button>
      {showRequestChanges ? (
        <button
          className="rounded-md border border-ink/15 px-3 py-2 text-xs font-semibold text-ink/70 transition hover:border-leaf hover:text-leaf"
          name="decision"
          type="submit"
          value="changes_requested"
        >
          {requestChangesLabel}
        </button>
      ) : null}
    </div>
  );
}

function QueueEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/15 bg-white px-4 py-6 text-sm text-ink/55">
      {message}
    </div>
  );
}

export default async function AdminPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const locale = await getRequestLocale(firstParam(params?.lang));
  const review = firstParam(params?.review);
  const copy = getDictionary(locale);
  const queues = await getAdminQueues(locale);

  return (
    <>
      <AppHeader locale={locale} pathname="/admin" />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-5 py-7">
        <section>
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {copy.admin.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/68">
            {copy.admin.intro}
          </p>
        </section>

        {!queues.canLoadLive ? (
          <p className="rounded-lg border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
            {copy.admin.accessRequired}
          </p>
        ) : null}

        {queues.liveUnavailable ? (
          <p className="rounded-lg border border-ink/10 bg-white px-4 py-3 text-sm font-medium text-ink/65">
            {copy.admin.liveUnavailable}
          </p>
        ) : null}

        {review ? (
          <p className="rounded-lg border border-leaf/25 bg-leaf/10 px-4 py-3 text-sm font-medium text-leaf">
            {review === "updated" ? copy.admin.reviewed : copy.admin.reviewFailed}
          </p>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-3">
          <section className="grid content-start gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {copy.admin.submissionsTitle}
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                {copy.admin.submissionsDescription}
              </p>
            </div>

            {queues.submissions.length > 0 ? (
              queues.submissions.map((item) => (
                <AdminQueue
                  description={item.description}
                  key={item.id}
                  meta={item.meta}
                  status={`${copy.admin.statusLabel}: ${item.status}`}
                  title={item.title}
                >
                  <form action={reviewSubmission} className="grid gap-3">
                    <input name="lang" type="hidden" value={locale} />
                    <input name="submissionId" type="hidden" value={item.id} />
                    <textarea
                      className="min-h-20 rounded-md border border-ink/15 px-3 py-2 text-sm outline-none transition focus:border-leaf"
                      name="reviewerNotes"
                      placeholder={copy.admin.reviewerNotes}
                    />
                    <ReviewButtons
                      approveLabel={copy.admin.approve}
                      rejectLabel={copy.admin.reject}
                      requestChangesLabel={copy.admin.requestChanges}
                    />
                  </form>
                </AdminQueue>
              ))
            ) : (
              <QueueEmpty message={copy.admin.emptyQueue} />
            )}
          </section>

          <section className="grid content-start gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {copy.admin.claimsTitle}
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                {copy.admin.claimsDescription}
              </p>
            </div>

            {queues.claims.length > 0 ? (
              queues.claims.map((item) => (
                <AdminQueue
                  description={item.description}
                  key={item.id}
                  meta={item.meta}
                  status={`${copy.admin.statusLabel}: ${item.status}`}
                  title={item.title}
                >
                  <form action={reviewOwnershipClaim} className="grid gap-3">
                    <input name="lang" type="hidden" value={locale} />
                    <input name="claimId" type="hidden" value={item.id} />
                    <textarea
                      className="min-h-20 rounded-md border border-ink/15 px-3 py-2 text-sm outline-none transition focus:border-leaf"
                      name="reviewerNotes"
                      placeholder={copy.admin.reviewerNotes}
                    />
                    <ReviewButtons
                      approveLabel={copy.admin.approve}
                      rejectLabel={copy.admin.reject}
                      requestChangesLabel={copy.admin.requestChanges}
                      showRequestChanges={false}
                    />
                  </form>
                </AdminQueue>
              ))
            ) : (
              <QueueEmpty message={copy.admin.emptyQueue} />
            )}
          </section>

          <section className="grid content-start gap-3">
            <div>
              <h2 className="text-lg font-semibold text-ink">
                {copy.admin.reportsTitle}
              </h2>
              <p className="mt-1 text-sm leading-6 text-ink/60">
                {copy.admin.reportsDescription}
              </p>
            </div>

            {queues.reports.length > 0 ? (
              queues.reports.map((item) => (
                <AdminQueue
                  description={item.description}
                  key={item.id}
                  meta={item.meta}
                  status={`${copy.admin.statusLabel}: ${item.status}`}
                  title={item.title}
                >
                  <form action={reviewReport} className="grid gap-3">
                    <input name="lang" type="hidden" value={locale} />
                    <input name="reportId" type="hidden" value={item.id} />
                    <ReviewButtons
                      approveLabel={copy.admin.approve}
                      rejectLabel={copy.admin.reject}
                      requestChangesLabel={copy.admin.requestChanges}
                    />
                  </form>
                </AdminQueue>
              ))
            ) : (
              <QueueEmpty message={copy.admin.emptyQueue} />
            )}
          </section>
        </div>
      </main>
    </>
  );
}
