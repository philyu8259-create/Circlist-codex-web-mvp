import { categories, platforms, type CategorySlug, type Platform } from "./domain";

export const adminGroupStatuses = [
  "approved",
  "needs_update",
  "suspended"
] as const;

export type AdminGroupStatusFilter =
  | "all"
  | (typeof adminGroupStatuses)[number];

export type AdminGroupFilters = {
  category: "all" | CategorySlug;
  platform: "all" | Platform;
  query: string;
  status: AdminGroupStatusFilter;
};

type AdminGroupFilterInput =
  | Record<string, string | string[] | undefined>
  | undefined;

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((category) => category.slug === value);
}

function isPlatform(value: string): value is Platform {
  return platforms.includes(value as Platform);
}

function isStatus(value: string): value is (typeof adminGroupStatuses)[number] {
  return adminGroupStatuses.includes(
    value as (typeof adminGroupStatuses)[number]
  );
}

export function normalizeAdminGroupFilters(
  input: AdminGroupFilterInput
): AdminGroupFilters {
  const query = firstValue(input?.groupQuery).trim().slice(0, 80);
  const status = firstValue(input?.groupStatus);
  const category = firstValue(input?.groupCategory);
  const platform = firstValue(input?.groupPlatform);

  return {
    category: isCategorySlug(category) ? category : "all",
    platform: isPlatform(platform) ? platform : "all",
    query,
    status: isStatus(status) ? status : "all"
  };
}

export function hasActiveAdminGroupFilters(filters: AdminGroupFilters): boolean {
  return Boolean(
    filters.query ||
      filters.status !== "all" ||
      filters.category !== "all" ||
      filters.platform !== "all"
  );
}
