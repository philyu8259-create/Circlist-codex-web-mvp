import type { Locale } from "@/lib/i18n";

export type LocalizedLabel = Record<Locale, string>;

export const categories = [
  { slug: "ai", label: { zh: "AI", en: "AI" } },
  { slug: "overseas", label: { zh: "出海", en: "Overseas Business" } },
  { slug: "programming", label: { zh: "编程", en: "Programming" } },
  { slug: "investment", label: { zh: "投资", en: "Investment" } },
  { slug: "indie-dev", label: { zh: "独立开发", en: "Indie Development" } }
] as const satisfies readonly {
  slug: string;
  label: LocalizedLabel;
}[];

export const platforms = [
  "wechat",
  "qq",
  "telegram",
  "discord",
  "slack",
  "other"
] as const;

export const moderationStatuses = [
  "draft",
  "pending",
  "approved",
  "rejected",
  "changes_requested",
  "suspended",
  "needs_update"
] as const;

export const trustSignals = [
  "recently_verified",
  "owner_maintained",
  "join_method_fresh",
  "needs_update",
  "under_review",
  "suspended"
] as const;

export const platformLabels = {
  wechat: { zh: "微信群", en: "WeChat" },
  qq: { zh: "QQ群", en: "QQ" },
  telegram: { zh: "Telegram", en: "Telegram" },
  discord: { zh: "Discord", en: "Discord" },
  slack: { zh: "Slack", en: "Slack" },
  other: { zh: "其他", en: "Other" }
} as const satisfies Record<Platform, LocalizedLabel>;

export type CategorySlug = (typeof categories)[number]["slug"];
export type Platform = (typeof platforms)[number];
export type ModerationStatus = (typeof moderationStatuses)[number];
export type TrustSignal = (typeof trustSignals)[number];

export type JoinMethodType =
  | "qr_code"
  | "invite_link"
  | "group_number"
  | "admin_contact"
  | "application_form"
  | "manual_notes";

export type JoinMethodReviewStatus = "approved" | "pending" | "rejected";

export type JoinMethod = {
  id: string;
  type: JoinMethodType;
  label: string;
  value: string;
  visibility: "public" | "members_only" | "admin_only";
  expiresAt?: string;
  lastVerifiedAt?: string;
  reviewStatus: JoinMethodReviewStatus;
};

export type Group = {
  id: string;
  slug: string;
  name: string;
  platform: Platform;
  categorySlug: CategorySlug;
  tags: string[];
  shortDescription: string;
  description: string;
  suitableAudience: string;
  suitableFor: string;
  language: string;
  region: string;
  activityLevel: "low" | "medium" | "high" | "unknown";
  joinPolicy: "open" | "approval_required" | "admin_contact" | "invite_only";
  price: "free" | "paid" | "unknown";
  rulesSummary: string;
  ownerVerified: boolean;
  lastVerifiedAt?: string;
  trustSignals: TrustSignal[];
  joinMethods: JoinMethod[];
  moderationStatus: ModerationStatus;
};

export function getCategoryLabel(
  slug: CategorySlug,
  locale: Locale = "zh"
): string {
  return categories.find((category) => category.slug === slug)?.label[locale] ?? slug;
}

export function getPlatformLabel(
  platform: Platform,
  locale: Locale = "zh"
): string {
  return platformLabels[platform][locale];
}
