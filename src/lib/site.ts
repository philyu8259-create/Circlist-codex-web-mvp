export const siteConfig = {
  name: "趣群岛 Circlist",
  defaultTitle: "趣群岛 Circlist - 真实活跃兴趣群目录",
  description:
    "发现、筛选和维护真实活跃的兴趣群，覆盖 AI、出海、编程、投资、一人公司和独立开发等主题。",
  englishTitle: "Circlist - Real Active Community Directory",
  englishDescription:
    "Discover, filter, and maintain real active communities across AI, overseas business, programming, investing, one-person companies, and indie development.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://127.0.0.1:3000"
};

export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
