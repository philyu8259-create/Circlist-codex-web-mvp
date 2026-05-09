import { describe, expect, it } from "vitest";

import { GROUPS_PER_PAGE, paginate, parsePageParam } from "../src/lib/pagination";

describe("pagination", () => {
  it("uses a scannable default page size", () => {
    expect(GROUPS_PER_PAGE).toBe(12);
  });

  it("returns the requested page slice and range", () => {
    const items = Array.from({ length: 126 }, (_, index) => index + 1);
    const page = paginate(items, 2);

    expect(page.items).toEqual([13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]);
    expect(page.currentPage).toBe(2);
    expect(page.totalPages).toBe(11);
    expect(page.startItem).toBe(13);
    expect(page.endItem).toBe(24);
  });

  it("normalizes invalid or out-of-range page params", () => {
    expect(parsePageParam("abc")).toBe(1);
    expect(parsePageParam("-2")).toBe(1);
    expect(paginate([1, 2, 3], 99).currentPage).toBe(1);
  });
});
