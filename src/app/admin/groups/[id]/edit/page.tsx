import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminGroupEditForm } from "@/components/AdminGroupEditForm";
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
  expires_at: string | null;
  last_verified_at: string | null;
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

function dateInputValue(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

function formatDate(value: string | null | undefined, locale: Locale): string {
  if (!value) return "";

  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", {
    dateStyle: "medium"
  }).format(new Date(value));
}

function isPastDate(value: string | null | undefined): boolean {
  if (!value) return false;

  const expiresAt = new Date(value);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  expiresAt.setHours(0, 0, 0, 0);

  return expiresAt < today;
}

function hasJoinMethodRisk(
  joinMethod: JoinMethodRow | null,
  moderationStatus: EditableGroupRow["moderation_status"]
): boolean {
  return (
    !joinMethod ||
    moderationStatus === "needs_update" ||
    joinMethod.review_status !== "approved" ||
    isPastDate(joinMethod.expires_at)
  );
}

function TextField({
  defaultValue,
  help,
  label,
  name,
  required,
  type = "text"
}: {
  defaultValue?: string | null;
  help?: string;
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
      {help ? <span className="text-xs leading-5 text-ink/50">{help}</span> : null}
    </label>
  );
}

function TextareaField({
  defaultValue,
  help,
  label,
  minHeight = "min-h-28",
  name,
  required
}: {
  defaultValue?: string | null;
  help?: string;
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
      {help ? <span className="text-xs leading-5 text-ink/50">{help}</span> : null}
    </label>
  );
}

function FormSection({
  children,
  description,
  title
}: {
  children: React.ReactNode;
  description?: string;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-ink/55">{description}</p>
      ) : null}
      <div className="mt-4 grid gap-4">{children}</div>
    </section>
  );
}

