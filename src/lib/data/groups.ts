import {
  categories,
  trustSignals,
  type CategorySlug,
  type Group,
  type JoinMethod,
  type JoinMethodReviewStatus,
  type LocalizedGroupContent,
  type LocalizedGroupField,
  type TrustSignal
} from "@/lib/domain";
import { sampleGroups } from "@/lib/mock-data";
import { searchGroups } from "@/lib/search";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import type { Json } from "@/lib/supabase/types";

type ApprovedGroupFilters = {
  query?: string;
  category?: string;
};

type CategoryRelation = {
  slug: string | null;
};

type JoinMethodRow = {
  id: string;
  type: JoinMethod["type"];
  label: string;
  value: string;
  visibility: JoinMethod["visibility"];
  review_status: string;
  expires_at: string | null;
  last_verified_at: string | null;
};

type GroupRow = {
  id: string;
  slug: string;
  name: string;
  platform: Group["platform"];
  tags: string[] | null;
  short_description: string;
  description: string;
  suitable_for: string | null;
  language: string | null;
  region: string | null;
  activity_level: Group["activityLevel"];
  join_policy: Group["joinPolicy"];
  price: Group["price"];
  rules_summary: string | null;
  owner_verified: boolean;
  moderation_status: Group["moderationStatus"];
  trust_signals: string[] | null;
  localized_content: Json | null;
  last_verified_at: string | null;
  categories: CategoryRelation | CategoryRelation[] | null;
  group_join_methods: JoinMethodRow[] | null;
};

const localizedFields = [
  "shortDescription",
  "description",
  "suitableAudience",
  "suitableFor",
  "language",
  "region",
  "rulesSummary"
] as const satisfies readonly LocalizedGroupField[];

const approvedSampleGroups = sampleGroups.filter(
  (group) => group.moderationStatus === "approved"
);

function getFallbackApprovedGroups(filters: ApprovedGroupFilters = {}): Group[] {
  const category = toCategorySlug(filters.category);

  if (filters.category && !category) {
    return [];
  }

  return searchGroups(approvedSampleGroups, {
    query: filters.query,
    category
  });
}

function toCategorySlug(value: string | undefined): CategorySlug | undefined {
  if (!value) return undefined;

  return categories.some((category) => category.slug === value)
    ? (value as CategorySlug)
    : undefined;
}

function firstCategory(
  category: CategoryRelation | CategoryRelation[] | null
): CategoryRelation | null {
  return Array.isArray(category) ? category[0] ?? null : category;
}

function isTrustSignal(value: string): value is TrustSignal {
  return trustSignals.includes(value as TrustSignal);
}

function toJoinMethodReviewStatus(
  value: string
): JoinMethodReviewStatus | null {
  if (value === "approved" || value === "pending" || value === "rejected") {
    return value;
  }

  return null;
}

function toDateOnly(value: string | null): string | undefined {
  return value?.slice(0, 10) || undefined;
}

function toLocalizedContent(value: Json | null): LocalizedGroupContent | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const content: LocalizedGroupContent = {};

  for (const locale of ["zh", "en"] as const) {
    const source = value[locale];

    if (!source || typeof source !== "object" || Array.isArray(source)) {
      continue;
    }

    for (const field of localizedFields) {
      const fieldValue = source[field];

      if (typeof fieldValue === "string") {
        content[locale] = {
          ...content[locale],
          [field]: fieldValue
        };
      }
    }
  }

  return Object.keys(content).length > 0 ? content : undefined;
}

