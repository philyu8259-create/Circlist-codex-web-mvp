import { describe, expect, it } from "vitest";

import { getDictionary, normalizeLocale } from "../src/lib/i18n";

describe("i18n", () => {
  it("normalizes English browser locales", () => {
    expect(normalizeLocale("en-US")).toBe("en");
  });

  it("provides Chinese MVP copy", () => {
    expect(getDictionary("zh").subtitle).toContain("兴趣群");
  });
});
