import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminBatchGroupForm } from "../src/components/AdminBatchGroupForm";

const labels = {
  batchActionDescription:
    "Select groups on this page, then publish, mark needs update, or hide them.",
  batchActionTitle: "Batch actions",
  batchConfirmDescription:
    "Apply \"{action}\" to {count} selected groups?",
  batchConfirmTitle: "Confirm batch action",
  batchNoSelection: "Select at least one group first.",
  batchSelectAll: "Select all current page",
  batchSelectedSummary: "{count} selected",
  batchSetHidden: "Hide selected",
  batchSetNeedsUpdate: "Mark needs update",
  batchSetPublished: "Set published",
  editGroup: "Edit",
  statusLabels: {
    approved: "Published",
    needs_update: "Needs update",
    suspended: "Hidden"
  }
};

const items = [
  {
    description: "other · investment · /groups/reddit-stocks",
    id: "123e4567-e89b-12d3-a456-426614174000",
    status: "approved",
    title: "r/stocks"
  },
  {
    description: "telegram · ai · /groups/ai-builders",
    id: "123e4567-e89b-12d3-a456-426614174001",
    status: "needs_update",
    title: "AI Builders"
  }
];

describe("AdminBatchGroupForm", () => {
  it("selects the current page and confirms before submitting a batch action", () => {
    const confirmSpy = vi.spyOn(window, "confirm");
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const action = vi.fn();

    render(
      <AdminBatchGroupForm
        action={action}
        items={items}
        labels={labels}
        locale="en"
      />
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Select all current page" }));

    expect(screen.getByRole("checkbox", { name: /r\/stocks/ })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: /AI Builders/ })).toBeChecked();
    expect(screen.getByText("2 selected")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hide selected" }));

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(
      screen.getByRole("dialog", { name: "Confirm batch action" })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Apply "Hide selected" to 2 selected groups?')
    ).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Cancel" })[0]);

    expect(
      screen.queryByRole("dialog", { name: "Confirm batch action" })
    ).not.toBeInTheDocument();
    expect(action).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });
});
