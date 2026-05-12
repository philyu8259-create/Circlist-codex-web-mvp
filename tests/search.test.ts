import { describe, expect, it } from "vitest";

import { getCategoryLabel, getGroupText } from "../src/lib/domain";
import { sampleGroups } from "../src/lib/mock-data";
import { searchGroups } from "../src/lib/search";

describe("group search", () => {
  it("finds approved AI communities by query, category, and platform", () => {
    const results = searchGroups(sampleGroups, {
      query: "LangChain",
      category: "ai",
      platform: "slack"
    });

    expect(results.some((group) => group.slug === "langchain-community-slack"))
      .toBe(true);
    expect(
      results.every(
        (group) => group.categorySlug === "ai" && group.platform === "slack"
      )
    ).toBe(true);
  });

  it("filters by price and join policy", () => {
    const results = searchGroups(sampleGroups, {
      price: "paid",
      joinPolicy: "approval_required"
    });

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.every(
        (group) =>
          group.price === "paid" && group.joinPolicy === "approval_required"
      )
    ).toBe(true);
    expect(results.some((group) => group.slug === "microconf-connect")).toBe(
      true
    );
  });

  it("sorts by activity and name", () => {
    const byActivity = searchGroups(sampleGroups, { sort: "activity" });
    const byName = searchGroups(sampleGroups, { sort: "name" });

    expect(byActivity[0].activityLevel).toBe("high");
    expect(byName.slice(0, 5).map((group) => group.name)).toEqual(
      byName
        .slice(0, 5)
        .map((group) => group.name)
        .sort((a: string, b: string) => a.localeCompare(b))
    );
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

  it("matches category labels in Chinese and English", () => {
    const chineseResults = searchGroups(sampleGroups, { query: "出海" });
    const englishResults = searchGroups(sampleGroups, {
      query: "Overseas Business"
    });

    expect(chineseResults.some((group) => group.slug === "shopify-community"))
      .toBe(true);
    expect(englishResults.some((group) => group.slug === "shopify-community"))
      .toBe(true);
  });

  it("matches platform labels in Chinese and English", () => {
    const chineseResults = searchGroups(sampleGroups, { query: "Discord" });
    const englishResults = searchGroups(sampleGroups, { query: "Discord" });

    expect(chineseResults.some((group) => group.platform === "discord")).toBe(
      true
    );
    expect(englishResults.some((group) => group.platform === "discord")).toBe(
      true
    );
  });

  it("finds one-person company groups in Chinese and English", () => {
    const chineseResults = searchGroups(sampleGroups, { query: "一人公司" });
    const englishResults = searchGroups(sampleGroups, {
      query: "One-Person Company"
    });

    expect(
      chineseResults.some((group) => group.slug === "opc-community")
    ).toBe(true);
    expect(englishResults.some((group) => group.slug === "opc-community")).toBe(
      true
    );
  });

  it("treats one-person company as a first-level category", () => {
    const results = searchGroups(sampleGroups, {
      category: "one-person-company"
    });

    expect(getCategoryLabel("one-person-company", "zh")).toBe("一人公司");
    expect(getCategoryLabel("one-person-company", "en")).toBe(
      "One-Person Company"
    );
    expect(results.some((group) => group.slug === "opc-community")).toBe(true);
    expect(results.every((group) => group.categorySlug === "one-person-company"))
      .toBe(true);
  });

  it("includes verified real-world public communities as samples", () => {
    const slugs = sampleGroups.map((group) => group.slug);

    expect(sampleGroups).toHaveLength(126);
    expect(new Set(slugs)).toHaveLength(sampleGroups.length);
    expect(slugs).toContain("langchain-community-slack");
    expect(slugs).toContain("hugging-face-discord");
    expect(slugs).toContain("supabase-discord");
    expect(slugs).toContain("cloudflare-developers-discord");
    expect(slugs).toContain("opc-community");
    expect(slugs).toContain("shopify-community");
    expect(slugs).toContain("microconf-connect");
    expect(slugs).toContain("bogleheads-forum");
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

  it("keeps every sample approved and backed by a public URL", () => {
    const values = sampleGroups.flatMap((group) =>
      group.joinMethods.map((method) => method.value)
    );

    expect(sampleGroups.every((group) => group.moderationStatus === "approved"))
      .toBe(true);
    expect(values.every((value) => /^https:\/\/\S+$/.test(value))).toBe(true);
    expect(values.some((value) => value.includes("example"))).toBe(false);
    expect(values.some((value) => value.includes("管理员"))).toBe(false);
    expect(sampleGroups.some((group) => group.slug.includes("pending"))).toBe(
      false
    );
  });

  it("provides English localized sample content for rendered group copy", () => {
    const cjkPattern = /[\u3400-\u9FFF]/;

    expect(
      sampleGroups.every((group) => group.localizedContent?.en?.shortDescription)
    ).toBe(true);
    expect(
      sampleGroups.every(
        (group) =>
          !cjkPattern.test(getGroupText(group, "shortDescription", "en")) &&
          !cjkPattern.test(getGroupText(group, "suitableFor", "en")) &&
          !cjkPattern.test(getGroupText(group, "rulesSummary", "en"))
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
