import { redirect } from "next/navigation";

import { hasSupabaseEnv } from "../supabase/env";
import type { Database, Json } from "../supabase/types";

const reviewDecisions = [
  "approved",
  "rejected",
  "changes_requested"
] as const;

type ReviewDecision = (typeof reviewDecisions)[number];
type OwnershipClaimDecision = Exclude<ReviewDecision, "changes_requested">;
type GroupSubmissionUpdate =
  Database["public"]["Tables"]["group_submissions"]["Update"];
type GroupInsert = Database["public"]["Tables"]["groups"]["Insert"];
type GroupJoinMethodInsert =
  Database["public"]["Tables"]["group_join_methods"]["Insert"];
type OwnershipClaimUpdate =
  Database["public"]["Tables"]["ownership_claims"]["Update"];
type ReportUpdate = Database["public"]["Tables"]["reports"]["Update"];
type JoinMethodType = Database["public"]["Enums"]["join_method_type"];

type SubmissionApprovalRow = {
  id: string;
  submitter_id: string;
  category_id: string | null;
  group_id: string | null;
  proposed_name: string;
  proposed_platform: Database["public"]["Enums"]["group_platform"];
  proposed_join_method: JoinMethodType | null;
  proposed_join_value: string | null;
  proposed_payload: Json;
  moderation_status: string;
};
type ClaimApprovalRow = {
  id: string;
  group_id: string;
  claimant_id: string;
};

type ReviewSubmissionInput = {
  submissionId?: FormDataEntryValue | null;
  decision?: FormDataEntryValue | null;
  reviewerNotes?: FormDataEntryValue | null;
};
type ReviewOwnershipClaimInput = {
  claimId?: FormDataEntryValue | null;
  decision?: FormDataEntryValue | null;
  reviewerNotes?: FormDataEntryValue | null;
};
type ReviewReportInput = {
  reportId?: FormDataEntryValue | null;
  decision?: FormDataEntryValue | null;
};

type ReviewSubmissionValidation =
  | {
      ok: true;
      submissionId: string;
      decision: ReviewDecision;
      reviewerNotes: string | null;
    }
  | { ok: false; errors: string[] };
type ReviewOwnershipClaimValidation =
  | {
      ok: true;
      claimId: string;
      decision: OwnershipClaimDecision;
      reviewerNotes: string | null;
    }
  | { ok: false; errors: string[] };

