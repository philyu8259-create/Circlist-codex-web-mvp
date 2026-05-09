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

export type GroupSubmissionInput = {
  name?: FormDataEntryValue | null;
  platform?: FormDataEntryValue | null;
  categorySlug?: FormDataEntryValue | null;
  shortDescription?: FormDataEntryValue | null;
  description?: FormDataEntryValue | null;
  joinMethodType?: FormDataEntryValue | null;
  joinMethodValue?: FormDataEntryValue | null;
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
  const errors: string[] = [];

  if (!name) errors.push("Group name is required.");
  if (!platform) errors.push("Platform is required.");
  if (!categorySlug) errors.push("Category is required.");
  if (!shortDescription) errors.push("Short description is required.");
  if (!description) errors.push("Description is required.");
  if (!joinMethodType || !joinMethodValue) {
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
    language: formData.get("language"),
    region: formData.get("region"),
    rulesSummary: formData.get("rulesSummary")
  };
}

export async function submitGroup(formData: FormData) {
  "use server";

  const { requireUser } = await import("../auth");
  const user = await requireUser();
  const input = submissionInputFromFormData(formData);
  const validation = validateGroupSubmission(input);
  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";

  if (!validation.ok) {
    redirect(`/submit?lang=${locale}&error=validation`);
  }

  const name = text(input.name);
  const platform = text(input.platform) as Platform;
  const categorySlug = text(input.categorySlug) as CategorySlug;
  const joinMethodType = text(input.joinMethodType) as JoinMethodType;
  const joinMethodValue = text(input.joinMethodValue);
  const category = categories.find((item) => item.slug === categorySlug);
  const { createClient } = await import("../supabase/server");
  const supabase = await createClient();

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
    proposed_join_value: joinMethodValue,
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
        value: joinMethodValue
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
  const user = await requireUser();
  const groupId = text(formData.get("groupId"));
  const evidence = text(formData.get("evidence"));
  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const slug = text(formData.get("slug"));

  if (!groupId || !evidence) {
    redirect(`${slug ? `/groups/${slug}` : "/"}?lang=${locale}&claim=missing`);
  }

  const { createClient } = await import("../supabase/server");
  const supabase = await createClient();
  const claim: OwnershipClaimInsert = {
    group_id: groupId,
    claimant_id: user.id,
    evidence,
    claim_status: "pending",
    moderator_notes: null
  };

  const { error } = await supabase
    .from("ownership_claims")
    .insert(claim as never);

  if (error) {
    redirect(`${slug ? `/groups/${slug}` : "/"}?lang=${locale}&claim=error`);
  }

  redirect(`${slug ? `/groups/${slug}` : "/my-groups"}?lang=${locale}&claim=sent`);
}
