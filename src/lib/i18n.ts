export type Locale = "zh" | "en";

type Dictionary = {
  appName: string;
  subtitle: string;
  nav: {
    browse: string;
    submit: string;
    myGroups: string;
    languageLabel: string;
    chinese: string;
    english: string;
  };
  home: {
    title: string;
    intro: string;
    approvedCount: string;
    categoriesTitle: string;
    allCategories: string;
    resultsTitle: string;
    emptyTitle: string;
    emptyDescription: string;
  };
  category: {
    titlePrefix: string;
    intro: string;
    emptyTitle: string;
    backHome: string;
  };
  detail: {
    backToBrowse: string;
    about: string;
    joinMethods: string;
    rules: string;
    publicDetails: string;
    suitableFor: string;
    freshness: string;
    ownerStatus: string;
    trustSignals: string;
    noJoinMethods: string;
    claimTitle: string;
    claimIntro: string;
    claimEvidence: string;
    claimButton: string;
    reportTitle: string;
    reportIntro: string;
    reportType: string;
    reportMessage: string;
    reportButton: string;
    reportSent: string;
    claimSent: string;
    notFoundTitle: string;
    notFoundDescription: string;
  };
  submit: {
    title: string;
    intro: string;
    name: string;
    platform: string;
    category: string;
    shortDescription: string;
    description: string;
    joinMethodType: string;
    joinMethodValue: string;
    language: string;
    region: string;
    rulesSummary: string;
    button: string;
    validationError: string;
    submitError: string;
  };
  myGroups: {
    title: string;
    intro: string;
    submitted: string;
    owned: string;
    pending: string;
    needsUpdate: string;
    emptyTitle: string;
    emptyDescription: string;
    submittedSuccess: string;
  };
  search: {
    label: string;
    placeholder: string;
    button: string;
  };
  card: {
    activity: string;
    freshness: string;
    regionLanguage: string;
    viewDetails: string;
  };
  fields: {
    platform: string;
    category: string;
    language: string;
    region: string;
    joinPolicy: string;
    price: string;
    lastVerified: string;
  };
  activityLevels: Record<"low" | "medium" | "high" | "unknown", string>;
  joinPolicies: Record<
    "open" | "approval_required" | "admin_contact" | "invite_only",
    string
  >;
  prices: Record<"free" | "paid" | "unknown", string>;
  ownerStatuses: {
    verified: string;
    unverified: string;
  };
  trustSignals: Record<
    | "recently_verified"
    | "owner_maintained"
    | "join_method_fresh"
    | "needs_update"
    | "under_review"
    | "suspended",
    string
  >;
  joinMethodTypes: Record<
    | "qr_code"
    | "invite_link"
    | "group_number"
    | "admin_contact"
    | "application_form"
    | "manual_notes",
    string
  >;
};

