import React, { type ReactNode } from "react";

type AdminQueueProps = {
  actionHref?: string;
  actionLabel?: string;
  title: string;
  description: string;
  status: string;
  details?: { label: string; value: string }[];
  detailsTitle?: string;
  meta?: string;
  notice?: string;
  children?: ReactNode;
};

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function AdminQueue({
  actionHref,
  actionLabel,
  title,
  description,
  status,
  details = [],
  detailsTitle,
  meta,
  notice,
  children
}: AdminQueueProps) {
  return (
    <article className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-6 text-ink">
            {title}
          </h3>
          <p className="mt-1 line-clamp-3 text-sm leading-6 text-ink/65">
            {description}
          </p>
        </div>
        <span className="rounded-md border border-leaf/20 bg-leaf/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-leaf">
          {status}
        </span>
      </div>

      {meta ? <p className="mt-3 text-xs text-ink/45">{meta}</p> : null}
      {notice ? (
        <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium leading-5 text-amber-800">
          {notice}
        </p>
      ) : null}
      {details.length > 0 ? (
        <details
          className="mt-4 rounded-md bg-paper px-3 py-3 text-xs"
          open
        >
          <summary className="cursor-pointer select-none font-semibold text-ink/60">
            {detailsTitle}
          </summary>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2">
            {details.map((item) => (
              <div className="min-w-0" key={`${item.label}:${item.value}`}>
                <dt className="font-medium text-ink/45">{item.label}</dt>
                <dd className="mt-1 break-words leading-5 text-ink/75">
                  {isHttpUrl(item.value) ? (
                    <a
                      className="font-medium text-leaf underline-offset-2 hover:underline"
                      href={item.value}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </details>
      ) : null}
      {actionHref && actionLabel ? (
        <div className="mt-4">
          <a
            className="inline-flex min-h-9 items-center rounded-md border border-ink/15 px-3 py-2 text-xs font-semibold text-ink/70 transition hover:border-leaf hover:text-leaf"
            href={actionHref}
          >
            {actionLabel}
          </a>
        </div>
      ) : null}
      {children ? <div className="mt-4 border-t border-ink/10 pt-4">{children}</div> : null}
    </article>
  );
}
