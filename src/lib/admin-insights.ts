export type AdminTrendLocale = "zh" | "en";

export type AdminTrendAuditEvent = {
  action: string;
  created_at: string | null;
};

export type AdminTrendStaleReport = {
  group_id: string | null;
  groups: { name: string | null; slug: string | null } | null;
  report_type: string;
};

export type AdminTrendInsights = {
  actionBreakdown: { count: number; label: string }[];
  dailyActivity: { count: number; date: string; label: string }[];
  repeatStaleGroups: { count: number; href: string; label: string }[];
};

export type AdminTrendInsightsInput = {
  auditEvents: AdminTrendAuditEvent[];
  locale: AdminTrendLocale;
  now: Date;
  staleReports: AdminTrendStaleReport[];
};

const dayMs = 24 * 60 * 60 * 1000;

function dateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function dayLabel(date: Date): string {
  return `${String(date.getUTCMonth() + 1).padStart(2, "0")}/${String(date.getUTCDate()).padStart(2, "0")}`;
}

function actionLabel(action: string, locale: AdminTrendLocale): string {
  const labels: Record<string, Record<AdminTrendLocale, string>> = {
    batch_update_groups: { en: "Batch operations", zh: "批量操作" },
    review_claim: { en: "Ownership claims", zh: "处理认领" },
    review_report: { en: "Reports handled", zh: "处理反馈" },
    review_submission: { en: "Submissions reviewed", zh: "审核提交" },
    update_group: { en: "Groups updated", zh: "更新群组" }
  };

  return labels[action]?.[locale] ?? action;
}

export function buildAdminTrendInsights({
  auditEvents,
  locale,
  now,
  staleReports
}: AdminTrendInsightsInput): AdminTrendInsights {
  const currentLang = locale === "en" ? "en" : "zh";
  const todayStart = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const dailyActivity = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(todayStart - (6 - index) * dayMs);

    return {
      count: 0,
      date: dateKey(date),
      label: dayLabel(date)
    };
  });
  const dailyIndex = new Map(
    dailyActivity.map((item, index) => [item.date, index])
  );
  const actionCounts = new Map<string, number>();

  for (const event of auditEvents) {
    if (!event.created_at) continue;

    const eventDate = new Date(event.created_at);
    const key = dateKey(eventDate);
    const index = dailyIndex.get(key);

    if (index !== undefined) {
      dailyActivity[index].count += 1;
    }

    actionCounts.set(event.action, (actionCounts.get(event.action) ?? 0) + 1);
  }

  const staleGroupCounts = new Map<
    string,
    { count: number; href: string; label: string }
  >();

  for (const report of staleReports) {
    if (!report.group_id) continue;

    const slug = report.groups?.slug ?? report.group_id;
    const existing = staleGroupCounts.get(report.group_id);

    if (existing) {
      existing.count += 1;
      continue;
    }

    staleGroupCounts.set(report.group_id, {
      count: 1,
      href: `/groups/${slug}?lang=${currentLang}`,
      label: report.groups?.name ?? report.groups?.slug ?? report.group_id
    });
  }

  return {
    actionBreakdown: Array.from(actionCounts.entries())
      .map(([action, count]) => ({
        count,
        label: actionLabel(action, currentLang)
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    dailyActivity,
    repeatStaleGroups: Array.from(staleGroupCounts.values())
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
      .slice(0, 5)
  };
}
