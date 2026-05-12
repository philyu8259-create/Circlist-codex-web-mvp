export const adminReportTypes = [
  "spam",
  "scam",
  "invalid_join_method",
  "outdated_info",
  "abuse",
  "other"
] as const;

export const adminReportStatuses = [
  "pending",
  "approved",
  "rejected",
  "changes_requested"
] as const;

export type AdminReportTypeFilter = "all" | (typeof adminReportTypes)[number];
export type AdminReportStatusFilter = (typeof adminReportStatuses)[number];

export type AdminReportFilters = {
  status: AdminReportStatusFilter;
  type: AdminReportTypeFilter;
};

type AdminReportFilterInput =
  | Record<string, string | string[] | undefined>
  | undefined;

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function isReportType(
  value: string
): value is (typeof adminReportTypes)[number] {
  return adminReportTypes.includes(value as (typeof adminReportTypes)[number]);
}

function isReportStatus(
  value: string
): value is (typeof adminReportStatuses)[number] {
  return adminReportStatuses.includes(
    value as (typeof adminReportStatuses)[number]
  );
}

export function normalizeAdminReportFilters(
  input: AdminReportFilterInput
): AdminReportFilters {
  const type = firstValue(input?.reportType);
  const status = firstValue(input?.reportStatus);

  return {
    status: isReportStatus(status) ? status : "pending",
    type: isReportType(type) ? type : "all"
  };
}

export function hasActiveAdminReportFilters(
  filters: AdminReportFilters
): boolean {
  return filters.status !== "pending" || filters.type !== "all";
}

export function isJoinFreshnessReportFilterType(value: string): boolean {
  return value === "invalid_join_method" || value === "outdated_info";
}
