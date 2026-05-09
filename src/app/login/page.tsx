import { AppHeader } from "@/components/AppHeader";
import { sendMagicLink } from "@/lib/actions/auth";
import { getSafeNextPath } from "@/lib/auth";
import { getDictionary } from "@/lib/i18n";
import { getRequestLocale } from "@/lib/request-locale";

type SearchParams = Promise<
  Record<string, string | string[] | undefined> | undefined
>;

function firstParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams
}: {
  searchParams?: SearchParams;
}) {
  const params = await searchParams;
  const locale = await getRequestLocale(firstParam(params?.lang));
  const authState = firstParam(params?.auth);
  const next = getSafeNextPath(firstParam(params?.next));
  const copy = getDictionary(locale);

  return (
    <>
      <AppHeader locale={locale} pathname="/login" query={{ next }} />
      <main className="mx-auto flex min-h-screen max-w-xl flex-col gap-6 px-5 py-7">
        <section>
          <h1 className="text-3xl font-semibold leading-tight text-ink sm:text-4xl">
            {copy.auth.title}
          </h1>
          <p className="mt-3 text-base leading-7 text-ink/68">
            {copy.auth.intro}
          </p>
        </section>

        {authState === "required" ? (
          <p className="rounded-lg border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
            {copy.auth.required}
          </p>
        ) : null}
        {authState === "sent" ? (
          <p className="rounded-lg border border-leaf/25 bg-leaf/10 px-4 py-3 text-sm font-medium text-leaf">
            {copy.auth.checkEmail}
          </p>
        ) : null}
        {authState === "error" ? (
          <p className="rounded-lg border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
            {copy.auth.error}
          </p>
        ) : null}
        {authState === "network" ? (
          <p className="rounded-lg border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
            {copy.auth.networkError}
          </p>
        ) : null}
        {authState === "rate_limited" ? (
          <p className="rounded-lg border border-coral/25 bg-coral/10 px-4 py-3 text-sm font-medium text-coral">
            {copy.auth.rateLimited}
          </p>
        ) : null}

        <form
          action={sendMagicLink}
          className="grid gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm"
        >
          <input name="lang" type="hidden" value={locale} />
          <input name="next" type="hidden" value={next} />
          <label className="grid gap-2 text-sm font-medium text-ink">
            {copy.auth.email}
            <input
              autoComplete="email"
              className="rounded-md border border-ink/15 px-3 py-2 text-base outline-none transition focus:border-leaf"
              name="email"
              required
              type="email"
            />
          </label>
          <button
            className="w-fit rounded-md bg-leaf px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-coral"
            type="submit"
          >
            {copy.auth.sendLink}
          </button>
        </form>
      </main>
    </>
  );
}
