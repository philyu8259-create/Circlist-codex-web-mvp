export type Locale = "zh" | "en";

type Dictionary = {
  appName: string;
  subtitle: string;
  nav: {
    browse: string;
    submit: string;
    myGroups: string;
    admin: string;
    languageLabel: string;
    chinese: string;
    english: string;
    signIn: string;
    signOut: string;
  };
  footer: {
    label: string;
    privacy: string;
    tagline: string;
    terms: string;
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
    officialStatus: string;
    officialMaintained: string;
    publicUnofficial: string;
    joinNow: string;
    externalLinkHint: string;
    reportLinkIssue: string;
    investmentRiskTitle: string;
    investmentRiskBody: string;
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
    reportValidationError: string;
    reportError: string;
    reportRateLimited: string;
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
    groupLink: string;
    groupLinkHint: string;
    qrCode: string;
    qrCodeHint: string;
    language: string;
    region: string;
    rulesSummary: string;
    basicsTitle: string;
    basicsDescription: string;
    joinTitle: string;
    joinDescription: string;
    reviewTitle: string;
    reviewDescription: string;
    checklistTitle: string;
    checklistItems: string[];
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
    resubmittedSuccess: string;
    resubmitError: string;
    resubmitValidationError: string;
    setupRequired: string;
    authRequired: string;
    submissionsTitle: string;
    claimsTitle: string;
    notes: string;
    needsActionTitle: string;
    needsActionDescription: string;
    editTitle: string;
    keepExistingQr: string;
    resubmitButton: string;
    platformLabel: string;
    categoryLabel: string;
    joinMethodLabel: string;
    joinValueLabel: string;
    groupLinkLabel: string;
    qrCodeLabel: string;
    languageLabel: string;
    regionLabel: string;
    descriptionLabel: string;
    rulesLabel: string;
  };
  admin: {
    title: string;
    intro: string;
    accessRequired: string;
    accessConfirmed: string;
    liveUnavailable: string;
    emptyQueue: string;
    pendingSubmissions: string;
    pendingClaims: string;
    pendingReports: string;
    publishedGroups: string;
    groupManagementTitle: string;
    groupManagementDescription: string;
    editGroup: string;
    groupSearchLabel: string;
    groupSearchPlaceholder: string;
    groupStatusAll: string;
    groupCategoryAll: string;
    groupPlatformAll: string;
    groupFilterButton: string;
    groupFilterClear: string;
    groupResultsSummary: (shown: number, total: number) => string;
    reportStatusFilter: string;
    reportTypeFilter: string;
    reportTypeAll: string;
    reportEditGroup: string;
    reportFreshnessNotice: string;
    reportHandled: string;
    reportFreshnessChecked: string;
    batchActionTitle: string;
    batchActionDescription: string;
    batchSetPublished: string;
    batchSetNeedsUpdate: string;
    batchSetHidden: string;
    batchSelectAll: string;
    batchSelectedSummary: string;
    batchConfirmTitle: string;
    batchConfirmDescription: string;
    batchNoSelection: string;
    batchUpdated: string;
    batchFailed: string;
    submissionsTitle: string;
    submissionsDescription: string;
    claimsTitle: string;
    claimsDescription: string;
    reportsTitle: string;
    reportsDescription: string;
    statusLabel: string;
    reviewerNotes: string;
    reviewerNotesLabel: string;
    detailsTitle: string;
    approve: string;
    reject: string;
    requestChanges: string;
    resolveReport: string;
    dismissReport: string;
    approveConfirm: string;
    rejectConfirm: string;
    requestChangesConfirm: string;
    resolveReportConfirm: string;
    dismissReportConfirm: string;
    categoryLabel: string;
    submitterLabel: string;
    claimantLabel: string;
    reporterLabel: string;
    groupLabel: string;
    reportTypeLabel: string;
    joinMethodLabel: string;
    joinValueLabel: string;
    groupLinkLabel: string;
    qrCodeLabel: string;
    languageLabel: string;
    regionLabel: string;
    descriptionLabel: string;
    rulesLabel: string;
    priorityTitle: string;
    priorityEmpty: string;
    workflowTitle: string;
    workflowItems: string[];
    auditTitle: string;
    auditEmpty: string;
    reviewed: string;
    reviewFailed: string;
  };
  auth: {
    title: string;
    intro: string;
    email: string;
    sendLink: string;
    checkEmail: string;
    error: string;
    networkError: string;
    rateLimited: string;
    required: string;
    emailChannelTitle: string;
    resendChannel: string;
    supabaseChannel: string;
  };
  search: {
    label: string;
    placeholder: string;
    button: string;
    platform: string;
    price: string;
    joinPolicy: string;
    sort: string;
    allPlatforms: string;
    allPrices: string;
    allJoinPolicies: string;
    clear: string;
    sortOptions: Record<"recent" | "activity" | "name", string>;
  };
  card: {
    activity: string;
    freshness: string;
    regionLanguage: string;
    viewDetails: string;
  };
  pagination: {
    label: string;
    previous: string;
    next: string;
    summary: (start: number, end: number, total: number) => string;
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
  reportTypes: Record<
    | "spam"
    | "scam"
    | "invalid_join_method"
    | "outdated_info"
    | "abuse"
    | "other",
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
      admin: "审核后台",
      languageLabel: "语言",
      chinese: "中文",
      english: "English",
      signIn: "登录",
      signOut: "退出"
    },
    footer: {
      label: "页脚链接",
      privacy: "隐私政策",
      tagline: "趣群岛只展示审核通过的公开群组信息。",
      terms: "使用条款"
    },
    home: {
      title: "发现真实活跃的兴趣群",
      intro:
        "从 AI、出海、编程、投资、一人公司和独立开发开始，按平台、主题和新鲜度快速筛选适合自己的社群。",
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
      officialStatus: "维护状态",
      officialMaintained: "官方或群主已核验",
      publicUnofficial: "公开社区，非官方维护",
      joinNow: "打开加入入口",
      externalLinkHint: "外部链接，请先确认社区规则和平台安全提示。",
      reportLinkIssue: "反馈链接失效或信息过期",
      investmentRiskTitle: "投资风险提示",
      investmentRiskBody:
        "社区内容仅供交流，不构成投资建议。加入投资类社区前，请自行核验信息来源、利益冲突和风险承受能力。",
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
      reportValidationError: "反馈内容不完整，请确认信息后重试。",
      reportError: "反馈提交失败，请稍后重试。",
      reportRateLimited: "反馈提交过于频繁，请稍后再试。",
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
      joinMethodValue: "补充说明",
      groupLink: "群链接 / 邀请链接",
      groupLinkHint: "适合 Telegram、Discord、Slack 或公开申请表链接。",
      qrCode: "二维码图片",
      qrCodeHint: "支持 PNG、JPG、WebP，最大 5 MB。微信群二维码过期后可重新提交更新。",
      language: "语言",
      region: "地区",
      rulesSummary: "群规摘要",
      basicsTitle: "基础信息",
      basicsDescription: "帮助用户快速判断这个群是否适合自己。",
      joinTitle: "加入方式",
      joinDescription: "至少提供一种加入入口，链接、二维码或管理员说明均可。",
      reviewTitle: "审核补充",
      reviewDescription: "这些信息会帮助审核员判断群组质量和展示方式。",
      checklistTitle: "审核会重点看",
      checklistItems: [
        "加入入口是否真实可用",
        "简介是否清楚说明群组主题",
        "是否存在明显营销、诈骗或过期信息"
      ],
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
      submittedSuccess: "群组已提交，当前状态为审核中。",
      resubmittedSuccess: "修改已重新提交，当前状态回到审核中。",
      resubmitError: "重新提交失败，请稍后重试。",
      resubmitValidationError: "请补全必填项后再重新提交。",
      setupRequired: "本地预览未配置 Supabase，暂时显示为空状态。",
      authRequired: "登录后可以查看你提交和认领的群组。",
      submissionsTitle: "我的提交",
      claimsTitle: "我的认领",
      notes: "审核备注",
      needsActionTitle: "需要修改",
      needsActionDescription:
        "审核员要求补充或修改这条提交。根据审核备注更新信息后，可以重新送审。",
      editTitle: "修改后重新提交",
      keepExistingQr: "未上传新二维码时会保留已有二维码。",
      resubmitButton: "重新提交审核",
      platformLabel: "平台",
      categoryLabel: "主题",
      joinMethodLabel: "加入方式",
      joinValueLabel: "加入说明",
      groupLinkLabel: "群链接",
      qrCodeLabel: "二维码",
      languageLabel: "语言",
      regionLabel: "地区",
      descriptionLabel: "详细介绍",
      rulesLabel: "群规摘要"
    },
    admin: {
      title: "审核队列",
      intro: "集中处理新群提交、群主认领和加入方式问题反馈。",
      accessRequired: "需要管理员账号登录后才能读取实时队列。",
      accessConfirmed: "管理员权限已确认，当前连接真实 Supabase 审核队列。",
      liveUnavailable: "实时队列暂时不可用，当前显示为空队列。",
      emptyQueue: "当前没有待处理项目。",
      pendingSubmissions: "待审核提交",
      pendingClaims: "待处理认领",
      pendingReports: "待处理反馈",
      publishedGroups: "公开群组",
      groupManagementTitle: "公开群组管理",
      groupManagementDescription: "快速进入最近更新的公开群组，修正文案、状态和加入方式。",
      editGroup: "编辑",
      groupSearchLabel: "搜索群组",
      groupSearchPlaceholder: "输入名称、slug 或简介",
      groupStatusAll: "全部状态",
      groupCategoryAll: "全部主题",
      groupPlatformAll: "全部平台",
      groupFilterButton: "筛选",
      groupFilterClear: "清除",
      groupResultsSummary: (shown, total) => `显示 ${shown} 个，共 ${total} 个匹配群组`,
      reportStatusFilter: "反馈状态",
      reportTypeFilter: "反馈类型",
      reportTypeAll: "全部类型",
      reportEditGroup: "去编辑加入方式",
      reportFreshnessNotice:
        "这类反馈通常需要先修正加入方式；保存后系统会重新检查失效提醒。",
      reportHandled: "反馈状态已更新。",
      reportFreshnessChecked: "反馈已处理，加入方式失效提醒已重新检查。",
      batchActionTitle: "批量操作",
      batchActionDescription: "勾选本页群组后，可批量恢复公开、标记需要更新或下架。",
      batchSetPublished: "设为公开",
      batchSetNeedsUpdate: "标记需要更新",
      batchSetHidden: "批量下架",
      batchSelectAll: "全选当前页",
      batchSelectedSummary: "已选择 {count} 个",
      batchConfirmTitle: "确认批量操作",
      batchConfirmDescription: "确认将 {count} 个群组执行“{action}”？",
      batchNoSelection: "请先选择至少一个群组。",
      batchUpdated: "批量状态已更新。",
      batchFailed: "批量操作失败，请先选择群组后重试。",
      submissionsTitle: "新群提交",
      submissionsDescription: "审核用户提交的新兴趣群和加入方式。",
      claimsTitle: "群主认领",
      claimsDescription: "核对认领证明，决定是否开放维护权限。",
      reportsTitle: "问题反馈",
      reportsDescription: "处理加入方式失效、过期信息和风险举报。",
      statusLabel: "状态",
      reviewerNotes: "审核备注",
      reviewerNotesLabel: "审核备注",
      detailsTitle: "查看详情",
      approve: "通过",
      reject: "拒绝",
      requestChanges: "要求修改",
      resolveReport: "已处理",
      dismissReport: "驳回反馈",
      approveConfirm: "确认通过这条提交？通过后会发布到公开列表。",
      rejectConfirm: "确认拒绝这条记录？",
      requestChangesConfirm: "确认要求提交者修改？",
      resolveReportConfirm: "确认将这条反馈标记为已处理？",
      dismissReportConfirm: "确认驳回这条反馈？",
      categoryLabel: "主题",
      submitterLabel: "提交人",
      claimantLabel: "认领人",
      reporterLabel: "反馈人",
      groupLabel: "群组",
      reportTypeLabel: "反馈类型",
      joinMethodLabel: "加入方式",
      joinValueLabel: "加入说明",
      groupLinkLabel: "群链接",
      qrCodeLabel: "二维码",
      languageLabel: "语言",
      regionLabel: "地区",
      descriptionLabel: "详细介绍",
      rulesLabel: "群规摘要",
      priorityTitle: "今日优先处理",
      priorityEmpty: "当前没有积压事项，可以继续补充样本群或检查公开列表质量。",
      workflowTitle: "审核工作流",
      workflowItems: [
        "先处理新群提交，确认主题、简介和加入入口真实可用。",
        "再处理认领请求，只给证据充分的群主开放维护权。",
        "最后处理举报和失效反馈，必要时下架或标记需要更新。"
      ],
      auditTitle: "最近操作",
      auditEmpty: "还没有后台操作记录。",
      reviewed: "审核状态已更新。",
      reviewFailed: "审核更新失败，请稍后重试。"
    },
    auth: {
      title: "登录 Circlist",
      intro: "输入邮箱后会收到登录链接。登录后可以提交群组、查看自己的提交和进入管理员后台。",
      email: "邮箱",
      sendLink: "发送登录链接",
      checkEmail: "登录链接已发送，请查看邮箱。",
      error: "登录链接发送失败，请稍后重试。",
      networkError: "连接 Supabase 超时，请检查网络后再试一次。",
      rateLimited: "登录邮件发送太频繁，请稍等一会儿再试。",
      required: "请先登录后继续。",
      emailChannelTitle: "邮件发送通道",
      resendChannel: "当前已配置正式邮件通道，登录链接会通过 Resend 发送。",
      supabaseChannel:
        "当前仍使用 Supabase 默认邮件通道，适合测试但容易触发低频率限制。配置 Resend 后会自动切换。"
    },
    search: {
      label: "搜索兴趣群",
      placeholder: "搜索 AI、出海、独立开发...",
      button: "搜索",
      platform: "平台",
      price: "价格",
      joinPolicy: "加入方式",
      sort: "排序",
      allPlatforms: "全部平台",
      allPrices: "全部价格",
      allJoinPolicies: "全部加入方式",
      clear: "清除筛选",
      sortOptions: {
        recent: "最近核验",
        activity: "活跃度优先",
        name: "名称 A-Z"
      }
    },
    card: {
      activity: "活跃度",
      freshness: "可信度",
      regionLanguage: "地区 / 语言",
      viewDetails: "查看详情"
    },
    pagination: {
      label: "分页",
      previous: "上一页",
      next: "下一页",
      summary: (start, end, total) => `显示第 ${start}-${end} 个，共 ${total} 个`
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
    },
    reportTypes: {
      invalid_join_method: "加入方式失效",
      outdated_info: "信息过期",
      spam: "垃圾内容",
      scam: "诈骗风险",
      abuse: "滥用或骚扰",
      other: "其他问题"
    }
  },
  en: {
    appName: "Circlist",
    subtitle: "Discover communities by interest",
    nav: {
      browse: "Browse groups",
      submit: "Submit group",
      myGroups: "My groups",
      admin: "Admin",
      languageLabel: "Language",
      chinese: "中文",
      english: "English",
      signIn: "Sign in",
      signOut: "Sign out"
    },
    footer: {
      label: "Footer links",
      privacy: "Privacy",
      tagline: "Circlist lists only reviewed public community information.",
      terms: "Terms"
    },
    home: {
      title: "Discover real, active communities",
      intro:
        "Start with AI, overseas business, programming, investing, one-person company, and indie development groups. Filter by platform, topic, and freshness.",
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
      officialStatus: "Maintainer status",
      officialMaintained: "Official or owner verified",
      publicUnofficial: "Public community, not owner verified",
      joinNow: "Open join page",
      externalLinkHint:
        "External link. Check the community rules and platform safety prompts before joining.",
      reportLinkIssue: "Report an expired link or outdated information",
      investmentRiskTitle: "Investment risk note",
      investmentRiskBody:
        "Community content is for discussion only and is not investment advice. Verify sources, conflicts of interest, and your own risk tolerance before joining investment communities.",
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
      reportValidationError: "The report form is incomplete. Please check your input and retry.",
      reportError: "Failed to send the report. Please try again later.",
      reportRateLimited: "Please avoid submitting the same report repeatedly. Try again in a moment.",
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
      joinMethodValue: "Additional instructions",
      groupLink: "Group link / invite link",
      groupLinkHint:
        "Useful for Telegram, Discord, Slack, or public application forms.",
      qrCode: "QR code image",
      qrCodeHint: "PNG, JPG, or WebP up to 5 MB. Expired QR codes can be updated later.",
      language: "Language",
      region: "Region",
      rulesSummary: "Rules summary",
      basicsTitle: "Basic information",
      basicsDescription:
        "Help visitors quickly decide whether this community is relevant.",
      joinTitle: "Join method",
      joinDescription:
        "Provide at least one path to join, such as a link, QR code, or admin instructions.",
      reviewTitle: "Review details",
      reviewDescription:
        "These details help moderators judge quality and decide how to list the group.",
      checklistTitle: "Review checks",
      checklistItems: [
        "The join path is real and usable",
        "The description clearly explains the community topic",
        "There is no obvious spam, scam, or outdated information"
      ],
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
      submittedSuccess: "Group submitted and pending review.",
      resubmittedSuccess: "Changes resubmitted and moved back to pending review.",
      resubmitError: "Could not resubmit changes. Please try again.",
      resubmitValidationError:
        "Please complete the required fields before resubmitting.",
      setupRequired:
        "Supabase is not configured for this local preview, so an empty state is shown.",
      authRequired: "Sign in to view groups you submitted or claimed.",
      submissionsTitle: "My submissions",
      claimsTitle: "My claims",
      notes: "Reviewer notes",
      needsActionTitle: "Needs changes",
      needsActionDescription:
        "A reviewer requested updates for this submission. Edit the details below and send it back to review.",
      editTitle: "Edit and resubmit",
      keepExistingQr: "The existing QR code is kept unless you upload a new one.",
      resubmitButton: "Resubmit for review",
      platformLabel: "Platform",
      categoryLabel: "Topic",
      joinMethodLabel: "Join method",
      joinValueLabel: "Join notes",
      groupLinkLabel: "Group link",
      qrCodeLabel: "QR code",
      languageLabel: "Language",
      regionLabel: "Region",
      descriptionLabel: "Description",
      rulesLabel: "Rules summary"
    },
    admin: {
      title: "Review queues",
      intro:
        "Review new community submissions, ownership claims, and invalid join feedback.",
      accessRequired: "Sign in with an admin account to load live queues.",
      accessConfirmed:
        "Admin access confirmed. This page is connected to the live Supabase review queues.",
      liveUnavailable: "Live queues are unavailable, so empty queues are shown.",
      emptyQueue: "No pending items.",
      pendingSubmissions: "Pending submissions",
      pendingClaims: "Pending claims",
      pendingReports: "Pending reports",
      publishedGroups: "Published groups",
      groupManagementTitle: "Published group management",
      groupManagementDescription:
        "Open recently updated communities to adjust copy, status, and join details.",
      editGroup: "Edit",
      groupSearchLabel: "Search groups",
      groupSearchPlaceholder: "Name, slug, or description",
      groupStatusAll: "All statuses",
      groupCategoryAll: "All topics",
      groupPlatformAll: "All platforms",
      groupFilterButton: "Filter",
      groupFilterClear: "Clear",
      groupResultsSummary: (shown, total) =>
        `Showing ${shown} of ${total} matching groups`,
      reportStatusFilter: "Report status",
      reportTypeFilter: "Report type",
      reportTypeAll: "All types",
      reportEditGroup: "Edit join method",
      reportFreshnessNotice:
        "This report usually needs a join-method fix first. Saving the group rechecks stale warnings.",
      reportHandled: "Report status updated.",
      reportFreshnessChecked:
        "Report handled. Join-method freshness warnings were rechecked.",
      batchActionTitle: "Batch actions",
      batchActionDescription:
        "Select groups on this page, then publish, mark needs update, or hide them.",
      batchSetPublished: "Set published",
      batchSetNeedsUpdate: "Mark needs update",
      batchSetHidden: "Hide selected",
      batchSelectAll: "Select all current page",
      batchSelectedSummary: "{count} selected",
      batchConfirmTitle: "Confirm batch action",
      batchConfirmDescription:
        "Apply \"{action}\" to {count} selected groups?",
      batchNoSelection: "Select at least one group first.",
      batchUpdated: "Batch status updated.",
      batchFailed: "Batch action failed. Select groups and try again.",
      submissionsTitle: "New submissions",
      submissionsDescription: "Review newly submitted communities and join paths.",
      claimsTitle: "Ownership claims",
      claimsDescription: "Check claim evidence before granting maintainer access.",
      reportsTitle: "Reports and invalid joins",
      reportsDescription:
        "Handle expired join methods, outdated details, and safety reports.",
      statusLabel: "Status",
      reviewerNotes: "Reviewer notes",
      reviewerNotesLabel: "Reviewer notes",
      detailsTitle: "View details",
      approve: "Approve",
      reject: "Reject",
      requestChanges: "Request changes",
      resolveReport: "Mark handled",
      dismissReport: "Dismiss report",
      approveConfirm:
        "Approve this submission? It will be published to the public directory.",
      rejectConfirm: "Reject this item?",
      requestChangesConfirm: "Ask the submitter to make changes?",
      resolveReportConfirm: "Mark this report as handled?",
      dismissReportConfirm: "Dismiss this report?",
      categoryLabel: "Topic",
      submitterLabel: "Submitter",
      claimantLabel: "Claimant",
      reporterLabel: "Reporter",
      groupLabel: "Group",
      reportTypeLabel: "Report type",
      joinMethodLabel: "Join method",
      joinValueLabel: "Join notes",
      groupLinkLabel: "Group link",
      qrCodeLabel: "QR code",
      languageLabel: "Language",
      regionLabel: "Region",
      descriptionLabel: "Description",
      rulesLabel: "Rules summary",
      priorityTitle: "Today priority",
      priorityEmpty:
        "No backlog right now. You can add more samples or review public listing quality.",
      workflowTitle: "Review workflow",
      workflowItems: [
        "Start with new submissions and verify the topic, description, and join path.",
        "Then review ownership claims and grant access only when evidence is clear.",
        "Finish with reports and invalid joins, marking outdated groups when needed."
      ],
      auditTitle: "Recent activity",
      auditEmpty: "No admin activity yet.",
      reviewed: "Review status updated.",
      reviewFailed: "Review update failed. Please try again later."
    },
    auth: {
      title: "Sign in to Circlist",
      intro:
        "Enter your email and we will send a magic link. After signing in, you can submit groups, track your submissions, and access admin review if enabled.",
      email: "Email",
      sendLink: "Send sign-in link",
      checkEmail: "Sign-in link sent. Check your email.",
      error: "Could not send the sign-in link. Please try again.",
      networkError: "Connection to Supabase timed out. Check the network and try again.",
      rateLimited: "Too many sign-in emails were requested. Please wait and try again.",
      required: "Please sign in to continue.",
      emailChannelTitle: "Email delivery channel",
      resendChannel:
        "Production email is configured. Sign-in links are sent through Resend.",
      supabaseChannel:
        "The app is still using Supabase's default email channel. It is fine for testing but has low sending limits. Configure Resend to switch automatically."
    },
    search: {
      label: "Search groups",
      placeholder: "Search AI, overseas, indie dev...",
      button: "Search",
      platform: "Platform",
      price: "Price",
      joinPolicy: "Join policy",
      sort: "Sort",
      allPlatforms: "All platforms",
      allPrices: "All prices",
      allJoinPolicies: "All join policies",
      clear: "Clear filters",
      sortOptions: {
        recent: "Recently verified",
        activity: "Most active",
        name: "Name A-Z"
      }
    },
    card: {
      activity: "Activity",
      freshness: "Trust",
      regionLanguage: "Region / language",
      viewDetails: "View details"
    },
    pagination: {
      label: "Pagination",
      previous: "Previous",
      next: "Next",
      summary: (start, end, total) => `Showing ${start}-${end} of ${total}`
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
    },
    reportTypes: {
      invalid_join_method: "Invalid join method",
      outdated_info: "Outdated information",
      spam: "Spam",
      scam: "Scam",
      abuse: "Abuse",
      other: "Other"
    }
  }
};

export function normalizeLocale(value: string | undefined | null): Locale {
  return value?.toLowerCase().startsWith("en") ? "en" : "zh";
}

export function localeFromSearchOrHeader(
  searchLang: string | undefined | null,
  headerLocale: string | undefined | null
): Locale {
  return normalizeLocale(searchLang ?? headerLocale);
}

export function getDictionary(locale: Locale = "zh"): Dictionary {
  return dictionaries[locale];
}
