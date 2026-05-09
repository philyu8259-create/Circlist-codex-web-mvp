import type { Group } from "@/lib/domain";

export const sampleGroups: Group[] = [
  {
    id: "grp_ai_builders_wechat",
    slug: "ai-builders-wechat",
    name: "AI Builders WeChat / AI 产品共创群",
    platform: "wechat",
    categorySlug: "ai",
    tags: ["AI", "AI 产品", "LLM", "工具", "独立开发"],
    shortDescription:
      "面向 AI 产品经理、创业者和独立开发者的中文交流群。",
    description:
      "A Chinese-friendly WeChat group for AI builders discussing agents, LLM apps, prompt design, product launches, and overseas go-to-market lessons.",
    suitableAudience:
      "AI 产品经理、独立开发者、创业者、正在构建 AI 工具的 makers",
    suitableFor:
      "AI 产品经理、独立开发者、创业者、正在构建 AI 工具的 makers",
    language: "中文 / English keywords",
    region: "全球 / Global",
    activityLevel: "high",
    joinPolicy: "approval_required",
    price: "free",
    rulesSummary: "禁止广告刷屏、灰产项目和无关推广。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: [
      "recently_verified",
      "owner_maintained",
      "join_method_fresh"
    ],
    joinMethods: [
      {
        id: "jm_ai_wechat_admin",
        type: "admin_contact",
        label: "联系管理员入群",
        value: "提交申请后由群主审核",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_indie_dev_discord",
    slug: "indie-dev-discord",
    name: "Indie Dev Launch Room / 独立开发出海社区",
    platform: "discord",
    categorySlug: "indie-dev",
    tags: ["Indie Dev", "SaaS", "Launch", "独立开发", "出海"],
    shortDescription:
      "独立开发者交流产品发布、增长、订阅收入和海外用户反馈。",
    description:
      "A Discord community for indie makers shipping SaaS, mobile apps, and AI tools, with bilingual discussion around launches, pricing, and early traction.",
    suitableAudience: "独立开发者、微型 SaaS 团队、solo founders",
    suitableFor: "独立开发者、微型 SaaS 团队、solo founders",
    language: "中文 / English",
    region: "全球 / Remote",
    activityLevel: "medium",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "保持高质量讨论，禁止群发广告。",
    ownerVerified: false,
    lastVerifiedAt: "2026-05-05",
    trustSignals: ["join_method_fresh"],
    joinMethods: [
      {
        id: "jm_indie_discord_link",
        type: "invite_link",
        label: "Discord invite link",
        value: "https://discord.gg/example",
        visibility: "public",
        lastVerifiedAt: "2026-05-05",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_overseas_business_wechat",
    slug: "overseas-business-wechat",
    name: "Overseas Business Dock / 出海业务码头",
    platform: "wechat",
    categorySlug: "overseas",
    tags: ["出海", "Overseas Business", "Cross-border", "Go-to-market"],
    shortDescription: "面向出海产品、跨境业务和海外增长的一线交流群。",
    description:
      "A WeChat community for founders and operators discussing overseas business setup, localization, payment, distribution, and compliance basics.",
    suitableAudience: "出海创业者、跨境业务负责人、海外增长团队",
    suitableFor: "出海创业者、跨境业务负责人、海外增长团队",
    language: "中文 / English",
    region: "China / Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "free",
    rulesSummary: "禁止无关广告、资金盘和虚假服务推广。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-07",
    trustSignals: ["recently_verified", "owner_maintained"],
    joinMethods: [
      {
        id: "jm_overseas_wechat_admin",
        type: "admin_contact",
        label: "联系管理员审核入群",
        value: "提交业务背景后由管理员邀请",
        visibility: "public",
        lastVerifiedAt: "2026-05-07",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_overseas_pending",
    slug: "overseas-founders-pending",
    name: "出海创始人内测群",
    platform: "telegram",
    categorySlug: "overseas",
    tags: ["出海", "Overseas", "Founders"],
    shortDescription: "等待审核的出海业务交流群。",
    description: "Pending review sample for moderation filtering.",
    suitableAudience: "跨境创业者",
    suitableFor: "跨境创业者",
    language: "中文",
    region: "Asia",
    activityLevel: "unknown",
    joinPolicy: "admin_contact",
    price: "unknown",
    rulesSummary: "审核通过前不公开展示。",
    ownerVerified: false,
    trustSignals: ["under_review"],
    joinMethods: [
      {
        id: "jm_overseas_pending_manual",
        type: "manual_notes",
        label: "待审核入群说明",
        value: "管理员审核中",
        visibility: "admin_only",
        reviewStatus: "pending"
      }
    ],
    moderationStatus: "pending"
  }
];
