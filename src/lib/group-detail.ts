import type { CategorySlug, Group } from "@/lib/domain";

export function isExternalJoinValue(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

export function shouldShowInvestmentRisk(categorySlug: CategorySlug): boolean {
  return categorySlug === "investment";
}

export function getOwnerTrustStatus(
  group: Pick<Group, "ownerVerified">
): "verified" | "public_unverified" {
  return group.ownerVerified ? "verified" : "public_unverified";
}
