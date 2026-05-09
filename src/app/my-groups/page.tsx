import { AppHeader } from "@/components/AppHeader";
import { requireUser } from "@/lib/auth";
import { getDictionary, normalizeLocale } from "@/lib/i18n";

type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function MyGroupsPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const locale = normalizeLocale(firstParam(params?.lang));
  const submitted = firstParam(params?.submitted);
  const copy = getDictionary(locale);

  await requireUser({ lang: locale, next: "/my-groups" });

  const stats = [
    { label: copy.myGroups.submitted, value: "0" },
    { label: copy.myGroups.owned, value: "0" },
    { label: copy.myGroups.pending, value: "0" },
    { label: copy.myGroups.needsUpdate, value: "0" }
  ];

  return (
    <>
      <AppHeader locale={locale} pathname="/my-groups" />
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-5 py-7">
        <section>
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {copy.myGroups.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-ink/68">
            {copy.myGroups.intro}
          </p>
        </section>

        {submitted ? (
          <p className="rounded-lg border border-leaf/25 bg-leaf/10 px-4 py-3 text-sm font-medium text-leaf">
            {copy.myGroups.submittedSuccess}
          </p>
        ) : null}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item) => (
            <div
              className="rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
              key={item.label}
            >
              <span className="block text-3xl font-semibold text-leaf">
                {item.value}
              </span>
              <span className="mt-2 block text-sm font-medium text-ink/65">
                {item.label}
              </span>
            </div>
          ))}
        </section>

        <section className="rounded-lg border border-dashed border-ink/15 bg-white px-5 py-10 text-center">
          <h2 className="text-lg font-semibold text-ink">
            {copy.myGroups.emptyTitle}
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            {copy.myGroups.emptyDescription}
          </p>
        </section>
      </main>
    </>
  );
}
