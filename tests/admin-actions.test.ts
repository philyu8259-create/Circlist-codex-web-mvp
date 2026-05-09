import { describe, expect, it } from "vitest";

import { validateReviewSubmissionInput } from "../src/lib/actions/admin";

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
