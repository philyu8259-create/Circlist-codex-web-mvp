import type { ReactNode } from "react";

type AdminQueueProps = {
  title: string;
  description: string;
  status: string;
  meta?: string;
  children?: ReactNode;
};

export function AdminQueue({
  title,
  description,
  status,
  meta,
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
      {children ? <div className="mt-4 border-t border-ink/10 pt-4">{children}</div> : null}
    </article>
  );
}
