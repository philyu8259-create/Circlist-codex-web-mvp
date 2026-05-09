import { redirect } from "next/navigation";

import type { Database } from "../supabase/types";

const reviewDecisions = [
  "approved",
  "rejected",
  "changes_requested"
] as const;

type ReviewDecision = (typeof reviewDecisions)[number];
type GroupSubmissionUpdate =
  Database["public"]["Tables"]["group_submissions"]["Update"];

type ReviewSubmissionInput = {
  submissionId?: FormDataEntryValue | null;
  decision?: FormDataEntryValue | null;
  reviewerNotes?: FormDataEntryValue | null;
};

type ReviewSubmissionValidation =
  | {
      ok: true;
      submissionId: string;
      decision: ReviewDecision;
      reviewerNotes: string | null;
    }
  | { ok: false; errors: string[] };

const REVIEWER_NOTES_MAX_LENGTH = 2000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function text(value: FormDataEntryValue | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function hasSupabaseEnv(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

function isReviewDecision(value: string): value is ReviewDecision {
  return reviewDecisions.includes(value as ReviewDecision);
}

export function validateReviewSubmissionInput(
  input: ReviewSubmissionInput
): ReviewSubmissionValidation {
  const submissionId = text(input.submissionId);
  const decision = text(input.decision);
  const reviewerNotes = text(input.reviewerNotes);
  const errors: string[] = [];

  if (!submissionId || !isUuid(submissionId)) {
    errors.push("Submission target is invalid.");
  }

  if (!isReviewDecision(decision)) {
    errors.push("Review decision is invalid.");
  }

  if (reviewerNotes.length > REVIEWER_NOTES_MAX_LENGTH) {
    errors.push("Reviewer notes must be 2000 characters or fewer.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    submissionId,
    decision: decision as ReviewDecision,
    reviewerNotes: reviewerNotes || null
  };
}

export async function requireAdmin() {
  if (!hasSupabaseEnv()) {
    throw new Error("Admin review requires Supabase configuration.");
  }

  const { requireUser } = await import("../auth");
  const { createClient } = await import("../supabase/server");
  const user = await requireUser({ next: "/admin" });
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();
  const profile = data as { id: string; role: string } | null;

  if (error || profile?.role !== "admin") {
    throw new Error("Admin role required.");
  }

  return { user, supabase };
}

export async function reviewSubmission(formData: FormData) {
  "use server";

  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const validation = validateReviewSubmissionInput({
    submissionId: formData.get("submissionId"),
    decision: formData.get("decision"),
    reviewerNotes: formData.get("reviewerNotes")
  });

  if (!validation.ok) {
    redirect(`/admin?lang=${locale}&review=validation`);
  }

  const { supabase } = await requireAdmin();
  const update: GroupSubmissionUpdate = {
    moderation_status: validation.decision,
    moderator_notes: validation.reviewerNotes,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("group_submissions")
    .update(update as never)
    .eq("id", validation.submissionId);

  if (error) {
    redirect(`/admin?lang=${locale}&review=error`);
  }

  redirect(`/admin?lang=${locale}&review=updated`);
}
