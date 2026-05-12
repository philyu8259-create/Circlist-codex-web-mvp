import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  categories,
  platforms,
  type CategorySlug,
  type JoinMethodType,
  type ModerationStatus,
  type Platform
} from "../domain";
import { buildAdminAuditEvent } from "../admin-audit";
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
type GroupUpdate = Database["public"]["Tables"]["groups"]["Update"];
type GroupJoinMethodInsert =
  Database["public"]["Tables"]["group_join_methods"]["Insert"];
type GroupJoinMethodUpdate =
  Database["public"]["Tables"]["group_join_methods"]["Update"];
type OwnershipClaimUpdate =
  Database["public"]["Tables"]["ownership_claims"]["Update"];
type ReportUpdate = Database["public"]["Tables"]["reports"]["Update"];
type SupabaseServerClient = Awaited<
  ReturnType<typeof import("../supabase/server").createClient>
>;

const activityLevels = ["low", "medium", "high", "unknown"] as const;
const prices = ["free", "paid", "unknown"] as const;
const editableModerationStatuses = [
  "approved",
  "needs_update",
  "suspended"
] as const satisfies readonly ModerationStatus[];
const joinMethodTypes = [
  "qr_code",
  "invite_link",
  "group_number",
  "admin_contact",
  "application_form",
  "manual_notes"
] as const satisfies readonly JoinMethodType[];

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
type ReportReviewRow = {
  group_id: string | null;
  join_method_id: string | null;
  report_type: string;
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
type AdminGroupUpdateInput = {
  groupId?: FormDataEntryValue | null;
  joinMethodId?: FormDataEntryValue | null;
  name?: FormDataEntryValue | null;
  platform?: FormDataEntryValue | null;
  categorySlug?: FormDataEntryValue | null;
  shortDescription?: FormDataEntryValue | null;
  description?: FormDataEntryValue | null;
  suitableFor?: FormDataEntryValue | null;
  language?: FormDataEntryValue | null;
  region?: FormDataEntryValue | null;
  activityLevel?: FormDataEntryValue | null;
  price?: FormDataEntryValue | null;
  rulesSummary?: FormDataEntryValue | null;
  moderationStatus?: FormDataEntryValue | null;
  shortDescriptionZh?: FormDataEntryValue | null;
  descriptionZh?: FormDataEntryValue | null;
  suitableForZh?: FormDataEntryValue | null;
  rulesSummaryZh?: FormDataEntryValue | null;
  shortDescriptionEn?: FormDataEntryValue | null;
  descriptionEn?: FormDataEntryValue | null;
  suitableForEn?: FormDataEntryValue | null;
  rulesSummaryEn?: FormDataEntryValue | null;
  joinMethodType?: FormDataEntryValue | null;
  joinMethodLabel?: FormDataEntryValue | null;
  joinMethodValue?: FormDataEntryValue | null;
  joinMethodExpiresAt?: FormDataEntryValue | null;
};
type AdminGroupBatchUpdateInput = {
  groupIds?: FormDataEntryValue[] | null;
  status?: FormDataEntryValue | null;
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
type AdminGroupUpdateValidation =
  | {
      ok: true;
      value: {
        activityLevel: (typeof activityLevels)[number];
        categorySlug: CategorySlug;
        description: string;
        groupId: string;
        joinMethodId: string | null;
        joinMethodExpiresAt: string | null;
        joinMethodLabel: string;
        joinMethodType: JoinMethodType;
        joinMethodValue: string;
        language: string | null;
        localizedContent: Json;
        moderationStatus: (typeof editableModerationStatuses)[number];
        name: string;
        platform: Platform;
        price: (typeof prices)[number];
        region: string | null;
        rulesSummary: string | null;
        shortDescription: string;
        suitableFor: string | null;
      };
    }
  | { ok: false; errors: string[] };
type AdminGroupBatchUpdateValidation =
  | {
      ok: true;
      groupIds: string[];
      status: (typeof editableModerationStatuses)[number];
    }
  | { ok: false; errors: string[] };

const REVIEWER_NOTES_MAX_LENGTH = 2000;
const GROUP_NAME_MIN_LENGTH = 2;
const GROUP_NAME_MAX_LENGTH = 160;
const SHORT_DESCRIPTION_MAX_LENGTH = 280;
const DESCRIPTION_MAX_LENGTH = 2000;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
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

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);

    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function dateInputToIso(value: string): string | null {
  if (!value) return null;
  if (!DATE_ONLY_PATTERN.test(value)) return null;

  const date = new Date(`${value}T23:59:59.999Z`);

  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    return null;
  }

  return date.toISOString();
}

