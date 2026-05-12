export type AdminPriorityLocale = "zh" | "en";

export type AdminPriorityKind =
  | "grouped_report"
  | "expiring_join"
  | "needs_update";

type GroupedReportPriorityInput = {
  groupedCount: number;
  groupId: string | null;
  id: string;
  title: string;
};

type ExpiringJoinPriorityInput = {
  expiresAt: string;
  groupId: string;
  groupName: string;
  id: string;
  label: string;
};

type NeedsUpdatePriorityInput = {
  id: string;
  name: string;
  updatedAt: string | null;
};

export type AdminPriorityItem = {
  description: string;
  href: string;
  id: string;
  kind: AdminPriorityKind;
  score: number;
  title: string;
};

export type AdminPriorityInput = {
  expiringJoinMethods: ExpiringJoinPriorityInput[];
  groupedReports: GroupedReportPriorityInput[];
  locale: AdminPriorityLocale;
  needsUpdateGroups: NeedsUpdatePriorityInput[];
  now: Date;
};

const dayMs = 24 * 60 * 60 * 1000;

function utcDateStart(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function daysUntil(value: string, now: Date): number {
  const expiresAt = new Date(value);

  if (Number.isNaN(expiresAt.getTime())) return 14;

  return Math.max(0, Math.round((utcDateStart(expiresAt) - utcDateStart(now)) / dayMs));
}

function byPriority(a: AdminPriorityItem, b: AdminPriorityItem): number {
  if (b.score !== a.score) return b.score - a.score;

  return a.title.localeCompare(b.title);
}

export function buildAdminPriorityItems({
  expiringJoinMethods,
  groupedReports,
  locale,
  needsUpdateGroups,
  now
}: AdminPriorityInput): AdminPriorityItem[] {
  const lang = locale === "en" ? "en" : "zh";
  const items: AdminPriorityItem[] = [];

  for (const report of groupedReports) {
    if (report.groupedCount <= 1) continue;

    items.push({
      description:
        lang === "en"
          ? `${report.title} needs one join-method update.`
          : `${report.title}，优先修正一次即可批量关闭。`,
      href: `/admin?lang=${lang}&reportStatus=pending&reportType=invalid_join_method`,
      id: `grouped-report:${report.id}`,
      kind: "grouped_report",
      score: 1000 + report.groupedCount * 20,
      title:
        lang === "en"
          ? `${report.groupedCount} related stale-join reports`
          : `${report.groupedCount} 条同源失效反馈`
    });
  }

  for (const method of expiringJoinMethods) {
    const days = daysUntil(method.expiresAt, now);

    items.push({
      description:
        lang === "en"
          ? `${method.groupName} · ${method.label}`
          : `${method.groupName} · ${method.label}`,
      href: `/admin/groups/${method.groupId}/edit?lang=${lang}`,
      id: `expiring-join:${method.id}`,
      kind: "expiring_join",
      score: 800 + Math.max(0, 14 - days) * 10,
      title:
        lang === "en"
          ? `Join method expires in ${days} day${days === 1 ? "" : "s"}`
          : `加入方式 ${days} 天内过期`
    });
  }

  for (const group of needsUpdateGroups) {
    items.push({
      description:
        lang === "en"
          ? group.name
          : `${group.name} 已标记为需要更新。`,
      href: `/admin/groups/${group.id}/edit?lang=${lang}`,
      id: `needs-update:${group.id}`,
      kind: "needs_update",
      score: 600,
      title: lang === "en" ? "Group needs update" : "群组需要更新"
    });
  }

  return items.sort(byPriority);
}
