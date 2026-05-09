import Link from "next/link";

import {
  getCategoryLabel,
  getGroupText,
  getPlatformLabel,
  type Group
} from "@/lib/domain";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

type GroupCardProps = {
  group: Group;
  locale: Locale;
};

function detailHref(slug: string, locale: Locale): string {
  return `/groups/${slug}?lang=${locale}`;
}

export function GroupCard({ group, locale }: GroupCardProps) {
  const copy = getDictionary(locale);
  const trustLabel = group.ownerVerified
    ? copy.ownerStatuses.verified
    : group.trustSignals[0]
      ? copy.trustSignals[group.trustSignals[0]]
      : copy.ownerStatuses.unverified;

  return (
    <article className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-leaf/35 hover:shadow-md sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="rounded-full bg-sky px-2.5 py-1 text-ink">
              {getPlatformLabel(group.platform, locale)}
            </span>
            <span className="rounded-full bg-leaf/10 px-2.5 py-1 text-leaf">
              {getCategoryLabel(group.categorySlug, locale)}
            </span>
          </div>
          <h2 className="mt-3 text-lg font-semibold leading-snug text-ink">
            <Link
              className="transition hover:text-leaf"
              href={detailHref(group.slug, locale)}
            >
              {group.name}
            </Link>
          </h2>
        </div>
        <Link
          className="shrink-0 rounded-md border border-leaf/20 px-3 py-2 text-sm font-semibold text-leaf transition hover:border-coral/30 hover:text-coral"
          href={detailHref(group.slug, locale)}
        >
          {copy.card.viewDetails}
        </Link>
      </div>

      <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/68">
        {getGroupText(group, "shortDescription", locale)}
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-md bg-paper p-2 text-xs text-ink/65 sm:gap-3 sm:p-3">
        <div className="min-w-0">
          <dt className="font-medium text-ink/45">{copy.card.activity}</dt>
          <dd className="mt-1 truncate font-semibold text-ink">
            {copy.activityLevels[group.activityLevel]}
          </dd>
        </div>
        <div className="min-w-0">
          <dt className="font-medium text-ink/45">{copy.card.freshness}</dt>
          <dd className="mt-1 truncate font-semibold text-ink">{trustLabel}</dd>
        </div>
        <div className="min-w-0">
          <dt className="font-medium text-ink/45">
            {copy.card.regionLanguage}
          </dt>
          <dd className="mt-1 truncate font-semibold text-ink">
            {getGroupText(group, "region", locale)} ·{" "}
            {getGroupText(group, "language", locale)}
          </dd>
        </div>
      </dl>
    </article>
  );
}
