import { describe, expect, it } from "vitest";

import {
  getDictionary,
  localeFromSearchOrHeader,
  normalizeLocale
} from "../src/lib/i18n";

describe("i18n", () => {
  it("normalizes English browser locales", () => {
    expect(normalizeLocale("en-US")).toBe("en");
  });

  it("uses browser locale only when query locale is absent", () => {
    expect(localeFromSearchOrHeader(undefined, "en-US,en;q=0.9")).toBe("en");
    expect(localeFromSearchOrHeader("zh", "en-US,en;q=0.9")).toBe("zh");
  });

  it("provides Chinese MVP copy", () => {
    expect(getDictionary("zh").subtitle).toContain("兴趣群");
  });
});
