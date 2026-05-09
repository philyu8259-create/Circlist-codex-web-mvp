import { getDictionary } from "@/lib/i18n";

export default function HomePage() {
  const copy = getDictionary("zh");

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8">
      <p className="text-sm font-medium text-leaf">{copy.homeEyebrow}</p>
      <h1 className="mt-4 text-3xl font-semibold text-ink">
        {copy.appName}
      </h1>
      <p className="mt-3 text-base text-ink/70">{copy.subtitle}</p>
    </main>
  );
}
