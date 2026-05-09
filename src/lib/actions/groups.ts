import { redirect } from "next/navigation";

import {
  categories,
  platforms,
  type CategorySlug,
  type JoinMethodType,
  type Platform
} from "../domain";
import type { Database } from "../supabase/types";

const joinMethodTypes = [
  "qr_code",
  "invite_link",
  "group_number",
  "admin_contact",
  "application_form",
  "manual_notes"
] as const satisfies readonly JoinMethodType[];

type GroupSubmissionInsert =
  Database["public"]["Tables"]["group_submissions"]["Insert"];
type OwnershipClaimInsert =
  Database["public"]["Tables"]["ownership_claims"]["Insert"];

const GROUP_NAME_MIN_LENGTH = 2;
const GROUP_NAME_MAX_LENGTH = 160;
const SHORT_DESCRIPTION_MAX_LENGTH = 280;
const DESCRIPTION_MAX_LENGTH = 2000;
const EVIDENCE_MAX_LENGTH = 2000;
const QR_CODE_MAX_SIZE_BYTES = 5 * 1024 * 1024;
const QR_CODE_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type GroupSubmissionInput = {
  name?: FormDataEntryValue | null;
  platform?: FormDataEntryValue | null;
  categorySlug?: FormDataEntryValue | null;
  shortDescription?: FormDataEntryValue | null;
  description?: FormDataEntryValue | null;
  joinMethodType?: FormDataEntryValue | null;
  joinMethodValue?: FormDataEntryValue | null;
  groupLink?: FormDataEntryValue | null;
  qrCode?: FormDataEntryValue | null;
  language?: FormDataEntryValue | null;
  region?: FormDataEntryValue | null;
  rulesSummary?: FormDataEntryValue | null;
};

export type ValidationResult =
  | { ok: true }
  | { ok: false; errors: string[] };

