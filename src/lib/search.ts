import {
  getCategoryLabel,
  getGroupText,
  getPlatformLabel,
  type CategorySlug,
  type Group,
  type JoinPolicy,
  type Platform
} from "./domain";

export type GroupSort = "recent" | "activity" | "name";

export type GroupSearchFilters = {
  query?: string;
  category?: CategorySlug | "all";
  platform?: Platform | "all";
  price?: Group["price"] | "all";
  joinPolicy?: JoinPolicy | "all";
  sort?: GroupSort;
  includeUnapproved?: boolean;
};

const activityRank: Record<Group["activityLevel"], number> = {
  high: 3,
  medium: 2,
  low: 1,
  unknown: 0
};

export function searchGroups(
  groups: readonly Group[],
  filters: GroupSearchFilters = {}
): Group[] {
  const query = filters.query?.trim().toLowerCase();

  const filteredGroups = groups.filter((group) => {
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

    if (filters.price && filters.price !== "all" && group.price !== filters.price) {
      return false;
    }

    if (
      filters.joinPolicy &&
      filters.joinPolicy !== "all" &&
      group.joinPolicy !== filters.joinPolicy
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

  return sortGroups(filteredGroups, filters.sort);
}

function sortGroups(groups: Group[], sort: GroupSort = "recent"): Group[] {
  return [...groups].sort((a, b) => {
    if (sort === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sort === "activity") {
      return (
        activityRank[b.activityLevel] - activityRank[a.activityLevel] ||
        b.lastVerifiedAt?.localeCompare(a.lastVerifiedAt ?? "") ||
        a.name.localeCompare(b.name)
      );
    }

    return (
      b.lastVerifiedAt?.localeCompare(a.lastVerifiedAt ?? "") ||
      activityRank[b.activityLevel] - activityRank[a.activityLevel] ||
      a.name.localeCompare(b.name)
    );
  });
}
