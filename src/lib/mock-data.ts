import type {
  CategorySlug,
  Group,
  JoinMethodType,
  LocalizedGroupContent,
  Platform
} from "@/lib/domain";

const rawSampleGroups: Group[] = [
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

type AdditionalCommunitySeed = {
  slug: string;
  name: string;
  platform: Platform;
  categorySlug: CategorySlug;
  tags: string[];
  shortDescription: string;
  englishShortDescription: string;
  description: string;
  englishDescription: string;
  suitableFor: string;
  englishSuitableFor: string;
  rulesSummary: string;
  englishRulesSummary: string;
  joinMethodLabel: string;
  joinMethodType: JoinMethodType;
  joinMethodValue: string;
  joinPolicy: Group["joinPolicy"];
  price: Group["price"];
  activityLevel?: Group["activityLevel"];
  ownerVerified?: boolean;
};

function makeAdditionalGroup(seed: AdditionalCommunitySeed): Group {
  const normalizedSlug = seed.slug.replaceAll("-", "_");

  return {
    id: `grp_${normalizedSlug}`,
    slug: seed.slug,
    name: seed.name,
    platform: seed.platform,
    categorySlug: seed.categorySlug,
    tags: seed.tags,
    shortDescription: seed.shortDescription,
    description: seed.description,
    suitableAudience: seed.suitableFor,
    suitableFor: seed.suitableFor,
    language: "English / Global",
    region: "Global",
    activityLevel: seed.activityLevel ?? "medium",
    joinPolicy: seed.joinPolicy,
    price: seed.price,
    rulesSummary: seed.rulesSummary,
    ownerVerified: seed.ownerVerified ?? true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "join_method_fresh"],
    joinMethods: [
      {
        id: `jm_${normalizedSlug}`,
        type: seed.joinMethodType,
        label: seed.joinMethodLabel,
        value: seed.joinMethodValue,
        visibility: "public",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved",
    localizedContent: {
      en: {
        shortDescription: seed.englishShortDescription,
        description: seed.englishDescription,
        suitableAudience: seed.englishSuitableFor,
        suitableFor: seed.englishSuitableFor,
        rulesSummary: seed.englishRulesSummary
      }
    }
  };
}

const additionalCommunitySeeds: AdditionalCommunitySeed[] = [
  {
    slug: "google-ai-developers-forum",
    name: "Google AI Developers Forum",
    platform: "other",
    categorySlug: "ai",
    tags: ["Google AI", "Gemini", "Developer Forum", "AI"],
    shortDescription:
      "Google AI Developers 官方论坛，适合讨论 Gemini、AI Studio 和生成式 AI 开发。",
    englishShortDescription:
      "Google AI Developers' official forum for Gemini, AI Studio, and generative AI development.",
    description:
      "面向使用 Google AI 开发工具的开发者，可公开提问、分享实践并查看官方社区回复。",
    englishDescription:
      "A public forum for developers using Google AI tools to ask questions, share practices, and read community answers.",
    suitableFor: "Gemini 开发者、AI 应用工程师、Google AI Studio 用户",
    englishSuitableFor:
      "Gemini developers, AI app engineers, and Google AI Studio users",
    rulesSummary: "适合公开技术讨论，不要发布密钥、隐私数据或账号敏感信息。",
    englishRulesSummary:
      "Use it for public technical discussion and avoid posting keys, private data, or account-sensitive information.",
    joinMethodLabel: "Official forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discuss.ai.google.dev/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "tensorflow-forum",
    name: "TensorFlow Forum",
    platform: "other",
    categorySlug: "ai",
    tags: ["TensorFlow", "Machine Learning", "Deep Learning", "Forum"],
    shortDescription:
      "TensorFlow 官方社区论坛，适合机器学习、模型训练和部署问题交流。",
    englishShortDescription:
      "TensorFlow's official forum for machine learning, model training, and deployment questions.",
    description:
      "TensorFlow 社区入口覆盖论坛、贡献和全球开发者资源，是学习和排障 TensorFlow 的公开空间。",
    englishDescription:
      "TensorFlow's community entry point includes forums, contribution paths, and global developer resources.",
    suitableFor: "机器学习工程师、TensorFlow 用户、深度学习学习者",
    englishSuitableFor:
      "Machine learning engineers, TensorFlow users, and deep learning learners",
    rulesSummary: "提问时提供版本、代码片段和错误上下文，避免发布私有数据。",
    englishRulesSummary:
      "Include versions, code snippets, and error context when asking questions; avoid private data.",
    joinMethodLabel: "Official community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discuss.tensorflow.org/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "pytorch-forums",
    name: "PyTorch Forums",
    platform: "other",
    categorySlug: "ai",
    tags: ["PyTorch", "Deep Learning", "Research", "Forum"],
    shortDescription:
      "PyTorch 官方论坛，适合深度学习研究、训练排障和框架使用讨论。",
    englishShortDescription:
      "PyTorch's official forums for deep learning research, training issues, and framework usage.",
    description:
      "PyTorch Forums 是围绕 PyTorch 使用、模型训练、部署和贡献的公开讨论区。",
    englishDescription:
      "PyTorch Forums host public discussions about PyTorch usage, model training, deployment, and contributions.",
    suitableFor: "深度学习工程师、研究者、PyTorch 用户",
    englishSuitableFor: "Deep learning engineers, researchers, and PyTorch users",
    rulesSummary: "问题应尽量可复现，并注明环境、版本和关键错误信息。",
    englishRulesSummary:
      "Questions should be reproducible and include environment, version, and key error details.",
    joinMethodLabel: "Official forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discuss.pytorch.org/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "fastai-forums",
    name: "fast.ai Forums",
    platform: "other",
    categorySlug: "ai",
    tags: ["fast.ai", "Deep Learning", "Education", "PyTorch"],
    shortDescription:
      "fast.ai 公开论坛，适合深度学习课程学习者和实践者交流项目与笔记。",
    englishShortDescription:
      "fast.ai's public forums for deep learning learners and practitioners sharing projects and notes.",
    description:
      "围绕 fast.ai 课程、深度学习实践、论文复现和学习经验的长期社区论坛。",
    englishDescription:
      "A long-running forum around fast.ai courses, deep learning practice, paper replication, and learning notes.",
    suitableFor: "深度学习学习者、课程学员、AI 实践者",
    englishSuitableFor:
      "Deep learning learners, course participants, and AI practitioners",
    rulesSummary: "鼓励高质量学习复盘、代码上下文和互助答疑。",
    englishRulesSummary:
      "High-quality learning notes, code context, and peer support are encouraged.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forums.fast.ai/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "deeplearning-ai-community",
    name: "DeepLearning.AI Community",
    platform: "other",
    categorySlug: "ai",
    tags: ["DeepLearning.AI", "AI Courses", "Machine Learning", "Forum"],
    shortDescription:
      "DeepLearning.AI 学习社区，适合 AI 课程、实验和机器学习实践讨论。",
    englishShortDescription:
      "DeepLearning.AI's learning community for AI courses, labs, and machine learning practice.",
    description:
      "面向 DeepLearning.AI 课程学习者和 AI 实践者的公开社区论坛。",
    englishDescription:
      "A public community forum for DeepLearning.AI learners and AI practitioners.",
    suitableFor: "AI 学习者、课程学员、机器学习工程师",
    englishSuitableFor: "AI learners, course participants, and ML engineers",
    rulesSummary: "适合课程相关提问和实践讨论，不要贴出受限答案或敏感资料。",
    englishRulesSummary:
      "Best for course questions and practice discussion; avoid posting restricted answers or sensitive material.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://community.deeplearning.ai/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "kaggle-discussions",
    name: "Kaggle Discussions",
    platform: "other",
    categorySlug: "ai",
    tags: ["Kaggle", "Data Science", "Machine Learning", "Competitions"],
    shortDescription:
      "Kaggle 讨论区，适合数据科学竞赛、Notebook、数据集和模型交流。",
    englishShortDescription:
      "Kaggle Discussions for data science competitions, notebooks, datasets, and model exchange.",
    description:
      "Kaggle 是数据科学和机器学习实践者聚集的平台，讨论区覆盖比赛、学习和项目问题。",
    englishDescription:
      "Kaggle is a hub for data science and machine learning practitioners, with discussions around competitions, learning, and projects.",
    suitableFor: "数据科学家、机器学习竞赛选手、AI 学习者",
    englishSuitableFor:
      "Data scientists, ML competition participants, and AI learners",
    rulesSummary: "遵守 Kaggle 竞赛规则，不要泄露私有测试集或违规协作。",
    englishRulesSummary:
      "Follow Kaggle competition rules and avoid leaking private test data or violating collaboration rules.",
    joinMethodLabel: "Discussion hub",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.kaggle.com/discussions",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "mlops-community",
    name: "MLOps Community",
    platform: "other",
    categorySlug: "ai",
    tags: ["MLOps", "Production ML", "AI Infrastructure", "Community"],
    shortDescription:
      "MLOps Community 是生产机器学习和 AI 工程实践者的全球社区。",
    englishShortDescription:
      "MLOps Community is a global community for production ML and AI engineering practitioners.",
    description:
      "社区围绕 MLOps、生产级 AI、模型部署、评估和团队实践组织讨论与活动。",
    englishDescription:
      "The community organizes discussion and events around MLOps, production AI, model deployment, evaluation, and team practice.",
    suitableFor: "MLOps 工程师、ML 平台团队、AI 基础设施从业者",
    englishSuitableFor:
      "MLOps engineers, ML platform teams, and AI infrastructure practitioners",
    rulesSummary: "适合真实生产经验分享，避免纯广告和无上下文招聘。",
    englishRulesSummary:
      "Best for real production experience sharing; avoid pure advertising or context-free recruiting.",
    joinMethodLabel: "Join community",
    joinMethodType: "application_form",
    joinMethodValue: "https://home.mlops.community/en",
    joinPolicy: "approval_required",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "datatalks-club-slack",
    name: "DataTalks.Club Slack",
    platform: "slack",
    categorySlug: "ai",
    tags: ["Data Science", "MLOps", "ML Engineering", "Slack"],
    shortDescription:
      "DataTalks.Club 的数据科学和机器学习 Slack 社区，覆盖课程、活动和职业讨论。",
    englishShortDescription:
      "DataTalks.Club's Slack community for data science, ML engineering, courses, events, and careers.",
    description:
      "全球数据从业者社区，围绕数据工程、机器学习、MLOps、课程和线上活动交流。",
    englishDescription:
      "A global data community around data engineering, machine learning, MLOps, courses, and online events.",
    suitableFor: "数据科学家、ML 工程师、数据工程师、AI 学习者",
    englishSuitableFor:
      "Data scientists, ML engineers, data engineers, and AI learners",
    rulesSummary: "适合学习和职业互助，避免刷屏推广和低质量外链。",
    englishRulesSummary:
      "Use it for learning and career support; avoid spammy promotion and low-quality links.",
    joinMethodLabel: "Slack invite via official site",
    joinMethodType: "application_form",
    joinMethodValue: "https://datatalks.club/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "llamaindex-community",
    name: "LlamaIndex Community",
    platform: "discord",
    categorySlug: "ai",
    tags: ["LlamaIndex", "RAG", "Agents", "LLM"],
    shortDescription:
      "LlamaIndex 官方社区，适合 RAG、agent、数据连接和上下文工程讨论。",
    englishShortDescription:
      "LlamaIndex's official community for RAG, agents, data connectors, and context engineering.",
    description:
      "面向使用 LlamaIndex 构建知识助手、RAG 和 agent 应用的开发者社区。",
    englishDescription:
      "A developer community for building knowledge assistants, RAG systems, and agent apps with LlamaIndex.",
    suitableFor: "RAG 开发者、LLM 应用工程师、AI agent builders",
    englishSuitableFor: "RAG developers, LLM app engineers, and AI agent builders",
    rulesSummary: "提问时说明数据源、索引方式和复现路径，避免发布敏感文档。",
    englishRulesSummary:
      "Describe data sources, indexing approaches, and reproduction paths; do not post sensitive documents.",
    joinMethodLabel: "Official community page",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.llamaindex.ai/community",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "pinecone-developer-discord",
    name: "Pinecone Developer Community",
    platform: "discord",
    categorySlug: "ai",
    tags: ["Pinecone", "Vector Database", "RAG", "AI Search"],
    shortDescription:
      "Pinecone 开发者社区，适合向量数据库、RAG 和生产检索系统交流。",
    englishShortDescription:
      "Pinecone's developer community for vector databases, RAG, and production retrieval systems.",
    description:
      "Pinecone 社区页面提供开发者 Discord 和活动入口，适合检索增强应用开发者。",
    englishDescription:
      "Pinecone's community page provides developer Discord and events for retrieval-augmented application builders.",
    suitableFor: "RAG 工程师、向量数据库用户、AI 搜索开发者",
    englishSuitableFor:
      "RAG engineers, vector database users, and AI search developers",
    rulesSummary: "适合技术支持和架构讨论，不要贴出 API key 或客户数据。",
    englishRulesSummary:
      "Use it for technical support and architecture discussion; do not post API keys or customer data.",
    joinMethodLabel: "Official community page",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.pinecone.io/community/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "weaviate-community-forum",
    name: "Weaviate Community Forum",
    platform: "other",
    categorySlug: "ai",
    tags: ["Weaviate", "Vector Database", "RAG", "Forum"],
    shortDescription:
      "Weaviate 社区论坛，适合向量数据库、混合搜索和 RAG 应用问题交流。",
    englishShortDescription:
      "Weaviate's community forum for vector databases, hybrid search, and RAG application questions.",
    description:
      "Weaviate 用户和开发者公开讨论 schema、检索、集成和生产问题的论坛。",
    englishDescription:
      "A public forum where Weaviate users and developers discuss schemas, retrieval, integrations, and production issues.",
    suitableFor: "Weaviate 用户、RAG 工程师、AI 搜索团队",
    englishSuitableFor: "Weaviate users, RAG engineers, and AI search teams",
    rulesSummary: "提问时提供 schema、查询和版本信息，避免发布私有数据。",
    englishRulesSummary:
      "Include schema, query, and version details when asking; avoid posting private data.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.weaviate.io/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "haystack-discord",
    name: "Haystack Discord",
    platform: "discord",
    categorySlug: "ai",
    tags: ["Haystack", "RAG", "NLP", "Agents"],
    shortDescription:
      "Haystack 社区 Discord，适合生产级 RAG、NLP pipeline 和 agent 系统讨论。",
    englishShortDescription:
      "Haystack's Discord community for production RAG, NLP pipelines, and agent systems.",
    description:
      "Haystack 官方站点提供 Discord 入口，聚集使用 Haystack 构建生产 AI 系统的开发者。",
    englishDescription:
      "Haystack's official site links to its Discord for developers building production AI systems with Haystack.",
    suitableFor: "RAG 开发者、NLP 工程师、生产 AI 应用团队",
    englishSuitableFor: "RAG developers, NLP engineers, and production AI teams",
    rulesSummary: "适合 pipeline 和集成问题，提问时提供组件和版本上下文。",
    englishRulesSummary:
      "Best for pipeline and integration questions; include component and version context.",
    joinMethodLabel: "Official Discord link",
    joinMethodType: "invite_link",
    joinMethodValue: "https://haystack.deepset.ai/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "qdrant-discord",
    name: "Qdrant Discord",
    platform: "discord",
    categorySlug: "ai",
    tags: ["Qdrant", "Vector Search", "Similarity Search", "RAG"],
    shortDescription:
      "Qdrant Discord 社区，适合向量搜索、相似度检索和 RAG 架构交流。",
    englishShortDescription:
      "Qdrant's Discord community for vector search, similarity search, and RAG architecture.",
    description:
      "Qdrant 支持页面和 Discord 目录都指向其社区，用于 Qdrant Cloud 和开源使用交流。",
    englishDescription:
      "Qdrant's support pages and Discord directory point to its community for Qdrant Cloud and open-source discussions.",
    suitableFor: "向量搜索开发者、Qdrant 用户、AI 基础设施工程师",
    englishSuitableFor:
      "Vector search developers, Qdrant users, and AI infrastructure engineers",
    rulesSummary: "适合社区支持和经验分享；生产事故仍应走正式支持渠道。",
    englishRulesSummary:
      "Use it for community support and experience sharing; production incidents should use formal support channels.",
    joinMethodLabel: "Official support community",
    joinMethodType: "invite_link",
    joinMethodValue: "https://qdrant.tech/documentation/support/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "hugging-face-forums",
    name: "Hugging Face Forums",
    platform: "other",
    categorySlug: "ai",
    tags: ["Hugging Face", "Transformers", "Datasets", "Forum"],
    shortDescription:
      "Hugging Face 讨论论坛，适合模型、datasets、Spaces 和开源 ML 问题。",
    englishShortDescription:
      "Hugging Face's discussion forum for models, datasets, Spaces, and open ML questions.",
    description:
      "与官方 Discord 互补的论坛空间，便于沉淀 Transformers、Hub 和 ML 生态问题。",
    englishDescription:
      "A forum complementing the official Discord, useful for durable questions about Transformers, the Hub, and ML tooling.",
    suitableFor: "开源模型用户、ML 工程师、Hugging Face Hub 用户",
    englishSuitableFor:
      "Open model users, ML engineers, and Hugging Face Hub users",
    rulesSummary: "提问时说明模型、数据和运行环境，不要上传敏感训练数据。",
    englishRulesSummary:
      "Include model, data, and runtime context when asking; do not upload sensitive training data.",
    joinMethodLabel: "Discussion forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discuss.huggingface.co/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "semantic-kernel-discussions",
    name: "Microsoft Semantic Kernel Discussions",
    platform: "other",
    categorySlug: "ai",
    tags: ["Semantic Kernel", "Microsoft", "Agents", "GitHub Discussions"],
    shortDescription:
      "Microsoft Semantic Kernel 的 GitHub Discussions，适合 agent 和编排框架交流。",
    englishShortDescription:
      "Microsoft Semantic Kernel's GitHub Discussions for agents and orchestration framework questions.",
    description:
      "围绕 Semantic Kernel SDK、agent 编排、插件和集成问题的公开讨论区。",
    englishDescription:
      "A public discussion area for Semantic Kernel SDKs, agent orchestration, plugins, and integrations.",
    suitableFor: "AI agent 开发者、.NET/Python/Java 工程师、企业 AI 团队",
    englishSuitableFor:
      "AI agent developers, .NET/Python/Java engineers, and enterprise AI teams",
    rulesSummary: "适合公开技术问题和功能讨论，敏感客户代码应最小化后再提问。",
    englishRulesSummary:
      "Use it for public technical and feature discussion; minimize sensitive customer code before posting.",
    joinMethodLabel: "GitHub Discussions",
    joinMethodType: "invite_link",
    joinMethodValue: "https://github.com/microsoft/semantic-kernel/discussions",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "local-llama-reddit",
    name: "r/LocalLLaMA",
    platform: "other",
    categorySlug: "ai",
    tags: ["Local LLM", "Open Models", "Inference", "Reddit"],
    shortDescription:
      "r/LocalLLaMA 是本地大模型、开源模型和推理实践的公开 Reddit 社区。",
    englishShortDescription:
      "r/LocalLLaMA is a public Reddit community for local LLMs, open models, and inference practice.",
    description:
      "社区聚焦本地部署、量化、推理框架、显卡配置和开源模型体验分享。",
    englishDescription:
      "The community focuses on local deployment, quantization, inference frameworks, GPU setups, and open model experiences.",
    suitableFor: "本地 LLM 玩家、AI 工程师、开源模型实践者",
    englishSuitableFor:
      "Local LLM enthusiasts, AI engineers, and open model practitioners",
    rulesSummary: "注意版权、模型许可和安全边界；不要发布侵权数据或滥用指南。",
    englishRulesSummary:
      "Respect copyright, model licenses, and safety boundaries; avoid infringing data or abuse guidance.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/LocalLLaMA/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  },
  {
    slug: "machine-learning-reddit",
    name: "r/MachineLearning",
    platform: "other",
    categorySlug: "ai",
    tags: ["Machine Learning", "Research", "Papers", "Reddit"],
    shortDescription:
      "r/MachineLearning 是机器学习论文、研究和行业讨论的公开 Reddit 社区。",
    englishShortDescription:
      "r/MachineLearning is a public Reddit community for ML papers, research, and industry discussion.",
    description:
      "适合跟踪机器学习研究进展、讨论论文、工具和行业动态。",
    englishDescription:
      "Useful for tracking ML research, discussing papers, tools, and industry developments.",
    suitableFor: "机器学习研究者、AI 工程师、研究生和论文读者",
    englishSuitableFor:
      "ML researchers, AI engineers, graduate students, and paper readers",
    rulesSummary: "遵守版规，区分研究、讨论和推广内容。",
    englishRulesSummary:
      "Follow subreddit rules and distinguish research, discussion, and promotional content.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/MachineLearning/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  },
  {
    slug: "learn-machine-learning-reddit",
    name: "r/learnmachinelearning",
    platform: "other",
    categorySlug: "ai",
    tags: ["Machine Learning", "Learning", "Beginners", "Reddit"],
    shortDescription:
      "r/learnmachinelearning 是机器学习学习者提问、路线和项目反馈社区。",
    englishShortDescription:
      "r/learnmachinelearning is a community for ML learners to ask questions, discuss paths, and get project feedback.",
    description:
      "面向入门到进阶学习者，讨论课程、项目、数学基础、工具选择和职业路径。",
    englishDescription:
      "For beginner-to-intermediate learners discussing courses, projects, math foundations, tools, and career paths.",
    suitableFor: "机器学习初学者、转行者、项目练习者",
    englishSuitableFor: "ML beginners, career switchers, and project learners",
    rulesSummary: "适合学习问题和项目反馈，避免重复低质量求资源帖。",
    englishRulesSummary:
      "Best for learning questions and project feedback; avoid repetitive low-effort resource requests.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/learnmachinelearning/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  },
  {
    slug: "tailwind-css-discord",
    name: "Tailwind CSS Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Tailwind CSS", "CSS", "Frontend", "Discord"],
    shortDescription:
      "Tailwind CSS 官方 Discord 入口，适合前端样式、组件和设计系统交流。",
    englishShortDescription:
      "Tailwind CSS's official Discord entry point for frontend styling, components, and design systems.",
    description:
      "面向 Tailwind CSS 用户和前端开发者的实时社区，适合交流样式方案和工具链问题。",
    englishDescription:
      "A real-time community for Tailwind CSS users and frontend developers discussing styling patterns and tooling issues.",
    suitableFor: "前端工程师、设计工程师、Tailwind CSS 用户",
    englishSuitableFor:
      "Frontend engineers, design engineers, and Tailwind CSS users",
    rulesSummary: "适合技术交流和作品反馈，避免无关推广。",
    englishRulesSummary:
      "Use it for technical exchange and work feedback; avoid unrelated promotion.",
    joinMethodLabel: "Official Discord redirect",
    joinMethodType: "invite_link",
    joinMethodValue: "https://tailwindcss.com/discord",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "vue-land-discord",
    name: "Vue Land",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Vue", "Nuxt", "Frontend", "Discord"],
    shortDescription:
      "Vue Land 是 Vue 生态的 Discord 社区，适合 Vue、Nuxt 和前端问题交流。",
    englishShortDescription:
      "Vue Land is a Discord community for the Vue ecosystem, including Vue, Nuxt, and frontend questions.",
    description:
      "Vue 开发者在这里讨论框架使用、组件、生态库、学习路线和项目排障。",
    englishDescription:
      "Vue developers discuss framework usage, components, ecosystem libraries, learning paths, and project debugging.",
    suitableFor: "Vue/Nuxt 开发者、前端工程师、开源贡献者",
    englishSuitableFor: "Vue/Nuxt developers, frontend engineers, and open-source contributors",
    rulesSummary: "提问前准备最小复现和版本信息，保持频道主题相关。",
    englishRulesSummary:
      "Prepare a minimal reproduction and version details before asking; keep channels on topic.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://vue-land.js.org/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "svelte-society",
    name: "Svelte Society",
    platform: "other",
    categorySlug: "programming",
    tags: ["Svelte", "SvelteKit", "Frontend", "Community"],
    shortDescription:
      "Svelte Society 是 Svelte 生态社区，沉淀资源、库、教程和社区内容。",
    englishShortDescription:
      "Svelte Society is a Svelte ecosystem community collecting resources, libraries, tutorials, and community content.",
    description:
      "适合查找 Svelte/SvelteKit 资源、提交项目、了解生态动态和连接社区。",
    englishDescription:
      "Useful for finding Svelte/SvelteKit resources, submitting projects, following ecosystem news, and connecting with the community.",
    suitableFor: "Svelte 开发者、前端工程师、框架学习者",
    englishSuitableFor: "Svelte developers, frontend engineers, and framework learners",
    rulesSummary: "提交资源应与 Svelte 生态相关，避免低质量重复内容。",
    englishRulesSummary:
      "Submitted resources should be relevant to the Svelte ecosystem and avoid low-quality duplicates.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://sveltesociety.dev/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "angular-discord",
    name: "Angular Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Angular", "TypeScript", "Frontend", "Discord"],
    shortDescription:
      "Angular Discord 社区，适合 Angular、TypeScript、库和前端架构问题交流。",
    englishShortDescription:
      "Angular's Discord community for Angular, TypeScript, libraries, and frontend architecture questions.",
    description:
      "Angular 开发者可以在这里提问、分享项目、寻找本地和语言频道交流。",
    englishDescription:
      "Angular developers can ask questions, share projects, and find local or language-specific channels.",
    suitableFor: "Angular 开发者、TypeScript 工程师、前端团队",
    englishSuitableFor: "Angular developers, TypeScript engineers, and frontend teams",
    rulesSummary: "适合技术互助和社区活动，遵守 Discord 社区规则。",
    englishRulesSummary:
      "Use it for technical support and community events while following Discord community rules.",
    joinMethodLabel: "Discord invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discord.com/invite/angular",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "flutter-community",
    name: "Flutter Community",
    platform: "other",
    categorySlug: "programming",
    tags: ["Flutter", "Dart", "Mobile", "Community"],
    shortDescription:
      "Flutter 官方社区入口，覆盖 Discord、Slack、论坛、Reddit 和全球活动。",
    englishShortDescription:
      "Flutter's official community entry point covering Discord, Slack, forums, Reddit, and global events.",
    description:
      "适合 Flutter 和 Dart 开发者寻找在线社区、活动、论坛和贡献路径。",
    englishDescription:
      "Useful for Flutter and Dart developers looking for online communities, events, forums, and contribution paths.",
    suitableFor: "Flutter 开发者、Dart 工程师、跨平台移动团队",
    englishSuitableFor:
      "Flutter developers, Dart engineers, and cross-platform mobile teams",
    rulesSummary: "按具体渠道规则参与，提问时提供可复现工程上下文。",
    englishRulesSummary:
      "Follow the rules of each channel and include reproducible project context when asking questions.",
    joinMethodLabel: "Official community page",
    joinMethodType: "invite_link",
    joinMethodValue: "https://flutter.dev/community",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "rust-users-forum",
    name: "Rust Users Forum",
    platform: "other",
    categorySlug: "programming",
    tags: ["Rust", "Systems Programming", "Forum", "Open Source"],
    shortDescription:
      "Rust 用户论坛，适合 Rust 学习、项目排障、crate 和工程实践交流。",
    englishShortDescription:
      "Rust's users forum for learning Rust, project debugging, crates, and engineering practice.",
    description:
      "面向 Rust 使用者的公开论坛，讨论语言、工具链、库和实际项目问题。",
    englishDescription:
      "A public forum for Rust users discussing the language, tooling, libraries, and real project issues.",
    suitableFor: "Rust 开发者、系统工程师、开源贡献者",
    englishSuitableFor: "Rust developers, systems engineers, and open-source contributors",
    rulesSummary: "适合用户问题和实践交流，内部语言设计议题请去 internals。",
    englishRulesSummary:
      "Best for user questions and practical discussion; language-design topics belong in internals.",
    joinMethodLabel: "Official users forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://users.rust-lang.org/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "rust-internals-forum",
    name: "Rust Internals Forum",
    platform: "other",
    categorySlug: "programming",
    tags: ["Rust", "Language Design", "Compiler", "Forum"],
    shortDescription:
      "Rust Internals 论坛，适合 Rust 语言设计、编译器和生态演进讨论。",
    englishShortDescription:
      "Rust Internals forum for Rust language design, compiler, and ecosystem evolution discussions.",
    description:
      "更偏 Rust 语言和标准库内部讨论，适合关注 RFC、实现和设计取舍的人。",
    englishDescription:
      "A more internal-facing forum for Rust language and standard library discussions, RFCs, implementation, and design tradeoffs.",
    suitableFor: "Rust 贡献者、编译器工程师、语言设计关注者",
    englishSuitableFor:
      "Rust contributors, compiler engineers, and language design followers",
    rulesSummary: "聚焦设计和实现讨论，普通使用问题更适合 users forum。",
    englishRulesSummary:
      "Focus on design and implementation discussion; ordinary usage questions fit the users forum better.",
    joinMethodLabel: "Official internals forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://internals.rust-lang.org/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "python-discuss",
    name: "Python Discuss",
    platform: "other",
    categorySlug: "programming",
    tags: ["Python", "Discourse", "PEP", "Community"],
    shortDescription:
      "Python 官方 Discourse 讨论区，适合语言、打包、PEP 和社区议题。",
    englishShortDescription:
      "Python's official Discourse forum for the language, packaging, PEPs, and community topics.",
    description:
      "Python 社区用于公开讨论语言生态、打包、治理和用户问题的论坛。",
    englishDescription:
      "Python's forum for public discussions about the language ecosystem, packaging, governance, and user questions.",
    suitableFor: "Python 开发者、包维护者、语言社区参与者",
    englishSuitableFor: "Python developers, package maintainers, and language community participants",
    rulesSummary: "按分类发帖，重大语言变更讨论需遵守社区流程。",
    englishRulesSummary:
      "Post in the right category and follow community process for major language-change discussions.",
    joinMethodLabel: "Official forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discuss.python.org/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "go-forum",
    name: "Go Forum",
    platform: "other",
    categorySlug: "programming",
    tags: ["Go", "Golang", "Backend", "Forum"],
    shortDescription:
      "Go Forum 是 Go 开发者讨论语言使用、后端开发和工具链的社区。",
    englishShortDescription:
      "Go Forum is a community for Go developers discussing language usage, backend development, and tooling.",
    description:
      "适合 Go 初学者和生产开发者交流并发、模块、Web 服务和排障问题。",
    englishDescription:
      "Useful for Go learners and production developers discussing concurrency, modules, web services, and debugging.",
    suitableFor: "Go 开发者、后端工程师、系统工具开发者",
    englishSuitableFor: "Go developers, backend engineers, and systems tooling developers",
    rulesSummary: "提问前提供代码片段、Go 版本和期望行为。",
    englishRulesSummary:
      "Provide code snippets, Go version, and expected behavior when asking questions.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.golangbridge.org/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "nodejs-openjs-slack",
    name: "OpenJS Slack",
    platform: "slack",
    categorySlug: "programming",
    tags: ["Node.js", "JavaScript", "OpenJS", "Slack"],
    shortDescription:
      "OpenJS Foundation Slack，适合 Node.js 和 JavaScript 开源生态交流。",
    englishShortDescription:
      "OpenJS Foundation Slack for Node.js and JavaScript open-source ecosystem discussion.",
    description:
      "OpenJS 生态项目参与者可通过 Slack 邀请入口加入讨论和协作。",
    englishDescription:
      "Participants in OpenJS ecosystem projects can join via the Slack invite entry point for discussion and collaboration.",
    suitableFor: "Node.js 开发者、JavaScript 工程师、开源维护者",
    englishSuitableFor: "Node.js developers, JavaScript engineers, and open-source maintainers",
    rulesSummary: "适合开源协作和项目讨论，遵守 OpenJS 社区行为准则。",
    englishRulesSummary:
      "Use it for open-source collaboration and project discussion while following OpenJS community norms.",
    joinMethodLabel: "Slack invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://slack-invite.openjsf.org/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "docker-community",
    name: "Docker Community",
    platform: "other",
    categorySlug: "programming",
    tags: ["Docker", "Containers", "DevOps", "Community"],
    shortDescription:
      "Docker 官方社区入口，适合容器、镜像、Compose 和开发环境交流。",
    englishShortDescription:
      "Docker's official community entry point for containers, images, Compose, and development environments.",
    description:
      "汇总 Docker 社区、活动和学习资源，适合从入门到生产实践的开发者。",
    englishDescription:
      "A hub for Docker community, events, and learning resources for developers from beginner to production practice.",
    suitableFor: "后端开发者、DevOps 工程师、容器用户",
    englishSuitableFor: "Backend developers, DevOps engineers, and container users",
    rulesSummary: "技术问题应提供 Docker 版本、镜像和复现步骤。",
    englishRulesSummary:
      "Technical questions should include Docker version, image details, and reproduction steps.",
    joinMethodLabel: "Official community page",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.docker.com/community/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "hashicorp-discuss",
    name: "HashiCorp Discuss",
    platform: "other",
    categorySlug: "programming",
    tags: ["Terraform", "Vault", "Nomad", "DevOps"],
    shortDescription:
      "HashiCorp Discuss 论坛，适合 Terraform、Vault、Nomad 和平台工程讨论。",
    englishShortDescription:
      "HashiCorp Discuss forum for Terraform, Vault, Nomad, and platform engineering questions.",
    description:
      "HashiCorp 产品用户在这里公开提问、分享实践和查看社区解答。",
    englishDescription:
      "A public forum where HashiCorp product users ask questions, share practices, and read community answers.",
    suitableFor: "平台工程师、DevOps 团队、Terraform/Vault 用户",
    englishSuitableFor:
      "Platform engineers, DevOps teams, and Terraform/Vault users",
    rulesSummary: "提问时说明产品版本、配置片段和运行环境。",
    englishRulesSummary:
      "Include product version, configuration snippets, and runtime environment when asking questions.",
    joinMethodLabel: "Official forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discuss.hashicorp.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "grafana-community-slack",
    name: "Grafana Community Slack",
    platform: "slack",
    categorySlug: "programming",
    tags: ["Grafana", "Observability", "Monitoring", "Slack"],
    shortDescription:
      "Grafana 社区 Slack，适合可观测性、监控、Dashboard 和插件交流。",
    englishShortDescription:
      "Grafana's community Slack for observability, monitoring, dashboards, and plugins.",
    description:
      "Grafana 用户和开发者可通过社区 Slack 讨论产品使用、集成和可视化实践。",
    englishDescription:
      "Grafana users and developers use the community Slack to discuss product usage, integrations, and visualization practice.",
    suitableFor: "SRE、DevOps、可观测性工程师、Grafana 用户",
    englishSuitableFor:
      "SREs, DevOps engineers, observability engineers, and Grafana users",
    rulesSummary: "适合公开技术交流，不要贴出生产监控凭证或敏感指标。",
    englishRulesSummary:
      "Use it for public technical exchange; do not post production credentials or sensitive metrics.",
    joinMethodLabel: "Slack invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://slack.grafana.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "elastic-discuss",
    name: "Elastic Discuss",
    platform: "other",
    categorySlug: "programming",
    tags: ["Elastic", "Elasticsearch", "Search", "Observability"],
    shortDescription:
      "Elastic Discuss 论坛，适合 Elasticsearch、Kibana、搜索和可观测性问题。",
    englishShortDescription:
      "Elastic Discuss forum for Elasticsearch, Kibana, search, and observability questions.",
    description:
      "Elastic 用户在这里讨论查询、索引、集群、可视化和日志分析问题。",
    englishDescription:
      "Elastic users discuss queries, indexing, clusters, visualization, and log analytics issues.",
    suitableFor: "搜索工程师、后端工程师、SRE、Elastic 用户",
    englishSuitableFor:
      "Search engineers, backend engineers, SREs, and Elastic users",
    rulesSummary: "提问时提供版本、mapping、查询和错误日志的最小信息。",
    englishRulesSummary:
      "Include version, mappings, queries, and minimal error logs when asking questions.",
    joinMethodLabel: "Official forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discuss.elastic.co/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "cncf-slack",
    name: "CNCF Slack",
    platform: "slack",
    categorySlug: "programming",
    tags: ["CNCF", "Cloud Native", "Kubernetes", "Slack"],
    shortDescription:
      "CNCF Slack 社区，适合云原生项目、工作组和贡献者交流。",
    englishShortDescription:
      "CNCF Slack community for cloud native projects, working groups, and contributors.",
    description:
      "云原生生态项目参与者可在 CNCF Slack 里按项目和工作组频道交流。",
    englishDescription:
      "Cloud native ecosystem participants use CNCF Slack to discuss by project and working-group channels.",
    suitableFor: "云原生工程师、CNCF 贡献者、平台团队",
    englishSuitableFor:
      "Cloud native engineers, CNCF contributors, and platform teams",
    rulesSummary: "按项目频道讨论，遵守 CNCF 行为准则。",
    englishRulesSummary:
      "Discuss in the appropriate project channel and follow the CNCF Code of Conduct.",
    joinMethodLabel: "Slack invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://slack.cncf.io/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "freecodecamp-forum",
    name: "freeCodeCamp Forum",
    platform: "other",
    categorySlug: "programming",
    tags: ["freeCodeCamp", "Learning", "Web Development", "Forum"],
    shortDescription:
      "freeCodeCamp 论坛，适合编程学习、项目答疑和职业路径交流。",
    englishShortDescription:
      "freeCodeCamp's forum for learning programming, project help, and career-path discussions.",
    description:
      "面向自学编程者的公开社区，涵盖前端、后端、算法、项目和求职。",
    englishDescription:
      "A public community for self-taught programmers covering frontend, backend, algorithms, projects, and jobs.",
    suitableFor: "编程初学者、转行者、自学开发者",
    englishSuitableFor:
      "Programming beginners, career switchers, and self-taught developers",
    rulesSummary: "适合学习互助，提问要展示已尝试内容和具体卡点。",
    englishRulesSummary:
      "Use it for learning support and show what you have tried plus the exact blocker.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.freecodecamp.org/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "dev-community",
    name: "DEV Community",
    platform: "other",
    categorySlug: "programming",
    tags: ["DEV", "Developers", "Blog", "Community"],
    shortDescription:
      "DEV Community 是开发者文章、讨论和项目分享社区。",
    englishShortDescription:
      "DEV Community is a developer community for articles, discussions, and project sharing.",
    description:
      "开发者在 DEV 发布技术文章、提问、参与讨论和发现开源项目。",
    englishDescription:
      "Developers publish technical articles, ask questions, join discussions, and discover open-source projects on DEV.",
    suitableFor: "开发者、技术写作者、开源参与者",
    englishSuitableFor: "Developers, technical writers, and open-source participants",
    rulesSummary: "适合公开技术内容，避免低质量外链农场和复制内容。",
    englishRulesSummary:
      "Best for public technical content; avoid low-quality link farming and copied content.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://dev.to/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "vercel-community",
    name: "Vercel Community",
    platform: "other",
    categorySlug: "programming",
    tags: ["Vercel", "Next.js", "Deployment", "Frontend"],
    shortDescription:
      "Vercel Community 论坛，适合部署、Next.js、边缘函数和前端平台问题。",
    englishShortDescription:
      "Vercel Community forum for deployment, Next.js, edge functions, and frontend platform questions.",
    description:
      "Vercel 用户公开讨论部署、构建、域名、函数、Next.js 和平台使用问题。",
    englishDescription:
      "Vercel users discuss deployments, builds, domains, functions, Next.js, and platform usage in public.",
    suitableFor: "Next.js 开发者、前端团队、Vercel 用户",
    englishSuitableFor: "Next.js developers, frontend teams, and Vercel users",
    rulesSummary: "提问时提供项目配置、构建日志摘要和复现链接。",
    englishRulesSummary:
      "Include project configuration, build-log summaries, and reproduction links when asking questions.",
    joinMethodLabel: "Official community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://community.vercel.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "postgresql-community",
    name: "PostgreSQL Community",
    platform: "other",
    categorySlug: "programming",
    tags: ["PostgreSQL", "Database", "SQL", "Community"],
    shortDescription:
      "PostgreSQL 官方社区入口，适合数据库、SQL、邮件列表和生态资源。",
    englishShortDescription:
      "PostgreSQL's official community entry point for databases, SQL, mailing lists, and ecosystem resources.",
    description:
      "PostgreSQL 社区页汇总用户组、邮件列表、活动和参与方式。",
    englishDescription:
      "PostgreSQL's community page gathers user groups, mailing lists, events, and participation paths.",
    suitableFor: "数据库工程师、后端开发者、PostgreSQL 用户",
    englishSuitableFor:
      "Database engineers, backend developers, and PostgreSQL users",
    rulesSummary: "数据库问题应提供版本、schema、查询计划和最小复现。",
    englishRulesSummary:
      "Database questions should include version, schema, query plans, and a minimal reproduction.",
    joinMethodLabel: "Official community page",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.postgresql.org/community/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "mongodb-community-forum",
    name: "MongoDB Community Forums",
    platform: "other",
    categorySlug: "programming",
    tags: ["MongoDB", "Database", "NoSQL", "Forum"],
    shortDescription:
      "MongoDB Community Forums，适合 MongoDB、Atlas、聚合和数据建模问题。",
    englishShortDescription:
      "MongoDB Community Forums for MongoDB, Atlas, aggregation, and data modeling questions.",
    description:
      "MongoDB 用户和开发者公开交流查询、部署、Atlas、驱动和性能问题。",
    englishDescription:
      "MongoDB users and developers discuss queries, deployment, Atlas, drivers, and performance issues.",
    suitableFor: "MongoDB 用户、后端工程师、数据库管理员",
    englishSuitableFor:
      "MongoDB users, backend engineers, and database administrators",
    rulesSummary: "提问时提供版本、索引、查询和数据结构的脱敏示例。",
    englishRulesSummary:
      "Include version, indexes, queries, and sanitized data-shape examples when asking.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.mongodb.com/community/forums/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "redis-community-forum",
    name: "Redis Community Forum",
    platform: "other",
    categorySlug: "programming",
    tags: ["Redis", "Cache", "Database", "Forum"],
    shortDescription:
      "Redis 社区论坛，适合缓存、数据结构、性能和 Redis Stack 问题。",
    englishShortDescription:
      "Redis community forum for caching, data structures, performance, and Redis Stack questions.",
    description:
      "Redis 用户可在论坛讨论使用方式、模块、集群、性能和架构设计。",
    englishDescription:
      "Redis users discuss usage, modules, clusters, performance, and architecture design in the forum.",
    suitableFor: "后端工程师、缓存系统用户、数据库工程师",
    englishSuitableFor:
      "Backend engineers, cache-system users, and database engineers",
    rulesSummary: "问题应包含 Redis 版本、配置和可复现命令。",
    englishRulesSummary:
      "Questions should include Redis version, configuration, and reproducible commands.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.redis.io/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "laravel-discord",
    name: "Laravel Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Laravel", "PHP", "Backend", "Discord"],
    shortDescription:
      "Laravel Discord 社区，适合 Laravel、PHP、后端和全栈开发交流。",
    englishShortDescription:
      "Laravel Discord community for Laravel, PHP, backend, and full-stack development discussion.",
    description:
      "Laravel 开发者可通过 Discord 讨论框架使用、生态包、部署和项目问题。",
    englishDescription:
      "Laravel developers use Discord to discuss framework usage, packages, deployment, and project questions.",
    suitableFor: "Laravel 开发者、PHP 工程师、全栈团队",
    englishSuitableFor: "Laravel developers, PHP engineers, and full-stack teams",
    rulesSummary: "提问时提供 Laravel/PHP 版本和相关代码片段。",
    englishRulesSummary:
      "Include Laravel/PHP versions and relevant code snippets when asking questions.",
    joinMethodLabel: "Discord invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discord.gg/laravel",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "django-forum",
    name: "Django Forum",
    platform: "other",
    categorySlug: "programming",
    tags: ["Django", "Python", "Backend", "Forum"],
    shortDescription:
      "Django Forum，适合 Django 框架、Python Web 和项目架构讨论。",
    englishShortDescription:
      "Django Forum for Django framework, Python web development, and project architecture discussion.",
    description:
      "Django 社区的公开论坛，覆盖使用问题、DEP、贡献和生态项目。",
    englishDescription:
      "Django's public forum covers usage questions, DEPs, contributions, and ecosystem projects.",
    suitableFor: "Django 开发者、Python Web 工程师、后端团队",
    englishSuitableFor:
      "Django developers, Python web engineers, and backend teams",
    rulesSummary: "适合具体问题和社区讨论，代码示例应尽量最小化。",
    englishRulesSummary:
      "Good for concrete questions and community discussion; keep code examples minimal.",
    joinMethodLabel: "Official forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.djangoproject.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "wordpress-slack",
    name: "Making WordPress Slack",
    platform: "slack",
    categorySlug: "programming",
    tags: ["WordPress", "Open Source", "PHP", "Slack"],
    shortDescription:
      "Making WordPress Slack，适合 WordPress 核心、插件、主题和贡献协作。",
    englishShortDescription:
      "Making WordPress Slack for WordPress core, plugins, themes, and contribution collaboration.",
    description:
      "WordPress 贡献者和开发者在 Slack 中按团队频道参与开源协作。",
    englishDescription:
      "WordPress contributors and developers collaborate in Slack across team channels.",
    suitableFor: "WordPress 开发者、插件作者、开源贡献者",
    englishSuitableFor:
      "WordPress developers, plugin authors, and open-source contributors",
    rulesSummary: "适合开源贡献和团队协作，遵守 WordPress 社区准则。",
    englishRulesSummary:
      "Use it for open-source contribution and team collaboration while following WordPress community guidelines.",
    joinMethodLabel: "Official chat guide",
    joinMethodType: "invite_link",
    joinMethodValue: "https://make.wordpress.org/chat/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "kotlin-slack",
    name: "Kotlin Slack",
    platform: "slack",
    categorySlug: "programming",
    tags: ["Kotlin", "Android", "JVM", "Slack"],
    shortDescription:
      "Kotlin Slack，适合 Kotlin、JVM、Android 和多平台开发者交流。",
    englishShortDescription:
      "Kotlin Slack for Kotlin, JVM, Android, and multiplatform developers.",
    description:
      "Kotlin 社区使用 Slack 讨论语言、库、工具、Android 和 KMP 实践。",
    englishDescription:
      "Kotlin community members use Slack to discuss the language, libraries, tooling, Android, and KMP practice.",
    suitableFor: "Kotlin 开发者、Android 工程师、JVM 团队",
    englishSuitableFor: "Kotlin developers, Android engineers, and JVM teams",
    rulesSummary: "适合技术讨论和生态协作，加入时按官方表单流程申请。",
    englishRulesSummary:
      "Use it for technical discussion and ecosystem collaboration; join through the official form flow.",
    joinMethodLabel: "Official Slack signup",
    joinMethodType: "application_form",
    joinMethodValue: "https://surveys.jetbrains.com/s3/kotlin-slack-sign-up",
    joinPolicy: "approval_required",
    price: "free"
  },
  {
    slug: "ecommercefuel-community",
    name: "eCommerceFuel Community",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Ecommerce", "DTC", "Operators", "Founder"],
    shortDescription:
      "eCommerceFuel 是面向成熟电商品牌经营者的高门槛社区论坛。",
    englishShortDescription:
      "eCommerceFuel is a high-bar community forum for established ecommerce brand operators.",
    description:
      "社区面向达到一定规模的电商经营者，讨论运营、团队、供应链和增长问题。",
    englishDescription:
      "The community serves established ecommerce operators discussing operations, teams, supply chains, and growth.",
    suitableFor: "成熟跨境电商卖家、DTC 创始人、电商品牌经营者",
    englishSuitableFor:
      "Established cross-border ecommerce sellers, DTC founders, and ecommerce brand operators",
    rulesSummary: "需要申请和资质审核，适合严肃经营者交流。",
    englishRulesSummary:
      "Requires application and qualification review; best for serious operators.",
    joinMethodLabel: "Community application",
    joinMethodType: "application_form",
    joinMethodValue: "https://www.ecommercefuel.com/ecommerce-forum/",
    joinPolicy: "approval_required",
    price: "paid",
    activityLevel: "high"
  },
  {
    slug: "amazon-seller-forums",
    name: "Amazon Seller Forums",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Amazon", "Marketplace", "Seller", "Ecommerce"],
    shortDescription:
      "Amazon Seller Forums 是亚马逊卖家公开交流账号、运营和平台问题的论坛。",
    englishShortDescription:
      "Amazon Seller Forums are public forums for sellers discussing accounts, operations, and marketplace issues.",
    description:
      "卖家可以查看社区经理主题和其他卖家的经验分享，适合跨境 Amazon 运营。",
    englishDescription:
      "Sellers can read community-manager topics and peer experience sharing, useful for Amazon marketplace operations.",
    suitableFor: "Amazon 卖家、跨境电商运营、Marketplace 团队",
    englishSuitableFor:
      "Amazon sellers, cross-border ecommerce operators, and marketplace teams",
    rulesSummary: "不要发布账号敏感信息、订单隐私或违规操作建议。",
    englishRulesSummary:
      "Do not post account-sensitive details, order privacy data, or policy-violating tactics.",
    joinMethodLabel: "Seller forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://sellercentral.amazon.com/seller-forums/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "etsy-community-forums",
    name: "Etsy Community Forums",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Etsy", "Marketplace", "Creators", "Ecommerce"],
    shortDescription:
      "Etsy Community Forums 面向 Etsy 店主，讨论店铺运营、产品和平台政策。",
    englishShortDescription:
      "Etsy Community Forums serve Etsy sellers discussing shop operations, products, and platform policy.",
    description:
      "适合手作、设计、 vintage 和小型跨境卖家交流店铺增长经验。",
    englishDescription:
      "Useful for handmade, design, vintage, and small cross-border sellers sharing shop growth experience.",
    suitableFor: "Etsy 卖家、创意产品店主、小型跨境电商",
    englishSuitableFor:
      "Etsy sellers, creative product shop owners, and small cross-border merchants",
    rulesSummary: "参与需遵守 Etsy 社区和卖家政策，不要公开客户隐私。",
    englishRulesSummary:
      "Follow Etsy community and seller policies; do not disclose customer privacy data.",
    joinMethodLabel: "Official forums",
    joinMethodType: "invite_link",
    joinMethodValue: "https://community.etsy.com/forum/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "ebay-community",
    name: "eBay Community",
    platform: "other",
    categorySlug: "overseas",
    tags: ["eBay", "Marketplace", "Sellers", "Ecommerce"],
    shortDescription:
      "eBay Community 是 eBay 买卖家讨论平台规则、listing 和运营问题的社区。",
    englishShortDescription:
      "eBay Community is a forum for buyers and sellers discussing platform rules, listings, and operations.",
    description:
      "适合 eBay 卖家了解平台政策、销售经验、账号问题和商品发布实践。",
    englishDescription:
      "Useful for eBay sellers learning platform policy, sales experience, account issues, and listing practices.",
    suitableFor: "eBay 卖家、跨境电商运营、二手/收藏品店主",
    englishSuitableFor:
      "eBay sellers, cross-border ecommerce operators, and resale or collectibles merchants",
    rulesSummary: "避免公开交易隐私和账号敏感细节，遵守平台规则。",
    englishRulesSummary:
      "Avoid publishing transaction privacy or account-sensitive details and follow platform rules.",
    joinMethodLabel: "Community hub",
    joinMethodType: "invite_link",
    joinMethodValue: "https://community.ebay.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "bigcommerce-community",
    name: "BigCommerce Community",
    platform: "other",
    categorySlug: "overseas",
    tags: ["BigCommerce", "Ecommerce", "SaaS Platform", "Merchants"],
    shortDescription:
      "BigCommerce Community 面向商家、开发者和合作伙伴交流独立站问题。",
    englishShortDescription:
      "BigCommerce Community is for merchants, developers, and partners discussing online store issues.",
    description:
      "适合 BigCommerce 用户查看支持社区、产品问题、集成和电商实践。",
    englishDescription:
      "Useful for BigCommerce users reading support community posts, product questions, integrations, and ecommerce practice.",
    suitableFor: "BigCommerce 商家、独立站开发者、跨境电商团队",
    englishSuitableFor:
      "BigCommerce merchants, online store developers, and cross-border ecommerce teams",
    rulesSummary: "公开讨论时不要泄露店铺后台、客户或支付敏感信息。",
    englishRulesSummary:
      "Do not disclose store admin, customer, or payment-sensitive information in public discussion.",
    joinMethodLabel: "Community support",
    joinMethodType: "invite_link",
    joinMethodValue: "https://support.bigcommerce.com/s/community",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "woocommerce-community",
    name: "WooCommerce Community",
    platform: "other",
    categorySlug: "overseas",
    tags: ["WooCommerce", "WordPress", "Ecommerce", "Merchants"],
    shortDescription:
      "WooCommerce 社区入口，适合 WordPress 电商、插件和店铺增长交流。",
    englishShortDescription:
      "WooCommerce's community entry point for WordPress ecommerce, plugins, and store growth discussion.",
    description:
      "Woo 社区汇总官方支持论坛、资源和连接方式，帮助商家和开发者成长。",
    englishDescription:
      "The Woo community gathers support forums, resources, and connection paths for merchants and developers.",
    suitableFor: "WooCommerce 商家、WordPress 开发者、独立站运营",
    englishSuitableFor:
      "WooCommerce merchants, WordPress developers, and online store operators",
    rulesSummary: "适合公开求助和经验分享，不要发布店铺密钥或客户数据。",
    englishRulesSummary:
      "Use it for public help and experience sharing; do not post store secrets or customer data.",
    joinMethodLabel: "Official community page",
    joinMethodType: "invite_link",
    joinMethodValue: "https://woocommerce.com/community/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "online-geniuses-slack",
    name: "Online Geniuses",
    platform: "slack",
    categorySlug: "overseas",
    tags: ["Marketing", "Growth", "Slack", "Operators"],
    shortDescription:
      "Online Geniuses 是面向数字营销、增长和运营从业者的 Slack 社区。",
    englishShortDescription:
      "Online Geniuses is a Slack community for digital marketing, growth, and operations practitioners.",
    description:
      "社区覆盖 SEO、PPC、社媒、增长、转化和营销职业交流。",
    englishDescription:
      "The community covers SEO, PPC, social, growth, conversion, and marketing career discussions.",
    suitableFor: "海外增长、数字营销、DTC 运营、出海团队",
    englishSuitableFor:
      "Overseas growth, digital marketing, DTC operations, and go-to-market teams",
    rulesSummary: "适合营销经验交流，避免低质量导流和群发销售。",
    englishRulesSummary:
      "Use it for marketing experience exchange; avoid low-quality traffic bait and mass sales outreach.",
    joinMethodLabel: "Slack application",
    joinMethodType: "application_form",
    joinMethodValue: "https://onlinegeniuses.com/",
    joinPolicy: "approval_required",
    price: "free"
  },
  {
    slug: "growthhackers-community",
    name: "GrowthHackers Community",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Growth", "Marketing", "Go-to-market", "Community"],
    shortDescription:
      "GrowthHackers 是增长营销、实验和获客策略讨论社区。",
    englishShortDescription:
      "GrowthHackers is a community for growth marketing, experiments, and acquisition strategy discussions.",
    description:
      "适合关注海外获客、增长实验、转化和营销运营的团队查找案例和讨论。",
    englishDescription:
      "Useful for teams exploring overseas acquisition, growth experiments, conversion, and marketing operations.",
    suitableFor: "增长负责人、出海营销团队、创业者",
    englishSuitableFor: "Growth leads, overseas marketing teams, and founders",
    rulesSummary: "适合公开案例和讨论，避免纯广告发布。",
    englishRulesSummary:
      "Use it for public case studies and discussion; avoid pure advertising.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://growthhackers.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "startup-grind-community",
    name: "Startup Grind",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Startup", "Founders", "Global", "Events"],
    shortDescription:
      "Startup Grind 是全球创业者社区，覆盖活动、城市分会和创始人连接。",
    englishShortDescription:
      "Startup Grind is a global founder community covering events, local chapters, and founder connections.",
    description:
      "适合出海创业者寻找全球创业活动、创始人网络和本地城市连接。",
    englishDescription:
      "Useful for global founders looking for startup events, founder networks, and local chapter connections.",
    suitableFor: "出海创业者、初创公司创始人、生态合作伙伴",
    englishSuitableFor:
      "Global founders, startup operators, and ecosystem partners",
    rulesSummary: "适合活动和创业交流，具体活动需按当地组织规则报名。",
    englishRulesSummary:
      "Use it for events and startup exchange; register for local events under each chapter's rules.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.startupgrind.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "global-from-asia-community",
    name: "Global From Asia Community",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Cross-border", "Asia", "Ecommerce", "Entrepreneurs"],
    shortDescription:
      "Global From Asia 社区面向亚洲和跨境业务创业者，覆盖电商、采购和出海。",
    englishShortDescription:
      "Global From Asia's community serves Asia-based and cross-border entrepreneurs across ecommerce, sourcing, and global business.",
    description:
      "适合做亚洲供应链、跨境电商、海外业务和全球创业的人连接资源。",
    englishDescription:
      "Useful for people working on Asian supply chains, cross-border ecommerce, global operations, and international entrepreneurship.",
    suitableFor: "跨境创业者、采购团队、亚洲供应链和出海业务负责人",
    englishSuitableFor:
      "Cross-border founders, sourcing teams, Asian supply-chain operators, and global business leads",
    rulesSummary: "适合跨境经验交流，注意商业合作尽调和风险识别。",
    englishRulesSummary:
      "Use it for cross-border experience exchange and apply diligence to business partnerships.",
    joinMethodLabel: "Community page",
    joinMethodType: "application_form",
    joinMethodValue: "https://www.globalfromasia.com/community/",
    joinPolicy: "approval_required",
    price: "unknown"
  },
  {
    slug: "helium10-seller-connect",
    name: "Helium 10 Seller Connect Forum",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Amazon FBA", "Helium 10", "Ecommerce", "Marketplace"],
    shortDescription:
      "Helium 10 Seller Connect Forum 面向 Amazon 和多平台卖家交流运营问题。",
    englishShortDescription:
      "Helium 10 Seller Connect Forum helps Amazon and marketplace sellers discuss operations.",
    description:
      "论坛覆盖 Amazon FBA、关键词、Listing、工具使用和卖家教育话题。",
    englishDescription:
      "The forum covers Amazon FBA, keywords, listings, tool usage, and seller education topics.",
    suitableFor: "Amazon FBA 卖家、跨境电商运营、Marketplace 从业者",
    englishSuitableFor:
      "Amazon FBA sellers, cross-border ecommerce operators, and marketplace practitioners",
    rulesSummary: "适合工具和卖家经验交流，注意不要公开账号或订单敏感数据。",
    englishRulesSummary:
      "Use it for tooling and seller experience exchange; avoid public account or order-sensitive data.",
    joinMethodLabel: "Seller forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.helium10.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "reddit-ecommerce",
    name: "r/ecommerce",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Ecommerce", "Reddit", "Operators", "DTC"],
    shortDescription:
      "r/ecommerce 是电商经营者、从业者和学习者的公开 Reddit 社区。",
    englishShortDescription:
      "r/ecommerce is a public Reddit community for ecommerce operators, practitioners, and learners.",
    description:
      "讨论店铺、平台、履约、营销、供应链和电商工具，适合观察真实问题。",
    englishDescription:
      "Discusses stores, platforms, fulfillment, marketing, supply chains, and ecommerce tools for real-world operator insight.",
    suitableFor: "电商创业者、跨境卖家、DTC 团队",
    englishSuitableFor:
      "Ecommerce founders, cross-border sellers, and DTC teams",
    rulesSummary: "遵守 subreddit 规则，注意广告和自我推广限制。",
    englishRulesSummary:
      "Follow subreddit rules and respect advertising and self-promotion limits.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/ecommerce/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  },
  {
    slug: "reddit-amazon-fba",
    name: "r/FulfillmentByAmazon",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Amazon FBA", "Reddit", "Marketplace", "Ecommerce"],
    shortDescription:
      "r/FulfillmentByAmazon 是 Amazon FBA 卖家讨论运营和平台问题的公开社区。",
    englishShortDescription:
      "r/FulfillmentByAmazon is a public community where Amazon FBA sellers discuss operations and platform issues.",
    description:
      "适合跟踪 Amazon FBA 真实问题、工具经验、供应链和平台政策变化。",
    englishDescription:
      "Useful for tracking real Amazon FBA issues, tooling experience, supply-chain topics, and marketplace policy changes.",
    suitableFor: "Amazon FBA 卖家、跨境运营、Marketplace 团队",
    englishSuitableFor: "Amazon FBA sellers, cross-border operators, and marketplace teams",
    rulesSummary: "遵守版规，避免账号隐私泄露和平台违规建议。",
    englishRulesSummary:
      "Follow subreddit rules and avoid account-privacy leaks or marketplace policy violations.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/FulfillmentByAmazon/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false
  },
  {
    slug: "reddit-shopify",
    name: "r/shopify",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Shopify", "Reddit", "DTC", "Ecommerce"],
    shortDescription:
      "r/shopify 是 Shopify 商家和开发者讨论店铺、应用和运营的公开社区。",
    englishShortDescription:
      "r/shopify is a public community for Shopify merchants and developers discussing stores, apps, and operations.",
    description:
      "适合观察 Shopify 独立站、主题、应用、营销和店铺问题的真实讨论。",
    englishDescription:
      "Useful for real discussions around Shopify stores, themes, apps, marketing, and shop issues.",
    suitableFor: "Shopify 商家、独立站开发者、DTC 运营",
    englishSuitableFor: "Shopify merchants, online store developers, and DTC operators",
    rulesSummary: "遵守 subreddit 规则，推广和店铺评审需按规定渠道发布。",
    englishRulesSummary:
      "Follow subreddit rules; promotion and store reviews must use allowed channels.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/shopify/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  },
  {
    slug: "product-hunt-discussions",
    name: "Product Hunt Discussions",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Product Hunt", "Launch", "Startup", "Product"],
    shortDescription:
      "Product Hunt Discussions 适合产品发布、海外用户反馈和 startup 话题交流。",
    englishShortDescription:
      "Product Hunt Discussions are useful for product launches, overseas user feedback, and startup topics.",
    description:
      "适合发现新产品、讨论发布策略、收集早期反馈和观察海外产品趋势。",
    englishDescription:
      "Useful for discovering new products, launch strategy discussion, early feedback, and overseas product trends.",
    suitableFor: "出海产品团队、独立开发者、创业者",
    englishSuitableFor: "Global product teams, indie makers, and founders",
    rulesSummary: "适合产品和发布讨论，避免无上下文刷榜或垃圾推广。",
    englishRulesSummary:
      "Best for product and launch discussion; avoid context-free vote-chasing or spam promotion.",
    joinMethodLabel: "Discussion hub",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.producthunt.com/discussions",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "wip-community",
    name: "WIP",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Maker", "Indie Maker", "Accountability", "One-Person Company"],
    shortDescription:
      "WIP 是 makers 和独立开发者的进度打卡与互助社区。",
    englishShortDescription:
      "WIP is an accountability and peer-support community for makers and indie builders.",
    description:
      "适合一人公司和 indie makers 持续发布进展、获得反馈并保持节奏。",
    englishDescription:
      "Useful for one-person companies and indie makers to post progress, get feedback, and stay consistent.",
    suitableFor: "一人公司创始人、indie makers、独立开发者",
    englishSuitableFor: "One-person founders, indie makers, and solo developers",
    rulesSummary: "适合真实进展和互相支持，不适合纯广告发布。",
    englishRulesSummary:
      "Best for real progress updates and mutual support, not pure advertising.",
    joinMethodLabel: "Community page",
    joinMethodType: "application_form",
    joinMethodValue: "https://wip.co/",
    joinPolicy: "approval_required",
    price: "paid"
  },
  {
    slug: "makerlog",
    name: "Makerlog",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Maker", "Indie Hacker", "Accountability", "Tasks"],
    shortDescription:
      "Makerlog 是 makers 公开记录任务、项目进展和互相鼓励的社区。",
    englishShortDescription:
      "Makerlog is a community where makers publicly log tasks, project progress, and encouragement.",
    description:
      "适合独立开发者和一人业务经营者用轻量任务流保持发布节奏。",
    englishDescription:
      "Useful for indie developers and one-person operators keeping momentum through lightweight task logs.",
    suitableFor: "独立开发者、solo founders、一人公司实践者",
    englishSuitableFor: "Indie developers, solo founders, and one-person company builders",
    rulesSummary: "适合进度记录和项目反馈，避免无关营销内容。",
    englishRulesSummary:
      "Use it for progress logging and project feedback; avoid unrelated marketing content.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://getmakerlog.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "ramen-club",
    name: "Ramen Club",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Bootstrapped", "Indie Business", "Revenue", "Community"],
    shortDescription:
      "Ramen Club 是 bootstrapped founders 围绕收入、产品和增长的社区。",
    englishShortDescription:
      "Ramen Club is a community for bootstrapped founders discussing revenue, product, and growth.",
    description:
      "适合以盈利为目标的小团队和一人业务交流从 0 到 ramen profitable 的路径。",
    englishDescription:
      "Useful for small teams and one-person businesses aiming to become ramen profitable.",
    suitableFor: "Bootstrapped 创始人、solo founders、微型 SaaS 团队",
    englishSuitableFor:
      "Bootstrapped founders, solo founders, and micro-SaaS teams",
    rulesSummary: "适合真实业务复盘和收入目标讨论，避免空泛鸡血。",
    englishRulesSummary:
      "Best for real business retrospectives and revenue goals, not vague hype.",
    joinMethodLabel: "Community site",
    joinMethodType: "application_form",
    joinMethodValue: "https://www.ramenclub.so/",
    joinPolicy: "approval_required",
    price: "paid"
  },
  {
    slug: "nocode-founders",
    name: "No Code Founders",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["No-code", "Founders", "Automation", "Community"],
    shortDescription:
      "No Code Founders 面向用 no-code、自动化和 AI 搭建业务的创始人。",
    englishShortDescription:
      "No Code Founders serves founders building businesses with no-code, automation, and AI.",
    description:
      "适合一人公司和非技术创始人交流工具栈、产品验证和自动化增长。",
    englishDescription:
      "Useful for one-person companies and nontechnical founders discussing tools, validation, and automation-led growth.",
    suitableFor: "非技术创始人、一人公司、no-code builders",
    englishSuitableFor: "Nontechnical founders, one-person companies, and no-code builders",
    rulesSummary: "适合工具和实战分享，避免低质量模板广告。",
    englishRulesSummary:
      "Use it for tool and practice sharing; avoid low-quality template advertising.",
    joinMethodLabel: "Community page",
    joinMethodType: "application_form",
    joinMethodValue: "https://nocodefounders.com/",
    joinPolicy: "approval_required",
    price: "paid"
  },
  {
    slug: "nocodedevs",
    name: "NoCodeDevs",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["No-code", "AI", "Automation", "Creators"],
    shortDescription:
      "NoCodeDevs 面向 no-code、AI 自动化和轻量产品构建者。",
    englishShortDescription:
      "NoCodeDevs serves no-code, AI automation, and lightweight product builders.",
    description:
      "社区适合围绕 no-code 工具、AI workflow、自动化产品和一人业务做交流。",
    englishDescription:
      "The community fits discussion around no-code tools, AI workflows, automation products, and one-person businesses.",
    suitableFor: "no-code makers、AI 自动化实践者、一人公司创始人",
    englishSuitableFor:
      "No-code makers, AI automation practitioners, and one-person founders",
    rulesSummary: "适合建设性工具交流和作品反馈，避免刷屏推广。",
    englishRulesSummary:
      "Use it for constructive tool discussion and work feedback; avoid spam promotion.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.nocodedevs.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "lenny-newsletter-community",
    name: "Lenny's Newsletter Community",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Product", "Growth", "Founders", "Community"],
    shortDescription:
      "Lenny's Newsletter Community 面向产品、增长和创业者的付费社区。",
    englishShortDescription:
      "Lenny's Newsletter Community is a paid community for product, growth, and founder operators.",
    description:
      "适合一人公司和小团队学习产品增长、运营体系和高质量同行问答。",
    englishDescription:
      "Useful for one-person companies and small teams learning product growth, operations, and high-quality peer Q&A.",
    suitableFor: "产品负责人、增长负责人、solo founders、小团队创业者",
    englishSuitableFor:
      "Product leads, growth leads, solo founders, and small-team founders",
    rulesSummary: "付费社区，适合高质量产品和增长讨论。",
    englishRulesSummary:
      "A paid community best suited for high-quality product and growth discussion.",
    joinMethodLabel: "Community page",
    joinMethodType: "application_form",
    joinMethodValue: "https://www.lennysnewsletter.com/community",
    joinPolicy: "approval_required",
    price: "paid"
  },
  {
    slug: "trends-vc-pro",
    name: "Trends.vc Pro Community",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Trends", "Microbusiness", "Research", "Community"],
    shortDescription:
      "Trends.vc Pro 社区围绕微型商业趋势、研究报告和 builders 交流。",
    englishShortDescription:
      "Trends.vc Pro community centers on microbusiness trends, research reports, and builder exchange.",
    description:
      "适合一人公司和小型创业者围绕趋势、机会、案例和商业模式做研究型交流。",
    englishDescription:
      "Useful for one-person companies and small founders researching trends, opportunities, cases, and business models.",
    suitableFor: "一人公司创始人、趋势研究者、indie builders",
    englishSuitableFor:
      "One-person founders, trend researchers, and indie builders",
    rulesSummary: "适合趋势和案例讨论，避免空泛项目宣传。",
    englishRulesSummary:
      "Best for trend and case discussion; avoid vague project promotion.",
    joinMethodLabel: "Pro community",
    joinMethodType: "application_form",
    joinMethodValue: "https://trends.vc/pro/",
    joinPolicy: "approval_required",
    price: "paid"
  },
  {
    slug: "startup-school-community",
    name: "Startup School",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Startup", "YC", "Founders", "Education"],
    shortDescription:
      "Startup School 面向创业者，提供课程、社区和创业进展支持。",
    englishShortDescription:
      "Startup School serves founders with startup education, community, and progress support.",
    description:
      "适合一人公司和早期创业者系统学习创业基础、找反馈并建立节奏。",
    englishDescription:
      "Useful for one-person companies and early founders learning startup basics, getting feedback, and building momentum.",
    suitableFor: "早期创业者、solo founders、想系统学习创业的人",
    englishSuitableFor:
      "Early founders, solo founders, and people learning startup fundamentals",
    rulesSummary: "适合创业学习和进展反馈，申请和课程需按官方流程参与。",
    englishRulesSummary:
      "Use it for startup learning and progress feedback; follow official application and course flows.",
    joinMethodLabel: "Official site",
    joinMethodType: "application_form",
    joinMethodValue: "https://www.startupschool.org/",
    joinPolicy: "approval_required",
    price: "free"
  },
  {
    slug: "saas-club-community",
    name: "SaaS Club Community",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["SaaS", "Founder", "Bootstrapped", "Community"],
    shortDescription:
      "SaaS Club 社区面向 SaaS 创始人，关注启动、增长和经营经验。",
    englishShortDescription:
      "SaaS Club Community serves SaaS founders focused on starting, growing, and operating SaaS businesses.",
    description:
      "适合一人 SaaS、小团队 SaaS 和 bootstrapped 创始人获取同行经验。",
    englishDescription:
      "Useful for solo SaaS, small SaaS teams, and bootstrapped founders looking for peer experience.",
    suitableFor: "SaaS 创始人、一人 SaaS、bootstrapped 团队",
    englishSuitableFor: "SaaS founders, solo SaaS builders, and bootstrapped teams",
    rulesSummary: "适合 SaaS 实战和经营讨论，避免泛泛外包推销。",
    englishRulesSummary:
      "Best for SaaS practice and operating discussion; avoid generic agency promotion.",
    joinMethodLabel: "Community page",
    joinMethodType: "application_form",
    joinMethodValue: "https://www.saasclub.io/community/",
    joinPolicy: "approval_required",
    price: "unknown"
  },
  {
    slug: "dynamite-circle",
    name: "Dynamite Circle",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Entrepreneurs", "Location Independent", "Bootstrapped", "Community"],
    shortDescription:
      "Dynamite Circle 面向 location-independent entrepreneurs 和小型业务经营者。",
    englishShortDescription:
      "Dynamite Circle serves location-independent entrepreneurs and small business operators.",
    description:
      "适合一人公司、远程创业者和全球小型业务经营者建立同行网络。",
    englishDescription:
      "Useful for one-person companies, remote founders, and global small business operators building peer networks.",
    suitableFor: "远程创业者、一人公司、location-independent founders",
    englishSuitableFor:
      "Remote founders, one-person companies, and location-independent entrepreneurs",
    rulesSummary: "会员制社区，适合长期同行连接和经营经验交流。",
    englishRulesSummary:
      "A member community for long-term peer connection and operating experience exchange.",
    joinMethodLabel: "Community application",
    joinMethodType: "application_form",
    joinMethodValue: "https://dynamitecircle.com/",
    joinPolicy: "approval_required",
    price: "paid"
  },
  {
    slug: "indie-hackers",
    name: "Indie Hackers",
    platform: "other",
    categorySlug: "indie-dev",
    tags: ["Indie Hackers", "Founders", "SaaS", "Community"],
    shortDescription:
      "Indie Hackers 是独立开发者和创业者分享产品、收入和增长经验的社区。",
    englishShortDescription:
      "Indie Hackers is a community where indie builders and founders share product, revenue, and growth experiences.",
    description:
      "适合发现独立产品案例、阅读创始人故事、参与问答和跟踪 bootstrapped 经验。",
    englishDescription:
      "Useful for discovering indie product cases, reading founder stories, joining Q&A, and tracking bootstrapped lessons.",
    suitableFor: "独立开发者、solo founders、微型 SaaS 创业者",
    englishSuitableFor:
      "Indie developers, solo founders, and micro-SaaS founders",
    rulesSummary: "适合真实产品和收入复盘，避免空泛推广。",
    englishRulesSummary:
      "Best for real product and revenue retrospectives; avoid vague promotion.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.indiehackers.com/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "hacker-news",
    name: "Hacker News",
    platform: "other",
    categorySlug: "indie-dev",
    tags: ["Hacker News", "Startups", "Technology", "Forum"],
    shortDescription:
      "Hacker News 是技术、创业、独立产品和开源项目讨论社区。",
    englishShortDescription:
      "Hacker News is a community for technology, startups, indie products, and open-source project discussion.",
    description:
      "适合观察早期产品发布、技术趋势、创业讨论和 Show HN 反馈。",
    englishDescription:
      "Useful for observing early product launches, technology trends, startup discussion, and Show HN feedback.",
    suitableFor: "独立开发者、技术创业者、开源作者",
    englishSuitableFor:
      "Indie developers, technical founders, and open-source creators",
    rulesSummary: "重视高质量链接和讨论，避免标题党和营销话术。",
    englishRulesSummary:
      "High-quality links and discussion matter; avoid clickbait and marketing copy.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://news.ycombinator.com/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high",
    ownerVerified: false
  },
  {
    slug: "lobsters",
    name: "Lobsters",
    platform: "other",
    categorySlug: "indie-dev",
    tags: ["Programming", "Indie Dev", "Open Source", "Forum"],
    shortDescription:
      "Lobsters 是邀请制技术社区，适合高质量编程、开源和系统话题讨论。",
    englishShortDescription:
      "Lobsters is an invite-based technical community for high-quality programming, open-source, and systems discussion.",
    description:
      "适合独立开发者和工程师阅读严肃技术讨论、分享项目和获取反馈。",
    englishDescription:
      "Useful for indie developers and engineers reading serious technical discussion, sharing projects, and getting feedback.",
    suitableFor: "独立开发者、资深工程师、开源维护者",
    englishSuitableFor:
      "Indie developers, experienced engineers, and open-source maintainers",
    rulesSummary: "社区偏高信号技术讨论，注册通常需要邀请。",
    englishRulesSummary:
      "The community favors high-signal technical discussion and registration usually requires an invitation.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://lobste.rs/",
    joinPolicy: "invite_only",
    price: "free",
    ownerVerified: false
  },
  {
    slug: "reddit-sideproject",
    name: "r/SideProject",
    platform: "other",
    categorySlug: "indie-dev",
    tags: ["Side Project", "Indie Dev", "Reddit", "Feedback"],
    shortDescription:
      "r/SideProject 是独立开发者发布副项目、获取反馈和找早期用户的社区。",
    englishShortDescription:
      "r/SideProject is a community where indie builders share side projects, get feedback, and find early users.",
    description:
      "适合展示 MVP、收集产品反馈、观察小产品发布方式和社区反应。",
    englishDescription:
      "Useful for showing MVPs, collecting product feedback, and observing how small products launch and receive community reactions.",
    suitableFor: "独立开发者、side project builders、MVP 创作者",
    englishSuitableFor:
      "Indie developers, side project builders, and MVP creators",
    rulesSummary: "遵守 subreddit 自我推广规则，发布要提供上下文和可试用入口。",
    englishRulesSummary:
      "Follow subreddit self-promotion rules and provide context plus a usable entry point.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/SideProject/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  },
  {
    slug: "reddit-saas",
    name: "r/SaaS",
    platform: "other",
    categorySlug: "indie-dev",
    tags: ["SaaS", "Reddit", "Founder", "Growth"],
    shortDescription:
      "r/SaaS 是 SaaS 创始人和从业者讨论产品、增长、定价和运营的社区。",
    englishShortDescription:
      "r/SaaS is a community for SaaS founders and operators discussing product, growth, pricing, and operations.",
    description:
      "适合独立 SaaS 和小团队跟踪真实问题、案例、产品反馈和增长策略。",
    englishDescription:
      "Useful for solo SaaS and small teams tracking real issues, cases, product feedback, and growth strategies.",
    suitableFor: "SaaS 创始人、独立开发者、增长和产品负责人",
    englishSuitableFor:
      "SaaS founders, indie developers, and growth or product leads",
    rulesSummary: "遵守版规，避免低质量推广和无上下文链接。",
    englishRulesSummary:
      "Follow subreddit rules and avoid low-quality promotion or context-free links.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/SaaS/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  },
  {
    slug: "stocktwits",
    name: "Stocktwits",
    platform: "other",
    categorySlug: "investment",
    tags: ["Stocks", "Markets", "Social Investing", "Community"],
    shortDescription:
      "Stocktwits 是围绕股票、市场和交易观点的公开投资社交社区。",
    englishShortDescription:
      "Stocktwits is a public investing social community around stocks, markets, and trading ideas.",
    description:
      "适合观察市场情绪、个股讨论和实时交易观点，但内容需要自行判断风险。",
    englishDescription:
      "Useful for observing market sentiment, ticker discussions, and real-time trading ideas, with independent risk judgment required.",
    suitableFor: "投资者、交易者、市场观察者",
    englishSuitableFor: "Investors, traders, and market observers",
    rulesSummary: "社区观点不构成投资建议，需警惕拉盘、谣言和高风险内容。",
    englishRulesSummary:
      "Community posts are not investment advice; watch for hype, rumors, and high-risk content.",
    joinMethodLabel: "Community site",
    joinMethodType: "invite_link",
    joinMethodValue: "https://stocktwits.com/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "wall-street-oasis",
    name: "Wall Street Oasis Forums",
    platform: "other",
    categorySlug: "investment",
    tags: ["Finance Careers", "Investing", "Markets", "Forum"],
    shortDescription:
      "Wall Street Oasis Forums 覆盖金融职业、投行、市场和投资讨论。",
    englishShortDescription:
      "Wall Street Oasis Forums cover finance careers, investment banking, markets, and investing discussion.",
    description:
      "适合了解金融行业职业路径、面试、市场观点和专业社区讨论。",
    englishDescription:
      "Useful for finance career paths, interviews, market views, and professional community discussion.",
    suitableFor: "金融从业者、投资学习者、投行和买方求职者",
    englishSuitableFor:
      "Finance professionals, investing learners, and investment banking or buy-side candidates",
    rulesSummary: "适合行业讨论和经验分享，投资观点需自行判断。",
    englishRulesSummary:
      "Use it for industry discussion and experience sharing; judge investment views independently.",
    joinMethodLabel: "Community forums",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.wallstreetoasis.com/forum",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "elite-trader-forum",
    name: "Elite Trader Forum",
    platform: "other",
    categorySlug: "investment",
    tags: ["Trading", "Markets", "Forum", "Active Traders"],
    shortDescription:
      "Elite Trader 是交易者讨论市场、策略、券商和交易技术的论坛。",
    englishShortDescription:
      "Elite Trader is a forum where traders discuss markets, strategies, brokers, and trading technology.",
    description:
      "适合主动交易者观察策略讨论、交易基础设施和市场经验分享。",
    englishDescription:
      "Useful for active traders observing strategy discussion, trading infrastructure, and market experience sharing.",
    suitableFor: "主动交易者、量化交易学习者、市场参与者",
    englishSuitableFor:
      "Active traders, quantitative trading learners, and market participants",
    rulesSummary: "交易风险高，社区内容不构成投资建议。",
    englishRulesSummary:
      "Trading is high risk and community posts are not investment advice.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.elitetrader.com/et/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "babypips-forum",
    name: "BabyPips Forum",
    platform: "other",
    categorySlug: "investment",
    tags: ["Forex", "Trading", "Education", "Forum"],
    shortDescription:
      "BabyPips Forum 是外汇学习、交易基础和策略交流社区。",
    englishShortDescription:
      "BabyPips Forum is a community for forex learning, trading basics, and strategy discussion.",
    description:
      "适合外汇初学者学习术语、交易计划、风险管理和市场讨论。",
    englishDescription:
      "Useful for forex beginners learning terminology, trading plans, risk management, and market discussion.",
    suitableFor: "外汇学习者、交易初学者、市场观察者",
    englishSuitableFor: "Forex learners, beginner traders, and market observers",
    rulesSummary: "外汇和杠杆交易风险很高，社区内容仅供学习。",
    englishRulesSummary:
      "Forex and leveraged trading are high risk; community content is for learning only.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forums.babypips.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "quantconnect-forum",
    name: "QuantConnect Forum",
    platform: "other",
    categorySlug: "investment",
    tags: ["Quant", "Algorithmic Trading", "Python", "Forum"],
    shortDescription:
      "QuantConnect Forum 适合量化交易、回测、算法策略和平台使用讨论。",
    englishShortDescription:
      "QuantConnect Forum is for quantitative trading, backtesting, algorithmic strategies, and platform usage discussion.",
    description:
      "量化开发者在这里交流 LEAN、回测、数据、策略实现和部署问题。",
    englishDescription:
      "Quant developers discuss LEAN, backtesting, data, strategy implementation, and deployment questions.",
    suitableFor: "量化开发者、算法交易者、Python 金融工程学习者",
    englishSuitableFor:
      "Quant developers, algorithmic traders, and Python finance learners",
    rulesSummary: "策略讨论需自行验证，社区内容不构成投资建议。",
    englishRulesSummary:
      "Validate strategies independently; community content is not investment advice.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.quantconnect.com/forum",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "anthropic-developer-support",
    name: "Anthropic Developer Support Community",
    platform: "other",
    categorySlug: "ai",
    tags: ["Anthropic", "Claude", "API", "Developer Support"],
    shortDescription:
      "Anthropic 开发者支持入口，适合 Claude API、模型使用和开发问题定位。",
    englishShortDescription:
      "Anthropic's developer support entry point for Claude API, model usage, and debugging questions.",
    description:
      "适合使用 Claude API 和 Anthropic 控制台的开发者查找官方支持和社区入口。",
    englishDescription:
      "Useful for developers using the Claude API and Anthropic Console to find official support and community paths.",
    suitableFor: "Claude API 开发者、AI 应用工程师、产品工程团队",
    englishSuitableFor:
      "Claude API developers, AI app engineers, and product engineering teams",
    rulesSummary: "不要公开 API key、账号信息或客户敏感数据。",
    englishRulesSummary:
      "Do not post API keys, account information, or sensitive customer data.",
    joinMethodLabel: "Official support entry",
    joinMethodType: "invite_link",
    joinMethodValue:
      "https://support.anthropic.com/en/articles/9015913-where-can-i-get-support",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "mistral-ai-discord",
    name: "Mistral AI Discord",
    platform: "discord",
    categorySlug: "ai",
    tags: ["Mistral AI", "LLM", "Open Models", "Discord"],
    shortDescription:
      "Mistral AI Discord 社区，适合模型、API、开源权重和应用开发交流。",
    englishShortDescription:
      "Mistral AI's Discord community for models, APIs, open weights, and application development.",
    description:
      "适合关注 Mistral 模型、La Plateforme、开源模型和推理部署的开发者交流。",
    englishDescription:
      "Useful for developers following Mistral models, La Plateforme, open models, and inference deployment.",
    suitableFor: "LLM 开发者、开源模型用户、AI 应用团队",
    englishSuitableFor: "LLM developers, open model users, and AI application teams",
    rulesSummary: "适合技术交流，避免分享密钥、滥用提示或敏感数据。",
    englishRulesSummary:
      "Use it for technical exchange and avoid sharing keys, abuse prompts, or sensitive data.",
    joinMethodLabel: "Discord invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discord.gg/mistralai",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "langfuse-discord",
    name: "Langfuse Discord",
    platform: "discord",
    categorySlug: "ai",
    tags: ["Langfuse", "LLMOps", "Observability", "Evaluation"],
    shortDescription:
      "Langfuse Discord 社区，适合 LLM 可观测性、评估和 prompt trace 问题。",
    englishShortDescription:
      "Langfuse's Discord community for LLM observability, evaluation, and prompt trace questions.",
    description:
      "面向构建生产 LLM 应用的开发者，讨论 tracing、evals、datasets 和监控。",
    englishDescription:
      "For developers building production LLM apps and discussing tracing, evals, datasets, and monitoring.",
    suitableFor: "LLMOps 工程师、AI 应用团队、产品工程师",
    englishSuitableFor: "LLMOps engineers, AI app teams, and product engineers",
    rulesSummary: "不要发布生产 trace 中的用户隐私或客户数据。",
    englishRulesSummary:
      "Do not post user privacy or customer data from production traces.",
    joinMethodLabel: "Discord invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://langfuse.com/discord",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "ollama-discord",
    name: "Ollama Discord",
    platform: "discord",
    categorySlug: "ai",
    tags: ["Ollama", "Local LLM", "Inference", "Discord"],
    shortDescription:
      "Ollama Discord 社区，适合本地 LLM、模型运行、硬件和部署问题。",
    englishShortDescription:
      "Ollama's Discord community for local LLMs, model running, hardware, and deployment questions.",
    description:
      "适合使用 Ollama 在本地或服务器运行模型的开发者交流模型和运行环境。",
    englishDescription:
      "Useful for developers running models locally or on servers with Ollama to discuss models and runtime environments.",
    suitableFor: "本地 LLM 用户、AI 工程师、开源模型实践者",
    englishSuitableFor:
      "Local LLM users, AI engineers, and open model practitioners",
    rulesSummary: "注意模型许可和安全边界，不要发布侵权数据。",
    englishRulesSummary:
      "Respect model licenses and safety boundaries; do not post infringing data.",
    joinMethodLabel: "Discord invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discord.gg/ollama",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "astro-discord",
    name: "Astro Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Astro", "Frontend", "Static Sites", "Discord"],
    shortDescription:
      "Astro Discord 社区，适合 Astro、内容站、Island 架构和前端性能交流。",
    englishShortDescription:
      "Astro's Discord community for Astro, content sites, island architecture, and frontend performance.",
    description:
      "Astro 官方聊天入口，适合开发者讨论框架使用、集成、部署和生态工具。",
    englishDescription:
      "Astro's official chat entry point for framework usage, integrations, deployment, and ecosystem tools.",
    suitableFor: "前端工程师、内容站开发者、Astro 用户",
    englishSuitableFor:
      "Frontend engineers, content-site developers, and Astro users",
    rulesSummary: "提问时提供项目配置、Astro 版本和最小复现。",
    englishRulesSummary:
      "Include project configuration, Astro version, and a minimal reproduction when asking.",
    joinMethodLabel: "Official chat",
    joinMethodType: "invite_link",
    joinMethodValue: "https://astro.build/chat",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "nuxt-discord",
    name: "Nuxt Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Nuxt", "Vue", "Frontend", "Discord"],
    shortDescription:
      "Nuxt Discord 社区，适合 Nuxt、Vue、SSR 和全栈前端问题交流。",
    englishShortDescription:
      "Nuxt's Discord community for Nuxt, Vue, SSR, and full-stack frontend questions.",
    description:
      "Nuxt 开发者在这里交流框架、模块、部署、Nitro 和 Vue 生态问题。",
    englishDescription:
      "Nuxt developers discuss the framework, modules, deployment, Nitro, and Vue ecosystem issues.",
    suitableFor: "Nuxt/Vue 开发者、前端工程师、全栈团队",
    englishSuitableFor: "Nuxt/Vue developers, frontend engineers, and full-stack teams",
    rulesSummary: "适合技术互助，提问时附上版本和可复现代码。",
    englishRulesSummary:
      "Use it for technical support and include versions plus reproducible code.",
    joinMethodLabel: "Discord invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discord.nuxt.com/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "remix-discord",
    name: "Remix Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Remix", "React Router", "Frontend", "Full-stack"],
    shortDescription:
      "Remix Discord 社区，适合 Remix、React Router、全栈 Web 和部署讨论。",
    englishShortDescription:
      "Remix's Discord community for Remix, React Router, full-stack web development, and deployment.",
    description:
      "适合使用 Remix 构建 Web 应用的开发者交流 loaders、actions、路由和部署。",
    englishDescription:
      "Useful for developers building web apps with Remix to discuss loaders, actions, routing, and deployment.",
    suitableFor: "React/Remix 开发者、全栈工程师、Web 产品团队",
    englishSuitableFor:
      "React/Remix developers, full-stack engineers, and web product teams",
    rulesSummary: "提问时提供路由、错误和复现仓库或代码片段。",
    englishRulesSummary:
      "Include routes, errors, and a reproduction repository or code snippet when asking.",
    joinMethodLabel: "Discord invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discord.gg/remix",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "deno-discord",
    name: "Deno Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Deno", "JavaScript", "TypeScript", "Runtime"],
    shortDescription:
      "Deno Discord 社区，适合 TypeScript runtime、Deno Deploy 和工具链交流。",
    englishShortDescription:
      "Deno's Discord community for the TypeScript runtime, Deno Deploy, and tooling discussion.",
    description:
      "Deno 用户和贡献者可在 Discord 中讨论运行时、标准库、部署和兼容性问题。",
    englishDescription:
      "Deno users and contributors discuss runtime, standard library, deployment, and compatibility topics.",
    suitableFor: "TypeScript 工程师、后端开发者、Deno 用户",
    englishSuitableFor: "TypeScript engineers, backend developers, and Deno users",
    rulesSummary: "适合公开技术讨论，不要发布敏感 token 或生产日志。",
    englishRulesSummary:
      "Use it for public technical discussion; do not post sensitive tokens or production logs.",
    joinMethodLabel: "Discord invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discord.gg/deno",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "bun-discord",
    name: "Bun Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Bun", "JavaScript", "Runtime", "Tooling"],
    shortDescription:
      "Bun Discord 社区，适合 JavaScript runtime、打包、测试和生态兼容问题。",
    englishShortDescription:
      "Bun's Discord community for JavaScript runtime, bundling, testing, and ecosystem compatibility questions.",
    description:
      "适合使用 Bun 的开发者讨论 runtime、package manager、bundler 和 test runner。",
    englishDescription:
      "Useful for Bun developers discussing runtime, package manager, bundler, and test runner topics.",
    suitableFor: "JavaScript/TypeScript 开发者、工具链工程师、Bun 用户",
    englishSuitableFor:
      "JavaScript/TypeScript developers, tooling engineers, and Bun users",
    rulesSummary: "反馈问题时提供 Bun 版本、复现命令和最小项目。",
    englishRulesSummary:
      "Include Bun version, reproduction commands, and a minimal project when reporting issues.",
    joinMethodLabel: "Discord invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://bun.sh/discord",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "prisma-slack",
    name: "Prisma Slack",
    platform: "slack",
    categorySlug: "programming",
    tags: ["Prisma", "Database", "ORM", "Slack"],
    shortDescription:
      "Prisma Slack 社区，适合 ORM、数据库 schema、迁移和 TypeScript 后端问题。",
    englishShortDescription:
      "Prisma's Slack community for ORM, database schema, migrations, and TypeScript backend questions.",
    description:
      "Prisma 用户可通过官方 Slack 入口交流 schema 设计、查询、迁移和部署问题。",
    englishDescription:
      "Prisma users can discuss schema design, queries, migrations, and deployment through the official Slack entry point.",
    suitableFor: "后端工程师、TypeScript 开发者、Prisma 用户",
    englishSuitableFor: "Backend engineers, TypeScript developers, and Prisma users",
    rulesSummary: "提问时提供 schema、数据库类型和最小复现代码。",
    englishRulesSummary:
      "Include schema, database type, and minimal reproduction code when asking questions.",
    joinMethodLabel: "Slack invite",
    joinMethodType: "invite_link",
    joinMethodValue: "https://slack.prisma.io/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "expo-discord",
    name: "Expo Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Expo", "React Native", "Mobile", "Discord"],
    shortDescription:
      "Expo Discord 社区，适合 React Native、Expo SDK、EAS 和移动应用构建。",
    englishShortDescription:
      "Expo's Discord community for React Native, Expo SDK, EAS, and mobile app development.",
    description:
      "适合移动开发者讨论 Expo 项目配置、构建、提交、路由和原生模块问题。",
    englishDescription:
      "Useful for mobile developers discussing Expo project setup, builds, submissions, routing, and native modules.",
    suitableFor: "React Native 开发者、移动工程师、Expo 用户",
    englishSuitableFor:
      "React Native developers, mobile engineers, and Expo users",
    rulesSummary: "提问时说明 SDK 版本、平台和最小复现。",
    englishRulesSummary:
      "Include SDK version, platform, and minimal reproduction when asking.",
    joinMethodLabel: "Official chat",
    joinMethodType: "invite_link",
    joinMethodValue: "https://chat.expo.dev/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "stripe-developer-discord",
    name: "Stripe Developer Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Stripe", "Payments", "Developers", "Discord"],
    shortDescription:
      "Stripe Developer Discord，适合支付集成、Webhook、Checkout 和 Billing 问题。",
    englishShortDescription:
      "Stripe Developer Discord for payment integrations, webhooks, Checkout, and Billing questions.",
    description:
      "开发者可通过 Stripe 支持入口了解开发者 Discord 和支付集成支持方式。",
    englishDescription:
      "Developers can use Stripe's support entry point to find the developer Discord and payment integration support paths.",
    suitableFor: "支付集成工程师、SaaS 开发者、Stripe 用户",
    englishSuitableFor:
      "Payment integration engineers, SaaS developers, and Stripe users",
    rulesSummary: "不要公开 API key、支付数据、客户隐私或可识别交易信息。",
    englishRulesSummary:
      "Do not post API keys, payment data, customer privacy, or identifiable transaction details.",
    joinMethodLabel: "Official support article",
    joinMethodType: "invite_link",
    joinMethodValue:
      "https://support.stripe.com/questions/join-the-stripe-developer-discord",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "sentry-discord",
    name: "Sentry Discord",
    platform: "discord",
    categorySlug: "programming",
    tags: ["Sentry", "Observability", "Errors", "Discord"],
    shortDescription:
      "Sentry Discord 社区，适合错误监控、性能追踪和 SDK 集成问题。",
    englishShortDescription:
      "Sentry's Discord community for error monitoring, performance tracing, and SDK integration questions.",
    description:
      "适合开发团队交流 Sentry SDK、issue triage、release health 和可观测性实践。",
    englishDescription:
      "Useful for engineering teams discussing Sentry SDKs, issue triage, release health, and observability practice.",
    suitableFor: "前后端工程师、SRE、可观测性团队",
    englishSuitableFor:
      "Frontend and backend engineers, SREs, and observability teams",
    rulesSummary: "不要公开 DSN 之外的敏感配置、用户数据或生产错误细节。",
    englishRulesSummary:
      "Do not disclose sensitive configuration beyond DSNs, user data, or production error details.",
    joinMethodLabel: "Community page",
    joinMethodType: "invite_link",
    joinMethodValue: "https://sentry.io/community/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "figma-community",
    name: "Figma Community",
    platform: "other",
    categorySlug: "programming",
    tags: ["Figma", "Design", "Plugins", "Community"],
    shortDescription:
      "Figma Community 适合发现设计文件、插件、组件资源和设计系统案例。",
    englishShortDescription:
      "Figma Community is for discovering design files, plugins, component resources, and design system examples.",
    description:
      "设计师和开发者可以发布、复用和讨论 Figma 社区资源。",
    englishDescription:
      "Designers and developers can publish, reuse, and discuss Figma community resources.",
    suitableFor: "设计师、设计工程师、前端团队、插件作者",
    englishSuitableFor:
      "Designers, design engineers, frontend teams, and plugin authors",
    rulesSummary: "尊重资源许可和原创作者，不要复制受限商业素材。",
    englishRulesSummary:
      "Respect resource licenses and creators; do not copy restricted commercial assets.",
    joinMethodLabel: "Community hub",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.figma.com/community",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "webflow-forum",
    name: "Webflow Forum",
    platform: "other",
    categorySlug: "programming",
    tags: ["Webflow", "No-code", "Frontend", "Forum"],
    shortDescription:
      "Webflow Forum 面向 Webflow 设计师、开发者和站点建设者交流问题。",
    englishShortDescription:
      "Webflow Forum is for Webflow designers, developers, and site builders discussing issues.",
    description:
      "适合讨论 Webflow 站点结构、CMS、交互、性能和客户项目实践。",
    englishDescription:
      "Useful for discussing Webflow site structure, CMS, interactions, performance, and client project practice.",
    suitableFor: "Webflow 设计师、独立站建设者、no-code makers",
    englishSuitableFor:
      "Webflow designers, online site builders, and no-code makers",
    rulesSummary: "适合具体项目问题和经验分享，避免纯广告帖。",
    englishRulesSummary:
      "Best for concrete project questions and experience sharing; avoid pure advertising posts.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://discourse.webflow.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "airtable-community",
    name: "Airtable Community",
    platform: "other",
    categorySlug: "programming",
    tags: ["Airtable", "No-code", "Automation", "Database"],
    shortDescription:
      "Airtable Community 适合数据库、自动化、接口和运营系统搭建交流。",
    englishShortDescription:
      "Airtable Community is for database, automation, interface, and operations-system building discussion.",
    description:
      "适合 no-code builders、运营团队和自动化实践者讨论 Airtable 用法。",
    englishDescription:
      "Useful for no-code builders, operations teams, and automation practitioners discussing Airtable usage.",
    suitableFor: "no-code builders、运营团队、自动化工程师",
    englishSuitableFor:
      "No-code builders, operations teams, and automation engineers",
    rulesSummary: "分享示例时注意隐藏表格、客户和业务敏感数据。",
    englishRulesSummary:
      "Hide table, customer, and business-sensitive data when sharing examples.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://community.airtable.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "notion-community",
    name: "Notion Community",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Notion", "Productivity", "Templates", "Community"],
    shortDescription:
      "Notion Community 连接 Notion 用户、模板作者、顾问和工作流实践者。",
    englishShortDescription:
      "Notion Community connects Notion users, template makers, consultants, and workflow practitioners.",
    description:
      "适合一人公司搭建知识库、CRM、项目管理和自动化工作流时寻找资源与同行。",
    englishDescription:
      "Useful for one-person companies building knowledge bases, CRMs, project management, and automated workflows.",
    suitableFor: "一人公司、模板作者、生产力工具实践者",
    englishSuitableFor:
      "One-person companies, template makers, and productivity-tool practitioners",
    rulesSummary: "分享模板和资源时注意版权、隐私和商业授权。",
    englishRulesSummary:
      "Respect copyright, privacy, and commercial licensing when sharing templates and resources.",
    joinMethodLabel: "Official community page",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.notion.com/community",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "obsidian-forum",
    name: "Obsidian Forum",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Obsidian", "PKM", "Productivity", "Forum"],
    shortDescription:
      "Obsidian Forum 适合个人知识管理、插件、工作流和本地笔记系统交流。",
    englishShortDescription:
      "Obsidian Forum is for personal knowledge management, plugins, workflows, and local note systems.",
    description:
      "适合一人公司和知识工作者构建长期知识库、写作系统和自动化笔记流。",
    englishDescription:
      "Useful for one-person companies and knowledge workers building long-term knowledge bases, writing systems, and automated note workflows.",
    suitableFor: "知识工作者、一人公司、PKM 实践者、插件作者",
    englishSuitableFor:
      "Knowledge workers, one-person companies, PKM practitioners, and plugin authors",
    rulesSummary: "适合工作流和插件交流，避免发布隐私笔记内容。",
    englishRulesSummary:
      "Best for workflow and plugin discussion; avoid posting private note content.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.obsidian.md/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "bubble-forum",
    name: "Bubble Forum",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Bubble", "No-code", "SaaS", "Forum"],
    shortDescription:
      "Bubble Forum 适合 no-code SaaS、MVP、插件和 Web app 构建问题交流。",
    englishShortDescription:
      "Bubble Forum is for no-code SaaS, MVPs, plugins, and web app building questions.",
    description:
      "适合一人公司和非技术创始人用 Bubble 搭建产品、验证需求和解决项目卡点。",
    englishDescription:
      "Useful for one-person companies and nontechnical founders building products, validating demand, and solving Bubble project blockers.",
    suitableFor: "no-code makers、非技术创始人、一人公司实践者",
    englishSuitableFor:
      "No-code makers, nontechnical founders, and one-person company builders",
    rulesSummary: "提问时提供 workflow、数据结构和最小复现说明。",
    englishRulesSummary:
      "Include workflow, data structure, and minimal reproduction details when asking.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.bubble.io/",
    joinPolicy: "open",
    price: "free",
    activityLevel: "high"
  },
  {
    slug: "framer-community",
    name: "Framer Community",
    platform: "other",
    categorySlug: "one-person-company",
    tags: ["Framer", "No-code", "Websites", "Design"],
    shortDescription:
      "Framer Community 适合网站搭建、组件、模板和设计转开发工作流交流。",
    englishShortDescription:
      "Framer Community is for website building, components, templates, and design-to-development workflows.",
    description:
      "适合一人公司快速搭建营销站、作品集、落地页并学习 Framer 实践。",
    englishDescription:
      "Useful for one-person companies quickly building marketing sites, portfolios, landing pages, and learning Framer practice.",
    suitableFor: "一人公司、设计师、独立开发者、营销站 builders",
    englishSuitableFor:
      "One-person companies, designers, indie developers, and marketing-site builders",
    rulesSummary: "适合作品反馈和工具交流，模板分享需尊重授权。",
    englishRulesSummary:
      "Good for work feedback and tool discussion; respect template licensing when sharing.",
    joinMethodLabel: "Community hub",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.framer.community/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "square-seller-community",
    name: "Square Seller Community",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Square", "Sellers", "Retail", "Ecommerce"],
    shortDescription:
      "Square Seller Community 面向商家讨论收款、零售、餐饮和线上销售问题。",
    englishShortDescription:
      "Square Seller Community helps merchants discuss payments, retail, restaurants, and online selling.",
    description:
      "适合出海小商家、电商和本地服务经营者交流 Square 工具与运营经验。",
    englishDescription:
      "Useful for global small merchants, ecommerce operators, and local service businesses discussing Square tools and operations.",
    suitableFor: "海外小商家、DTC 运营、本地服务和零售经营者",
    englishSuitableFor:
      "Overseas small merchants, DTC operators, and retail or local service businesses",
    rulesSummary: "不要公开支付、客户、订单或账号敏感信息。",
    englishRulesSummary:
      "Do not disclose payment, customer, order, or account-sensitive information.",
    joinMethodLabel: "Seller community",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.sellercommunity.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "squarespace-forum",
    name: "Squarespace Forum",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Squarespace", "Website", "Ecommerce", "Forum"],
    shortDescription:
      "Squarespace Forum 适合网站、模板、店铺和创作者业务运营问题交流。",
    englishShortDescription:
      "Squarespace Forum is for websites, templates, shops, and creator business operations questions.",
    description:
      "适合海外小企业、创作者和服务商交流 Squarespace 网站和电商功能。",
    englishDescription:
      "Useful for overseas small businesses, creators, and service providers discussing Squarespace websites and ecommerce features.",
    suitableFor: "海外小企业、创作者、独立站运营者",
    englishSuitableFor:
      "Overseas small businesses, creators, and online store operators",
    rulesSummary: "分享站点问题时注意隐藏客户、订单和后台信息。",
    englishRulesSummary:
      "Hide customer, order, and admin details when sharing site issues.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.squarespace.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "wix-studio-community",
    name: "Wix Studio Community Forum",
    platform: "other",
    categorySlug: "overseas",
    tags: ["Wix Studio", "Websites", "Agencies", "Forum"],
    shortDescription:
      "Wix Studio Community Forum 面向网站建设者、代理商和创意业务团队。",
    englishShortDescription:
      "Wix Studio Community Forum serves website builders, agencies, and creative business teams.",
    description:
      "适合出海服务商和独立站建设者讨论 Wix Studio、客户站点和网页交付问题。",
    englishDescription:
      "Useful for overseas service providers and website builders discussing Wix Studio, client sites, and web delivery.",
    suitableFor: "网站建设者、出海服务商、创意代理商",
    englishSuitableFor:
      "Website builders, overseas service providers, and creative agencies",
    rulesSummary: "适合项目问题和经验分享，避免公开客户敏感资料。",
    englishRulesSummary:
      "Use it for project questions and experience sharing; avoid exposing client-sensitive data.",
    joinMethodLabel: "Community forum",
    joinMethodType: "invite_link",
    joinMethodValue: "https://forum.wixstudio.com/",
    joinPolicy: "open",
    price: "free"
  },
  {
    slug: "reddit-investing",
    name: "r/investing",
    platform: "other",
    categorySlug: "investment",
    tags: ["Investing", "Reddit", "Stocks", "Portfolio"],
    shortDescription:
      "r/investing 是公开投资讨论社区，覆盖长期投资、市场和组合话题。",
    englishShortDescription:
      "r/investing is a public investing community covering long-term investing, markets, and portfolio topics.",
    description:
      "适合观察普通投资者对市场、基金、股票和资产配置的讨论。",
    englishDescription:
      "Useful for observing retail investor discussion around markets, funds, stocks, and asset allocation.",
    suitableFor: "长期投资者、个人财务学习者、市场观察者",
    englishSuitableFor:
      "Long-term investors, personal finance learners, and market observers",
    rulesSummary: "社区内容不构成投资建议，注意识别风险和利益冲突。",
    englishRulesSummary:
      "Community content is not investment advice; watch for risk and conflicts of interest.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/investing/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  },
  {
    slug: "reddit-personal-finance",
    name: "r/personalfinance",
    platform: "other",
    categorySlug: "investment",
    tags: ["Personal Finance", "Budgeting", "Investing", "Reddit"],
    shortDescription:
      "r/personalfinance 是个人财务、预算、储蓄、债务和投资基础讨论社区。",
    englishShortDescription:
      "r/personalfinance is a community for personal finance, budgeting, saving, debt, and investing basics.",
    description:
      "适合学习美国语境下的个人财务决策、应急基金、退休账户和基础投资。",
    englishDescription:
      "Useful for learning U.S.-context personal finance decisions, emergency funds, retirement accounts, and investing basics.",
    suitableFor: "个人财务学习者、长期投资初学者、预算管理者",
    englishSuitableFor:
      "Personal finance learners, beginner long-term investors, and budget planners",
    rulesSummary: "财务建议需要结合个人情况，社区内容不能替代专业意见。",
    englishRulesSummary:
      "Financial guidance depends on personal context and community content does not replace professional advice.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/personalfinance/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  },
  {
    slug: "reddit-stocks",
    name: "r/stocks",
    platform: "other",
    categorySlug: "investment",
    tags: ["Stocks", "Equity", "Reddit", "Markets"],
    shortDescription:
      "r/stocks 是股票市场、公司研究和交易观点的公开讨论社区。",
    englishShortDescription:
      "r/stocks is a public discussion community for equity markets, company research, and trading views.",
    description:
      "适合观察股票投资者对公司基本面、新闻和市场走势的讨论。",
    englishDescription:
      "Useful for observing stock investors discussing company fundamentals, news, and market moves.",
    suitableFor: "股票投资者、市场观察者、公司研究学习者",
    englishSuitableFor:
      "Stock investors, market observers, and company research learners",
    rulesSummary: "个股讨论不构成投资建议，注意高波动和信息来源质量。",
    englishRulesSummary:
      "Stock discussion is not investment advice; watch volatility and source quality.",
    joinMethodLabel: "Public subreddit",
    joinMethodType: "invite_link",
    joinMethodValue: "https://www.reddit.com/r/stocks/",
    joinPolicy: "open",
    price: "free",
    ownerVerified: false,
    activityLevel: "high"
  }
];

const additionalSampleGroups = additionalCommunitySeeds.map(makeAdditionalGroup);

type EnglishGroupContent = NonNullable<LocalizedGroupContent["en"]>;

const englishContentBySlug: Record<string, EnglishGroupContent> = {
  "openai-developer-community": {
    shortDescription:
      "OpenAI's official developer forum for API, model, agent, and product integration questions.",
    suitableAudience: "AI app developers, product engineers, and API teams",
    suitableFor: "AI app developers, product engineers, and API teams",
    rulesSummary:
      "Use it for developer questions and avoid sharing secrets, account issues, or unrelated promotion."
  },
  "langchain-community-slack": {
    shortDescription:
      "LangChain's official community Slack for developers building AI agents and LLM applications.",
    suitableAudience: "AI engineers, agent developers, and LLM app builders",
    suitableFor: "AI engineers, agent developers, and LLM app builders",
    rulesSummary:
      "Follow the community code of conduct and avoid unrelated recruiting or spam."
  },
  "hugging-face-discord": {
    shortDescription:
      "Hugging Face's official Discord for machine learning, open models, and practical AI work.",
    suitableAudience:
      "ML engineers, AI researchers, application developers, and open model users",
    suitableFor:
      "ML engineers, AI researchers, application developers, and open model users",
    rulesSummary:
      "Join through the Hugging Face verification flow and follow the community rules."
  },
  "n8n-community-forum": {
    shortDescription:
      "n8n's official community forum for automation workflows, AI agents, and integrations.",
    suitableAudience:
      "Automation developers, AI workflow builders, and operations engineers",
    suitableFor:
      "Automation developers, AI workflow builders, and operations engineers",
    rulesSummary:
      "Provide workflow context when asking questions and do not expose credentials or sensitive business data."
  },
  "supabase-discord": {
    shortDescription:
      "Supabase's official Discord for Postgres, auth, storage, edge functions, and app development.",
    suitableAudience:
      "Web developers, backend engineers, and Postgres/Supabase users",
    suitableFor:
      "Web developers, backend engineers, and Postgres/Supabase users",
    rulesSummary:
      "Use it for public technical discussion and community support; never post project secrets."
  },
  "cloudflare-developers-discord": {
    shortDescription:
      "Cloudflare Developers' official Discord for Workers, Pages, AI, and edge development.",
    suitableAudience:
      "Frontend and backend developers, edge developers, and Cloudflare Workers users",
    suitableFor:
      "Frontend and backend developers, edge developers, and Cloudflare Workers users",
    rulesSummary:
      "Follow the official community rules and include context when asking technical questions."
  },
  "nextjs-discord": {
    shortDescription:
      "A Next.js community entry point for React, App Router, and full-stack web development discussions.",
    suitableAudience:
      "React and Next.js developers, full-stack web engineers, and frontend teams",
    suitableFor:
      "React and Next.js developers, full-stack web engineers, and frontend teams",
    rulesSummary:
      "Technical support questions should include reproducible context and follow Next.js community norms."
  },
  "reactiflux-discord": {
    shortDescription:
      "A large React and JavaScript Discord for React, React Native, Redux, GraphQL, and related topics.",
    suitableAudience:
      "React developers, frontend engineers, and React Native or GraphQL users",
    suitableFor:
      "React developers, frontend engineers, and React Native or GraphQL users",
    rulesSummary:
      "Keep discussions technical and follow the community's Discord rules."
  },
  "github-community": {
    shortDescription:
      "GitHub's official community hub for open source collaboration, product feedback, and developer questions.",
    suitableAudience:
      "Open source maintainers, GitHub users, and developer tool teams",
    suitableFor:
      "Open source maintainers, GitHub users, and developer tool teams",
    rulesSummary:
      "Use it for public GitHub and open source discussion; do not post sensitive repository information."
  },
  "kubernetes-slack": {
    shortDescription:
      "Kubernetes' official Slack for cloud native users, SIGs, working groups, and contributors.",
    suitableAudience:
      "Cloud native engineers, Kubernetes users, and CNCF contributors",
    suitableFor:
      "Cloud native engineers, Kubernetes users, and CNCF contributors",
    rulesSummary:
      "Use the right channel for each topic and follow the Kubernetes Code of Conduct."
  },
  "shopify-community": {
    shortDescription:
      "Shopify's official community forum for cross-border ecommerce, online stores, merchants, and partners.",
    suitableAudience:
      "Cross-border ecommerce sellers, Shopify merchants, store developers, and DTC teams",
    suitableFor:
      "Cross-border ecommerce sellers, Shopify merchants, store developers, and DTC teams",
    rulesSummary:
      "Use it for public business and technical discussion; avoid sharing sensitive store admin information."
  },
  "mds-ecommerce-community": {
    shortDescription:
      "A vetted ecommerce founder community for seven- to nine-figure brands across Amazon, DTC, and TikTok Shop.",
    suitableAudience:
      "Established ecommerce founders and DTC, Amazon, or TikTok Shop operators",
    suitableFor:
      "Established ecommerce founders and DTC, Amazon, or TikTok Shop operators",
    rulesSummary:
      "Applicants should meet the community threshold and go through review before joining."
  },
  "underdog-ecom-slack": {
    shortDescription:
      "A Slack community for scrappy ecommerce founders and operators building lean brands.",
    suitableAudience:
      "Cross-border ecommerce founders, DTC operators, and lean brand teams",
    suitableFor:
      "Cross-border ecommerce founders, DTC operators, and lean brand teams",
    rulesSummary:
      "The community focuses on real ecommerce operations and requires an application before Slack access."
  },
  "everything-marketplaces": {
    shortDescription:
      "A community for marketplace founders and operators building platform businesses for global markets.",
    suitableAudience:
      "Marketplace founders, platform business leads, and overseas operations teams",
    suitableFor:
      "Marketplace founders, platform business leads, and overseas operations teams",
    rulesSummary:
      "Best suited to marketplace founders and operators looking for high-signal peer exchange."
  },
  "opc-community": {
    shortDescription:
      "A public community and member network for AI-era one-person companies and solo founders.",
    suitableAudience:
      "One-person company founders, solo founders, AI builders, and indie hackers",
    suitableFor:
      "One-person company founders, solo founders, AI builders, and indie hackers",
    rulesSummary:
      "The community emphasizes high-trust, high-signal connections for serious one-person company builders."
  },
  "small-bets": {
    shortDescription:
      "A paid community for solopreneurs and small internet business builders.",
    suitableAudience:
      "One-person company founders, solopreneurs, and independent internet entrepreneurs",
    suitableFor:
      "One-person company founders, solopreneurs, and independent internet entrepreneurs",
    rulesSummary:
      "This is a paid community for people seriously running small business experiments."
  },
  "productize-yourself": {
    shortDescription:
      "A course and community around productized services and one-person businesses.",
    suitableAudience:
      "Consultants, B2B service providers, and solo founders productizing their expertise",
    suitableFor:
      "Consultants, B2B service providers, and solo founders productizing their expertise",
    rulesSummary:
      "Best for discussion around productized services, B2B offers, and one-person business systems."
  },
  "microconf-connect": {
    shortDescription:
      "A vetted private community for bootstrapped SaaS founders.",
    suitableAudience:
      "Bootstrapped SaaS founders, indie developers, and small software teams",
    suitableFor:
      "Bootstrapped SaaS founders, indie developers, and small software teams",
    rulesSummary:
      "Requires an application and emphasizes no-pitch, high-quality founder support."
  },
  "micro-saas-hq-community": {
    shortDescription:
      "A Micro SaaS community for SaaS founders, builders, and solopreneurs.",
    suitableAudience: "Micro SaaS founders, indie developers, and solopreneurs",
    suitableFor: "Micro SaaS founders, indie developers, and solopreneurs",
    rulesSummary:
      "Focused on product feedback, launch support, and SaaS growth discussions."
  },
  "bogleheads-forum": {
    shortDescription:
      "A long-running forum for low-cost index investing, asset allocation, and personal finance.",
    suitableAudience:
      "Long-term investors, index fund investors, and personal finance learners",
    suitableFor:
      "Long-term investors, index fund investors, and personal finance learners",
    rulesSummary:
      "Discussion centers on long-term, low-cost, diversified investing rather than short-term stock promotion."
  },
  "value-investors-club": {
    shortDescription:
      "A selective community where value investors exchange well-researched investment ideas.",
    suitableAudience:
      "Value investors, equity researchers, and professional investors",
    suitableFor:
      "Value investors, equity researchers, and professional investors",
    rulesSummary:
      "Membership and discussion require high-quality investment research, not generic stock promotion."
  },
  "tradingview-community": {
    shortDescription:
      "TradingView's social network for market analysis, scripts, trading ideas, and peer discussion.",
    suitableAudience:
      "Traders, investors, Pine Script users, and market analysis enthusiasts",
    suitableFor:
      "Traders, investors, Pine Script users, and market analysis enthusiasts",
    rulesSummary:
      "Investing involves risk; community posts are not investment advice and must follow the platform rules."
  }
};

export const sampleGroups: Group[] = [
  ...rawSampleGroups,
  ...additionalSampleGroups
].map((group) => ({
  ...group,
  localizedContent: {
    ...group.localizedContent,
    en: {
      ...englishContentBySlug[group.slug],
      ...group.localizedContent?.en
    }
  }
}));
