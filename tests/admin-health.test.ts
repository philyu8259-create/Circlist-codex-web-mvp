import { describe, expect, it } from "vitest";

import { buildAdminHealthMetrics } from "../src/lib/admin-health";

describe("buildAdminHealthMetrics", () => {
  it("builds linked admin health metrics in operational order", () => {
    expect(
      buildAdminHealthMetrics({
        expiringJoinMethods: 2,
        handledThisWeek: 5,
        locale: "zh",
        needsUpdateGroups: 3,
        staleJoinReports: 4
      })
    ).toEqual([
      {
        href: "/admin?lang=zh&reportStatus=pending&reportType=invalid_join_method",
        label: "失效反馈",
        tone: "urgent",
        value: "4"
      },
      {
        href: "/admin?lang=zh&groupStatus=needs_update",
        label: "待更新群组",
        tone: "warning",
        value: "3"
      },
      {
        href: "/admin?lang=zh",
        label: "14 天内过期",
        tone: "warning",
        value: "2"
      },
      {
        href: "/admin?lang=zh&adminInsight=weekly_activity",
        label: "7 天处理",
        tone: "good",
        value: "5"
      }
    ]);
  });
});
