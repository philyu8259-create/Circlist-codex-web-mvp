import type { Metadata } from "next";

import { AppHeader } from "@/components/AppHeader";
import { getRequestLocale } from "@/lib/request-locale";
import { absoluteUrl } from "@/lib/site";

type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

const termsCopy = {
  zh: {
    title: "使用条款",
    intro:
      "这些条款用于说明趣群岛 Circlist MVP 的基本使用规则和内容审核边界。",
    updated: "最后更新：2026 年 5 月 10 日",
    sections: [
      {
        title: "服务定位",
        body: [
          "Circlist 是兴趣群组目录和维护工具，不是任何群组、平台或组织的官方代表。",
          "群组信息可能变化、过期或失效，加入前请自行判断适合度和风险。"
        ]
      },
      {
        title: "提交规则",
        body: [
          "你提交的群组信息应真实、清楚、可验证，并且不侵犯他人权益。",
          "不得提交诈骗、诱导投资、违法、骚扰、仇恨、成人或恶意营销内容。",
          "不得上传包含敏感个人信息、付款记录、后台凭证或非公开邀请的二维码图片。"
        ]
      },
      {
        title: "审核和展示",
        body: [
          "Circlist 可以审核、拒绝、要求修改、下架或标记需要更新的群组信息。",
          "通过审核不代表官方背书，也不代表群组内容、成员或交易行为安全。",
          "投资、付费服务、出海合规等高风险话题应由用户自行进行独立判断。"
        ]
      },
      {
        title: "举报和认领",
        body: [
          "用户可以举报失效链接、过期二维码、垃圾信息或安全风险。",
          "群主认领需要提供足够证据；审核通过后才会开放维护入口。"
        ]
      }
    ]
  },
  en: {
    title: "Terms of Use",
    intro:
      "These terms describe the basic usage rules and moderation boundaries for the Circlist MVP.",
    updated: "Last updated: May 10, 2026",
    sections: [
      {
        title: "Service Scope",
        body: [
          "Circlist is a community directory and maintenance tool. It is not an official representative of any community, platform, or organization.",
          "Community information may change, expire, or become invalid. Users should make their own judgment before joining."
        ]
      },
      {
        title: "Submission Rules",
        body: [
          "Submitted community information should be truthful, clear, verifiable, and respectful of others' rights.",
          "Do not submit scams, investment bait, illegal content, harassment, hate, adult content, or abusive marketing.",
          "Do not upload QR code images that include sensitive personal data, payment records, admin credentials, or non-public invitations."
        ]
      },
      {
        title: "Review and Listing",
        body: [
          "Circlist may review, reject, request changes, delist, or mark community information as needing updates.",
          "Approval does not mean official endorsement and does not guarantee that a community, its members, or transactions are safe.",
          "Users should independently evaluate higher-risk topics such as investing, paid services, and cross-border compliance."
        ]
      },
      {
        title: "Reports and Claims",
        body: [
          "Users may report invalid links, expired QR codes, spam, or safety concerns.",
          "Ownership claims require enough evidence, and maintainer access is only enabled after review."
        ]
      }
    ]
  }
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export const metadata: Metadata = {
  alternates: {
    canonical: absoluteUrl("/terms")
  },
  title: "使用条款 Terms of Use",
  description: "趣群岛 Circlist 使用条款。"
};

export default async function TermsPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const locale = await getRequestLocale(firstParam(params?.lang));
  const copy = termsCopy[locale];

  return (
    <>
      <AppHeader locale={locale} pathname="/terms" />
      <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-5 py-7">
        <section className="rounded-lg border border-ink/10 bg-white px-5 py-6 shadow-sm">
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-ink/68">{copy.intro}</p>
          <p className="mt-4 text-sm text-ink/45">{copy.updated}</p>
        </section>

        {copy.sections.map((section) => (
          <section
            className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
            key={section.title}
          >
            <h2 className="text-xl font-semibold text-ink">{section.title}</h2>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-ink/68">
              {section.body.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}
