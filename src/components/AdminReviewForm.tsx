"use client";

import { Check, FilePenLine, Loader2, X } from "lucide-react";
import React from "react";
import { useState } from "react";

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
  pending
}: {
  decisions: ReviewDecision[];
  pending: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {decisions.map((decision) => {
        const Icon = decisionIcon(decision.tone);

        return (
          <button
            className={`inline-flex min-h-10 items-center gap-2 rounded-md px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed ${buttonClassName(decision.tone)}`}
            data-confirm={decision.confirmMessage}
            disabled={pending}
            key={decision.value}
            name="decision"
            type="submit"
            value={decision.value}
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

  return (
    <form
      action={action}
      className="grid gap-3"
      onSubmit={(event) => {
        const submitter = (event.nativeEvent as SubmitEvent).submitter;
        const confirmMessage =
          submitter instanceof HTMLButtonElement
            ? submitter.dataset.confirm
            : undefined;

        if (confirmMessage && !window.confirm(confirmMessage)) {
          event.preventDefault();
          setPending(false);
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
      <ReviewButtons decisions={decisions} pending={pending} />
    </form>
  );
}
