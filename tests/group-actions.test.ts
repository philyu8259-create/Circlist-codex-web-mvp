import { describe, expect, it } from "vitest";

import { validateGroupSubmission } from "../src/lib/actions/groups";
import { validateReportInput } from "../src/lib/actions/reports";

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
      joinMethodType: "unsupported_method",
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

  it("accepts a group link as the join method detail", () => {
    expect(
      validateGroupSubmission({
        name: "AI Builders",
        platform: "telegram",
        categorySlug: "ai",
        shortDescription: "A focused AI community.",
        description: "A community for builders working on AI products.",
        joinMethodType: "invite_link",
        groupLink: "https://t.me/example"
      })
    ).toEqual({ ok: true });
  });

  it("rejects invalid group links", () => {
    const result = validateGroupSubmission({
      name: "AI Builders",
      platform: "telegram",
      categorySlug: "ai",
      shortDescription: "A focused AI community.",
      description: "A community for builders working on AI products.",
      joinMethodType: "invite_link",
      groupLink: "not-a-url"
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Group link must be a valid URL.");
    }
  });

  it("accepts an uploaded QR image as the join method detail", () => {
    expect(
      validateGroupSubmission({
        name: "AI Builders",
        platform: "wechat",
        categorySlug: "ai",
        shortDescription: "A focused AI community.",
        description: "A community for builders working on AI products.",
        joinMethodType: "qr_code",
        qrCode: new File(["qr"], "qr.png", { type: "image/png" })
      })
    ).toEqual({ ok: true });
  });

  it("rejects unsupported QR upload file types", () => {
    const result = validateGroupSubmission({
      name: "AI Builders",
      platform: "wechat",
      categorySlug: "ai",
      shortDescription: "A focused AI community.",
      description: "A community for builders working on AI products.",
      joinMethodType: "qr_code",
      qrCode: new File(["qr"], "qr.txt", { type: "text/plain" })
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("QR code must be a PNG, JPG, or WebP image.");
    }
  });

  it("rejects a one-character group name", () => {
    const result = validateGroupSubmission({
      name: "A",
      platform: "wechat",
      categorySlug: "ai",
      shortDescription: "A focused AI community.",
      description: "A community for builders working on AI products.",
      joinMethodType: "admin_contact",
      joinMethodValue: "Contact the admin with your background."
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain(
        "Group name must be between 2 and 160 characters."
      );
    }
  });

  it("rejects an overlong group name", () => {
    const result = validateGroupSubmission({
      name: "A".repeat(161),
      platform: "wechat",
      categorySlug: "ai",
      shortDescription: "A focused AI community.",
      description: "A community for builders working on AI products.",
      joinMethodType: "admin_contact",
      joinMethodValue: "Contact the admin with your background."
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain(
        "Group name must be between 2 and 160 characters."
      );
    }
  });
});

describe("validateReportInput", () => {
  it("rejects an overlong report message", () => {
    const result = validateReportInput({
      groupSlug: "ai-builders-wechat",
      reportType: "outdated_info",
      message: "A".repeat(2001)
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain(
        "Report message must be 2000 characters or fewer."
      );
    }
  });

  it("rejects an invalid report type", () => {
    const result = validateReportInput({
      groupSlug: "ai-builders-wechat",
      reportType: "not-a-real-report-type",
      message: "This join method is stale."
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Report type is invalid.");
    }
  });
});
