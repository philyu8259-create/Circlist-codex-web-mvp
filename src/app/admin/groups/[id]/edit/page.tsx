import Link from "next/link";
import { notFound } from "next/navigation";

import { AppHeader } from "@/components/AppHeader";
import {
  requireAdmin,
  updateAdminGroup
} from "@/lib/actions/admin";
import {
  categories,
  getCategoryLabel,
  getPlatformLabel,
  platforms
} from "@/lib/domain";
import type { JoinMethodType, LocalizedGroupContent } from "@/lib/domain";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";
import type { Json } from "@/lib/supabase/types";

type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;
type RouteParams = Promise<{ id: string }>;

type CategoryRelation = {
  slug: string | null;
};

type JoinMethodRow = {
  id: string;
  type: JoinMethodType;
  label: string;
  value: string;
  visibility: string;
  review_status: string;
  updated_at: string | null;
};

type EditableGroupRow = {
  id: string;
  slug: string;
  name: string;
  platform: (typeof platforms)[number];
  short_description: string;
  description: string;
  suitable_for: string | null;
  language: string | null;
  region: string | null;
  activity_level: "low" | "medium" | "high" | "unknown";
  join_policy: string;
  price: "free" | "paid" | "unknown";
  rules_summary: string | null;
  moderation_status: "approved" | "needs_update" | "suspended";
  localized_content: Json | null;
  categories: CategoryRelation | CategoryRelation[] | null;
  group_join_methods: JoinMethodRow[] | null;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function firstCategory(
  category: CategoryRelation | CategoryRelation[] | null
): CategoryRelation | null {
  return Array.isArray(category) ? category[0] ?? null : category;
}

function localizedContent(value: Json | null): LocalizedGroupContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return value as LocalizedGroupContent;
}

function localizedText(
  content: LocalizedGroupContent,
  locale: Locale,
  field:
    | "description"
    | "rulesSummary"
    | "shortDescription"
    | "suitableFor"
): string {
  return content[locale]?.[field] ?? "";
}

function TextField({
  defaultValue,
  label,
  name,
  required,
  type = "text"
}: {
  defaultValue?: string | null;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <input
        className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
        type={type}
      />
    </label>
  );
}

function TextareaField({
  defaultValue,
  label,
  minHeight = "min-h-28",
  name,
  required
}: {
  defaultValue?: string | null;
  label: string;
  minHeight?: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <textarea
        className={`${minHeight} rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15`}
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
      />
    </label>
  );
}

