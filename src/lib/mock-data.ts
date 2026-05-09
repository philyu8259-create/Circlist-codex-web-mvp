import type { Group } from "@/lib/domain";

export const sampleGroups: Group[] = [
  {
    id: "grp_openai_developer_community",
    slug: "openai-developer-community",
    name: "OpenAI Developer Community",
    platform: "other",
    categorySlug: "ai",
    tags: ["OpenAI", "API", "ChatGPT", "Agents", "AI"],
    shortDescription:
      "OpenAI 官方开发者社区，适合讨论 API、模型、agents 和产品集成问题。",
    description:
      "The OpenAI Developer Community is a public forum for developers building with OpenAI APIs and the developer platform.",
    suitableAudience: "AI 应用开发者、产品工程师、API 集成团队",
    suitableFor: "AI 应用开发者、产品工程师、API 集成团队",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "这是开发者论坛，不适合发布密钥、账号问题或无关推广。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: [
      "recently_verified",
      "owner_maintained",
      "join_method_fresh"
    ],
    joinMethods: [
      {
        id: "jm_openai_developer_community_forum",
        type: "invite_link",
        label: "Official developer forum",
        value: "https://community.openai.com/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
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
      "An official LangChain Community Slack for developers building with LangChain, LangGraph, agents, and generative AI workflows.",
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
      "The official Hugging Face Discord Community for AI and ML builders, learners, and open source contributors.",
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
    id: "grp_n8n_community_forum",
    slug: "n8n-community-forum",
    name: "n8n Community Forum",
    platform: "other",
    categorySlug: "ai",
    tags: ["n8n", "Automation", "AI Agents", "Workflow", "No-code"],
    shortDescription:
      "n8n 官方社区论坛，适合交流自动化工作流、AI agent 和集成实践。",
    description:
      "The n8n Community Forum is the official forum for automation builders to ask questions, share workflows, and discuss production patterns.",
    suitableAudience: "自动化开发者、AI workflow builders、运营工程师",
    suitableFor: "自动化开发者、AI workflow builders、运营工程师",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "提问时提供工作流上下文，避免公开凭证和敏感业务数据。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "owner_maintained"],
    joinMethods: [
      {
        id: "jm_n8n_community_forum_link",
        type: "invite_link",
        label: "Official community forum",
        value: "https://community.n8n.io/",
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
      "Cloudflare's developer community Discord for sharing ideas, answers, code, and notes around the Cloudflare Developer Platform.",
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
    id: "grp_nextjs_discord",
    slug: "nextjs-discord",
    name: "Next.js Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Next.js", "React", "Vercel", "Frontend", "Full-stack"],
    shortDescription:
      "Next.js 官方社区入口之一，适合交流 React、App Router 和全栈 Web 开发。",
    description:
      "The Next.js community points developers to GitHub Discussions, Discord, and Reddit for questions, project sharing, and peer support.",
    suitableAudience: "React/Next.js 开发者、全栈 Web 工程师、前端团队",
    suitableFor: "React/Next.js 开发者、全栈 Web 工程师、前端团队",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "技术支持应提供可复现上下文，遵守 Next.js 社区行为准则。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_nextjs_discord_link",
        type: "invite_link",
        label: "Official Discord invite",
        value: "https://discord.com/invite/bUG2bvbtHy",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_reactiflux_discord",
    slug: "reactiflux-discord",
    name: "Reactiflux",
    platform: "discord",
    categorySlug: "programming",
    tags: ["React", "JavaScript", "React Native", "Redux", "GraphQL"],
    shortDescription:
      "大型 React/JavaScript Discord 社区，适合 React、React Native 和 GraphQL 讨论。",
    description:
      "Reactiflux is a long-running chat community for React, React Native, Redux, Jest, Relay, GraphQL, and related JavaScript topics.",
    suitableAudience: "React 开发者、前端工程师、React Native/GraphQL 用户",
    suitableFor: "React 开发者、前端工程师、React Native/GraphQL 用户",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "approval_required",
    price: "free",
    rulesSummary: "以技术讨论和问答为主，遵守 Discord 社区规则。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_reactiflux_discord_link",
        type: "invite_link",
        label: "Official Discord invite",
        value: "https://discord.com/invite/reactiflux",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_github_community",
    slug: "github-community",
    name: "GitHub Community",
    platform: "other",
    categorySlug: "programming",
    tags: ["GitHub", "Open Source", "Discussions", "Developer Tools"],
    shortDescription:
      "GitHub 官方社区和 Discussions 空间，适合开源协作、产品反馈和开发者问题。",
    description:
      "GitHub Community supports GitHub users through Discussions, learning resources, product feedback, and open source collaboration.",
    suitableAudience: "开源维护者、GitHub 用户、开发者工具团队",
    suitableFor: "开源维护者、GitHub 用户、开发者工具团队",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "适合公开讨论 GitHub 产品和开源协作，不要发布敏感仓库信息。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "owner_maintained"],
    joinMethods: [
      {
        id: "jm_github_community_link",
        type: "invite_link",
        label: "Official community hub",
        value: "https://github.com/community",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_kubernetes_slack",
    slug: "kubernetes-slack",
    name: "Kubernetes Slack",
    platform: "slack",
    categorySlug: "programming",
    tags: ["Kubernetes", "Cloud Native", "CNCF", "DevOps", "Infrastructure"],
    shortDescription:
      "Kubernetes 官方社区 Slack，适合云原生、SIG、工作组和贡献者交流。",
    description:
      "Kubernetes Slack is the main real-time communication platform for the Kubernetes community outside mailing lists.",
    suitableAudience: "云原生工程师、Kubernetes 用户、CNCF 贡献者",
    suitableFor: "云原生工程师、Kubernetes 用户、CNCF 贡献者",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "按频道主题交流，遵守 Kubernetes Code of Conduct。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_kubernetes_slack_invite",
        type: "invite_link",
        label: "Official Slack invite",
        value: "https://slack.k8s.io/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_shopify_community",
    slug: "shopify-community",
    name: "Shopify Community",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Shopify", "Ecommerce", "DTC", "Cross-border", "Merchants"],
    shortDescription:
      "Shopify 官方社区论坛，适合跨境电商、独立站、商家和合作伙伴交流。",
    description:
      "Shopify Community provides discussion forums for merchants, partners, and people learning more about Shopify.",
    suitableAudience: "跨境电商卖家、Shopify 商家、独立站开发者、DTC 团队",
    suitableFor: "跨境电商卖家、Shopify 商家、独立站开发者、DTC 团队",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "适合公开业务和技术讨论，避免发布店铺敏感后台信息。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "owner_maintained"],
    joinMethods: [
      {
        id: "jm_shopify_community_forum",
        type: "invite_link",
        label: "Official community forum",
        value: "https://community.shopify.com/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_mds_ecommerce_community",
    slug: "mds-ecommerce-community",
    name: "MDS Ecommerce Community",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Ecommerce", "Amazon", "DTC", "TikTok Shop", "Founder"],
    shortDescription:
      "面向 7-9 位数电商品牌创始人的 vetted 社区，覆盖 Amazon、DTC、TikTok Shop 等渠道。",
    description:
      "MDS is a vetted ecommerce founder community for operators running significant DTC, Amazon, TikTok Shop, retail, and omnichannel brands.",
    suitableAudience: "成熟跨境电商品牌创始人、DTC/Amazon/TikTok Shop 运营者",
    suitableFor: "成熟跨境电商品牌创始人、DTC/Amazon/TikTok Shop 运营者",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "approval_required",
    price: "paid",
    rulesSummary: "面向已达到门槛的品牌经营者，需要申请和审核。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_mds_apply",
        type: "application_form",
        label: "Official application",
        value: "https://www.mds.co/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_underdog_ecom_slack",
    slug: "underdog-ecom-slack",
    name: "Underdog Ecom Slack",
    platform: "slack",
    categorySlug: "overseas",
    tags: ["Ecommerce", "DTC", "Bootstrapped", "Operators", "Slack"],
    shortDescription:
      "面向 scrappy e-commerce founders 和 operators 的 Slack 社区。",
    description:
      "Underdog Ecom describes itself as a Slack community for hands-on ecommerce founders and operators scaling brands without massive teams or VC funding.",
    suitableAudience: "跨境电商创业者、DTC operators、精益品牌团队",
    suitableFor: "跨境电商创业者、DTC operators、精益品牌团队",
    language: "English / Global",
    region: "Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "unknown",
    rulesSummary: "强调真实电商运营交流，申请加入后再进入 Slack。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_underdog_ecom_apply",
        type: "application_form",
        label: "Official community application",
        value: "https://underdogecom.com/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_everything_marketplaces",
    slug: "everything-marketplaces",
    name: "Everything Marketplaces",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Marketplace", "Startup", "Founders", "Platform", "Operators"],
    shortDescription:
      "面向 marketplace founders 和 operators 的社区，适合平台型出海业务交流。",
    description:
      "Everything Marketplaces is a community for marketplace founders and leaders to learn best practices, share insights, and get help from peers.",
    suitableAudience: "Marketplace 创始人、平台业务负责人、出海运营团队",
    suitableFor: "Marketplace 创始人、平台业务负责人、出海运营团队",
    language: "English / Global",
    region: "Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "paid",
    rulesSummary: "适合 marketplace 创始人和运营者，社区内容偏高信号经验交流。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_everything_marketplaces_join",
        type: "application_form",
        label: "Official community application",
        value: "https://www.everythingmarketplaces.com/",
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
      "OPC Community is a community for one-person companies and solo founders who want peer connection, founder resources, and AI-era operating playbooks.",
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
    id: "grp_small_bets",
    slug: "small-bets",
    name: "Small Bets",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Small Bets", "Solopreneur", "One-Person Company", "Indie Hacker"],
    shortDescription:
      "面向 solopreneurs 和小型互联网业务实践者的付费社区。",
    description:
      "Small Bets is a community for solopreneurs and digital entrepreneurs interested in small experiments, audience building, and internet businesses.",
    suitableAudience: "一人公司创始人、solopreneurs、独立互联网创业者",
    suitableFor: "一人公司创始人、solopreneurs、独立互联网创业者",
    language: "English / Global",
    region: "Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "paid",
    rulesSummary: "付费社区，适合认真做小型商业实验的人。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_small_bets_chat",
        type: "application_form",
        label: "Official community page",
        value: "https://chat.smallbets.com/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_productize_yourself",
    slug: "productize-yourself",
    name: "Productize Yourself",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Productized Service", "One-Person Business", "B2B", "Solo Founder"],
    shortDescription:
      "围绕 productized service 和一人业务的课程加社区。",
    description:
      "Productize Yourself is a course and community for builders turning expertise and services into more scalable productized offers.",
    suitableAudience: "顾问型创业者、B2B 服务商、想产品化自己能力的 solo founders",
    suitableFor: "顾问型创业者、B2B 服务商、想产品化自己能力的 solo founders",
    language: "English / Global",
    region: "Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "paid",
    rulesSummary: "适合围绕服务产品化、B2B offer 和一人业务搭建做交流。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_productize_yourself_join",
        type: "application_form",
        label: "Official community page",
        value: "https://www.productizeyourself.co/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_microconf_connect",
    slug: "microconf-connect",
    name: "MicroConf Connect",
    platform: "other",
    categorySlug: "indie-dev",
    tags: ["MicroConf", "Bootstrapped SaaS", "Founder", "Indie Dev"],
    shortDescription:
      "面向 bootstrapped SaaS founders 的 vetted 私密社区。",
    description:
      "MicroConf Connect is a vetted private community for bootstrapped SaaS founders seeking advice, accountability, and peer relationships.",
    suitableAudience: "Bootstrapped SaaS 创始人、独立开发者、微型团队",
    suitableFor: "Bootstrapped SaaS 创始人、独立开发者、微型团队",
    language: "English / Global",
    region: "Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "paid",
    rulesSummary: "需要申请审核，强调无推销和高质量创始人互助。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_microconf_connect_apply",
        type: "application_form",
        label: "Official application",
        value: "https://microconf.com/connect",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_micro_saas_hq_community",
    slug: "micro-saas-hq-community",
    name: "Micro SaaS HQ Community",
    platform: "discord",
    categorySlug: "indie-dev",
    tags: ["Micro SaaS", "SaaS", "Solopreneur", "Indie Dev", "Discord"],
    shortDescription:
      "面向 SaaS founders、builders 和 solopreneurs 的 Micro SaaS 社区。",
    description:
      "Micro SaaS HQ runs a community for SaaS founders, builders, and solopreneurs to discuss ideas, get feedback, and share launches.",
    suitableAudience: "Micro SaaS 创始人、独立开发者、solopreneurs",
    suitableFor: "Micro SaaS 创始人、独立开发者、solopreneurs",
    language: "English / Global",
    region: "Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "paid",
    rulesSummary: "偏产品反馈、发布支持和 SaaS 增长交流。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_micro_saas_hq_join",
        type: "application_form",
        label: "Official community page",
        value: "https://microsaashq.com/micro-saas-community",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_bogleheads_forum",
    slug: "bogleheads-forum",
    name: "Bogleheads Forum",
    platform: "other",
    categorySlug: "investment",
    tags: ["Bogleheads", "Index Investing", "Personal Finance", "ETF"],
    shortDescription:
      "围绕低成本指数投资、资产配置和个人财务的长期社区论坛。",
    description:
      "Bogleheads Forum is a long-running investing community inspired by Jack Bogle, with discussions around index investing and personal finance.",
    suitableAudience: "长期投资者、指数基金投资者、个人财务学习者",
    suitableFor: "长期投资者、指数基金投资者、个人财务学习者",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "强调长期、低成本、分散投资讨论，不适合短线荐股刷屏。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_bogleheads_forum_link",
        type: "invite_link",
        label: "Official forum",
        value: "https://www.bogleheads.org/forum/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_value_investors_club",
    slug: "value-investors-club",
    name: "Value Investors Club",
    platform: "other",
    categorySlug: "investment",
    tags: ["Value Investing", "Investment Ideas", "Equity Research"],
    shortDescription:
      "价值投资者交流投资想法的精选社区，加入需要提交研究充分的投资观点。",
    description:
      "Value Investors Club is a selective community where sophisticated investors exchange value and special situation investment ideas.",
    suitableAudience: "价值投资者、股票研究者、专业投资人",
    suitableFor: "价值投资者、股票研究者、专业投资人",
    language: "English / Global",
    region: "Global",
    activityLevel: "medium",
    joinPolicy: "approval_required",
    price: "free",
    rulesSummary: "需要高质量投资研究，不适合泛泛荐股或营销。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_value_investors_club_apply",
        type: "application_form",
        label: "Official membership page",
        value: "https://www.valueinvestorsclub.com/help/interact",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_tradingview_community",
    slug: "tradingview-community",
    name: "TradingView Community",
    platform: "other",
    categorySlug: "investment",
    tags: ["TradingView", "Trading Ideas", "Pine Script", "Markets"],
    shortDescription:
      "TradingView 的社交网络和交易想法社区，适合市场分析、脚本和观点交流。",
    description:
      "TradingView's community lets traders and investors publish market ideas, discuss symbols, share Pine scripts, and learn from other market participants.",
    suitableAudience: "交易者、投资者、Pine Script 用户、市场分析爱好者",
    suitableFor: "交易者、投资者、Pine Script 用户、市场分析爱好者",
    language: "English / Global",
    region: "Global",
    activityLevel: "high",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "投资有风险，社区观点不构成投资建议；遵守平台 House Rules。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "owner_maintained"],
    joinMethods: [
      {
        id: "jm_tradingview_community_link",
        type: "invite_link",
        label: "Official social network",
        value: "https://www.tradingview.com/social-network/",
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  }
];
