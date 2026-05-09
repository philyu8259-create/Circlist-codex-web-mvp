import Link from "next/link";

import {
  getCategoryLabel,
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
    <article className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-leaf/35 hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
        <span className="rounded-full bg-sky px-2.5 py-1 text-ink">
          {getPlatformLabel(group.platform, locale)}
        </span>
        <span className="rounded-full bg-leaf/10 px-2.5 py-1 text-leaf">
          {getCategoryLabel(group.categorySlug, locale)}
        </span>
      </div>

      <div className="mt-3">
        <h2 className="text-lg font-semibold leading-snug text-ink">
          <Link
            className="transition hover:text-leaf"
            href={detailHref(group.slug, locale)}
          >
            {group.name}
          </Link>
        </h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink/68">
          {group.shortDescription}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 text-xs text-ink/65 sm:grid-cols-3">
        <div>
          <dt className="font-medium text-ink/45">{copy.card.activity}</dt>
          <dd className="mt-1 font-semibold text-ink">
            {copy.activityLevels[group.activityLevel]}
          </dd>
        </div>
        <div>
          <dt className="font-medium text-ink/45">{copy.card.freshness}</dt>
          <dd className="mt-1 font-semibold text-ink">{trustLabel}</dd>
        </div>
        <div>
          <dt className="font-medium text-ink/45">
            {copy.card.regionLanguage}
          </dt>
          <dd className="mt-1 font-semibold text-ink">
            {group.region} · {group.language}
          </dd>
        </div>
      </dl>

      <Link
        className="mt-4 inline-flex text-sm font-semibold text-leaf transition hover:text-coral"
        href={detailHref(group.slug, locale)}
      >
        {copy.card.viewDetails}
      </Link>
    </article>
  );
}
