import type { CategorySlug, Group, JoinMethod } from "@/lib/domain";

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

export function isJoinMethodExpired(
  method: Pick<JoinMethod, "expiresAt">,
  now: Date = new Date()
): boolean {
  if (!method.expiresAt) return false;

  const expiresAt = new Date(`${method.expiresAt}T23:59:59.999Z`);

  return !Number.isNaN(expiresAt.getTime()) && expiresAt < now;
}

export function shouldWarnAboutJoinFreshness(
  group: Pick<Group, "joinMethods" | "trustSignals">,
  now: Date = new Date()
): boolean {
  return (
    group.trustSignals.includes("needs_update") ||
    group.joinMethods.some((method) => isJoinMethodExpired(method, now))
  );
}

export function getOwnerTrustStatus(
  group: Pick<Group, "ownerVerified">
): "verified" | "public_unverified" {
  return group.ownerVerified ? "verified" : "public_unverified";
}
