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

  it("treats one-person company as a first-level category", () => {
    const results = searchGroups(sampleGroups, {
      category: "one-person-company"
    });

    expect(getCategoryLabel("one-person-company", "zh")).toBe("一人公司");
    expect(getCategoryLabel("one-person-company", "en")).toBe(
      "One-Person Company"
    );
    expect(results.some((group) => group.slug === "one-person-company-wechat"))
      .toBe(true);
    expect(results.every((group) => group.categorySlug === "one-person-company"))
      .toBe(true);
  });

  it("includes verified real-world public communities as samples", () => {
    const slugs = sampleGroups.map((group) => group.slug);

    expect(slugs).toContain("langchain-community-slack");
    expect(slugs).toContain("hugging-face-discord");
    expect(slugs).toContain("supabase-discord");
    expect(slugs).toContain("cloudflare-developers-discord");
    expect(slugs).toContain("opc-community");
  });

  it("finds real-world samples by official community names", () => {
    expect(
      searchGroups(sampleGroups, { query: "LangChain" }).some(
        (group) => group.slug === "langchain-community-slack"
      )
    ).toBe(true);
    expect(
      searchGroups(sampleGroups, { query: "Supabase" }).some(
        (group) => group.slug === "supabase-discord"
      )
    ).toBe(true);
    expect(
      searchGroups(sampleGroups, { query: "OPC Community" }).some(
        (group) => group.slug === "opc-community"
      )
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