function isPlatform(value: string): value is Platform {
  return platforms.includes(value as Platform);
}

function isCategorySlug(value: string): value is CategorySlug {
  return categories.some((category) => category.slug === value);
}

function isJoinMethodType(value: string): value is JoinMethodType {
  return joinMethodTypes.includes(value as JoinMethodType);
}

function isActivityLevel(
  value: string
): value is (typeof activityLevels)[number] {
  return activityLevels.includes(value as (typeof activityLevels)[number]);
}

function isPrice(value: string): value is (typeof prices)[number] {
  return prices.includes(value as (typeof prices)[number]);
}

function isEditableModerationStatus(
  value: string
): value is (typeof editableModerationStatuses)[number] {
  return editableModerationStatuses.includes(
    value as (typeof editableModerationStatuses)[number]
  );
}

function isReviewDecision(value: string): value is ReviewDecision {
  return reviewDecisions.includes(value as ReviewDecision);
}

export function isJoinFreshnessReportType(value: string): boolean {
  return value === "invalid_join_method" || value === "outdated_info";
}

export function restoreJoinFreshnessSignals(signals: string[] | null): string[] {
  const restoredSignals = (signals ?? []).filter(
    (signal) => signal !== "needs_update" && signal !== "join_method_fresh"
  );

  return [...new Set([...restoredSignals, "join_method_fresh"])];
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

function localizedFieldsFromInput(input: AdminGroupUpdateInput): Json {
  const zh = {
    shortDescription: text(input.shortDescriptionZh),
    description: text(input.descriptionZh),
    suitableFor: text(input.suitableForZh),
    suitableAudience: text(input.suitableForZh),
    rulesSummary: text(input.rulesSummaryZh)
  };
  const en = {
    shortDescription: text(input.shortDescriptionEn),
    description: text(input.descriptionEn),
    suitableFor: text(input.suitableForEn),
    suitableAudience: text(input.suitableForEn),
    rulesSummary: text(input.rulesSummaryEn)
  };
  const content: Record<string, Record<string, string>> = {};

  for (const [locale, values] of Object.entries({ zh, en })) {
    for (const [key, value] of Object.entries(values)) {
      if (!value) continue;

      content[locale] = {
        ...content[locale],
        [key]: value
      };
    }
  }

  return content;
}

export function validateAdminGroupUpdateInput(
  input: AdminGroupUpdateInput
): AdminGroupUpdateValidation {
  const groupId = text(input.groupId);
  const joinMethodId = text(input.joinMethodId);
  const name = text(input.name);
  const platform = text(input.platform);
  const categorySlug = text(input.categorySlug);
  const shortDescription = text(input.shortDescription);
  const description = text(input.description);
  const suitableFor = text(input.suitableFor);
  const language = text(input.language);
  const region = text(input.region);
  const activityLevel = text(input.activityLevel);
  const price = text(input.price);
  const rulesSummary = text(input.rulesSummary);
  const moderationStatus = text(input.moderationStatus);
  const joinMethodType = text(input.joinMethodType);
  const joinMethodLabelText = text(input.joinMethodLabel);
  const joinMethodValue = text(input.joinMethodValue);
  const joinMethodExpiresAtText = text(input.joinMethodExpiresAt);
  const joinMethodExpiresAt = dateInputToIso(joinMethodExpiresAtText);
  const errors: string[] = [];

  if (!groupId || !isUuid(groupId)) errors.push("Group target is invalid.");
  if (joinMethodId && !isUuid(joinMethodId)) {
    errors.push("Join method target is invalid.");
  }
  if (
    !name ||
    name.length < GROUP_NAME_MIN_LENGTH ||
    name.length > GROUP_NAME_MAX_LENGTH
  ) {
    errors.push("Group name must be between 2 and 160 characters.");
  }
  if (!shortDescription) errors.push("Short description is required.");
  if (shortDescription.length > SHORT_DESCRIPTION_MAX_LENGTH) {
    errors.push("Short description must be 280 characters or fewer.");
  }
  if (!description) errors.push("Description is required.");
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.push("Description must be 2000 characters or fewer.");
  }
  if (!platform || !isPlatform(platform)) errors.push("Platform is invalid.");
  if (!categorySlug || !isCategorySlug(categorySlug)) {
    errors.push("Category is invalid.");
  }
  if (!activityLevel || !isActivityLevel(activityLevel)) {
    errors.push("Activity level is invalid.");
  }
  if (!price || !isPrice(price)) errors.push("Price is invalid.");
  if (!moderationStatus || !isEditableModerationStatus(moderationStatus)) {
    errors.push("Moderation status is invalid.");
  }
  if (!joinMethodType || !isJoinMethodType(joinMethodType)) {
    errors.push("Join method type is invalid.");
  }
  if (!joinMethodValue) errors.push("Join method value is required.");
  if (joinMethodExpiresAtText && !joinMethodExpiresAt) {
    errors.push("Join method expiration date is invalid.");
  }
  if (
    joinMethodValue &&
    (joinMethodType === "invite_link" || joinMethodType === "application_form") &&
    !isValidUrl(joinMethodValue)
  ) {
    errors.push("Join method value must be a valid URL.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      activityLevel: activityLevel as (typeof activityLevels)[number],
      categorySlug: categorySlug as CategorySlug,
      description,
      groupId,
      joinMethodId: joinMethodId || null,
      joinMethodExpiresAt,
      joinMethodLabel:
        joinMethodLabelText || joinMethodLabel(joinMethodType as JoinMethodType),
      joinMethodType: joinMethodType as JoinMethodType,
      joinMethodValue,
      language: language || null,
      localizedContent: localizedFieldsFromInput(input),
      moderationStatus: moderationStatus as (typeof editableModerationStatuses)[number],
      name,
      platform: platform as Platform,
      price: price as (typeof prices)[number],
      region: region || null,
      rulesSummary: rulesSummary || null,
      shortDescription,
      suitableFor: suitableFor || null
    }
  };
}

