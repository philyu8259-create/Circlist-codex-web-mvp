import { AppHeader } from "@/components/AppHeader";
import { submitGroup } from "@/lib/actions/groups";
import { categories, platforms } from "@/lib/domain";
import { getCategoryLabel, getPlatformLabel } from "@/lib/domain";
import { getDictionary, normalizeLocale } from "@/lib/i18n";

type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function SubmitPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const locale = normalizeLocale(firstParam(params?.lang));
  const error = firstParam(params?.error);
  const copy = getDictionary(locale);

  return (
    <>
      <AppHeader locale={locale} pathname="/submit" />
      <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-5 py-7">
        <section>
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {copy.submit.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-ink/68">
            {copy.submit.intro}
          </p>
        </section>

        {error ? (
          <p className="rounded-lg border border-coral/30 bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
            {error === "validation"
              ? copy.submit.validationError
              : copy.submit.submitError}
          </p>
        ) : null}

        <form
          action={submitGroup}
          className="grid gap-5 rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
        >
          <input name="lang" type="hidden" value={locale} />

          <label className="grid gap-2 text-sm font-medium text-ink">
            {copy.submit.name}
            <input
              className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
              name="name"
              required
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink">
              {copy.submit.platform}
              <select
                className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
                name="platform"
                required
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
                className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
                name="categorySlug"
                required
              >
                {categories.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {getCategoryLabel(category.slug, locale)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-ink">
            {copy.submit.shortDescription}
            <input
              className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
              name="shortDescription"
              required
            />
          </label>

          <label className="grid gap-2 text-sm font-medium text-ink">
            {copy.submit.description}
            <textarea
              className="min-h-32 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
              name="description"
              required
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink">
              {copy.submit.joinMethodType}
              <select
                className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
                name="joinMethodType"
                required
              >
                {Object.entries(copy.joinMethodTypes).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm font-medium text-ink">
              {copy.submit.joinMethodValue}
              <input
                className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
                name="joinMethodValue"
                required
              />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-ink">
              {copy.submit.language}
              <input
                className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
                name="language"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-ink">
              {copy.submit.region}
              <input
                className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
                name="region"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-ink">
            {copy.submit.rulesSummary}
            <textarea
              className="min-h-24 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
              name="rulesSummary"
            />
          </label>

          <button
            className="w-fit rounded-md bg-leaf px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-coral"
            type="submit"
          >
            {copy.submit.button}
          </button>
        </form>
      </main>
    </>
  );
}
