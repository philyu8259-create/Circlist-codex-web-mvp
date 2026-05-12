import { isJoinFreshnessReportFilterType } from "./admin-report-filters";

export type AdminReportQueueRowBase = {
  created_at: string | null;
  group_id: string | null;
  id: string;
  join_method_id: string | null;
  report_type: string;
  status: string;
};

export type GroupedAdminReportRow<T extends AdminReportQueueRowBase> = {
  groupId: string | null;
  groupedCount: number;
  isGroupedJoinFreshness: boolean;
  joinMethodId: string | null;
  primary: T;
  reportIds: string[];
  rows: T[];
};

function groupKey(row: AdminReportQueueRowBase): string | null {
  if (
    row.status !== "pending" ||
    !row.group_id ||
    !isJoinFreshnessReportFilterType(row.report_type)
  ) {
    return null;
  }

  return `${row.group_id}:${row.join_method_id ?? "group"}`;
}

export function groupAdminReportRows<T extends AdminReportQueueRowBase>(
  rows: T[]
): GroupedAdminReportRow<T>[] {
  const grouped = new Map<string, GroupedAdminReportRow<T>>();
  const result: GroupedAdminReportRow<T>[] = [];

  for (const row of rows) {
    const key = groupKey(row);

    if (!key) {
      result.push({
        groupId: row.group_id,
        groupedCount: 1,
        isGroupedJoinFreshness: false,
        joinMethodId: row.join_method_id,
        primary: row,
        reportIds: [row.id],
        rows: [row]
      });
      continue;
    }

    const existing = grouped.get(key);

    if (existing) {
      existing.groupedCount += 1;
      existing.reportIds.push(row.id);
      existing.rows.push(row);
      continue;
    }

    const item = {
      groupId: row.group_id,
      groupedCount: 1,
      isGroupedJoinFreshness: true,
      joinMethodId: row.join_method_id,
      primary: row,
      reportIds: [row.id],
      rows: [row]
    };

    grouped.set(key, item);
    result.push(item);
  }

  return result;
}
