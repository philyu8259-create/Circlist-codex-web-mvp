import {
  getCategoryLabel,
  getPlatformLabel,
  type CategorySlug,
  type Group,
  type Platform
} from "./domain";

export type GroupSearchFilters = {
  query?: string;
  category?: CategorySlug | "all";
  platform?: Platform | "all";
  includeUnapproved?: boolean;
};

export function searchGroups(
  groups: readonly Group[],
  filters: GroupSearchFilters = {}
): Group[] {
  const query = filters.query?.trim().toLowerCase();

  return groups.filter((group) => {
    if (!filters.includeUnapproved && group.moderationStatus !== "approved") {
      return false;
    }

    if (
      filters.category &&
      filters.category !== "all" &&
      group.categorySlug !== filters.category
    ) {
      return false;
    }

    if (
      filters.platform &&
      filters.platform !== "all" &&
      group.platform !== filters.platform
    ) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      group.name,
      getCategoryLabel(group.categorySlug, "zh"),
      getCategoryLabel(group.categorySlug, "en"),
      getPlatformLabel(group.platform, "zh"),
      getPlatformLabel(group.platform, "en"),
      group.shortDescription,
      group.description,
      group.suitableAudience,
      group.suitableFor,
      group.language,
      group.region,
      ...group.tags
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}
