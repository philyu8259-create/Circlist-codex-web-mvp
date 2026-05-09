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
    id: "grp_langchain_community_slack",
    slug: "langchain-community-slack",
    name: "LangChain Community Slack",
    platform: "slack",
    categorySlug: "ai",
    tags: ["LangChain", "LangGraph", "AI Agents", "LLM", "GenAI"],
    shortDescription:
      "LangChain 官方社区 Slack，面向构建 AI agents 和 LLM 应用的开发者。",
    description:
      "An official LangChain Community Slack for developers building with LangChain, LangGraph, agents, and generative AI workflows. The public page describes it as a place for open discussion, events, jobs, and showcasing agents.",
    suitableAudience: "AI 工程师、agent 开发者、LLM 应用 builders",
    suitableFor: "AI 工程师、agent 开发者、LLM 应用 builders",
    language: "English",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "approval_required",
    price: "free",
    rulesSummary: "需要遵守社区行为准则，禁止无关招揽和刷屏推广。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: [
      "recently_verified",
      "owner_maintained",
      "join_method_fresh"
    ],
    joinMethods: [
      {
        id: "jm_langchain_slack_form",
        type: "application_form",
        label: "Official Slack application",
        value: "https://www.langchain.com/join-community",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_hugging_face_discord",
    slug: "hugging-face-discord",
    name: "Hugging Face Discord Community",
    platform: "discord",
    categorySlug: "ai",
    tags: ["Hugging Face", "Machine Learning", "AI", "Open Source", "Models"],
    shortDescription:
      "Hugging Face 官方 Discord 社区，聚焦机器学习、开源模型和 AI 实践。",
    description:
      "The official Hugging Face Discord Community for AI and ML builders, learners, and open source contributors. Members join through Hugging Face verification before entering Discord.",
    suitableAudience: "ML 工程师、AI 研究/应用开发者、开源模型用户",
    suitableFor: "ML 工程师、AI 研究/应用开发者、开源模型用户",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "approval_required",
    price: "free",
    rulesSummary: "按 Hugging Face Discord 验证流程加入，遵守社区规则。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: [
      "recently_verified",
      "owner_maintained",
      "join_method_fresh"
    ],
    joinMethods: [
      {
        id: "jm_hugging_face_discord_invite",
        type: "invite_link",
        label: "Official Discord invite",
        value: "https://hf.co/join/discord",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_supabase_discord",
    slug: "supabase-discord",
    name: "Supabase Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Supabase", "Postgres", "Backend", "Database", "Open Source"],
    shortDescription:
      "Supabase 官方 Discord，适合交流 Postgres、Auth、Storage、Edge Functions 等开发问题。",
    description:
      "The official Supabase Discord community for developers building with Supabase, Postgres, auth, storage, realtime, and edge functions.",
    suitableAudience: "Web 开发者、后端工程师、Postgres/Supabase 用户",
    suitableFor: "Web 开发者、后端工程师、Postgres/Supabase 用户",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "适合公开技术交流和社区支持，不要发布敏感项目凭证。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: [
      "recently_verified",
      "owner_maintained",
      "join_method_fresh"
    ],
    joinMethods: [
      {
        id: "jm_supabase_discord_link",
        type: "invite_link",
        label: "Official Discord invite",
        value: "https://discord.supabase.com",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_cloudflare_developers_discord",
    slug: "cloudflare-developers-discord",
    name: "Cloudflare Developers Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Cloudflare", "Workers", "Edge", "Serverless", "Developer Platform"],
    shortDescription:
      "Cloudflare Developers 官方 Discord，面向 Workers、Pages、AI 和边缘开发者。",
    description:
      "Cloudflare's developer community Discord for sharing ideas, answers, code, and notes around the Cloudflare Developer Platform, Workers, Pages, AI, and edge infrastructure.",
    suitableAudience: "前后端开发者、边缘计算开发者、Cloudflare Workers 用户",
    suitableFor: "前后端开发者、边缘计算开发者、Cloudflare Workers 用户",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "遵守官方社区规则，技术问题请尽量公开提问并提供上下文。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: [
      "recently_verified",
      "owner_maintained",
      "join_method_fresh"
    ],
    joinMethods: [
      {
        id: "jm_cloudflare_developers_discord_link",
        type: "invite_link",
        label: "Official Discord invite",
        value: "https://discord.cloudflare.com",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_one_person_company_wechat",
    slug: "one-person-company-wechat",
    name: "一人公司实践群 / One-Person Company Lab",
    platform: "wechat",
    categorySlug: "one-person-company",
    tags: ["一人公司", "One-Person Company", "Solo Founder", "独立开发", "自动化"],
    shortDescription:
      "面向 solo founders、独立开发者和小型自动化业务实践者的中文交流群。",
    description:
      "A Chinese-friendly WeChat group for builders running or exploring one-person companies: product selection, automation workflows, AI leverage, lightweight operations, pricing, and sustainable revenue.",
    suitableAudience: "一人公司实践者、solo founders、独立开发者、自动化创业者",
    suitableFor: "一人公司实践者、solo founders、独立开发者、自动化创业者",
    language: "中文 / English keywords",
    region: "全球 / Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "free",
    rulesSummary: "鼓励实战复盘和工具分享，禁止割韭菜项目、刷屏广告和无关推广。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "owner_maintained"],
    joinMethods: [
      {
        id: "jm_one_person_company_wechat_admin",
        type: "admin_contact",
        label: "联系管理员入群",
        value: "提交你的项目方向或正在实践的一人公司主题后审核",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_opc_community",
    slug: "opc-community",
    name: "OPC Community",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["OPC", "One-Person Company", "Solo Founder", "AI", "Indie Hacker"],
    shortDescription:
      "面向 AI 时代一人公司和 solo founders 的公开社区与会员网络。",
    description:
      "OPC Community is a real community for one-person companies and solo founders who want peer connection, curated resources, events, and AI-era operating playbooks.",
    suitableAudience: "一人公司创始人、solo founders、AI builders、indie hackers",
    suitableFor: "一人公司创始人、solo founders、AI builders、indie hackers",
    language: "English / Global",
    region: "Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "unknown",
    rulesSummary: "强调高信任、高信号连接，适合认真建设一人公司的人。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_opc_community_signup",
        type: "application_form",
        label: "Official community sign up",
        value: "https://www.opc.community/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
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
