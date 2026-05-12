import { describe, expect, it } from "vitest";

import {
  hasActiveAdminReportFilters,
  normalizeAdminReportFilters,
  type AdminReportFilters
} from "../src/lib/admin-report-filters";

describe("normalizeAdminReportFilters", () => {
  it("accepts valid report queue filters", () => {
    const filters = normalizeAdminReportFilters({
      reportStatus: "approved",
      reportType: "invalid_join_method"
    });

    expect(filters).toEqual({
      status: "approved",
      type: "invalid_join_method"
    } satisfies AdminReportFilters);
    expect(hasActiveAdminReportFilters(filters)).toBe(true);
  });

  it("falls back to pending reports when filters are invalid", () => {
    const filters = normalizeAdminReportFilters({
      reportStatus: "archived",
      reportType: "not-real"
    });

    expect(filters).toEqual({
      status: "pending",
      type: "all"
    } satisfies AdminReportFilters);
    expect(hasActiveAdminReportFilters(filters)).toBe(false);
  });
});
