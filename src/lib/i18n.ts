export type Locale = "zh" | "en";

type Dictionary = {
  appName: string;
  subtitle: string;
  homeEyebrow: string;
  homeTitle: string;
  homeIntro: string;
  searchPlaceholder: string;
  searchButton: string;
};

const dictionaries: Record<Locale, Dictionary> = {
  zh: {
    appName: "趣群岛 Circlist",
    subtitle: "发现真实活跃的兴趣群",
    homeEyebrow: "兴趣群发现平台",
    homeTitle: "发现真实活跃的兴趣群",
    homeIntro:
      "先从 AI、出海、编程、投资和独立开发开始，找到适合自己的微信群、QQ群、Telegram 或 Discord 社群。",
    searchPlaceholder: "搜索 AI、出海、独立开发...",
    searchButton: "搜索"
  },
  en: {
    appName: "Circlist",
    subtitle: "Discover communities by interest",
    homeEyebrow: "Interest group discovery",
    homeTitle: "Discover real, active communities",
    homeIntro:
      "Start with AI, overseas business, programming, investing, and indie development communities across WeChat, QQ, Telegram, and Discord.",
    searchPlaceholder: "Search AI, overseas, indie dev...",
    searchButton: "Search"
  }
};

export function normalizeLocale(value: string | undefined | null): Locale {
  return value?.toLowerCase().startsWith("en") ? "en" : "zh";
}

export function getDictionary(locale: Locale = "zh"): Dictionary {
  return dictionaries[locale];
}
