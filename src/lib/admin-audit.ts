import type { Locale } from "./i18n";
import type { Database, Json } from "./supabase/types";

export type AdminAuditEventRow = Pick<
  Database["public"]["Tables"]["audit_events"]["Row"],
  "action" | "created_at" | "entity_id" | "entity_type" | "id" | "metadata"
>;

type AdminAuditInsert =
  Database["public"]["Tables"]["audit_events"]["Insert"];

type AdminAuditAction =
  | "batch_update_groups"
  | "review_claim"
  | "review_report"
  | "review_submission"
  | "update_group";

type AdminAuditEventInput = {
  action: AdminAuditAction;
  actorId: string;
  entityId: string | null;
  entityType: string;
  metadata?: Json;
};

export type FormattedAdminAuditEvent = {
  description: string;
  id: string;
  meta: string;
  title: string;
};

const groupStatusActionTitles = {
  approved: {
    en: "Published groups in bulk",
    zh: "批量公开群组"
  },
  needs_update: {
    en: "Marked groups as needing update",
    zh: "批量标记需要更新"
  },
  suspended: {
    en: "Hid groups in bulk",
    zh: "批量下架群组"
  }
} as const;

export function buildAdminAuditEvent({
  action,
  actorId,
  entityId,
  entityType,
  metadata = {}
}: AdminAuditEventInput): AdminAuditInsert {
  return {
    action,
    actor_id: actorId,
    entity_id: entityId,
    entity_type: entityType,
    metadata
  };
}

function metadataRecord(metadata: Json): Record<string, Json | undefined> {
  return metadata && typeof metadata === "object" && !Array.isArray(metadata)
    ? metadata
    : {};
}

function auditTitle(
  action: string,
  metadata: Record<string, Json | undefined>,
  locale: Locale
): string {
  if (action === "batch_update_groups") {
    const status = metadata.status;

    if (
      status === "approved" ||
      status === "needs_update" ||
      status === "suspended"
    ) {
      return groupStatusActionTitles[status][locale];
    }
  }

  const titles: Record<string, Record<Locale, string>> = {
    review_claim: {
      en: "Reviewed ownership claim",
      zh: "审核群主认领"
    },
    review_report: {
      en: "Reviewed report",
      zh: "处理问题反馈"
    },
    review_submission: {
      en: "Reviewed group submission",
      zh: "审核新群提交"
    },
    update_group: {
      en: "Updated group details",
      zh: "更新群组资料"
    }
  };

  return titles[action]?.[locale] ?? action;
}

function entityLabel(entityType: string, locale: Locale): string {
  const labels: Record<string, Record<Locale, string>> = {
    group_submissions: {
      en: "Submission",
      zh: "提交"
    },
    groups: {
      en: "Groups",
      zh: "群组"
    },
    ownership_claims: {
      en: "Claim",
      zh: "认领"
    },
    reports: {
      en: "Report",
      zh: "反馈"
    }
  };

  return labels[entityType]?.[locale] ?? entityType;
}

function formatAuditDate(value: string | null, locale: Locale): string {
  if (!value) return "";

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function formatAdminAuditEvent(
  event: AdminAuditEventRow,
  locale: Locale
): FormattedAdminAuditEvent {
  const metadata = metadataRecord(event.metadata);
  const count = typeof metadata.count === "number" ? metadata.count : null;
  const objectCount = count ?? 1;
  const entity = entityLabel(event.entity_type, locale);
  const objectLabel =
    locale === "en"
      ? `${objectCount} ${objectCount === 1 ? "object" : "objects"}`
      : `${objectCount} 个对象`;

  return {
    description: `${entity} · ${objectLabel}`,
    id: event.id,
    meta: formatAuditDate(event.created_at, locale),
    title: auditTitle(event.action, metadata, locale)
  };
}
