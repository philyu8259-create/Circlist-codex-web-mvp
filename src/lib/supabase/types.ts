export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type RowInsertUpdate<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: never[];
};

type UserRole = "user" | "moderator" | "admin";
type GroupPlatform = "wechat" | "qq" | "telegram" | "discord" | "slack" | "other";
type ModerationStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "changes_requested"
  | "suspended"
  | "needs_update";
type JoinMethodType =
  | "qr_code"
  | "invite_link"
  | "group_number"
  | "admin_contact"
  | "application_form"
  | "manual_notes";
type JoinMethodVisibility = "public" | "members_only" | "admin_only";
type ReportType =
  | "spam"
  | "scam"
  | "invalid_join_method"
  | "outdated_info"
  | "abuse"
  | "other";
type ClaimStatus = "pending" | "approved" | "rejected";

export type Database = {
  public: {
    Tables: {
      profiles: RowInsertUpdate<
        {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        },
        {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        }
      >;
      categories: RowInsertUpdate<{
        id: string;
        slug: string;
        name_zh: string;
        name_en: string;
        description_zh: string | null;
        description_en: string | null;
        sort_order: number;
        created_at: string;
      }>;
      groups: RowInsertUpdate<{
        id: string;
        category_id: string;
        owner_id: string | null;
        slug: string;
        name: string;
        platform: GroupPlatform;
        tags: string[];
        short_description: string;
        description: string;
        suitable_for: string | null;
        language: string | null;
        region: string | null;
        activity_level: "low" | "medium" | "high" | "unknown";
        join_policy: "open" | "approval_required" | "admin_contact" | "invite_only";
        price: "free" | "paid" | "unknown";
        rules_summary: string | null;
        owner_verified: boolean;
        moderation_status: ModerationStatus;
        trust_signals: string[];
        last_verified_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      group_join_methods: RowInsertUpdate<{
        id: string;
        group_id: string;
        type: JoinMethodType;
        label: string;
        value: string;
        visibility: JoinMethodVisibility;
        review_status: ModerationStatus;
        expires_at: string | null;
        last_verified_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      group_submissions: RowInsertUpdate<
        {
          id: string;
          submitter_id: string;
          category_id: string | null;
          group_id: string | null;
          proposed_name: string;
          proposed_platform: GroupPlatform;
          proposed_join_method: JoinMethodType | null;
          proposed_join_value: string | null;
          proposed_payload: Json;
          moderation_status: ModerationStatus;
          moderator_notes: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          submitter_id: string;
          proposed_name: string;
          proposed_platform: GroupPlatform;
          category_id?: string | null;
          group_id?: string | null;
          proposed_join_method?: JoinMethodType | null;
          proposed_join_value?: string | null;
          proposed_payload?: Json;
          moderation_status?: "pending";
          moderator_notes?: null;
        }
      >;
      ownership_claims: RowInsertUpdate<
        {
          id: string;
          group_id: string;
          claimant_id: string;
          claim_status: ClaimStatus;
          evidence: string;
          moderator_notes: string | null;
          created_at: string;
          updated_at: string;
        },
        {
          group_id: string;
          claimant_id: string;
          evidence: string;
          claim_status?: "pending";
          moderator_notes?: null;
        }
      >;
      reports: RowInsertUpdate<
        {
          id: string;
          group_id: string | null;
          join_method_id: string | null;
          reporter_id: string | null;
          report_type: ReportType;
          details: string | null;
          status: ModerationStatus;
          created_at: string;
        },
        {
          report_type: ReportType;
          group_id?: string | null;
          join_method_id?: string | null;
          reporter_id?: string | null;
          details?: string | null;
          status?: "pending";
        }
      >;
      audit_events: RowInsertUpdate<{
        id: string;
        actor_id: string | null;
        action: string;
        entity_type: string;
        entity_id: string | null;
        metadata: Json;
        created_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      claim_status: ClaimStatus;
      group_platform: GroupPlatform;
      join_method_type: JoinMethodType;
      join_method_visibility: JoinMethodVisibility;
      moderation_status: ModerationStatus;
      report_type: ReportType;
      user_role: UserRole;
    };
    CompositeTypes: Record<string, never>;
  };
};
