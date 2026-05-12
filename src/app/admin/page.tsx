import { AppHeader } from "@/components/AppHeader";
import { AdminBatchGroupForm } from "@/components/AdminBatchGroupForm";
import { AdminQueue } from "@/components/AdminQueue";
import { AdminReviewForm } from "@/components/AdminReviewForm";
import { Pagination } from "@/components/Pagination";
import Link from "next/link";
import {
  ADMIN_GROUPS_PER_PAGE,
  adminGroupStatuses,
  hasActiveAdminGroupFilters,
  normalizeAdminGroupFilters,
  type AdminGroupFilters
} from "@/lib/admin-group-filters";
import {
  adminReportStatuses,
  adminReportTypes,
  hasActiveAdminReportFilters,
  isJoinFreshnessReportFilterType,
  normalizeAdminReportFilters,
  type AdminReportFilters
} from "@/lib/admin-report-filters";
import {
  batchUpdateAdminGroups,
  reviewOwnershipClaim,
  reviewReport,
  reviewSubmission
} from "@/lib/actions/admin";
import {
  formatAdminAuditEvent,
  type AdminAuditEventRow
} from "@/lib/admin-audit";
import { getCurrentUser } from "@/lib/auth";
import {
  categories,
  getCategoryLabel,
  getPlatformLabel,
  platforms
} from "@/lib/domain";
import { getDictionary, type Locale } from "@/lib/i18n";
import type { PaginationState } from "@/lib/pagination";
import { getRequestLocale } from "@/lib/request-locale";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import {
  compactDetailItems,
  parseSubmissionPayload
} from "@/lib/submission-payload";

type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

type QueueItem = {
  id: string;
  actionHref?: string;
  actionLabel?: string;
  title: string;
  description: string;
  status: string;
  rawStatus?: string;
  details?: { label: string; value: string }[];
  meta?: string;
  notice?: string;
};

type SubmissionQueueRow = {
  id: string;
  proposed_name: string;
  proposed_platform: string;
  proposed_join_method: string | null;
  proposed_join_value: string | null;
  proposed_payload: unknown;
  submitter_id: string;
  moderation_status: string;
  created_at: string | null;
  categories: { slug: string | null; name_zh: string | null; name_en: string | null } | null;
};

type ClaimQueueRow = {
  id: string;
  claimant_id: string;
  claim_status: string;
  evidence: string;
  created_at: string | null;
  groups: { name: string | null; slug: string | null } | null;
};

type ReportQueueRow = {
  id: string;
  group_id: string | null;
  join_method_id: string | null;
  reporter_id: string | null;
  report_type: string;
  details: string | null;
  status: string;
  created_at: string | null;
  groups: { name: string | null; slug: string | null } | null;
  group_join_methods: {
    label: string | null;
    type: string | null;
    value: string | null;
  } | null;
};

type AdminGroupRow = {
  id: string;
  name: string;
  slug: string;
  platform: string;
  moderation_status: string;
  updated_at: string | null;
  categories: { slug: string | null } | { slug: string | null }[] | null;
};

