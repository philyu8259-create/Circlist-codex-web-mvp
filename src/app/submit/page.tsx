import { AppHeader } from "@/components/AppHeader";
import { submitGroup } from "@/lib/actions/groups";
import { categories, platforms } from "@/lib/domain";
import { getCategoryLabel, getPlatformLabel } from "@/lib/domain";
import { getDictionary } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

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
  const locale = await getRequestLocale(firstParam(params?.lang));
  const error = firstParam(params?.error);
  const copy = getDictionary(locale);

  return (
    <>
      <AppHeader locale={locale} pathname="/submit" />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-5 py-7">
        <section className="rounded-lg border border-ink/10 bg-white px-5 py-6 shadow-sm">
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {copy.submit.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/68">
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

        <div className="grid gap-5 lg:grid-cols-[1fr_18rem]">
          <form action={submitGroup} className="grid gap-4">
            <input name="lang" type="hidden" value={locale} />

            <FormSection
              description={copy.submit.basicsDescription}
              step="1"
              title={copy.submit.basicsTitle}
            >
              <TextField label={copy.submit.name} name="name" required />

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  {copy.submit.platform}
                  <select
                    className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
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
                    className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
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

              <TextField
                label={copy.submit.shortDescription}
                name="shortDescription"
                required
              />
              <TextareaField
                label={copy.submit.description}
                minHeight="min-h-32"
                name="description"
                required
              />
            </FormSection>

            <FormSection
              description={copy.submit.joinDescription}
              step="2"
              title={copy.submit.joinTitle}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-ink">
                  {copy.submit.joinMethodType}
                  <select
                    className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
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

                <TextField
                  label={copy.submit.joinMethodValue}
                  name="joinMethodValue"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  hint={copy.submit.groupLinkHint}
                  label={copy.submit.groupLink}
                  name="groupLink"
                  placeholder="https://"
                  type="url"
                />

                <label className="grid gap-2 text-sm font-medium text-ink">
                  {copy.submit.qrCode}
                  <input
                    accept="image/png,image/jpeg,image/webp"
                    className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition file:mr-3 file:rounded-md file:border-0 file:bg-leaf/10 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-leaf focus:border-leaf focus:ring-2 focus:ring-leaf/15"
                    name="qrCode"
                    type="file"
                  />
                  <span className="text-xs font-normal leading-5 text-ink/55">
                    {copy.submit.qrCodeHint}
                  </span>
                </label>
              </div>
            </FormSection>

            <FormSection
              description={copy.submit.reviewDescription}
              step="3"
              title={copy.submit.reviewTitle}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label={copy.submit.language} name="language" />
                <TextField label={copy.submit.region} name="region" />
              </div>

              <TextareaField
                label={copy.submit.rulesSummary}
                minHeight="min-h-24"
                name="rulesSummary"
              />

              <button
                className="min-h-11 w-full rounded-md bg-leaf px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-coral focus:outline-none focus:ring-2 focus:ring-leaf/30 sm:w-fit"
                type="submit"
              >
                {copy.submit.button}
              </button>
            </FormSection>
          </form>

          <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-base font-semibold text-ink">
              {copy.submit.checklistTitle}
            </h2>
            <ul className="mt-4 grid gap-3">
              {copy.submit.checklistItems.map((item, index) => (
                <li className="flex gap-3 text-sm leading-6 text-ink/70" key={item}>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf/10 text-xs font-semibold text-leaf">
                    {index + 1}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </main>
    </>
  );
}

function FormSection({
  children,
  description,
  step,
  title
}: {
  children: React.ReactNode;
  description: string;
  step: string;
  title: string;
}) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
      <div className="mb-5 flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf text-sm font-semibold text-white">
          {step}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-ink/60">{description}</p>
        </div>
      </div>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function TextField({
  hint,
  label,
  name,
  placeholder,
  required,
  type = "text"
}: {
  hint?: string;
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <input
        className="min-h-11 rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15"
        name={name}
        placeholder={placeholder}
        required={required}
        type={type}
      />
      {hint ? (
        <span className="text-xs font-normal leading-5 text-ink/55">{hint}</span>
      ) : null}
    </label>
  );
}

function TextareaField({
  label,
  minHeight,
  name,
  required
}: {
  label: string;
  minHeight: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-ink">
      {label}
      <textarea
        className={`${minHeight} rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf focus:ring-2 focus:ring-leaf/15`}
        name={name}
        required={required}
      />
    </label>
  );
}
