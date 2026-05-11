import { describe, expect, it } from "vitest";

import {
  normalizeAdminGroupFilters,
  type AdminGroupFilters
} from "../src/lib/admin-group-filters";

describe("normalizeAdminGroupFilters", () => {
  it("accepts valid admin group search and filter params", () => {
    expect(
      normalizeAdminGroupFilters({
        groupCategory: "investment",
        groupPlatform: "telegram",
        groupQuery: "  stocks  ",
        groupStatus: "needs_update"
      })
    ).toEqual({
      category: "investment",
      platform: "telegram",
      query: "stocks",
      status: "needs_update"
    } satisfies AdminGroupFilters);
  });

  it("falls back to all filters when params are invalid", () => {
    expect(
      normalizeAdminGroupFilters({
        groupCategory: "not-real",
        groupPlatform: "pager",
        groupQuery: "A".repeat(120),
        groupStatus: "draft"
      })
    ).toEqual({
      category: "all",
      platform: "all",
      query: "A".repeat(80),
      status: "all"
    } satisfies AdminGroupFilters);
  });
});
