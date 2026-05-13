export type AdminHealthTone = "good" | "urgent" | "warning";

export type AdminHealthMetric = {
  href: string;
  label: string;
  tone: AdminHealthTone;
  value: string;
};

export type AdminHealthInput = {
  expiringJoinMethods: number;
  handledThisWeek: number;
  locale: "zh" | "en";
  needsUpdateGroups: number;
  staleJoinReports: number;
};

function lang(locale: "zh" | "en"): "zh" | "en" {
  return locale === "en" ? "en" : "zh";
}

export function buildAdminHealthMetrics({
  expiringJoinMethods,
  handledThisWeek,
  locale,
  needsUpdateGroups,
  staleJoinReports
}: AdminHealthInput): AdminHealthMetric[] {
  const currentLang = lang(locale);

  return [
    {
      href: `/admin?lang=${currentLang}&reportStatus=pending&reportType=invalid_join_method`,
      label: currentLang === "en" ? "Stale reports" : "失效反馈",
      tone: staleJoinReports > 0 ? "urgent" : "good",
      value: String(staleJoinReports)
    },
    {
      href: `/admin?lang=${currentLang}&groupStatus=needs_update`,
      label: currentLang === "en" ? "Needs update" : "待更新群组",
      tone: needsUpdateGroups > 0 ? "warning" : "good",
      value: String(needsUpdateGroups)
    },
    {
      href: `/admin?lang=${currentLang}`,
      label: currentLang === "en" ? "Expiring in 14d" : "14 天内过期",
      tone: expiringJoinMethods > 0 ? "warning" : "good",
      value: String(expiringJoinMethods)
    },
    {
      href: `/admin?lang=${currentLang}`,
      label: currentLang === "en" ? "Handled in 7d" : "7 天处理",
      tone: "good",
      value: String(handledThisWeek)
    }
  ];
}
