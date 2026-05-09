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
    <header className="border-b border-ink/10 bg-paper/95">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <Link className="min-w-0" href={`/${langQuery}`}>
          <span className="block text-lg font-semibold leading-tight text-ink">
            {copy.appName}
          </span>
          <span className="block text-xs text-ink/60">{copy.subtitle}</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            className="hidden text-sm font-medium text-ink/70 transition hover:text-leaf sm:inline"
            href={`/${langQuery}`}
          >
            {copy.nav.browse}
          </Link>
          <Link
            className="hidden text-sm font-medium text-ink/70 transition hover:text-leaf sm:inline"
            href={`/submit${langQuery}`}
          >
            {copy.nav.submit}
          </Link>
          <Link
            className="hidden text-sm font-medium text-ink/70 transition hover:text-leaf sm:inline"
            href={`/my-groups${langQuery}`}
          >
            {copy.nav.myGroups}
          </Link>
          {isAdmin ? (
            <Link
              className="hidden rounded-md bg-ink px-3 py-2 text-sm font-semibold text-white transition hover:bg-leaf sm:inline"
              href={`/admin${langQuery}`}
            >
              {copy.nav.admin}
            </Link>
          ) : null}
          {user ? (
            <form action={signOut}>
              <input name="lang" type="hidden" value={locale} />
              <button
                className="hidden text-sm font-medium text-ink/70 transition hover:text-leaf sm:inline"
                type="submit"
              >
                {copy.nav.signOut}
              </button>
            </form>
          ) : (
            <Link
              className="hidden text-sm font-medium text-ink/70 transition hover:text-leaf sm:inline"
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