const REVIEWER_NOTES_MAX_LENGTH = 2000;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function text(value: FormDataEntryValue | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function jsonObject(value: Json): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function payloadText(payload: Json, key: string): string {
  const value = jsonObject(payload)[key];

  return typeof value === "string" ? value.trim() : "";
}

function payloadJoinValue(payload: Json): string {
  const joinMethod = jsonObject(jsonObject(payload).joinMethod ?? null);
  const qrCode = jsonObject(joinMethod.qrCode ?? null);

  for (const value of [
    joinMethod.groupLink,
    qrCode.storagePath,
    joinMethod.value
  ]) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
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

export function validateReviewOwnershipClaimInput(
  input: ReviewOwnershipClaimInput
): ReviewOwnershipClaimValidation {
  const result = validateReviewSubmissionInput({
    submissionId: input.claimId,
    decision: input.decision,
    reviewerNotes: input.reviewerNotes
  });

  if (!result.ok) return result;

  if (result.decision === "changes_requested") {
    return { ok: false, errors: ["Ownership claim decision is invalid."] };
  }

  return {
    ok: true,
    claimId: result.submissionId,
    decision: result.decision,
    reviewerNotes: result.reviewerNotes
  };
}

export function validateReviewReportInput(
  input: ReviewReportInput
): ReviewSubmissionValidation {
  return validateReviewSubmissionInput({
    submissionId: input.reportId,
    decision: input.decision,
    reviewerNotes: null
  });
}

export function buildPublishedGroupSlug(name: string, submissionId: string): string {
  const suffix = submissionId.replace(/-/g, "").slice(0, 8);
  const base = name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 56)
    .replace(/-+$/g, "");

  return `${base || "group"}-${suffix}`;
}

export function inferJoinPolicy(
  joinMethodType: JoinMethodType | null
): "open" | "approval_required" | "admin_contact" | "invite_only" {
  if (joinMethodType === "admin_contact") return "admin_contact";
  if (joinMethodType === "application_form") return "approval_required";

  return "open";
}

function joinMethodLabel(joinMethodType: JoinMethodType | null): string {
  switch (joinMethodType) {
    case "qr_code":
      return "Submitted QR code";
    case "group_number":
      return "Submitted group number";
    case "admin_contact":
      return "Submitted admin contact";
    case "application_form":
      return "Submitted application form";
    case "manual_notes":
      return "Submitted join notes";
    case "invite_link":
    default:
      return "Submitted invite link";
  }
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

async function resolveSubmissionCategoryId({
  categoryId,
  payload,
  supabase
}: {
  categoryId: string | null;
  payload: Json;
  supabase: Awaited<ReturnType<typeof import("../supabase/server").createClient>>;
}): Promise<string | null> {
  if (categoryId) return categoryId;

  const categorySlug = payloadText(payload, "categorySlug");

  if (!categorySlug) return null;

  const { data, error } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();
  const category = data as { id: string } | null;

  return error ? null : category?.id ?? null;
}

async function publishSubmission({
  reviewerNotes,
  submission,
  supabase
}: {
  reviewerNotes: string | null;
  submission: SubmissionApprovalRow;
  supabase: Awaited<ReturnType<typeof import("../supabase/server").createClient>>;
}): Promise<boolean> {
  if (submission.group_id) {
    const update: GroupSubmissionUpdate = {
      moderation_status: "approved",
      moderator_notes: reviewerNotes,
      updated_at: new Date().toISOString()
    };
    const { error } = await supabase
      .from("group_submissions")
      .update(update as never)
      .eq("id", submission.id);

    return !error;
  }

  const categoryId = await resolveSubmissionCategoryId({
    categoryId: submission.category_id,
    payload: submission.proposed_payload,
    supabase
  });
  const joinMethodType = submission.proposed_join_method ?? "invite_link";
  const joinValue =
    submission.proposed_join_value ?? payloadJoinValue(submission.proposed_payload);

  if (!categoryId || !joinValue) {
    return false;
  }

  const now = new Date().toISOString();
  const shortDescription =
    payloadText(submission.proposed_payload, "shortDescription") ||
    submission.proposed_name;
  const description =
    payloadText(submission.proposed_payload, "description") || shortDescription;
  const group: GroupInsert = {
    category_id: categoryId,
    owner_id: null,
    slug: buildPublishedGroupSlug(submission.proposed_name, submission.id),
    name: submission.proposed_name,
    platform: submission.proposed_platform,
    tags: [],
    short_description: shortDescription,
    description,
    suitable_for: null,
    language: payloadText(submission.proposed_payload, "language") || null,
    region: payloadText(submission.proposed_payload, "region") || null,
    activity_level: "unknown",
    join_policy: inferJoinPolicy(joinMethodType),
    price: "unknown",
    rules_summary:
      payloadText(submission.proposed_payload, "rulesSummary") || null,
    owner_verified: false,
    moderation_status: "pending",
    trust_signals: ["recently_verified", "join_method_fresh"],
    last_verified_at: now,
    created_at: now,
    updated_at: now
  };

  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .insert(group as never)
    .select("id")
    .single();
  const publishedGroup = groupData as { id: string } | null;

  if (groupError || !publishedGroup) {
    return false;
  }

  const joinMethod: GroupJoinMethodInsert = {
    group_id: publishedGroup.id,
    type: joinMethodType,
    label: joinMethodLabel(joinMethodType),
    value: joinValue,
    visibility: "public",
    review_status: "approved",
    expires_at: null,
    last_verified_at: now,
    created_at: now,
    updated_at: now
  };
  const { error: joinMethodError } = await supabase
    .from("group_join_methods")
    .insert(joinMethod as never);

  if (joinMethodError) {
    return false;
  }

  const { error: groupPublishError } = await supabase
    .from("groups")
    .update({
      moderation_status: "approved",
      updated_at: now
    } as never)
    .eq("id", publishedGroup.id);

  if (groupPublishError) {
    return false;
  }

  const update: GroupSubmissionUpdate = {
    group_id: publishedGroup.id,
    moderation_status: "approved",
    moderator_notes: reviewerNotes,
    updated_at: now
  };
  const { error: updateError } = await supabase
    .from("group_submissions")
    .update(update as never)
    .eq("id", submission.id);

  return !updateError;
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

  if (validation.decision === "approved") {
    const { data, error } = await supabase
      .from("group_submissions")
      .select(
        `
        id,
        submitter_id,
        category_id,
        group_id,
        proposed_name,
        proposed_platform,
        proposed_join_method,
        proposed_join_value,
        proposed_payload,
        moderation_status
      `
      )
      .eq("id", validation.submissionId)
      .maybeSingle();
    const submission = data as SubmissionApprovalRow | null;

    if (
      error ||
      !submission ||
      submission.moderation_status !== "pending" ||
      !(await publishSubmission({
        reviewerNotes: validation.reviewerNotes,
        submission,
        supabase
      }))
    ) {
      redirect(`/admin?lang=${locale}&review=error`);
    }

    redirect(`/admin?lang=${locale}&review=updated`);
  }

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

export async function reviewOwnershipClaim(formData: FormData) {
  "use server";

  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const validation = validateReviewOwnershipClaimInput({
    claimId: formData.get("claimId"),
    decision: formData.get("decision"),
    reviewerNotes: formData.get("reviewerNotes")
  });

  if (!validation.ok) {
    redirect(`/admin?lang=${locale}&review=validation`);
  }

  const { supabase } = await requireAdmin();
  const update: OwnershipClaimUpdate = {
    claim_status: validation.decision,
    moderator_notes: validation.reviewerNotes,
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from("ownership_claims")
    .update(update as never)
    .eq("id", validation.claimId);

  if (error) {
    redirect(`/admin?lang=${locale}&review=error`);
  }

  if (validation.decision === "approved") {
    const { data: claimData, error: claimError } = await supabase
      .from("ownership_claims")
      .select("id, group_id, claimant_id")
      .eq("id", validation.claimId)
      .maybeSingle();
    const claim = claimData as ClaimApprovalRow | null;

    if (claimError || !claim) {
      redirect(`/admin?lang=${locale}&review=error`);
    }

    const { data: groupData, error: groupReadError } = await supabase
      .from("groups")
      .select("trust_signals")
      .eq("id", claim.group_id)
      .maybeSingle();
    const group = groupData as { trust_signals: string[] | null } | null;
    const trustSignals = new Set(group?.trust_signals ?? []);
    trustSignals.add("owner_maintained");

    const { error: groupUpdateError } = await supabase
      .from("groups")
      .update({
        owner_id: claim.claimant_id,
        owner_verified: true,
        trust_signals: Array.from(trustSignals),
        updated_at: new Date().toISOString()
      } as never)
      .eq("id", claim.group_id);

    if (groupReadError || groupUpdateError) {
      redirect(`/admin?lang=${locale}&review=error`);
    }
  }

  redirect(`/admin?lang=${locale}&review=updated`);
}

export async function reviewReport(formData: FormData) {
  "use server";

  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const validation = validateReviewReportInput({
    reportId: formData.get("reportId"),
    decision: formData.get("decision")
  });

  if (!validation.ok) {
    redirect(`/admin?lang=${locale}&review=validation`);
  }

  const { supabase } = await requireAdmin();
  const update: ReportUpdate = {
    status: validation.decision
  };

  const { error } = await supabase
    .from("reports")
    .update(update as never)
    .eq("id", validation.submissionId);

  if (error) {
    redirect(`/admin?lang=${locale}&review=error`);
  }

  redirect(`/admin?lang=${locale}&review=updated`);
}
