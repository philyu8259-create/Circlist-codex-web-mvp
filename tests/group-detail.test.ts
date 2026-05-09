import { describe, expect, it } from "vitest";

import {
  getOwnerTrustStatus,
  isExternalJoinValue,
  shouldShowInvestmentRisk
} from "../src/lib/group-detail";
import { sampleGroups } from "../src/lib/mock-data";

describe("group detail helpers", () => {
  it("detects external join URLs without treating plain notes as links", () => {
    expect(isExternalJoinValue("https://discord.gg/example")).toBe(true);
    expect(isExternalJoinValue("http://example.com/apply")).toBe(true);
    expect(isExternalJoinValue("Contact an admin in the public forum")).toBe(
      false
    );
  });

  it("flags investment communities for a risk note", () => {
    expect(shouldShowInvestmentRisk("investment")).toBe(true);
    expect(shouldShowInvestmentRisk("ai")).toBe(false);
  });

  it("separates owner-verified and public unverified communities", () => {
    const officialGroup = sampleGroups.find(
      (group) => group.slug === "langchain-community-slack"
    );
    const publicGroup = sampleGroups.find(
      (group) => group.slug === "reddit-investing"
    );

    expect(officialGroup).toBeDefined();
    expect(publicGroup).toBeDefined();
    expect(getOwnerTrustStatus(officialGroup!)).toBe("verified");
    expect(getOwnerTrustStatus(publicGroup!)).toBe("public_unverified");
  });
});
