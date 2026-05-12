"use client";

import { Loader2, X } from "lucide-react";
import React, { useId, useRef, useState } from "react";

type AdminGroupEditFormLabels = {
  cancel: string;
  confirm: string;
  confirmDescription: string;
  confirmTitle: string;
  saveButton: string;
};

type AdminGroupEditFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  labels: AdminGroupEditFormLabels;
};

function AdminGroupSaveConfirmModal({
  allowSubmit,
  labels,
  onCancel,
  pending,
  titleId
}: {
  allowSubmit: () => void;
  labels: AdminGroupEditFormLabels;
  onCancel: () => void;
  pending: boolean;
  titleId: string;
}) {
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
              {labels.confirmTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              {labels.confirmDescription}
            </p>
          </div>
          <button
            aria-label={labels.cancel}
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
            {labels.cancel}
          </button>
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-leaf px-4 py-2 text-sm font-semibold text-white transition hover:bg-leaf/85 disabled:cursor-not-allowed disabled:bg-leaf/50"
            disabled={pending}
            onClick={allowSubmit}
            type="submit"
          >
            {pending ? (
              <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
            ) : null}
            <span>{labels.confirm}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminGroupEditForm({
  action,
  children,
  labels
}: AdminGroupEditFormProps) {
  const allowSubmitRef = useRef(false);
  const titleId = useId();
  const [pending, setPending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  function cancelConfirm() {
    allowSubmitRef.current = false;
    setShowConfirm(false);
  }

  return (
    <form
      action={action}
      className="grid gap-5"
      onSubmit={(event) => {
        if (!allowSubmitRef.current) {
          event.preventDefault();
          setShowConfirm(true);
          return;
        }

        setPending(true);
      }}
    >
      {children}

      <button
        className="min-h-11 w-full rounded-md bg-leaf px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-coral focus:outline-none focus:ring-2 focus:ring-leaf/30 disabled:cursor-not-allowed disabled:bg-leaf/50 sm:w-fit"
        disabled={pending}
        type="submit"
      >
        {labels.saveButton}
      </button>

      {showConfirm ? (
        <AdminGroupSaveConfirmModal
          allowSubmit={() => {
            allowSubmitRef.current = true;
          }}
          labels={labels}
          onCancel={cancelConfirm}
          pending={pending}
          titleId={titleId}
        />
      ) : null}
    </form>
  );
}
