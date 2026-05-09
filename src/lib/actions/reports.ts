import { redirect } from "next/navigation";

import type { Database } from "../supabase/types";

const reportTypes = [
  "spam",
  "scam",
  "invalid_join_method",
  "outdated_info",
  "abuse",
  "other"
] as const;

type ReportType = (typeof reportTypes)[number];
type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];
type ReportValidationInput = {
  groupSlug?: FormDataEntryValue | null;
  joinMethodId?: FormDataEntryValue | null;
  reportType?: FormDataEntryValue | null;
  message?: FormDataEntryValue | null;
  website?: FormDataEntryValue | null;
};
type ReportValidationResult =
  | { ok: true; reportType: ReportType; message: string; groupSlug: string; joinMethodId: string | null }
  | { ok: false; errors: string[] };

const REPORT_MESSAGE_MAX_LENGTH = 2000;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function text(value: FormDataEntryValue | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function isReportType(value: string): value is ReportType {
  return reportTypes.includes(value as ReportType);
}

function isValidSlug(value: string): boolean {
  return SLUG_PATTERN.test(value);
}

function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}

export function validateReportInput(
  input: ReportValidationInput
): ReportValidationResult {
  const groupSlug = text(input.groupSlug);
  const joinMethodId = text(input.joinMethodId);
  const reportTypeInput = text(input.reportType);
  const message = text(input.message);
  const website = text(input.website);
  const errors: string[] = [];

  if (website) {
    errors.push("Report was rejected.");
  }

  if (!groupSlug || !isValidSlug(groupSlug)) {
    errors.push("Group target is invalid.");
  }

  if (joinMethodId && !isUuid(joinMethodId)) {
    errors.push("Join method target is invalid.");
  }

  if (!isReportType(reportTypeInput)) {
    errors.push("Report type is invalid.");
  }

  if (message.length > REPORT_MESSAGE_MAX_LENGTH) {
    errors.push("Report message must be 2000 characters or fewer.");
  }

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const reportType = reportTypeInput as ReportType;

  return {
    ok: true,
    reportType,
    message,
    groupSlug,
    joinMethodId: joinMethodId || null
  };
}

export async function reportGroup(formData: FormData) {
  "use server";

  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const validation = validateReportInput({
    groupSlug: formData.get("groupSlug"),
    joinMethodId: formData.get("joinMethodId"),
    reportType: formData.get("reportType"),
    message: formData.get("message"),
    website: formData.get("website")
  });
  const slug = text(formData.get("groupSlug"));
  const returnPath = slug && isValidSlug(slug) ? `/groups/${slug}` : "/";

  if (!validation.ok) {
    redirect(`${returnPath}?lang=${locale}&report=validation`);
  }

  const { getCurrentUser } = await import("../auth");
  const { createClient } = await import("../supabase/server");
  const user = await getCurrentUser();
  const supabase = await createClient();

  const { data: groupData, error: groupError } = await supabase
    .from("groups")
    .select("id")
    .eq("slug", validation.groupSlug)
    .eq("moderation_status", "approved")
    .maybeSingle();
  const group = groupData as { id: string } | null;

  if (groupError || !group) {
    redirect(`${returnPath}?lang=${locale}&report=not_found`);
  }

  if (validation.joinMethodId) {
    const { data: joinMethodData, error: joinMethodError } = await supabase
      .from("group_join_methods")
      .select("id")
      .eq("id", validation.joinMethodId)
      .eq("group_id", group.id)
      .eq("review_status", "approved")
      .maybeSingle();

    if (joinMethodError || !joinMethodData) {
      redirect(`${returnPath}?lang=${locale}&report=not_found`);
    }
  }

  // This anonymous endpoint still needs durable rate limiting. Until Task 7
  // adds DB-backed reads, duplicate abuse is constrained by slug lookup,
  // strict type/length validation, and a honeypot field.
  const report: ReportInsert = {
    group_id: group.id,
    join_method_id: validation.joinMethodId,
    reporter_id: user?.id ?? null,
    report_type: validation.reportType,
    details: validation.message || null,
    status: "pending"
  };

  const { error } = await supabase.from("reports").insert(report as never);

  if (error) {
    redirect(`${returnPath}?lang=${locale}&report=error`);
  }

  redirect(`${returnPath}?lang=${locale}&report=sent`);
}