const dictionaries: Record<Locale, Dictionary> = {
  zh: {
    appName: "趣群岛 Circlist",
    subtitle: "发现真实活跃的兴趣群",
    nav: {
      browse: "浏览群组",
      submit: "提交群组",
      myGroups: "我的群组",
      languageLabel: "语言",
      chinese: "中文",
      english: "English"
    },
    home: {
      title: "发现真实活跃的兴趣群",
      intro:
        "从 AI、出海、编程、投资和独立开发开始，按平台、主题和新鲜度快速筛选适合自己的社群。",
      approvedCount: "个已审核群组",
      categoriesTitle: "按主题浏览",
      allCategories: "全部",
      resultsTitle: "推荐群组",
      emptyTitle: "没有找到匹配的群组",
      emptyDescription: "换个关键词或主题试试。"
    },
    category: {
      titlePrefix: "主题",
      intro: "以下群组已通过公开展示审核，并按当前主题筛选。",
      emptyTitle: "这个主题暂时没有已审核群组",
      backHome: "返回全部群组"
    },
    detail: {
      backToBrowse: "返回浏览",
      about: "群组简介",
      joinMethods: "加入方式",
      rules: "群规摘要",
      publicDetails: "公开信息",
      suitableFor: "适合人群",
      freshness: "新鲜度",
      ownerStatus: "群主状态",
      trustSignals: "可信信号",
      noJoinMethods: "暂无可公开展示的已审核加入方式。",
      claimTitle: "认领这个群组",
      claimIntro: "如果你是群主或管理员，可以提交证明，审核后会开放维护权限。",
      claimEvidence: "认领证明",
      claimButton: "提交认领",
      reportTitle: "反馈问题",
      reportIntro: "加入方式失效、信息过期或发现风险时，可以提交给审核队列。",
      reportType: "问题类型",
      reportMessage: "补充说明",
      reportButton: "提交反馈",
      reportSent: "反馈已提交，等待审核。",
      claimSent: "认领申请已提交，等待审核。",
      notFoundTitle: "没有找到这个群组",
      notFoundDescription: "它可能尚未通过审核，或链接已经失效。"
    },
    submit: {
      title: "提交新的兴趣群",
      intro: "提交后会进入人工审核队列。审核通过前不会公开展示。",
      name: "群组名称",
      platform: "平台",
      category: "主题",
      shortDescription: "一句话简介",
      description: "详细介绍",
      joinMethodType: "加入方式类型",
      joinMethodValue: "加入方式内容",
      language: "语言",
      region: "地区",
      rulesSummary: "群规摘要",
      button: "提交审核",
      validationError: "请补全必填项后再提交。",
      submitError: "提交失败，请稍后重试。"
    },
    myGroups: {
      title: "我的群组",
      intro: "查看你提交、认领和需要更新的群组状态。实时列表会在后续版本接入。",
      submitted: "已提交",
      owned: "已认领",
      pending: "审核中",
      needsUpdate: "需要更新",
      emptyTitle: "暂时没有可展示的群组记录",
      emptyDescription: "你提交或认领的群组会出现在这里。",
      submittedSuccess: "群组已提交，当前状态为审核中。"
    },
    search: {
      label: "搜索兴趣群",
      placeholder: "搜索 AI、出海、独立开发...",
      button: "搜索"
    },
    card: {
      activity: "活跃度",
      freshness: "可信度",
      regionLanguage: "地区 / 语言",
      viewDetails: "查看详情"
    },
    fields: {
      platform: "平台",
      category: "主题",
      language: "语言",
      region: "地区",
      joinPolicy: "加入规则",
      price: "费用",
      lastVerified: "最近核验"
    },
    activityLevels: {
      low: "低",
      medium: "中",
      high: "高",
      unknown: "未知"
    },
    joinPolicies: {
      open: "开放加入",
      approval_required: "需要审核",
      admin_contact: "联系管理员",
      invite_only: "仅邀请"
    },
    prices: {
      free: "免费",
      paid: "付费",
      unknown: "未知"
    },
    ownerStatuses: {
      verified: "群主已核验",
      unverified: "群主未核验"
    },
    trustSignals: {
      recently_verified: "近期已核验",
      owner_maintained: "群主维护",
      join_method_fresh: "加入方式有效",
      needs_update: "需要更新",
      under_review: "审核中",
      suspended: "已暂停"
    },
    joinMethodTypes: {
      qr_code: "二维码",
      invite_link: "邀请链接",
      group_number: "群号",
      admin_contact: "管理员联系",
      application_form: "申请表",
      manual_notes: "文字说明"
    }
  },
  en: {
    appName: "Circlist",
    subtitle: "Discover communities by interest",
    nav: {
      browse: "Browse groups",
      submit: "Submit group",
      myGroups: "My groups",
      languageLabel: "Language",
      chinese: "中文",
      english: "English"
    },
    home: {
      title: "Discover real, active communities",
      intro:
        "Start with AI, overseas business, programming, investing, and indie development groups. Filter by platform, topic, and freshness.",
      approvedCount: "approved groups",
      categoriesTitle: "Browse by topic",
      allCategories: "All",
      resultsTitle: "Recommended groups",
      emptyTitle: "No matching groups found",
      emptyDescription: "Try another keyword or topic."
    },
    category: {
      titlePrefix: "Category",
      intro: "These approved public groups are filtered by the selected topic.",
      emptyTitle: "No approved groups in this category yet",
      backHome: "Back to all groups"
    },
    detail: {
      backToBrowse: "Back to browse",
      about: "About this group",
      joinMethods: "Join methods",
      rules: "Rules summary",
      publicDetails: "Public details",
      suitableFor: "Suitable for",
      freshness: "Freshness",
      ownerStatus: "Owner status",
      trustSignals: "Trust signals",
      noJoinMethods: "No approved public join methods are available yet.",
      claimTitle: "Claim this group",
      claimIntro:
        "If you are the owner or admin, submit evidence for moderator review.",
      claimEvidence: "Claim evidence",
      claimButton: "Submit claim",
      reportTitle: "Report an issue",
      reportIntro:
        "Send expired join methods, outdated details, or safety concerns to review.",
      reportType: "Issue type",
      reportMessage: "Message",
      reportButton: "Submit report",
      reportSent: "Report submitted for review.",
      claimSent: "Claim submitted for review.",
      notFoundTitle: "Group not found",
      notFoundDescription:
        "It may not be approved for public listing, or the link may be outdated."
    },
    submit: {
      title: "Submit a community",
      intro:
        "Submissions go to manual review and stay private until approved.",
      name: "Group name",
      platform: "Platform",
      category: "Category",
      shortDescription: "Short description",
      description: "Description",
      joinMethodType: "Join method type",
      joinMethodValue: "Join method value",
      language: "Language",
      region: "Region",
      rulesSummary: "Rules summary",
      button: "Submit for review",
      validationError: "Please complete the required fields before submitting.",
      submitError: "Submission failed. Please try again later."
    },
    myGroups: {
      title: "My groups",
      intro:
        "Track submitted, claimed, pending, and needs-update groups. Live lists can be connected later.",
      submitted: "Submitted",
      owned: "Owned",
      pending: "Pending",
      needsUpdate: "Needs update",
      emptyTitle: "No group records yet",
      emptyDescription: "Groups you submit or claim will appear here.",
      submittedSuccess: "Group submitted and pending review."
    },
    search: {
      label: "Search groups",
      placeholder: "Search AI, overseas, indie dev...",
      button: "Search"
    },
    card: {
      activity: "Activity",
      freshness: "Trust",
      regionLanguage: "Region / language",
      viewDetails: "View details"
    },
    fields: {
      platform: "Platform",
      category: "Category",
      language: "Language",
      region: "Region",
      joinPolicy: "Join policy",
      price: "Price",
      lastVerified: "Last verified"
    },
    activityLevels: {
      low: "Low",
      medium: "Medium",
      high: "High",
      unknown: "Unknown"
    },
    joinPolicies: {
      open: "Open",
      approval_required: "Approval required",
      admin_contact: "Contact admin",
      invite_only: "Invite only"
    },
    prices: {
      free: "Free",
      paid: "Paid",
      unknown: "Unknown"
    },
    ownerStatuses: {
      verified: "Owner verified",
      unverified: "Owner not verified"
    },
    trustSignals: {
      recently_verified: "Recently verified",
      owner_maintained: "Owner maintained",
      join_method_fresh: "Fresh join method",
      needs_update: "Needs update",
      under_review: "Under review",
      suspended: "Suspended"
    },
    joinMethodTypes: {
      qr_code: "QR code",
      invite_link: "Invite link",
      group_number: "Group number",
      admin_contact: "Admin contact",
      application_form: "Application form",
      manual_notes: "Manual notes"
    }
  }
};

export function normalizeLocale(value: string | undefined | null): Locale {
  return value?.toLowerCase().startsWith("en") ? "en" : "zh";
}

export function getDictionary(locale: Locale = "zh"): Dictionary {
  return dictionaries[locale];
}
