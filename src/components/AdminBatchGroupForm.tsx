"use client";

import { X } from "lucide-react";
import Link from "next/link";
import React, { useId, useMemo, useState } from "react";

type BatchStatus = "approved" | "needs_update" | "suspended";

export type AdminBatchGroupItem = {
  description: string;
  id: string;
  status: string;
  title: string;
};

export type AdminBatchGroupLabels = {
  batchActionDescription: string;
  batchActionTitle: string;
  batchConfirmDescription: string;
  batchConfirmTitle: string;
  batchNoSelection: string;
  batchSelectAll: string;
  batchSelectedSummary: string;
  batchSetHidden: string;
  batchSetNeedsUpdate: string;
  batchSetPublished: string;
  editGroup: string;
  statusLabels: Record<BatchStatus, string>;
};

type BatchDecision = {
  label: string;
  tone: "approve" | "neutral" | "reject";
  value: BatchStatus;
};

type AdminBatchGroupFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children?: React.ReactNode;
  items: AdminBatchGroupItem[];
  labels: AdminBatchGroupLabels;
  locale: "zh" | "en";
};

function decisionClassName(tone: BatchDecision["tone"]): string {
  if (tone === "approve") return "bg-leaf text-white hover:bg-coral";
  if (tone === "reject") {
    return "border border-coral/25 text-coral hover:bg-coral/10";
  }

  return "border border-ink/15 text-ink/70 hover:border-leaf hover:text-leaf";
}

function formatTemplate(
  template: string,
  values: Record<string, string | number>
): string {
  return Object.entries(values).reduce(
    (copy, [key, value]) => copy.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function AdminBatchConfirmModal({
  decision,
  labels,
  locale,
  onCancel,
  pending,
  selectedCount
}: {
  decision: BatchDecision;
  labels: AdminBatchGroupLabels;
  locale: "zh" | "en";
  onCancel: () => void;
  pending: boolean;
  selectedCount: number;
}) {
  const titleId = useId();
  const cancel = locale === "en" ? "Cancel" : "取消";
  const confirm = locale === "en" ? "Confirm" : "确认";
  const description = formatTemplate(labels.batchConfirmDescription, {
    action: decision.label,
    count: selectedCount
  });

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-ink/35 px-4 py-6"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-lg border border-ink/10 bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink" id={titleId}>
              {labels.batchConfirmTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              {description}
            </p>
          </div>
          <button
            aria-label={cancel}
            className="rounded-md p-1 text-ink/45 transition hover:bg-paper hover:text-ink"
            disabled={pending}
            onClick={onCancel}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            className="min-h-10 rounded-md border border-ink/15 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-ink/30 hover:text-ink disabled:cursor-not-allowed disabled:text-ink/35"
            disabled={pending}
            onClick={onCancel}
            type="button"
          >
            {cancel}
          </button>
          <button
            className={`min-h-10 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${decisionClassName(decision.tone)}`}
            disabled={pending}
            name="batchStatus"
            type="submit"
            value={decision.value}
          >
            {`${confirm}: ${decision.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminBatchGroupForm({
  action,
  children,
  items,
  labels,
  locale
}: AdminBatchGroupFormProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectedDecision, setSelectedDecision] =
    useState<BatchDecision | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const decisions: BatchDecision[] = useMemo(
    () => [
      {
        label: labels.batchSetPublished,
        tone: "approve",
        value: "approved"
      },
      {
        label: labels.batchSetNeedsUpdate,
        tone: "neutral",
        value: "needs_update"
      },
      {
        label: labels.batchSetHidden,
        tone: "reject",
        value: "suspended"
      }
    ],
    [labels.batchSetHidden, labels.batchSetNeedsUpdate, labels.batchSetPublished]
  );
  const allSelected =
    items.length > 0 && selectedIds.size === items.length;
  const selectedSummary = formatTemplate(labels.batchSelectedSummary, {
    count: selectedIds.size
  });

  function toggleSelected(id: string) {
    setMessage("");
    setSelectedIds((current) => {
      const next = new Set(current);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  }

  function toggleAll() {
    setMessage("");
    setSelectedIds((current) =>
      current.size === items.length ? new Set() : new Set(items.map((item) => item.id))
    );
  }

  function selectDecision(decision: BatchDecision) {
    if (selectedIds.size === 0) {
      setMessage(labels.batchNoSelection);
      return;
    }

    setMessage("");
    setSelectedDecision(decision);
  }

  return (
    <form
      action={action}
      className="mt-4 grid gap-3"
      onSubmit={(event) => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter;

        if (
          submitter instanceof HTMLButtonElement &&
          submitter.name !== "batchStatus"
        ) {
          event.preventDefault();
          return;
        }

        setPending(true);
      }}
    >
      <input name="lang" type="hidden" value={locale} />
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink/10 bg-white px-3 py-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">
            {labels.batchActionTitle}
          </h3>
          <p className="mt-1 text-xs leading-5 text-ink/55">
            {labels.batchActionDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {decisions.map((decision) => (
            <button
              className={`min-h-9 rounded-md px-3 py-2 text-xs font-semibold transition ${decisionClassName(decision.tone)}`}
              key={decision.value}
              onClick={() => selectDecision(decision)}
              type="button"
            >
              {decision.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-paper px-3 py-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-ink/70">
          <input
            checked={allSelected}
            className="h-4 w-4 rounded border-ink/20 text-leaf focus:ring-leaf/30"
            onChange={toggleAll}
            type="checkbox"
          />
          {labels.batchSelectAll}
        </label>
        <span className="text-xs font-medium text-ink/50">
          {selectedSummary}
        </span>
      </div>

      {message ? (
        <p className="rounded-md border border-coral/25 bg-coral/10 px-3 py-2 text-sm font-semibold text-coral">
          {message}
        </p>
      ) : null}

      <div className="grid gap-2">
        {items.map((item) => (
          <div
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-ink/10 px-3 py-3"
            key={item.id}
          >
            <label className="flex min-w-0 flex-1 items-start gap-3">
              <input
                checked={selectedIds.has(item.id)}
                className="mt-1 h-4 w-4 rounded border-ink/20 text-leaf focus:ring-leaf/30"
                name="groupIds"
                onChange={() => toggleSelected(item.id)}
                type="checkbox"
                value={item.id}
              />
              <span className="min-w-0">
                <span className="block font-semibold text-ink">
                  {item.title}
                </span>
                <span className="mt-1 block text-xs leading-5 text-ink/55">
                  {item.description}
                </span>
              </span>
            </label>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-leaf/20 bg-leaf/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-leaf">
                {labels.statusLabels[item.status as BatchStatus] ?? item.status}
              </span>
              <Link
                className="rounded-md border border-ink/15 px-3 py-2 text-sm font-semibold text-ink/70 transition hover:border-leaf hover:text-leaf"
                href={`/admin/groups/${item.id}/edit?lang=${locale}`}
              >
                {labels.editGroup}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {children}

      {selectedDecision ? (
        <AdminBatchConfirmModal
          decision={selectedDecision}
          labels={labels}
          locale={locale}
          onCancel={() => setSelectedDecision(null)}
          pending={pending}
          selectedCount={selectedIds.size}
        />
      ) : null}
    </form>
  );
}
