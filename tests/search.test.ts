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
        (group) => group.category === "ai" && group.platform === "wechat"
      )
    ).toBe(true);
  });

  it("returns only approved groups by default", () => {
    const results = searchGroups(sampleGroups, {});

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((group) => group.moderationStatus === "approved")).toBe(
      true
    );
  });

  it("provides bilingual category labels", () => {
    expect(getCategoryLabel("overseas", "zh")).toBe("出海");
    expect(getCategoryLabel("overseas", "en")).toContain("Overseas");
  });
});