export function validateAdminGroupBatchUpdateInput(
  input: AdminGroupBatchUpdateInput
): AdminGroupBatchUpdateValidation {
  const groupIds = (input.groupIds ?? [])
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim());
  const validGroupIds = groupIds.filter(isUuid);
  const status = text(input.status);
  const errors: string[] = [];

  if (validGroupIds.length === 0) {
    errors.push("Select at least one group.");
  }

  if (validGroupIds.length !== groupIds.length) {
    errors.push("Group selection is invalid.");
  }

  if (!isEditableModerationStatus(status)) {
    errors.push("Batch status is invalid.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    groupIds: Array.from(new Set(validGroupIds)),
    status: status as (typeof editableModerationStatuses)[number]
  };
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

async function writeAdminAuditEvent({
  action,
  actorId,
  entityId,
  entityType,
  metadata,
  supabase
}: {
  action: Parameters<typeof buildAdminAuditEvent>[0]["action"];
  actorId: string;
  entityId: string | null;
  entityType: string;
  metadata?: Json;
  supabase: SupabaseServerClient;
}) {
  await supabase.from("audit_events").insert(
    buildAdminAuditEvent({
      action,
      actorId,
      entityId,
      entityType,
      metadata
    }) as never
  );
}

async function restoreGroupJoinFreshnessIfClear({
  groupId,
  now,
  supabase
}: {
  groupId: string;
  now: string;
  supabase: SupabaseServerClient;
}): Promise<boolean> {
  const { count, error: countError } = await supabase
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("group_id", groupId)
    .eq("status", "pending")
    .in("report_type", ["invalid_join_method", "outdated_info"]);

  if (countError || (count ?? 0) > 0) {
    return !countError;
  }

  const { data, error: readError } = await supabase
    .from("groups")
    .select("trust_signals")
    .eq("id", groupId)
    .maybeSingle();
  const group = data as { trust_signals: string[] | null } | null;

  if (readError || !group) {
    return false;
  }

  const { error: updateError } = await supabase
    .from("groups")
    .update({
      trust_signals: restoreJoinFreshnessSignals(group.trust_signals),
      updated_at: now
    } as never)
    .eq("id", groupId);

  return !updateError;
}

async function resolveFreshnessReportsAfterJoinUpdate({
  groupId,
  joinMethodId,
  now,
  supabase
}: {
  groupId: string;
  joinMethodId: string | null;
  now: string;
  supabase: SupabaseServerClient;
}): Promise<boolean> {
  const groupLevelUpdate = await supabase
    .from("reports")
    .update({ status: "approved" } as never)
    .eq("group_id", groupId)
    .is("join_method_id", null)
    .eq("status", "pending")
    .in("report_type", ["invalid_join_method", "outdated_info"]);

  if (groupLevelUpdate.error) {
    return false;
  }

  if (joinMethodId) {
    const methodLevelUpdate = await supabase
      .from("reports")
      .update({ status: "approved" } as never)
      .eq("group_id", groupId)
      .eq("join_method_id", joinMethodId)
      .eq("status", "pending")
      .in("report_type", ["invalid_join_method", "outdated_info"]);

    if (methodLevelUpdate.error) {
      return false;
    }
  }

  return restoreGroupJoinFreshnessIfClear({ groupId, now, supabase });
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

  const { supabase, user } = await requireAdmin();

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

    await writeAdminAuditEvent({
      action: "review_submission",
      actorId: user.id,
      entityId: validation.submissionId,
      entityType: "group_submissions",
      metadata: {
        decision: validation.decision,
        reviewerNotesProvided: Boolean(validation.reviewerNotes)
      },
      supabase
    });

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

  await writeAdminAuditEvent({
    action: "review_submission",
    actorId: user.id,
    entityId: validation.submissionId,
    entityType: "group_submissions",
    metadata: {
      decision: validation.decision,
      reviewerNotesProvided: Boolean(validation.reviewerNotes)
    },
    supabase
  });

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

  const { supabase, user } = await requireAdmin();
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

  await writeAdminAuditEvent({
    action: "review_claim",
    actorId: user.id,
    entityId: validation.claimId,
    entityType: "ownership_claims",
    metadata: {
      decision: validation.decision,
      reviewerNotesProvided: Boolean(validation.reviewerNotes)
    },
    supabase
  });

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

  const { supabase, user } = await requireAdmin();
  const { data: reportData, error: reportReadError } = await supabase
    .from("reports")
    .select("group_id, join_method_id, report_type")
    .eq("id", validation.submissionId)
    .maybeSingle();
  const report = reportData as ReportReviewRow | null;

  if (reportReadError || !report) {
    redirect(`/admin?lang=${locale}&review=error`);
  }

  const update: ReportUpdate = {
    status: validation.decision
  };
  const now = new Date().toISOString();

  const { error } = await supabase
    .from("reports")
    .update(update as never)
    .eq("id", validation.submissionId);

  if (error) {
    redirect(`/admin?lang=${locale}&review=error`);
  }

  let reportReviewResult = "handled";

  if (
    report.group_id &&
    isJoinFreshnessReportType(report.report_type) &&
    validation.decision !== "changes_requested"
  ) {
    if (
      !(await restoreGroupJoinFreshnessIfClear({
        groupId: report.group_id,
        now,
        supabase
      }))
    ) {
      redirect(`/admin?lang=${locale}&review=error`);
    }

    reportReviewResult = "freshness_checked";
  }

  await writeAdminAuditEvent({
    action: "review_report",
    actorId: user.id,
    entityId: validation.submissionId,
    entityType: "reports",
    metadata: {
      decision: validation.decision
    },
    supabase
  });

  redirect(
    `/admin?lang=${locale}&review=updated&reportReview=${reportReviewResult}`
  );
}

export async function updateAdminGroup(formData: FormData) {
  "use server";

  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const validation = validateAdminGroupUpdateInput({
    activityLevel: formData.get("activityLevel"),
    categorySlug: formData.get("categorySlug"),
    description: formData.get("description"),
    descriptionEn: formData.get("descriptionEn"),
    descriptionZh: formData.get("descriptionZh"),
    groupId: formData.get("groupId"),
    joinMethodExpiresAt: formData.get("joinMethodExpiresAt"),
    joinMethodId: formData.get("joinMethodId"),
    joinMethodLabel: formData.get("joinMethodLabel"),
    joinMethodType: formData.get("joinMethodType"),
    joinMethodValue: formData.get("joinMethodValue"),
    language: formData.get("language"),
    moderationStatus: formData.get("moderationStatus"),
    name: formData.get("name"),
    platform: formData.get("platform"),
    price: formData.get("price"),
    region: formData.get("region"),
    rulesSummary: formData.get("rulesSummary"),
    rulesSummaryEn: formData.get("rulesSummaryEn"),
    rulesSummaryZh: formData.get("rulesSummaryZh"),
    shortDescription: formData.get("shortDescription"),
    shortDescriptionEn: formData.get("shortDescriptionEn"),
    shortDescriptionZh: formData.get("shortDescriptionZh"),
    suitableFor: formData.get("suitableFor"),
    suitableForEn: formData.get("suitableForEn"),
    suitableForZh: formData.get("suitableForZh")
  });

  if (!validation.ok) {
    redirect(`/admin/groups/${text(formData.get("groupId"))}/edit?lang=${locale}&edit=validation`);
  }

  const { supabase, user } = await requireAdmin();
  const { value } = validation;
  const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", value.categorySlug)
    .maybeSingle();
  const category = categoryData as { id: string } | null;

  if (categoryError || !category) {
    redirect(`/admin/groups/${value.groupId}/edit?lang=${locale}&edit=error`);
  }

  const now = new Date().toISOString();
  const groupUpdate: GroupUpdate = {
    activity_level: value.activityLevel,
    category_id: category.id,
    description: value.description,
    language: value.language,
    localized_content: value.localizedContent,
    moderation_status: value.moderationStatus,
    name: value.name,
    platform: value.platform,
    price: value.price,
    region: value.region,
    rules_summary: value.rulesSummary,
    short_description: value.shortDescription,
    suitable_for: value.suitableFor,
    updated_at: now
  };

  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .update(groupUpdate as never)
    .eq("id", value.groupId)
    .select("slug")
    .maybeSingle();
  const group = groupData as { slug: string } | null;

  if (groupError || !group) {
    redirect(`/admin/groups/${value.groupId}/edit?lang=${locale}&edit=error`);
  }

  const joinMethodUpdate: GroupJoinMethodUpdate = {
    expires_at: value.joinMethodExpiresAt,
    label: value.joinMethodLabel,
    last_verified_at: now,
    review_status:
      value.moderationStatus === "approved" ? "approved" : "needs_update",
    type: value.joinMethodType,
    updated_at: now,
    value: value.joinMethodValue,
    visibility: "public"
  };

  const joinResult = value.joinMethodId
    ? await supabase
        .from("group_join_methods")
        .update(joinMethodUpdate as never)
        .eq("id", value.joinMethodId)
        .eq("group_id", value.groupId)
    : await supabase.from("group_join_methods").insert({
        ...joinMethodUpdate,
        created_at: now,
        group_id: value.groupId
      } as never);

  if (joinResult.error) {
    redirect(`/admin/groups/${value.groupId}/edit?lang=${locale}&edit=error`);
  }

  if (
    value.moderationStatus === "approved" &&
    !(await resolveFreshnessReportsAfterJoinUpdate({
      groupId: value.groupId,
      joinMethodId: value.joinMethodId,
      now,
      supabase
    }))
  ) {
    redirect(`/admin/groups/${value.groupId}/edit?lang=${locale}&edit=error`);
  }

  await writeAdminAuditEvent({
    action: "update_group",
    actorId: user.id,
    entityId: value.groupId,
    entityType: "groups",
    metadata: {
      categorySlug: value.categorySlug,
      joinMethodType: value.joinMethodType,
      status: value.moderationStatus
    },
    supabase
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath(`/groups/${group.slug}`);
  redirect(`/admin/groups/${value.groupId}/edit?lang=${locale}&edit=updated`);
}

export async function batchUpdateAdminGroups(formData: FormData) {
  "use server";

  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const validation = validateAdminGroupBatchUpdateInput({
    groupIds: formData.getAll("groupIds"),
    status: formData.get("batchStatus")
  });

  if (!validation.ok) {
    redirect(`/admin?lang=${locale}&batch=validation`);
  }

  const { supabase, user } = await requireAdmin();
  const now = new Date().toISOString();
  const { error: groupError } = await supabase
    .from("groups")
    .update({
      moderation_status: validation.status,
      updated_at: now
    } as never)
    .in("id", validation.groupIds);

  if (groupError) {
    redirect(`/admin?lang=${locale}&batch=error`);
  }

  const { error: joinMethodError } = await supabase
    .from("group_join_methods")
    .update({
      review_status: validation.status === "approved" ? "approved" : "needs_update",
      updated_at: now
    } as never)
    .in("group_id", validation.groupIds);

  if (joinMethodError) {
    redirect(`/admin?lang=${locale}&batch=error`);
  }

  await writeAdminAuditEvent({
    action: "batch_update_groups",
    actorId: user.id,
    entityId: null,
    entityType: "groups",
    metadata: {
      count: validation.groupIds.length,
      groupIds: validation.groupIds,
      status: validation.status
    },
    supabase
  });

  revalidatePath("/");
  revalidatePath("/admin");
  validation.groupIds.forEach((id) => {
    revalidatePath(`/admin/groups/${id}/edit`);
  });
  redirect(`/admin?lang=${locale}&batch=updated`);
}
