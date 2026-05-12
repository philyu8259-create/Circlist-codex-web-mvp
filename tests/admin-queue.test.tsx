import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AdminQueue } from "../src/components/AdminQueue";

describe("AdminQueue", () => {
  it("renders an optional management link and notice", () => {
    render(
      <AdminQueue
        actionHref="/admin/groups/group-1/edit?lang=zh"
        actionLabel="去编辑加入方式"
        description="加入方式失效"
        notice="处理后会重新检查失效提醒。"
        status="状态: pending"
        title="加入方式失效"
      />
    );

    expect(
      screen.getByRole("link", { name: "去编辑加入方式" })
    ).toHaveAttribute("href", "/admin/groups/group-1/edit?lang=zh");
    expect(screen.getByText("处理后会重新检查失效提醒。")).toBeInTheDocument();
  });
});
