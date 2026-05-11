import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminReviewForm } from "../src/components/AdminReviewForm";

const decisions = [
  {
    confirmMessage: "Approve this submission?",
    label: "Approve",
    tone: "approve" as const,
    value: "approved"
  },
  {
    confirmMessage: "Reject this item?",
    label: "Reject",
    tone: "reject" as const,
    value: "rejected"
  }
];

describe("AdminReviewForm", () => {
  it("asks for confirmation before submitting a review decision", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const action = vi.fn();

    render(
      <AdminReviewForm
        action={action}
        decisions={decisions}
        entityFieldName="submissionId"
        entityId="123e4567-e89b-12d3-a456-426614174000"
        locale="en"
        reviewerNotesLabel="Reviewer notes"
        reviewerNotesPlaceholder="Add notes"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Approve" }));

    expect(confirmSpy).toHaveBeenCalledWith("Approve this submission?");
    expect(action).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
