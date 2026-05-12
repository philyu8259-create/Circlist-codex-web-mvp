import { describe, expect, it } from "vitest";

import { groupAdminReportRows } from "../src/lib/admin-report-queue";

const baseReport = {
  created_at: "2026-05-13T01:00:00.000Z",
  group_id: "group-1",
  join_method_id: "join-1",
  report_type: "invalid_join_method",
  status: "pending"
};

describe("groupAdminReportRows", () => {
  it("groups pending join freshness reports for the same group and join method", () => {
    const groups = groupAdminReportRows([
      { ...baseReport, id: "report-1" },
      {
        ...baseReport,
        created_at: "2026-05-13T00:30:00.000Z",
        id: "report-2",
        report_type: "outdated_info"
      },
      {
        ...baseReport,
        group_id: "group-2",
        id: "report-3"
      }
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({
      groupId: "group-1",
      groupedCount: 2,
      isGroupedJoinFreshness: true,
      joinMethodId: "join-1",
      primary: expect.objectContaining({ id: "report-1" }),
      reportIds: ["report-1", "report-2"]
    });
    expect(groups[1]).toMatchObject({
      groupedCount: 1,
      isGroupedJoinFreshness: true,
      primary: expect.objectContaining({ id: "report-3" })
    });
  });

  it("does not group non-freshness reports or already handled reports", () => {
    const groups = groupAdminReportRows([
      {
        ...baseReport,
        id: "report-1",
        report_type: "spam"
      },
      {
        ...baseReport,
        id: "report-2",
        status: "approved"
      }
    ]);

    expect(groups).toHaveLength(2);
    expect(groups[0]).toMatchObject({
      groupedCount: 1,
      isGroupedJoinFreshness: false,
      reportIds: ["report-1"]
    });
    expect(groups[1]).toMatchObject({
      groupedCount: 1,
      isGroupedJoinFreshness: false,
      reportIds: ["report-2"]
    });
  });
});
