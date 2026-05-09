export const GROUPS_PER_PAGE = 12;

export type PaginationState<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  startItem: number;
  endItem: number;
};

export function parsePageParam(value: string | undefined): number {
  if (!value) return 1;

  const page = Number.parseInt(value, 10);

  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number = GROUPS_PER_PAGE
): PaginationState<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return {
    items: paginatedItems,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    startItem: totalItems === 0 ? 0 : startIndex + 1,
    endItem: startIndex + paginatedItems.length
  };
}