function JoinMethodFreshnessNotice({
  joinMethod,
  locale,
  moderationStatus
}: {
  joinMethod: JoinMethodRow | null;
  locale: Locale;
  moderationStatus: EditableGroupRow["moderation_status"];
}) {
  const isExpired = isPastDate(joinMethod?.expires_at);
  const shouldWarn =
    !joinMethod ||
    moderationStatus === "needs_update" ||
    joinMethod.review_status !== "approved" ||
    isExpired;

  if (!shouldWarn) {
    return (
      <div className="rounded-md border border-leaf/20 bg-leaf/10 px-3 py-3 text-sm leading-6 text-leaf">
        {locale === "en"
          ? `Join method looks fresh${
              joinMethod?.last_verified_at
                ? `, last verified ${formatDate(joinMethod.last_verified_at, locale)}`
                : ""
            }.`
          : `加入方式看起来有效${
              joinMethod?.last_verified_at
                ? `，上次核验：${formatDate(joinMethod.last_verified_at, locale)}`
                : ""
            }。`}
      </div>
    );
  }

  const reasons = [
    !joinMethod
      ? locale === "en"
        ? "No public join method exists yet."
        : "当前还没有公开加入方式。"
      : "",
    moderationStatus === "needs_update"
      ? locale === "en"
        ? "This group is marked as needing an update."
        : "这个群组已标记为需要更新。"
      : "",
    joinMethod && joinMethod.review_status !== "approved"
      ? locale === "en"
        ? `Join method review status is ${joinMethod.review_status}.`
        : `加入方式审核状态为 ${joinMethod.review_status}。`
      : "",
    isExpired
      ? locale === "en"
        ? `Join method expired on ${formatDate(joinMethod?.expires_at, locale)}.`
        : `加入方式已于 ${formatDate(joinMethod?.expires_at, locale)} 过期。`
      : ""
  ].filter(Boolean);

  return (
    <div className="rounded-md border border-coral/25 bg-coral/10 px-3 py-3 text-sm leading-6 text-coral">
      <p className="font-semibold">
        {locale === "en" ? "Join method may be invalid" : "加入方式可能已失效"}
      </p>
      <ul className="mt-2 grid gap-1">
        {reasons.map((reason) => (
          <li key={reason}>{reason}</li>
        ))}
      </ul>
    </div>
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
        expires_at,
        last_verified_at,
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

        <AdminGroupEditForm
          action={updateAdminGroup}
          labels={{
            cancel: locale === "en" ? "Cancel" : "取消",
            confirm: locale === "en" ? "Confirm save" : "确认保存",
            confirmDescription:
              hasJoinMethodRisk(joinMethod, group.moderation_status)
                ? locale === "en"
                  ? "The group has a join-path risk. Please recheck the public join method and confirm it is still usable before saving."
                  : "当前群组存在加入方式风险。保存前请再次确认公开加入方式仍可用。"
                : locale === "en"
                  ? "This will immediately update the public group profile and join method. Please confirm the join path is still usable before saving."
                  : "这会立即更新公开群组资料和加入方式。保存前请确认加入入口仍然可用。",
            confirmTitle:
              locale === "en" ? "Save group changes?" : "确认保存群组修改？",
            saveButton: locale === "en" ? "Save changes" : "保存修改"
          }}
        >
          <input name="groupId" type="hidden" value={group.id} />
          <input name="joinMethodId" type="hidden" value={joinMethod?.id ?? ""} />
          <input name="lang" type="hidden" value={locale} />

          <FormSection
            description={
              locale === "en"
                ? "These fields define the public name and core positioning visitors see first."
                : "这些字段决定访客最先看到的公开名称和核心定位。"
            }
            title={locale === "en" ? "Public profile" : "公开资料"}
          >
            <TextField
              defaultValue={group.name}
              label={copy.submit.name}
              name="name"
              required
            />
            <TextField
              defaultValue={group.short_description}
              help={
                locale === "en"
                  ? "Keep this short enough for cards and search results."
                  : "尽量保持简短，适合卡片和搜索结果展示。"
              }
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

          <FormSection
            description={
              locale === "en"
                ? "Use this section for taxonomy and lightweight public metadata."
                : "这里集中维护分类、平台和轻量公开信息。"
            }
            title={locale === "en" ? "Classification" : "分类信息"}
          >
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
          </FormSection>

          <FormSection
            description={
              locale === "en"
                ? "Optional localized copy overrides the default public text when users switch languages."
                : "可选文案会在用户切换语言时覆盖默认公开文本。"
            }
            title={locale === "en" ? "Localized copy" : "中英文文案"}
          >
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

          <FormSection
            description={
              locale === "en"
                ? "Operational state controls whether this group is visible or flagged for owner follow-up."
                : "运营状态决定群组是否公开展示，以及是否提示群主更新。"
            }
            title={locale === "en" ? "Operational status" : "运营状态"}
          >
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
            <TextareaField
              defaultValue={group.rules_summary}
              label={copy.submit.rulesSummary}
              name="rulesSummary"
            />
          </FormSection>

          <FormSection
            description={
              locale === "en"
                ? "Review the actual entry users follow to join. QR codes and invite links should be checked before saving."
                : "这里维护用户真正用来加入的入口。二维码和邀请链接保存前应先确认可用。"
            }
            title={locale === "en" ? "Join method" : "加入方式"}
          >
            <JoinMethodFreshnessNotice
              joinMethod={joinMethod}
              locale={locale}
              moderationStatus={group.moderation_status}
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
            <TextField
              defaultValue={dateInputValue(joinMethod?.expires_at)}
              help={
                locale === "en"
                  ? "Optional. Use this for QR codes or invite links that can expire."
                  : "可选。适合填写二维码、邀请链接等可能过期的入口。"
              }
              label={locale === "en" ? "Expires at" : "失效日期"}
              name="joinMethodExpiresAt"
              type="date"
            />
          </FormSection>
        </AdminGroupEditForm>
      </main>
    </>
  );
}
