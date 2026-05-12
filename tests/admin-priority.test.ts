import { describe, expect, it } from "vitest";

import { buildAdminPriorityItems } from "../src/lib/admin-priority";

describe("buildAdminPriorityItems", () => {
  it("orders grouped stale reports before expiring join methods and needs-update groups", () => {
    const items = buildAdminPriorityItems({
      expiringJoinMethods: [
        {
          expiresAt: "2026-05-15T23:59:59.999Z",
          groupId: "group-1",
          groupName: "Soon Expiring",
          id: "join-1",
          label: "Telegram"
        }
      ],
      groupedReports: [
        {
          groupedCount: 3,
          groupId: "group-2",
          id: "report-group-1",
          title: "加入方式失效"
        }
      ],
      locale: "zh",
      needsUpdateGroups: [
        {
          id: "group-3",
          name: "Needs Copy",
          updatedAt: "2026-05-12T08:00:00.000Z"
        }
      ],
      now: new Date("2026-05-13T00:00:00.000Z")
    });

    expect(items.map((item) => item.kind)).toEqual([
      "grouped_report",
      "expiring_join",
      "needs_update"
    ]);
    expect(items[0]).toMatchObject({
      href: "/admin?lang=zh&reportStatus=pending&reportType=invalid_join_method",
      title: "3 条同源失效反馈"
    });
    expect(items[1]).toMatchObject({
      href: "/admin/groups/group-1/edit?lang=zh",
      title: "加入方式 2 天内过期"
    });
    expect(items[2]).toMatchObject({
      href: "/admin/groups/group-3/edit?lang=zh",
      title: "群组需要更新"
    });
  });
});
