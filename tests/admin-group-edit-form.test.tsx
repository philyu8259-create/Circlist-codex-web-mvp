import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminGroupEditForm } from "../src/components/AdminGroupEditForm";

const labels = {
  cancel: "Cancel",
  confirm: "Confirm save",
  confirmDescription:
    "This will immediately update the public group profile and join method.",
  confirmTitle: "Save group changes?",
  saveButton: "Save changes"
};

describe("AdminGroupEditForm", () => {
  it("opens a confirmation dialog before submitting edits", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const action = vi.fn();

    render(
      <AdminGroupEditForm action={action} labels={labels}>
        <input
          defaultValue="123e4567-e89b-12d3-a456-426614174000"
          name="groupId"
        />
      </AdminGroupEditForm>
    );

    fireEvent.click(screen.getByRole("button", { name: "Save changes" }));

    expect(
      screen.getByRole("dialog", { name: "Save group changes?" })
    ).toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();

    fireEvent.click(screen.getAllByRole("button", { name: "Cancel" })[0]);

    expect(
      screen.queryByRole("dialog", { name: "Save group changes?" })
    ).not.toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
