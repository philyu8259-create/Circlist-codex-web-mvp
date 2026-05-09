import {
  getCategoryLabel,
  getGroupText,
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
      getGroupText(group, "shortDescription", "zh"),
      getGroupText(group, "shortDescription", "en"),
      getGroupText(group, "description", "zh"),
      getGroupText(group, "description", "en"),
      getGroupText(group, "suitableAudience", "zh"),
      getGroupText(group, "suitableAudience", "en"),
      getGroupText(group, "suitableFor", "zh"),
      getGroupText(group, "suitableFor", "en"),
      getGroupText(group, "language", "zh"),
      getGroupText(group, "language", "en"),
      getGroupText(group, "region", "zh"),
      getGroupText(group, "region", "en"),
      ...group.tags
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}