function text(value: FormDataEntryValue | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function file(value: FormDataEntryValue | null | undefined): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
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

export function validateGroupSubmission(
  input: GroupSubmissionInput
): ValidationResult {
  const name = text(input.name);
  const platform = text(input.platform);
  const categorySlug = text(input.categorySlug);
  const shortDescription = text(input.shortDescription);
  const description = text(input.description);
  const joinMethodType = text(input.joinMethodType);
  const joinMethodValue = text(input.joinMethodValue);
  const groupLink = text(input.groupLink);
  const qrCode = file(input.qrCode);
  const errors: string[] = [];

  if (!name) errors.push("Group name is required.");
  if (
    name &&
    (name.length < GROUP_NAME_MIN_LENGTH || name.length > GROUP_NAME_MAX_LENGTH)
  ) {
    errors.push("Group name must be between 2 and 160 characters.");
  }
  if (!platform) errors.push("Platform is required.");
  if (!categorySlug) errors.push("Category is required.");
  if (!shortDescription) errors.push("Short description is required.");
  if (shortDescription.length > SHORT_DESCRIPTION_MAX_LENGTH) {
    errors.push("Short description must be 280 characters or fewer.");
  }
  if (!description) errors.push("Description is required.");
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.push("Description must be 2000 characters or fewer.");
  }
  if (!joinMethodType || (!joinMethodValue && !groupLink && !qrCode)) {
    errors.push("Join method is required.");
  }

  if (platform && !isPlatform(platform)) {
    errors.push("Platform is invalid.");
  }

  if (categorySlug && !isCategorySlug(categorySlug)) {
    errors.push("Category is invalid.");
  }

  if (joinMethodType && !isJoinMethodType(joinMethodType)) {
    errors.push("Join method type is invalid.");
  }

  if (groupLink && !isValidUrl(groupLink)) {
    errors.push("Group link must be a valid URL.");
  }

  if (qrCode && !QR_CODE_IMAGE_TYPES.includes(qrCode.type)) {
    errors.push("QR code must be a PNG, JPG, or WebP image.");
  }

  if (qrCode && qrCode.size > QR_CODE_MAX_SIZE_BYTES) {
    errors.push("QR code image must be 5 MB or smaller.");
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}

function submissionInputFromFormData(formData: FormData): GroupSubmissionInput {
  return {
    name: formData.get("name"),
    platform: formData.get("platform"),
    categorySlug: formData.get("categorySlug"),
    shortDescription: formData.get("shortDescription"),
    description: formData.get("description"),
    joinMethodType: formData.get("joinMethodType"),
    joinMethodValue: formData.get("joinMethodValue"),
    groupLink: formData.get("groupLink"),
    qrCode: formData.get("qrCode"),
    language: formData.get("language"),
    region: formData.get("region"),
    rulesSummary: formData.get("rulesSummary")
  };
}

async function uploadQrCode({
  file,
  userId
}: {
  file: File | null;
  userId: string;
}): Promise<{ path: string | null; status: "uploaded" | "not_provided" | "failed" }> {
  if (!file) {
    return { path: null, status: "not_provided" };
  }

  const { hasSupabaseEnv } = await import("../supabase/env");
  if (!hasSupabaseEnv()) {
    return { path: null, status: "failed" };
  }

  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${extension}`;
  const { createClient } = await import("../supabase/server");
  const supabase = await createClient();
  const { error } = await supabase.storage
    .from("join-assets")
    .upload(path, file, {
      contentType: file.type,
      upsert: false
    });

  if (error) {
    return { path: null, status: "failed" };
  }

  return { path, status: "uploaded" };
}

export async function submitGroup(formData: FormData) {
  "use server";

  const { requireUser } = await import("../auth");
  const input = submissionInputFromFormData(formData);
  const validation = validateGroupSubmission(input);
  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const user = await requireUser({ lang: locale, next: "/submit" });

  if (!validation.ok) {
    redirect(`/submit?lang=${locale}&error=validation`);
  }

  const name = text(input.name);
  const platform = text(input.platform) as Platform;
  const categorySlug = text(input.categorySlug) as CategorySlug;
  const joinMethodType = text(input.joinMethodType) as JoinMethodType;
  const joinMethodValue = text(input.joinMethodValue);
  const groupLink = text(input.groupLink);
  const qrCode = file(input.qrCode);
  const category = categories.find((item) => item.slug === categorySlug);
  const { createClient } = await import("../supabase/server");
  const supabase = await createClient();
  const qrUpload = await uploadQrCode({ file: qrCode, userId: user.id });

  if (qrCode && qrUpload.status === "failed") {
    redirect(`/submit?lang=${locale}&error=submit`);
  }

  const { data: categoryData } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();
  const categoryRow = categoryData as { id: string } | null;

  const submission: GroupSubmissionInsert = {
    submitter_id: user.id,
    category_id: categoryRow?.id ?? null,
    proposed_name: name,
    proposed_platform: platform,
    proposed_join_method: joinMethodType,
    proposed_join_value: groupLink || qrUpload.path || joinMethodValue || null,
    proposed_payload: {
      categorySlug,
      categoryLabel: category?.label ?? null,
      shortDescription: text(input.shortDescription),
      description: text(input.description),
      language: text(input.language) || null,
      region: text(input.region) || null,
      rulesSummary: text(input.rulesSummary) || null,
      joinMethod: {
        type: joinMethodType,
        value: joinMethodValue || null,
        groupLink: groupLink || null,
        qrCode: qrCode
          ? {
              name: qrCode.name,
              type: qrCode.type,
              size: qrCode.size,
              storagePath: qrUpload.path,
              uploadStatus: qrUpload.status
            }
          : null
      }
    },
    moderation_status: "pending",
    moderator_notes: null
  };

  const { error } = await supabase
    .from("group_submissions")
    .insert(submission as never);

  if (error) {
    redirect(`/submit?lang=${locale}&error=submit`);
  }

  redirect(`/my-groups?lang=${locale}&submitted=1`);
}

export async function claimGroup(formData: FormData) {
  "use server";

  const { requireUser } = await import("../auth");
  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const slug = text(formData.get("groupSlug"));
  const user = await requireUser({
    lang: locale,
    next: slug && isValidSlug(slug) ? `/groups/${slug}` : "/"
  });
  const evidence = text(formData.get("evidence"));
  const returnPath = slug && isValidSlug(slug) ? `/groups/${slug}` : "/";

  if (!slug || !isValidSlug(slug) || !evidence) {
    redirect(`${returnPath}?lang=${locale}&claim=missing`);
  }

  if (evidence.length > EVIDENCE_MAX_LENGTH) {
    redirect(`${returnPath}?lang=${locale}&claim=validation`);
  }

  const { createClient } = await import("../supabase/server");
  const supabase = await createClient();

  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .select("id")
    .eq("slug", slug)
    .eq("moderation_status", "approved")
    .maybeSingle();
  const group = groupData as { id: string } | null;

  if (groupError || !group) {
    redirect(`${returnPath}?lang=${locale}&claim=not_found`);
  }

  const claim: OwnershipClaimInsert = {
    group_id: group.id,
    claimant_id: user.id,
    evidence,
    claim_status: "pending",
    moderator_notes: null
  };

  const { error } = await supabase
    .from("ownership_claims")
    .insert(claim as never);

  if (error) {
    redirect(`${returnPath}?lang=${locale}&claim=error`);
  }

  redirect(`${returnPath}?lang=${locale}&claim=sent`);
}