function FormSection({
  children,
  title
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

export default async function EditAdminGroupPage({
  params,
  searchParams
}: {
  params: RouteParams;
  searchParams?: SearchParams;
}) {
  const [{ id }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ]);
  const locale = await getRequestLocale(firstParam(resolvedSearchParams?.lang));
  const edit = firstParam(resolvedSearchParams?.edit);
  const copy = getDictionary(locale);
  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("groups")
    .select(
      `
      id,
      slug,
      name,
      platform,
      short_description,
      description,
      suitable_for,
      language,
      region,
      activity_level,
      join_policy,
      price,
      rules_summary,
      moderation_status,
      localized_content,
      categories(slug),
      group_join_methods(
        id,
        type,
        label,
        value,
        visibility,
        review_status,
        updated_at
      )
    `
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const group = data as EditableGroupRow;
  const categorySlug = firstCategory(group.categories)?.slug ?? categories[0].slug;
  const content = localizedContent(group.localized_content);
  const joinMethod =
    group.group_join_methods?.find((method) => method.visibility === "public") ??
    group.group_join_methods?.[0] ??
    null;

  return (
    <>
      <AppHeader locale={locale} pathname="/admin" />
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-5 py-7">
        <section className="rounded-lg border border-ink/10 bg-white px-5 py-6 shadow-sm">
          <Link
            className="text-sm font-semibold text-leaf underline-offset-2 hover:underline"
            href={`/admin?lang=${locale}`}
          >
            {locale === "en" ? "Back to admin" : "返回后台"}
          </Link>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {locale === "en" ? "Edit group" : "编辑群组"}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/68">
            {group.name} · /groups/{group.slug}
          </p>
        </section>

        {edit ? (
          <p
            className={`rounded-lg border px-4 py-3 text-sm font-medium ${
              edit === "updated"
                ? "border-leaf/25 bg-leaf/10 text-leaf"
                : "border-coral/25 bg-coral/10 text-coral"
            }`}
          >
            {edit === "updated"
              ? locale === "en"
                ? "Group updated."
                : "群组已更新。"
              : locale === "en"
                ? "Update failed. Please check the fields and try again."
                : "更新失败，请检查字段后重试。"}
          </p>
        ) : null}

        <form action={updateAdminGroup} className="grid gap-5">
          <input name="groupId" type="hidden" value={group.id} />
          <input name="joinMethodId" type="hidden" value={joinMethod?.id ?? ""} />
          <input name="lang" type="hidden" value={locale} />

          <FormSection title={locale === "en" ? "Basics" : "基础信息"}>
            <TextField
              defaultValue={group.name}
              label={copy.submit.name}
              name="name"
              required
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-ink">
                {copy.submit.platform}
                <select
                  className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={group.platform}
                  name="platform"
                >
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {getPlatformLabel(platform, locale)}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                {copy.submit.category}
                <select
                  className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={categorySlug}
                  name="categorySlug"
                >
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {getCategoryLabel(category.slug, locale)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <TextField
              defaultValue={group.short_description}
              label={copy.submit.shortDescription}
              name="shortDescription"
              required
            />
            <TextareaField
              defaultValue={group.description}
              label={copy.submit.description}
              minHeight="min-h-36"
              name="description"
              required
            />
            <TextareaField
              defaultValue={group.suitable_for}
              label={copy.detail.suitableFor}
              name="suitableFor"
            />
          </FormSection>

          <FormSection title={locale === "en" ? "Localized copy" : "中英文文案"}>
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="grid gap-4">
                <TextField
                  defaultValue={localizedText(content, "zh", "shortDescription")}
                  label="中文一句话介绍"
                  name="shortDescriptionZh"
                />
                <TextareaField
                  defaultValue={localizedText(content, "zh", "description")}
                  label="中文详细介绍"
                  minHeight="min-h-32"
                  name="descriptionZh"
                />
                <TextareaField
                  defaultValue={localizedText(content, "zh", "suitableFor")}
                  label="中文适合人群"
                  name="suitableForZh"
                />
                <TextareaField
                  defaultValue={localizedText(content, "zh", "rulesSummary")}
                  label="中文群规摘要"
                  name="rulesSummaryZh"
                />
              </div>
              <div className="grid gap-4">
                <TextField
                  defaultValue={localizedText(content, "en", "shortDescription")}
                  label="English short description"
                  name="shortDescriptionEn"
                />
                <TextareaField
                  defaultValue={localizedText(content, "en", "description")}
                  label="English description"
                  minHeight="min-h-32"
                  name="descriptionEn"
                />
                <TextareaField
                  defaultValue={localizedText(content, "en", "suitableFor")}
                  label="English audience"
                  name="suitableForEn"
                />
                <TextareaField
                  defaultValue={localizedText(content, "en", "rulesSummary")}
                  label="English rules summary"
                  name="rulesSummaryEn"
                />
              </div>
            </div>
          </FormSection>

          <FormSection title={locale === "en" ? "Status and join path" : "状态和加入方式"}>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-ink">
                {copy.fields.price}
                <select
                  className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={group.price}
                  name="price"
                >
                  {Object.entries(copy.prices).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                {copy.card.activity}
                <select
                  className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={group.activity_level}
                  name="activityLevel"
                >
                  {Object.entries(copy.activityLevels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-ink">
                {copy.admin.statusLabel}
                <select
                  className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={group.moderation_status}
                  name="moderationStatus"
                >
                  <option value="approved">
                    {locale === "en" ? "Published" : "公开"}
                  </option>
                  <option value="needs_update">
                    {locale === "en" ? "Needs update" : "需要更新"}
                  </option>
                  <option value="suspended">
                    {locale === "en" ? "Hidden" : "下架"}
                  </option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                defaultValue={group.language}
                label={copy.submit.language}
                name="language"
              />
              <TextField
                defaultValue={group.region}
                label={copy.submit.region}
                name="region"
              />
            </div>
            <TextareaField
              defaultValue={group.rules_summary}
              label={copy.submit.rulesSummary}
              name="rulesSummary"
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2 text-sm font-medium text-ink">
                {copy.submit.joinMethodType}
                <select
                  className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                  defaultValue={joinMethod?.type ?? "invite_link"}
                  name="joinMethodType"
                >
                  {Object.entries(copy.joinMethodTypes).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <TextField
                defaultValue={joinMethod?.label}
                label={copy.admin.joinMethodLabel}
                name="joinMethodLabel"
              />
              <TextField
                defaultValue={joinMethod?.value}
                label={copy.admin.joinValueLabel}
                name="joinMethodValue"
                required
              />
            </div>
          </FormSection>

          <button
            className="min-h-11 w-full rounded-md bg-leaf px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-coral focus:outline-none focus:ring-2 focus:ring-leaf/30 sm:w-fit"
            type="submit"
          >
            {locale === "en" ? "Save changes" : "保存修改"}
          </button>
        </form>
      </main>
    </>
  );
}
