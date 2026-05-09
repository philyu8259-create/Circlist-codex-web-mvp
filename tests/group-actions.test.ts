import { describe, expect, it } from "vitest";

import { validateGroupSubmission } from "../src/lib/actions/groups";

describe("validateGroupSubmission", () => {
  it("returns field errors for missing required submission fields", () => {
    const result = validateGroupSubmission({});

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "Group name is required.",
          "Short description is required.",
          "Description is required.",
          "Join method is required."
        ])
      );
    }
  });

  it("rejects invalid platform, category, and join method type", () => {
    const result = validateGroupSubmission({
      name: "AI Builders",
      platform: "invalid-platform",
      categorySlug: "not-a-category",
      shortDescription: "A focused AI community.",
      description: "A community for builders working on AI products.",
      joinMethodType: "carrier_pigeon",
      joinMethodValue: "Send a note."
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "Platform is invalid.",
          "Category is invalid.",
          "Join method type is invalid."
        ])
      );
    }
  });

  it("accepts a valid minimal submission", () => {
    expect(
      validateGroupSubmission({
        name: "AI Builders",
        platform: "wechat",
        categorySlug: "ai",
        shortDescription: "A focused AI community.",
        description: "A community for builders working on AI products.",
        joinMethodType: "admin_contact",
        joinMethodValue: "Contact the admin with your background."
      })
    ).toEqual({ ok: true });
  });
});
