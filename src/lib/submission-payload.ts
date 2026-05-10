import type { Json } from "@/lib/supabase/types";

export type SubmissionPayloadDetails = {
  categorySlug: string;
  categoryLabel: string;
  shortDescription: string;
  description: string;
  language: string;
  region: string;
  rulesSummary: string;
  joinMethodValue: string;
  groupLink: string;
  qrCodeName: string;
  qrCodeStoragePath: string;
  qrCodeUploadStatus: string;
};

function jsonObject(value: Json | unknown): Record<string, Json | undefined> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, Json | undefined>)
    : {};
}

function jsonText(value: Json | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseSubmissionPayload(
  payload: Json | unknown
): SubmissionPayloadDetails {
  const root = jsonObject(payload);
  const joinMethod = jsonObject(root.joinMethod);
  const qrCode = jsonObject(joinMethod.qrCode);

  return {
    categorySlug: jsonText(root.categorySlug),
    categoryLabel: jsonText(root.categoryLabel),
    shortDescription: jsonText(root.shortDescription),
    description: jsonText(root.description),
    language: jsonText(root.language),
    region: jsonText(root.region),
    rulesSummary: jsonText(root.rulesSummary),
    joinMethodValue: jsonText(joinMethod.value),
    groupLink: jsonText(joinMethod.groupLink),
    qrCodeName: jsonText(qrCode.name),
    qrCodeStoragePath: jsonText(qrCode.storagePath),
    qrCodeUploadStatus: jsonText(qrCode.uploadStatus)
  };
}

export function compactDetailItems(
  items: { label: string; value: string | null | undefined }[]
) {
  return items
    .map((item) => ({
      label: item.label,
      value: item.value?.trim() ?? ""
    }))
    .filter((item) => item.value);
}
