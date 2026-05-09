import { describe, expect, it } from "vitest";

import {
  buildPublishedGroupSlug,
  inferJoinPolicy,
  validateReviewOwnershipClaimInput,
  validateReviewReportInput,
  validateReviewSubmissionInput
} from "../src/lib/actions/admin";

const submissionId = "123e4567-e89b-12d3-a456-426614174000";

describe("validateReviewSubmissionInput", () => {
  it("accepts approved, rejected, and changes_requested decisions", () => {
    for (const decision of ["approved", "rejected", "changes_requested"]) {
      expect(
        validateReviewSubmissionInput({
          submissionId,
          decision,
          reviewerNotes: "Reviewed."
        })
      ).toEqual({
        ok: true,
        submissionId,
        decision,
        reviewerNotes: "Reviewed."
      });
    }
  });

  it("rejects invalid submission ids and decisions", () => {
    const result = validateReviewSubmissionInput({
      submissionId: "not-a-uuid",
      decision: "pending"
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toEqual(
        expect.arrayContaining([
          "Submission target is invalid.",
          "Review decision is invalid."
        ])
      );
    }
  });

  it("rejects overlong reviewer notes", () => {
    const result = validateReviewSubmissionInput({
      submissionId,
      decision: "approved",
      reviewerNotes: "A".repeat(2001)
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain(
        "Reviewer notes must be 2000 characters or fewer."
      );
    }
  });
});

describe("validateReviewOwnershipClaimInput", () => {
  it("rejects changes_requested because claim_status does not support it", () => {
    const result = validateReviewOwnershipClaimInput({
      claimId: submissionId,
      decision: "changes_requested"
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("Ownership claim decision is invalid.");
    }
  });
});

describe("validateReviewReportInput", () => {
  it("accepts report review decisions", () => {
    expect(
      validateReviewReportInput({
        reportId: submissionId,
        decision: "approved"
      })
    ).toEqual({
      ok: true,
      submissionId,
      decision: "approved",
      reviewerNotes: null
    });
  });
});

describe("submission publishing helpers", () => {
  it("builds stable public group slugs from English names", () => {
    expect(
      buildPublishedGroupSlug("LangChain Community Slack", submissionId)
    ).toBe("langchain-community-slack-123e4567");
  });

  it("falls back to a generated group slug for non-ASCII names", () => {
    expect(buildPublishedGroupSlug("一人公司交流群", submissionId)).toBe(
      "group-123e4567"
    );
  });

  it("infers join policy from submitted join method type", () => {
    expect(inferJoinPolicy("admin_contact")).toBe("admin_contact");
    expect(inferJoinPolicy("application_form")).toBe("approval_required");
    expect(inferJoinPolicy("invite_link")).toBe("open");
  });
});
