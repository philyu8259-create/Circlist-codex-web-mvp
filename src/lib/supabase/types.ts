export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Enums: {
      claim_status: "pending" | "approved" | "rejected";
      group_platform: "wechat" | "qq" | "telegram" | "discord" | "slack" | "other";
      join_method_type:
        | "qr_code"
        | "invite_link"
        | "group_number"
        | "admin_contact"
        | "application_form"
        | "manual_notes";
      join_method_visibility: "public" | "members_only" | "admin_only";
      moderation_status:
        | "draft"
        | "pending"
        | "approved"
        | "rejected"
        | "changes_requested"
        | "suspended"
        | "needs_update";
      report_type:
        | "spam"
        | "scam"
        | "invalid_join_method"
        | "outdated_info"
        | "abuse"
        | "other";
      user_role: "user" | "moderator" | "admin";
    };
  };
};
