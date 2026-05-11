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
      groupPage: "3",
      groupPlatform: "telegram",
      groupQuery: "  stocks  ",
      groupStatus: "needs_update"
      })
    ).toEqual({
      category: "investment",
      page: 3,
      platform: "telegram",
      query: "stocks",
      status: "needs_update"
    } satisfies AdminGroupFilters);
  });

  it("falls back to all filters when params are invalid", () => {
    expect(
      normalizeAdminGroupFilters({
      groupCategory: "not-real",
      groupPage: "-2",
      groupPlatform: "pager",
      groupQuery: "A".repeat(120),
      groupStatus: "draft"
      })
    ).toEqual({
      category: "all",
      page: 1,
      platform: "all",
      query: "A".repeat(80),
      status: "all"
    } satisfies AdminGroupFilters);
  });
});
