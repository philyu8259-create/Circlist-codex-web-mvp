import { describe, expect, it } from "vitest";

import { getCategoryLabel } from "../src/lib/domain";
import { sampleGroups } from "../src/lib/mock-data";
import { searchGroups } from "../src/lib/search";

describe("group search", () => {
  it("finds approved AI WeChat groups by query, category, and platform", () => {
    const results = searchGroups(sampleGroups, {
      query: "AI",
      category: "ai",
      platform: "wechat"
    });

    expect(results.some((group) => group.slug === "ai-builders-wechat")).toBe(
      true
    );
    expect(
      results.every(
        (group) => group.categorySlug === "ai" && group.platform === "wechat"
      )
    ).toBe(true);
  });

  it("returns no groups for unmatched queries", () => {
    expect(searchGroups(sampleGroups, { query: "definitely-not-a-group" })).toEqual(
      []
    );
  });

  it("returns only approved groups by default", () => {
    const results = searchGroups(sampleGroups, {});

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((group) => group.moderationStatus === "approved")).toBe(
      true
    );
  });

  it("excludes pending groups even when the query matches them", () => {
    const results = searchGroups(sampleGroups, {
      query: "Pending review sample"
    });

    expect(results.some((group) => group.slug === "overseas-founders-pending")).toBe(
      false
    );
    expect(results).toEqual([]);
  });

  it("matches category labels in Chinese and English", () => {
    const chineseResults = searchGroups(sampleGroups, { query: "出海" });
    const englishResults = searchGroups(sampleGroups, {
      query: "Overseas Business"
    });

    expect(
      chineseResults.some((group) => group.slug === "overseas-business-wechat")
    ).toBe(true);
    expect(
      englishResults.some((group) => group.slug === "overseas-business-wechat")
    ).toBe(true);
  });

  it("matches platform labels in Chinese and English", () => {
    const chineseResults = searchGroups(sampleGroups, { query: "微信群" });
    const englishResults = searchGroups(sampleGroups, { query: "WeChat" });

    expect(chineseResults.some((group) => group.platform === "wechat")).toBe(
      true
    );
    expect(englishResults.some((group) => group.platform === "wechat")).toBe(
      true
    );
  });

  it("finds one-person company groups in Chinese and English", () => {
    const chineseResults = searchGroups(sampleGroups, { query: "一人公司" });
    const englishResults = searchGroups(sampleGroups, {
      query: "One-Person Company"
    });

    expect(
      chineseResults.some((group) => group.slug === "one-person-company-wechat")
    ).toBe(true);
    expect(
      englishResults.some((group) => group.slug === "one-person-company-wechat")
    ).toBe(true);
  });

  it("standardizes group category data on categorySlug", () => {
    expect(sampleGroups.every((group) => !("category" in group))).toBe(true);
  });

  it("provides bilingual category labels", () => {
    expect(getCategoryLabel("overseas", "zh")).toBe("出海");
    expect(getCategoryLabel("overseas", "en")).toContain("Overseas");
  });
});