type AdminQueues = {
  submissions: QueueItem[];
  claims: QueueItem[];
  reports: QueueItem[];
  auditEvents: QueueItem[];
  recentGroups: QueueItem[];
  recentGroupPagination: PaginationState<QueueItem>;
  recentGroupCount: number;
  pendingSubmissionCount: number;
  pendingClaimCount: number;
  pendingReportCount: number;
  publishedGroupCount: number;
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

function formatSubmissionDescription(
  item: SubmissionQueueRow,
  locale: Locale
): string {
  const payload = parseSubmissionPayload(item.proposed_payload);
  const category =
    locale === "en" ? item.categories?.name_en : item.categories?.name_zh;
  const parts = [
    item.proposed_platform,
    category ?? item.categories?.slug ?? "",
    payload.shortDescription,
    item.proposed_join_value ?? item.proposed_join_method ?? ""
  ].filter(Boolean);

  return parts.join(" · ");
}

function buildSubmissionDetails(
  item: SubmissionQueueRow,
  copy: ReturnType<typeof getDictionary>["admin"],
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
    { label: copy.submitterLabel, value: item.submitter_id.slice(0, 8) },
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

function buildClaimDetails(
  item: ClaimQueueRow,
  copy: ReturnType<typeof getDictionary>["admin"]
) {
  return compactDetailItems([
    {
      label: copy.groupLabel,
      value: item.groups?.name ?? item.groups?.slug ?? ""
    },
    { label: copy.claimantLabel, value: item.claimant_id.slice(0, 8) },
    { label: copy.descriptionLabel, value: item.evidence }
  ]);
}

function buildReportDetails(
  item: ReportQueueRow,
  copy: ReturnType<typeof getDictionary>["admin"],
  locale: Locale
) {
  return compactDetailItems([
    {
      label: copy.groupLabel,
      value: item.groups?.name ?? item.groups?.slug ?? item.group_id
    },
    { label: copy.reporterLabel, value: item.reporter_id?.slice(0, 8) },
    { label: copy.reportTypeLabel, value: copyReportType(item.report_type, locale) },
    { label: copy.joinMethodLabel, value: item.group_join_methods?.label },
    { label: copy.joinValueLabel, value: item.group_join_methods?.value },
    { label: copy.descriptionLabel, value: item.details }
  ]);
}

function escapeIlikeTerm(value: string): string {
  return value.replace(/[%_,]/g, " ").trim();
}

function firstCategorySlug(
  category: AdminGroupRow["categories"]
): string | null {
  return Array.isArray(category) ? category[0]?.slug ?? null : category?.slug ?? null;
}

async function getAdminQueues(
  locale: Locale,
  groupFilters: AdminGroupFilters,
  reportFilters: AdminReportFilters
): Promise<AdminQueues> {
  const emptyQueues: AdminQueues = {
    submissions: [],
    claims: [],
    reports: [],
    recentGroups: [],
    auditEvents: [],
    recentGroupPagination: {
      currentPage: 1,
      endItem: 0,
      items: [],
      pageSize: ADMIN_GROUPS_PER_PAGE,
      startItem: 0,
      totalItems: 0,
      totalPages: 1
    },
    recentGroupCount: 0,
    pendingSubmissionCount: 0,
    pendingClaimCount: 0,
    pendingReportCount: 0,
    publishedGroupCount: 0,
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

    const groupStart = (groupFilters.page - 1) * ADMIN_GROUPS_PER_PAGE;
    const groupEnd = groupStart + ADMIN_GROUPS_PER_PAGE - 1;
    let managedGroupsQuery = supabase
      .from("groups")
      .select(
        "id, name, slug, platform, moderation_status, updated_at, categories!inner(slug)",
        { count: "exact" }
      )
      .order("updated_at", { ascending: false, nullsFirst: false })
      .range(groupStart, groupEnd);

    if (groupFilters.status === "all") {
      managedGroupsQuery = managedGroupsQuery.in("moderation_status", [
        ...adminGroupStatuses
      ]);
    } else {
      managedGroupsQuery = managedGroupsQuery.eq(
        "moderation_status",
        groupFilters.status
      );
    }

    if (groupFilters.platform !== "all") {
      managedGroupsQuery = managedGroupsQuery.eq("platform", groupFilters.platform);
    }

    if (groupFilters.category !== "all") {
      managedGroupsQuery = managedGroupsQuery.eq(
        "categories.slug",
        groupFilters.category
      );
    }

    if (groupFilters.query) {
      const query = escapeIlikeTerm(groupFilters.query);

      if (query) {
        managedGroupsQuery = managedGroupsQuery.or(
          `name.ilike.%${query}%,slug.ilike.%${query}%,short_description.ilike.%${query}%`
        );
      }
    }

    let reportsQuery = supabase
      .from("reports")
      .select(
        "id, group_id, join_method_id, reporter_id, report_type, details, status, created_at, groups(name, slug), group_join_methods(label, type, value)",
        { count: "exact" }
      )
      .eq("status", reportFilters.status)
      .order("created_at", { ascending: false })
      .limit(20);

    if (reportFilters.type !== "all") {
      reportsQuery = reportsQuery.eq("report_type", reportFilters.type);
    }

    const [
      submissionsResult,
      claimsResult,
      reportsResult,
      pendingReportsCountResult,
      groupsResult,
      recentGroupsResult,
      auditEventsResult
    ] =
      await Promise.all([
        supabase.from("group_submissions").select(
          `
          id,
          proposed_name,
          proposed_platform,
          proposed_join_method,
          proposed_join_value,
          proposed_payload,
          submitter_id,
          moderation_status,
          created_at,
          categories(slug, name_zh, name_en)
        `,
          { count: "exact" }
        )
          .eq("moderation_status", "pending")
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("ownership_claims")
          .select(
            "id, claimant_id, claim_status, evidence, created_at, groups(name, slug)",
            { count: "exact" }
          )
          .eq("claim_status", "pending")
          .order("created_at", { ascending: false })
          .limit(10),
        reportsQuery,
        supabase
          .from("reports")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("groups")
          .select("id", { count: "exact", head: true })
          .eq("moderation_status", "approved"),
        managedGroupsQuery,
        supabase
          .from("audit_events")
          .select("id, action, entity_type, entity_id, metadata, created_at")
          .order("created_at", { ascending: false })
          .limit(8)
      ]);

    const queryError =
      submissionsResult.error ||
      claimsResult.error ||
      reportsResult.error ||
      pendingReportsCountResult.error ||
      groupsResult.error ||
      recentGroupsResult.error ||
      auditEventsResult.error;

    if (queryError) {
      return { ...emptyQueues, canLoadLive: true, liveUnavailable: true };
    }

    const submissionRows =
      (submissionsResult.data as SubmissionQueueRow[] | null) ?? [];
    const claimRows = (claimsResult.data as ClaimQueueRow[] | null) ?? [];
    const reportRows = (reportsResult.data as ReportQueueRow[] | null) ?? [];
    const recentGroupRows =
      (recentGroupsResult.data as AdminGroupRow[] | null) ?? [];
    const auditRows =
      (auditEventsResult.data as AdminAuditEventRow[] | null) ?? [];
    const recentGroups = recentGroupRows.map((item) => ({
      id: item.id,
      title: item.name,
      description: [item.platform, firstCategorySlug(item.categories), `/groups/${item.slug}`]
        .filter(Boolean)
        .join(" · "),
      status: item.moderation_status,
      meta: formatDate(item.updated_at, locale)
    }));
    const recentGroupCount = recentGroupsResult.count ?? recentGroupRows.length;
    const recentGroupTotalPages = Math.max(
      1,
      Math.ceil(recentGroupCount / ADMIN_GROUPS_PER_PAGE)
    );
    const recentGroupCurrentPage = Math.min(
      Math.max(groupFilters.page, 1),
      recentGroupTotalPages
    );
    const recentGroupStartItem =
      recentGroupCount === 0
        ? 0
        : (recentGroupCurrentPage - 1) * ADMIN_GROUPS_PER_PAGE + 1;

    return {
      canLoadLive: true,
      liveUnavailable: false,
      pendingSubmissionCount: submissionsResult.count ?? submissionRows.length,
      pendingClaimCount: claimsResult.count ?? claimRows.length,
      pendingReportCount: pendingReportsCountResult.count ?? 0,
      publishedGroupCount: groupsResult.count ?? 0,
      recentGroupCount,
      recentGroupPagination: {
        currentPage: recentGroupCurrentPage,
        endItem: recentGroupStartItem + recentGroups.length - 1,
        items: recentGroups,
        pageSize: ADMIN_GROUPS_PER_PAGE,
        startItem: recentGroupStartItem,
        totalItems: recentGroupCount,
        totalPages: recentGroupTotalPages
      },
      recentGroups,
      auditEvents: auditRows.map((item) => {
        const formatted = formatAdminAuditEvent(item, locale);

        return {
          id: formatted.id,
          title: formatted.title,
          description: formatted.description,
          status: "",
          meta: formatted.meta
        };
      }),
      submissions: submissionRows.map((item) => ({
        id: item.id,
        title: item.proposed_name,
        description: formatSubmissionDescription(item, locale),
        details: buildSubmissionDetails(item, getDictionary(locale).admin, locale),
        status: item.moderation_status,
        meta: formatDate(item.created_at, locale)
      })),
      claims: claimRows.map((item) => ({
        id: item.id,
        title: item.groups?.name ?? item.groups?.slug ?? item.id,
        description: item.evidence,
        details: buildClaimDetails(item, getDictionary(locale).admin),
        status: item.claim_status,
        meta: formatDate(item.created_at, locale)
      })),
      reports: reportRows.map((item) => {
        const isJoinFreshnessReport = isJoinFreshnessReportFilterType(
          item.report_type
        );

        return {
          id: item.id,
          actionHref:
            item.group_id && isJoinFreshnessReport
              ? `/admin/groups/${item.group_id}/edit?lang=${locale}`
              : undefined,
          actionLabel: isJoinFreshnessReport
            ? getDictionary(locale).admin.reportEditGroup
            : undefined,
          title: copyReportType(item.report_type, locale),
          description: item.details ?? item.report_type,
          details: buildReportDetails(item, getDictionary(locale).admin, locale),
          notice: isJoinFreshnessReport
            ? getDictionary(locale).admin.reportFreshnessNotice
            : undefined,
          rawStatus: item.status,
          status: copyReportStatus(item.status, locale),
          meta: formatDate(item.created_at, locale)
        };
      })
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

function copyAdminGroupStatus(value: string, locale: Locale): string {
  const labels = {
    approved: { zh: "公开", en: "Published" },
    needs_update: { zh: "需要更新", en: "Needs update" },
    suspended: { zh: "下架", en: "Hidden" }
  } as const;

  return value in labels
    ? labels[value as keyof typeof labels][locale]
    : value;
}

function copyReportStatus(value: string, locale: Locale): string {
  const labels = {
    approved: { zh: "已处理", en: "Handled" },
    changes_requested: { zh: "要求修改", en: "Changes requested" },
    pending: { zh: "待处理", en: "Pending" },
    rejected: { zh: "已驳回", en: "Dismissed" }
  } as const;

  return value in labels
    ? labels[value as keyof typeof labels][locale]
    : value;
}

function QueueEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-ink/15 bg-white px-4 py-6 text-sm text-ink/55">
      {message}
    </div>
  );
}

function StatusNotice({
  tone,
  children
}: {
  tone: "error" | "success" | "neutral";
  children: React.ReactNode;
}) {
  const className =
    tone === "error"
      ? "border-coral/25 bg-coral/10 text-coral"
      : tone === "success"
        ? "border-leaf/25 bg-leaf/10 text-leaf"
        : "border-ink/10 bg-white text-ink/65";

  return (
    <p className={`rounded-lg border px-4 py-3 text-sm font-medium ${className}`}>
      {children}
    </p>
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
  const reportReview = firstParam(params?.reportReview);
  const batch = firstParam(params?.batch);
  const groupFilters = normalizeAdminGroupFilters(params);
  const hasGroupFilters = hasActiveAdminGroupFilters(groupFilters);
  const reportFilters = normalizeAdminReportFilters(params);
  const hasReportFilters = hasActiveAdminReportFilters(reportFilters);
  const copy = getDictionary(locale);
  const queues = await getAdminQueues(locale, groupFilters, reportFilters);
  const totalPending =
    queues.pendingSubmissionCount +
    queues.pendingClaimCount +
    queues.pendingReportCount;
  const priorityItems = [
    {
      count: queues.pendingSubmissionCount,
      label: copy.admin.pendingSubmissions
    },
    {
      count: queues.pendingClaimCount,
      label: copy.admin.pendingClaims
    },
    {
      count: queues.pendingReportCount,
      label: copy.admin.pendingReports
    }
  ].filter((item) => item.count > 0);
  const stats = [
    {
      label: copy.admin.pendingSubmissions,
      value: queues.canLoadLive ? String(queues.pendingSubmissionCount) : "-"
    },
    {
      label: copy.admin.pendingClaims,
      value: queues.canLoadLive ? String(queues.pendingClaimCount) : "-"
    },
    {
      label: copy.admin.pendingReports,
      value: queues.canLoadLive ? String(queues.pendingReportCount) : "-"
    },
    {
      label: copy.admin.publishedGroups,
      value: queues.canLoadLive ? String(queues.publishedGroupCount) : "-"
    }
  ];
  const groupPaginationQuery = {
    groupCategory:
      groupFilters.category === "all" ? undefined : groupFilters.category,
    groupPlatform:
      groupFilters.platform === "all" ? undefined : groupFilters.platform,
    groupQuery: groupFilters.query || undefined,
    groupStatus: groupFilters.status === "all" ? undefined : groupFilters.status
  };

  return (
    <>
      <AppHeader locale={locale} pathname="/admin" />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-5 py-7">
        <section className="grid gap-5 lg:grid-cols-[1fr_20rem]">
          <div className="rounded-lg border border-ink/10 bg-white px-5 py-6 shadow-sm">
            <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              {copy.admin.title}
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-ink/68">
              {copy.admin.intro}
            </p>
          </div>

          <aside className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <span className="text-sm font-medium text-ink/55">
              {copy.admin.priorityTitle}
            </span>
            <strong className="mt-2 block text-4xl font-semibold text-leaf">
              {queues.canLoadLive ? totalPending : "-"}
            </strong>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              {priorityItems.length > 0
                ? priorityItems
                    .map((item) => `${item.label} ${item.count}`)
                    .join(" · ")
                : copy.admin.priorityEmpty}
            </p>
          </aside>
        </section>

        {!queues.canLoadLive ? (
          <StatusNotice tone="error">
            {copy.admin.accessRequired}
          </StatusNotice>
        ) : null}

        {queues.canLoadLive && !queues.liveUnavailable ? (
          <StatusNotice tone="success">
            {copy.admin.accessConfirmed}
          </StatusNotice>
        ) : null}

        {queues.liveUnavailable ? (
          <StatusNotice tone="neutral">
            {copy.admin.liveUnavailable}
          </StatusNotice>
        ) : null}

        {review ? (
          <StatusNotice tone={review === "updated" ? "success" : "error"}>
            {review === "updated" ? copy.admin.reviewed : copy.admin.reviewFailed}
          </StatusNotice>
        ) : null}

        {reportReview ? (
          <StatusNotice tone="success">
            {reportReview === "freshness_checked"
              ? copy.admin.reportFreshnessChecked
              : copy.admin.reportHandled}
          </StatusNotice>
        ) : null}

        {batch ? (
          <StatusNotice tone={batch === "updated" ? "success" : "error"}>
            {batch === "updated" ? copy.admin.batchUpdated : copy.admin.batchFailed}
          </StatusNotice>
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

        {queues.canLoadLive ? (
          <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  {copy.admin.groupManagementTitle}
                </h2>
                <p className="mt-1 text-sm leading-6 text-ink/60">
                  {copy.admin.groupManagementDescription}
                </p>
              </div>
            </div>

            <form
              action="/admin"
              className="mt-4 grid gap-3 rounded-md bg-paper p-3 md:grid-cols-[minmax(12rem,1fr)_repeat(3,minmax(8rem,10rem))_auto]"
            >
              <input name="lang" type="hidden" value={locale} />
              <label className="grid gap-1.5 text-xs font-semibold text-ink/55">
                {copy.admin.groupSearchLabel}
                <input
                  className="min-h-10 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={groupFilters.query}
                  name="groupQuery"
                  placeholder={copy.admin.groupSearchPlaceholder}
                />
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-ink/55">
                {copy.admin.statusLabel}
                <select
                  className="min-h-10 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={groupFilters.status}
                  name="groupStatus"
                >
                  <option value="all">{copy.admin.groupStatusAll}</option>
                  {adminGroupStatuses.map((status) => (
                    <option key={status} value={status}>
                      {copyAdminGroupStatus(status, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-ink/55">
                {copy.admin.categoryLabel}
                <select
                  className="min-h-10 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={groupFilters.category}
                  name="groupCategory"
                >
                  <option value="all">{copy.admin.groupCategoryAll}</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {getCategoryLabel(category.slug, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1.5 text-xs font-semibold text-ink/55">
                {copy.search.platform}
                <select
                  className="min-h-10 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={groupFilters.platform}
                  name="groupPlatform"
                >
                  <option value="all">{copy.admin.groupPlatformAll}</option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {getPlatformLabel(platform, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <div className="flex items-end gap-2">
                <button
                  className="min-h-10 rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral"
                  type="submit"
                >
                  {copy.admin.groupFilterButton}
                </button>
                {hasGroupFilters ? (
                  <Link
                    className="inline-flex min-h-10 items-center rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold text-ink/65 transition hover:border-leaf hover:text-leaf"
                    href={`/admin?lang=${locale}`}
                  >
                    {copy.admin.groupFilterClear}
                  </Link>
                ) : null}
              </div>
            </form>

            <p className="mt-3 text-xs font-medium text-ink/50">
              {copy.admin.groupResultsSummary(
                queues.recentGroups.length,
                queues.recentGroupCount
              )}
            </p>

            {queues.recentGroups.length > 0 ? (
              <AdminBatchGroupForm
                action={batchUpdateAdminGroups}
                items={queues.recentGroups.map((item) => ({
                  description: item.meta
                    ? `${item.description} · ${item.meta}`
                    : item.description,
                  id: item.id,
                  status: item.status,
                  title: item.title
                }))}
                labels={{
                  batchActionDescription: copy.admin.batchActionDescription,
                  batchActionTitle: copy.admin.batchActionTitle,
                  batchConfirmDescription: copy.admin.batchConfirmDescription,
                  batchConfirmTitle: copy.admin.batchConfirmTitle,
                  batchNoSelection: copy.admin.batchNoSelection,
                  batchSelectAll: copy.admin.batchSelectAll,
                  batchSelectedSummary: copy.admin.batchSelectedSummary,
                  batchSetHidden: copy.admin.batchSetHidden,
                  batchSetNeedsUpdate: copy.admin.batchSetNeedsUpdate,
                  batchSetPublished: copy.admin.batchSetPublished,
                  editGroup: copy.admin.editGroup,
                  statusLabels: {
                    approved: copyAdminGroupStatus("approved", locale),
                    needs_update: copyAdminGroupStatus("needs_update", locale),
                    suspended: copyAdminGroupStatus("suspended", locale)
                  }
                }}
                locale={locale}
              >
                <Pagination
                  locale={locale}
                  pageParam="groupPage"
                  pathname="/admin"
                  query={groupPaginationQuery}
                  state={queues.recentGroupPagination}
                />
              </AdminBatchGroupForm>
            ) : (
              <QueueEmpty message={copy.admin.emptyQueue} />
            )}
          </section>
        ) : null}

        <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
          <div className="grid gap-5">
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
                    details={item.details}
                    detailsTitle={copy.admin.detailsTitle}
                    key={item.id}
                    meta={item.meta}
                    status={`${copy.admin.statusLabel}: ${item.status}`}
                    title={item.title}
                  >
                    <AdminReviewForm
                      action={reviewSubmission}
                      decisions={[
                        {
                          confirmMessage: copy.admin.approveConfirm,
                          label: copy.admin.approve,
                          tone: "approve",
                          value: "approved"
                        },
                        {
                          confirmMessage: copy.admin.rejectConfirm,
                          label: copy.admin.reject,
                          tone: "reject",
                          value: "rejected"
                        },
                        {
                          confirmMessage: copy.admin.requestChangesConfirm,
                          label: copy.admin.requestChanges,
                          tone: "neutral",
                          value: "changes_requested"
                        }
                      ]}
                      entityFieldName="submissionId"
                      entityId={item.id}
                      locale={locale}
                      reviewerNotesLabel={copy.admin.reviewerNotesLabel}
                      reviewerNotesPlaceholder={copy.admin.reviewerNotes}
                    />
                  </AdminQueue>
                ))
              ) : (
                <QueueEmpty message={copy.admin.emptyQueue} />
              )}
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <div className="grid content-start gap-3">
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
                      details={item.details}
                      detailsTitle={copy.admin.detailsTitle}
                      key={item.id}
                      meta={item.meta}
                      status={`${copy.admin.statusLabel}: ${item.status}`}
                      title={item.title}
                    >
                      <AdminReviewForm
                        action={reviewOwnershipClaim}
                        decisions={[
                          {
                            confirmMessage: copy.admin.approveConfirm,
                            label: copy.admin.approve,
                            tone: "approve",
                            value: "approved"
                          },
                          {
                            confirmMessage: copy.admin.rejectConfirm,
                            label: copy.admin.reject,
                            tone: "reject",
                            value: "rejected"
                          }
                        ]}
                        entityFieldName="claimId"
                        entityId={item.id}
                        locale={locale}
                        reviewerNotesLabel={copy.admin.reviewerNotesLabel}
                        reviewerNotesPlaceholder={copy.admin.reviewerNotes}
                      />
                    </AdminQueue>
                  ))
                ) : (
                  <QueueEmpty message={copy.admin.emptyQueue} />
                )}
              </div>

              <div className="grid content-start gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-ink">
                    {copy.admin.reportsTitle}
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-ink/60">
                    {copy.admin.reportsDescription}
                  </p>
                </div>

                <form
                  action="/admin"
                  className="grid gap-3 rounded-md bg-paper p-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                  <input name="lang" type="hidden" value={locale} />
                  <label className="grid gap-1.5 text-xs font-semibold text-ink/55">
                    {copy.admin.reportStatusFilter}
                    <select
                      className="min-h-10 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                      defaultValue={reportFilters.status}
                      name="reportStatus"
                    >
                      {adminReportStatuses.map((status) => (
                        <option key={status} value={status}>
                          {copyReportStatus(status, locale)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-xs font-semibold text-ink/55">
                    {copy.admin.reportTypeFilter}
                    <select
                      className="min-h-10 rounded-md border border-ink/15 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                      defaultValue={reportFilters.type}
                      name="reportType"
                    >
                      <option value="all">{copy.admin.reportTypeAll}</option>
                      {adminReportTypes.map((type) => (
                        <option key={type} value={type}>
                          {copyReportType(type, locale)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex items-end gap-2">
                    <button
                      className="min-h-10 rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-coral"
                      type="submit"
                    >
                      {copy.admin.groupFilterButton}
                    </button>
                    {hasReportFilters ? (
                      <Link
                        className="inline-flex min-h-10 items-center rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold text-ink/65 transition hover:border-leaf hover:text-leaf"
                        href={`/admin?lang=${locale}`}
                      >
                        {copy.admin.groupFilterClear}
                      </Link>
                    ) : null}
                  </div>
                </form>

                {queues.reports.length > 0 ? (
                  queues.reports.map((item) => (
                    <AdminQueue
                      actionHref={item.actionHref}
                      actionLabel={item.actionLabel}
                      description={item.description}
                      details={item.details}
                      detailsTitle={copy.admin.detailsTitle}
                      key={item.id}
                      meta={item.meta}
                      notice={item.notice}
                      status={`${copy.admin.statusLabel}: ${item.status}`}
                      title={item.title}
                    >
                      {item.rawStatus === "pending" ? (
                        <AdminReviewForm
                          action={reviewReport}
                          decisions={[
                            {
                              confirmMessage: copy.admin.resolveReportConfirm,
                              label: copy.admin.resolveReport,
                              tone: "approve",
                              value: "approved"
                            },
                            {
                              confirmMessage: copy.admin.dismissReportConfirm,
                              label: copy.admin.dismissReport,
                              tone: "reject",
                              value: "rejected"
                            },
                            {
                              confirmMessage: copy.admin.requestChangesConfirm,
                              label: copy.admin.requestChanges,
                              tone: "neutral",
                              value: "changes_requested"
                            }
                          ]}
                          entityFieldName="reportId"
                          entityId={item.id}
                          locale={locale}
                          showReviewerNotes={false}
                        />
                      ) : null}
                    </AdminQueue>
                  ))
                ) : (
                  <QueueEmpty message={copy.admin.emptyQueue} />
                )}
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-base font-semibold text-ink">
              {copy.admin.workflowTitle}
            </h2>
            <ol className="mt-4 grid gap-3">
              {copy.admin.workflowItems.map((item, index) => (
                <li className="flex gap-3 text-sm leading-6 text-ink/70" key={item}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf/10 text-xs font-semibold text-leaf">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>

            <div className="mt-6 border-t border-ink/10 pt-5">
              <h2 className="text-base font-semibold text-ink">
                {copy.admin.auditTitle}
              </h2>
              {queues.auditEvents.length > 0 ? (
                <ol className="mt-4 grid gap-3">
                  {queues.auditEvents.map((event) => (
                    <li
                      className="rounded-md border border-ink/10 bg-paper px-3 py-2"
                      key={event.id}
                    >
                      <span className="block text-sm font-semibold text-ink">
                        {event.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-ink/55">
                        {[event.description, event.meta]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm leading-6 text-ink/55">
                  {copy.admin.auditEmpty}
                </p>
              )}
            </div>
          </aside>
        </div>
      </main>
    </>
  );
}
