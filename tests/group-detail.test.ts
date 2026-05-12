import { describe, expect, it } from "vitest";

import {
  getOwnerTrustStatus,
  isJoinMethodExpired,
  isExternalJoinValue,
  shouldWarnAboutJoinFreshness,
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

  it("detects expired joining methods from date-only expiration values", () => {
    const now = new Date("2026-05-11T12:00:00.000Z");

    expect(isJoinMethodExpired({ expiresAt: "2026-05-10" }, now)).toBe(true);
    expect(isJoinMethodExpired({ expiresAt: "2026-05-11" }, now)).toBe(false);
    expect(isJoinMethodExpired({ expiresAt: undefined }, now)).toBe(false);
  });

  it("warns when a group has stale joining signals or expired methods", () => {
    const baseGroup = sampleGroups[0];
    const now = new Date("2026-05-11T12:00:00.000Z");

    expect(
      shouldWarnAboutJoinFreshness(
        {
          trustSignals: ["needs_update"],
          joinMethods: baseGroup.joinMethods
        },
        now
      )
    ).toBe(true);
    expect(
      shouldWarnAboutJoinFreshness(
        {
          trustSignals: [],
          joinMethods: [
            {
              ...baseGroup.joinMethods[0],
              expiresAt: "2026-05-10"
            }
          ]
        },
        now
      )
    ).toBe(true);
    expect(
      shouldWarnAboutJoinFreshness(
        {
          trustSignals: [],
          joinMethods: [
            {
              ...baseGroup.joinMethods[0],
              expiresAt: "2026-05-12"
            }
          ]
        },
        now
      )
    ).toBe(false);
  });
});
