import Link from "next/link";

import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import type { PaginationState } from "@/lib/pagination";

type PaginationProps = {
  locale: Locale;
  pageParam?: string;
  pathname: string;
  query?: Record<string, string | undefined>;
  state: PaginationState<unknown>;
};

function pageHref(
  pathname: string,
  locale: Locale,
  page: number,
  pageParam: string,
  query: Record<string, string | undefined> = {}
): string {
  const params = new URLSearchParams();
  params.set("lang", locale);

  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });

  if (page > 1) {
    params.set(pageParam, String(page));
  }

  return `${pathname}?${params.toString()}`;
}

function pageNumbers(currentPage: number, totalPages: number): number[] {
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function Pagination({
  locale,
  pageParam = "page",
  pathname,
  query,
  state
}: PaginationProps) {
  if (state.totalPages <= 1) {
    return null;
  }

  const copy = getDictionary(locale);
  const pages = pageNumbers(state.currentPage, state.totalPages);
  const previousPage = Math.max(1, state.currentPage - 1);
  const nextPage = Math.min(state.totalPages, state.currentPage + 1);

  return (
    <nav
      aria-label={copy.pagination.label}
      className="flex flex-col gap-3 border-t border-ink/10 pt-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-sm text-ink/60">
        {copy.pagination.summary(
          state.startItem,
          state.endItem,
          state.totalItems
        )}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          aria-disabled={state.currentPage === 1}
          className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
            state.currentPage === 1
              ? "pointer-events-none border-ink/10 text-ink/35"
              : "border-ink/15 text-ink hover:border-leaf/40 hover:text-leaf"
          }`}
          href={pageHref(pathname, locale, previousPage, pageParam, query)}
        >
          {copy.pagination.previous}
        </Link>

        {pages[0] > 1 ? (
          <Link
            className="rounded-md border border-ink/15 px-3 py-2 text-sm font-medium text-ink transition hover:border-leaf/40 hover:text-leaf"
            href={pageHref(pathname, locale, 1, pageParam, query)}
          >
            1
          </Link>
        ) : null}
        {pages[0] > 2 ? <span className="px-1 text-ink/40">...</span> : null}

        {pages.map((page) => (
          <Link
            aria-current={page === state.currentPage ? "page" : undefined}
            className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
              page === state.currentPage
                ? "border-leaf bg-leaf text-white"
                : "border-ink/15 text-ink hover:border-leaf/40 hover:text-leaf"
            }`}
            href={pageHref(pathname, locale, page, pageParam, query)}
            key={page}
          >
            {page}
          </Link>
        ))}

        {pages.at(-1)! < state.totalPages - 1 ? (
          <span className="px-1 text-ink/40">...</span>
        ) : null}
        {pages.at(-1)! < state.totalPages ? (
          <Link
            className="rounded-md border border-ink/15 px-3 py-2 text-sm font-medium text-ink transition hover:border-leaf/40 hover:text-leaf"
            href={pageHref(pathname, locale, state.totalPages, pageParam, query)}
          >
            {state.totalPages}
          </Link>
        ) : null}

        <Link
          aria-disabled={state.currentPage === state.totalPages}
          className={`rounded-md border px-3 py-2 text-sm font-medium transition ${
            state.currentPage === state.totalPages
              ? "pointer-events-none border-ink/10 text-ink/35"
              : "border-ink/15 text-ink hover:border-leaf/40 hover:text-leaf"
          }`}
          href={pageHref(pathname, locale, nextPage, pageParam, query)}
        >
          {copy.pagination.next}
        </Link>
      </div>
    </nav>
  );
}
