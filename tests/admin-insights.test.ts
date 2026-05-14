import { describe, expect, it } from "vitest";

import { buildAdminTrendInsights } from "../src/lib/admin-insights";

describe("buildAdminTrendInsights", () => {
  it("summarizes weekly activity, action distribution, and repeat stale groups", () => {
    const insights = buildAdminTrendInsights({
      auditEvents: [
        {
          action: "review_report",
          created_at: "2026-05-13T08:00:00.000Z"
        },
        {
          action: "update_group",
          created_at: "2026-05-13T09:00:00.000Z"
        },
        {
          action: "review_report",
          created_at: "2026-05-12T10:00:00.000Z"
        }
      ],
      locale: "zh",
      now: new Date("2026-05-13T12:00:00.000Z"),
      staleReports: [
        {
          group_id: "group-1",
          groups: { name: "LangChain Slack", slug: "langchain-slack" },
          report_type: "invalid_join_method"
        },
        {
          group_id: "group-1",
          groups: { name: "LangChain Slack", slug: "langchain-slack" },
          report_type: "outdated_info"
        },
        {
          group_id: "group-2",
          groups: { name: "Solo Builder", slug: "solo-builder" },
          report_type: "invalid_join_method"
        }
      ]
    });

    expect(insights.dailyActivity.at(-1)).toMatchObject({
      count: 2,
      date: "2026-05-13",
      label: "05/13"
    });
    expect(insights.actionBreakdown).toEqual([
      { count: 2, label: "处理反馈" },
      { count: 1, label: "更新群组" }
    ]);
    expect(insights.repeatStaleGroups).toEqual([
      {
        adminHref: "/admin/groups/group-1/edit?lang=zh",
        count: 2,
        href: "/groups/langchain-slack?lang=zh",
        groupId: "group-1",
        label: "LangChain Slack"
      },
      {
        adminHref: "/admin/groups/group-2/edit?lang=zh",
        count: 1,
        href: "/groups/solo-builder?lang=zh",
        groupId: "group-2",
        label: "Solo Builder"
      }
    ]);
  });
});
