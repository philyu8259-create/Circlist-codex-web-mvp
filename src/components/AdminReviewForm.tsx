"use client";

import { Check, FilePenLine, Loader2, X } from "lucide-react";
import React from "react";
import { useId, useState } from "react";

type ReviewDecision = {
  confirmMessage: string;
  label: string;
  tone: "approve" | "reject" | "neutral";
  value: string;
};

type AdminReviewFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  decisions: ReviewDecision[];
  entityFieldName: string;
  entityId: string;
  locale: "zh" | "en";
  reviewerNotesLabel?: string;
  reviewerNotesPlaceholder?: string;
  showReviewerNotes?: boolean;
};

function decisionIcon(tone: ReviewDecision["tone"]) {
  if (tone === "approve") return Check;
  if (tone === "reject") return X;

  return FilePenLine;
}

function buttonClassName(tone: ReviewDecision["tone"]) {
  if (tone === "approve") {
    return "bg-leaf text-white hover:bg-leaf/85 disabled:bg-leaf/50";
  }

  if (tone === "reject") {
    return "bg-coral text-white hover:bg-coral/85 disabled:bg-coral/50";
  }

  return "border border-ink/15 text-ink/70 hover:border-leaf hover:text-leaf disabled:text-ink/35";
}

function ReviewButtons({
  decisions,
  onDecisionSelect,
  pending
}: {
  decisions: ReviewDecision[];
  onDecisionSelect: (decision: ReviewDecision) => void;
  pending: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {decisions.map((decision) => {
        const Icon = decisionIcon(decision.tone);

        return (
          <button
            className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed ${buttonClassName(decision.tone)}`}
            disabled={pending}
            key={decision.value}
            onClick={() => onDecisionSelect(decision)}
            type="button"
          >
            {pending ? (
              <Loader2 aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            )}
            <span>{decision.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function AdminConfirmModal({
  decision,
  locale,
  onCancel,
  pending
}: {
  decision: ReviewDecision;
  locale: "zh" | "en";
  onCancel: () => void;
  pending: boolean;
}) {
  const title = locale === "en" ? "Confirm review action" : "确认审核操作";
  const cancel = locale === "en" ? "Cancel" : "取消";
  const confirm = locale === "en" ? "Confirm" : "确认";
  const titleId = useId();

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
              {title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              {decision.confirmMessage}
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
            className={`inline-flex min-h-10 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed ${buttonClassName(decision.tone)}`}
            disabled={pending}
            name="decision"
            type="submit"
            value={decision.value}
          >
            {pending ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : null}
            <span>{`${confirm}: ${decision.label}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminReviewForm({
  action,
  decisions,
  entityFieldName,
  entityId,
  locale,
  reviewerNotesLabel,
  reviewerNotesPlaceholder,
  showReviewerNotes = true
}: AdminReviewFormProps) {
  const [pending, setPending] = useState(false);
  const [selectedDecision, setSelectedDecision] =
    useState<ReviewDecision | null>(null);

  return (
    <form
      action={action}
      className="grid gap-3"
      onSubmit={(event) => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter;

        if (
          submitter instanceof HTMLButtonElement &&
          submitter.name !== "decision"
        ) {
          event.preventDefault();
          return;
        }

        setPending(true);
      }}
    >
      <input name="lang" type="hidden" value={locale} />
      <input name={entityFieldName} type="hidden" value={entityId} />
      {showReviewerNotes ? (
        <label className="grid gap-2 text-xs font-semibold text-ink/60">
          <span>{reviewerNotesLabel}</span>
          <textarea
            className="min-h-24 rounded-md border border-ink/15 px-3 py-2 text-sm font-normal leading-6 text-ink outline-none transition focus:border-leaf"
            maxLength={2000}
            name="reviewerNotes"
            placeholder={reviewerNotesPlaceholder}
          />
        </label>
      ) : null}
      <ReviewButtons
        decisions={decisions}
        onDecisionSelect={setSelectedDecision}
        pending={pending}
      />
      {selectedDecision ? (
        <AdminConfirmModal
          decision={selectedDecision}
          locale={locale}
          onCancel={() => setSelectedDecision(null)}
          pending={pending}
        />
      ) : null}
    </form>
  );
}