function mapGroupRow(row: GroupRow): Group | null {
  if (row.moderation_status !== "approved") {
    return null;
  }

  const categorySlug = firstCategory(row.categories)?.slug;

  if (!toCategorySlug(categorySlug ?? undefined)) {
    return null;
  }

  const joinMethods = (row.group_join_methods ?? []).flatMap((method) => {
    const reviewStatus = toJoinMethodReviewStatus(method.review_status);

    if (method.visibility !== "public" || reviewStatus !== "approved") {
      return [];
    }

    return {
      id: method.id,
      type: method.type,
      label: method.label,
      value: method.value,
      visibility: method.visibility,
      expiresAt: toDateOnly(method.expires_at),
      lastVerifiedAt: toDateOnly(method.last_verified_at),
      reviewStatus
    } satisfies JoinMethod;
  });

  const suitableFor = row.suitable_for ?? "";

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    platform: row.platform,
    categorySlug: categorySlug as CategorySlug,
    tags: row.tags ?? [],
    shortDescription: row.short_description,
    description: row.description,
    suitableAudience: suitableFor,
    suitableFor,
    language: row.language ?? "",
    region: row.region ?? "",
    activityLevel: row.activity_level,
    joinPolicy: row.join_policy,
    price: row.price,
    rulesSummary: row.rules_summary ?? "",
    ownerVerified: row.owner_verified,
    lastVerifiedAt: toDateOnly(row.last_verified_at),
    trustSignals: (row.trust_signals ?? []).filter(isTrustSignal),
    joinMethods,
    moderationStatus: row.moderation_status,
    localizedContent: toLocalizedContent(row.localized_content)
  };
}

function mapGroupRows(rows: GroupRow[] | null): Group[] {
  return (rows ?? []).flatMap((row) => {
    const group = mapGroupRow(row);
    return group ? [group] : [];
  });
}

export async function getApprovedGroups(
  filters: ApprovedGroupFilters = {}
): Promise<Group[]> {
  if (!hasSupabaseEnv()) {
    return getFallbackApprovedGroups(filters);
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    let query = supabase
      .from("groups")
      .select(
        `
        id,
        slug,
        name,
        platform,
        tags,
        short_description,
        description,
        suitable_for,
        language,
        region,
        activity_level,
        join_policy,
        price,
        rules_summary,
        owner_verified,
        moderation_status,
        trust_signals,
        localized_content,
        last_verified_at,
        categories!inner(slug),
        group_join_methods(
          id,
          type,
          label,
          value,
          visibility,
          review_status,
          expires_at,
          last_verified_at
        )
      `
      )
      .eq("moderation_status", "approved")
      .eq("group_join_methods.visibility", "public")
      .eq("group_join_methods.review_status", "approved")
      .order("last_verified_at", { ascending: false, nullsFirst: false })
      .order("name", { ascending: true });

    if (filters.category) {
      query = query.eq("categories.slug", filters.category);
    }

    const { data, error } = await query;

    if (error) {
      return getFallbackApprovedGroups(filters);
    }

    const groups = mapGroupRows(data as GroupRow[] | null);

    return filters.query ? searchGroups(groups, { query: filters.query }) : groups;
  } catch {
    return getFallbackApprovedGroups(filters);
  }
}

export async function getApprovedGroupBySlug(
  slug: string
): Promise<Group | null> {
  if (!hasSupabaseEnv()) {
    return getFallbackApprovedGroups().find((group) => group.slug === slug) ?? null;
  }

  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("groups")
      .select(
        `
        id,
        slug,
        name,
        platform,
        tags,
        short_description,
        description,
        suitable_for,
        language,
        region,
        activity_level,
        join_policy,
        price,
        rules_summary,
        owner_verified,
        moderation_status,
        trust_signals,
        localized_content,
        last_verified_at,
        categories!inner(slug),
        group_join_methods(
          id,
          type,
          label,
          value,
          visibility,
          review_status,
          expires_at,
          last_verified_at
        )
      `
      )
      .eq("slug", slug)
      .eq("moderation_status", "approved")
      .eq("group_join_methods.visibility", "public")
      .eq("group_join_methods.review_status", "approved")
      .maybeSingle();

    if (error) {
      return getFallbackApprovedGroups().find((group) => group.slug === slug) ?? null;
    }

    return data ? mapGroupRow(data as GroupRow) : null;
  } catch {
    return getFallbackApprovedGroups().find((group) => group.slug === slug) ?? null;
  }
}
