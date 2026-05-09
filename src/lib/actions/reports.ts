import { redirect } from "next/navigation";

import { getCurrentUser } from "../auth";
import { createClient } from "../supabase/server";
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

function text(value: FormDataEntryValue | null | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

function isReportType(value: string): value is ReportType {
  return reportTypes.includes(value as ReportType);
}

export async function reportGroup(formData: FormData) {
  "use server";

  const groupId = text(formData.get("groupId"));
  const joinMethodId = text(formData.get("joinMethodId"));
  const reportTypeInput = text(formData.get("reportType"));
  const reportType = isReportType(reportTypeInput) ? reportTypeInput : "other";
  const message = text(formData.get("message"));
  const locale = text(formData.get("lang")) === "en" ? "en" : "zh";
  const slug = text(formData.get("slug"));
  const returnPath = slug ? `/groups/${slug}` : "/";

  if (!groupId && !joinMethodId) {
    redirect(`${returnPath}?lang=${locale}&report=missing`);
  }

  const user = await getCurrentUser();
  const supabase = await createClient();
  const report: ReportInsert = {
    group_id: groupId || null,
    join_method_id: joinMethodId || null,
    reporter_id: user?.id ?? null,
    report_type: reportType,
    details: message || null,
    status: "pending"
  };

  const { error } = await supabase.from("reports").insert(report as never);

  if (error) {
    redirect(`${returnPath}?lang=${locale}&report=error`);
  }

  redirect(`${returnPath}?lang=${locale}&report=sent`);
}
