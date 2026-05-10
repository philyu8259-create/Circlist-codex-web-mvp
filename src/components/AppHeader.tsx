import Link from "next/link";

import { signOut } from "@/lib/actions/auth";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { getDictionary, type Locale } from "@/lib/i18n";
import { LanguageSwitch } from "./LanguageSwitch";

type AppHeaderProps = {
  locale: Locale;
  pathname?: string;
  query?: Record<string, string | undefined>;
};

export async function AppHeader({
  locale,
  pathname = "/",
  query = {}
}: AppHeaderProps) {
  const copy = getDictionary(locale);
  const langQuery = locale === "zh" ? "?lang=zh" : "?lang=en";
  const [user, profile] = await Promise.all([
    getCurrentUser(),
    getCurrentProfile()
  ]);
  const isAdmin = profile?.role === "admin";

  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link className="min-w-0" href={`/${langQuery}`}>
          <span className="block text-lg font-semibold leading-tight text-ink">
            {copy.appName}
          </span>
          <span className="block text-xs text-ink/60">{copy.subtitle}</span>
        </Link>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:gap-3">
          <Link
            className="rounded-md px-2.5 py-2 text-sm font-medium text-ink/70 transition hover:bg-white hover:text-leaf"
            href={`/${langQuery}`}
          >
            {copy.nav.browse}
          </Link>
          <Link
            className="rounded-md px-2.5 py-2 text-sm font-medium text-ink/70 transition hover:bg-white hover:text-leaf"
            href={`/submit${langQuery}`}
          >
            {copy.nav.submit}
          </Link>
          <Link
            className="rounded-md px-2.5 py-2 text-sm font-medium text-ink/70 transition hover:bg-white hover:text-leaf"
            href={`/my-groups${langQuery}`}
          >
            {copy.nav.myGroups}
          </Link>
          {isAdmin ? (
            <Link
              className="rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-leaf"
              href={`/admin${langQuery}`}
            >
              {copy.nav.admin}
            </Link>
          ) : null}
          {user ? (
            <form action={signOut} className="contents">
              <input name="lang" type="hidden" value={locale} />
              <button
                className="rounded-md px-2.5 py-2 text-sm font-medium text-ink/70 transition hover:bg-white hover:text-leaf"
                type="submit"
              >
                {copy.nav.signOut}
              </button>
            </form>
          ) : (
            <Link
              className="rounded-md px-2.5 py-2 text-sm font-medium text-ink/70 transition hover:bg-white hover:text-leaf"
              href={`/login${langQuery}`}
            >
              {copy.nav.signIn}
            </Link>
          )}
          <LanguageSwitch locale={locale} pathname={pathname} query={query} />
        </div>
      </div>
    </header>
  );
}
