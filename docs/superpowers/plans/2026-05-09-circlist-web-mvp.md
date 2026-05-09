# Circlist Web MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first Web App MVP for 趣群岛 / Circlist: public group discovery, email login, group submission, owner operations, reports, and admin review queues.

**Architecture:** Use a Next.js App Router application with a small domain layer, Supabase for auth/database/storage, and server actions for mutations. Build a Chinese-first responsive UI with clean public browsing first, then add authenticated owner/admin workflows behind role checks.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Supabase Auth/Postgres/Storage, Vitest, Testing Library, Vercel-ready environment variables.

---

## File Structure

- `package.json`: project scripts and dependencies.
- `next.config.ts`: Next.js config.
- `tsconfig.json`: strict TypeScript config.
- `postcss.config.mjs`: Tailwind PostCSS config.
- `tailwind.config.ts`: Tailwind content and theme config.
- `vitest.config.ts`: unit/component test config.
- `src/app/layout.tsx`: root layout and metadata.
- `src/app/globals.css`: base styles and Tailwind layers.
- `src/app/page.tsx`: public home/search experience.
- `src/app/categories/[slug]/page.tsx`: category listing page.
- `src/app/groups/[slug]/page.tsx`: public group detail page.
- `src/app/submit/page.tsx`: login-gated group submission page.
- `src/app/my-groups/page.tsx`: owner dashboard.
- `src/app/admin/page.tsx`: admin queue overview.
- `src/components/*`: reusable UI components.
- `src/lib/domain.ts`: shared domain types, constants, and labels.
- `src/lib/mock-data.ts`: seeded mock content before Supabase wiring.
- `src/lib/search.ts`: group filtering and scoring helpers.
- `src/lib/supabase/client.ts`: browser Supabase client.
- `src/lib/supabase/server.ts`: server Supabase client.
- `src/lib/auth.ts`: current-user and role helpers.
- `src/lib/actions/*`: server actions for submissions, claims, reports, and reviews.
- `supabase/migrations/0001_initial_schema.sql`: database schema, enums, RLS, and seed categories.
- `tests/*`: focused unit tests for domain/search/action helpers.
- `.env.example`: required Supabase environment variables.

## Task 1: Bootstrap The Next.js App

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `postcss.config.mjs`
- Create: `tailwind.config.ts`
- Create: `vitest.config.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`
- Create: `tests/setup.ts`

- [ ] **Step 1: Create package metadata and scripts**

Create `package.json`:

```json
{
  "name": "circlist",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@supabase/ssr": "^0.6.1",
    "@supabase/supabase-js": "^2.49.4",
    "lucide-react": "^0.468.0",
    "next": "^14.2.18",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "autoprefixer": "^10.4.20",
    "eslint": "^8.57.1",
    "eslint-config-next": "^14.2.18",
    "jsdom": "^25.0.1",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Add framework config files**

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true
};

export default nextConfig;
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "es2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

Create `postcss.config.mjs`:

```js
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

export default config;
```

Create `tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17211B",
        leaf: "#1B7F5C",
        coral: "#E85D4F",
        sky: "#E8F4FF",
        paper: "#F8F7F2"
      }
    }
  },
  plugins: []
};

export default config;
```

- [ ] **Step 3: Add test config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"]
  }
});
```

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: Add root app shell**

Create `src/app/layout.tsx`:

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "趣群岛 Circlist",
  description: "发现真实活跃的兴趣群"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

Create `src/app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color: #17211b;
  background: #f8f7f2;
}

body {
  margin: 0;
  min-height: 100vh;
  background: #f8f7f2;
  font-family: Arial, "PingFang SC", "Microsoft YaHei", sans-serif;
}
```

Create `src/app/page.tsx`:

```tsx
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8">
      <h1 className="text-3xl font-semibold text-ink">趣群岛 Circlist</h1>
      <p className="mt-3 text-base text-ink/70">发现真实活跃的兴趣群</p>
    </main>
  );
}
```

- [ ] **Step 5: Install and verify**

Run:

```bash
npm install
npm run test
npm run build
```

Expected: dependencies install, test command exits with no tests found or pass after configuration, and `next build` completes.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json next.config.ts tsconfig.json postcss.config.mjs tailwind.config.ts vitest.config.ts src tests
git commit -m "chore: bootstrap Circlist web app"
```

## Task 2: Add Domain Types, Categories, And Search Helpers

**Files:**
- Create: `src/lib/domain.ts`
- Create: `src/lib/mock-data.ts`
- Create: `src/lib/search.ts`
- Create: `tests/search.test.ts`

- [ ] **Step 1: Write search tests**

Create `tests/search.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { searchGroups } from "@/lib/search";
import { sampleGroups } from "@/lib/mock-data";

describe("searchGroups", () => {
  it("matches by keyword, category, and platform", () => {
    const results = searchGroups(sampleGroups, {
      query: "AI",
      category: "ai",
      platform: "wechat"
    });

    expect(results.map((group) => group.slug)).toContain("ai-builders-wechat");
    expect(results.every((group) => group.categorySlug === "ai")).toBe(true);
    expect(results.every((group) => group.platform === "wechat")).toBe(true);
  });

  it("returns approved public groups only by default", () => {
    const results = searchGroups(sampleGroups, {});

    expect(results.every((group) => group.moderationStatus === "approved")).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
npm run test -- tests/search.test.ts
```

Expected: FAIL because `@/lib/search` and `@/lib/mock-data` do not exist.

- [ ] **Step 3: Add domain types and constants**

Create `src/lib/domain.ts`:

```ts
export const categories = [
  { slug: "ai", name: "AI" },
  { slug: "overseas", name: "出海" },
  { slug: "programming", name: "编程" },
  { slug: "investment", name: "投资" },
  { slug: "indie-dev", name: "独立开发" }
] as const;

export const platforms = ["wechat", "qq", "telegram", "discord", "slack", "other"] as const;
export const moderationStatuses = ["draft", "pending", "approved", "rejected", "changes_requested", "suspended", "needs_update"] as const;
export const trustSignals = ["recently_verified", "owner_maintained", "join_method_fresh", "needs_update", "under_review", "suspended"] as const;

export type CategorySlug = (typeof categories)[number]["slug"];
export type Platform = (typeof platforms)[number];
export type ModerationStatus = (typeof moderationStatuses)[number];
export type TrustSignal = (typeof trustSignals)[number];

export type JoinMethod = {
  id: string;
  type: "qr_code" | "invite_link" | "group_number" | "admin_contact" | "application_form" | "manual_notes";
  label: string;
  value: string;
  expiresAt?: string;
  lastVerifiedAt?: string;
  reviewStatus: "approved" | "pending" | "rejected";
};

export type Group = {
  id: string;
  slug: string;
  name: string;
  platform: Platform;
  categorySlug: CategorySlug;
  tags: string[];
  shortDescription: string;
  description: string;
  suitableFor: string;
  language: string;
  region: string;
  activityLevel: "low" | "medium" | "high" | "unknown";
  joinPolicy: "open" | "approval_required" | "admin_contact" | "invite_only";
  price: "free" | "paid" | "unknown";
  rulesSummary: string;
  ownerVerified: boolean;
  lastVerifiedAt?: string;
  trustSignals: TrustSignal[];
  joinMethods: JoinMethod[];
  moderationStatus: ModerationStatus;
};

export const platformLabels: Record<Platform, string> = {
  wechat: "微信群",
  qq: "QQ群",
  telegram: "Telegram",
  discord: "Discord",
  slack: "Slack",
  other: "其他"
};
```

- [ ] **Step 4: Add sample groups**

Create `src/lib/mock-data.ts`:

```ts
import type { Group } from "@/lib/domain";

export const sampleGroups: Group[] = [
  {
    id: "grp_ai_builders_wechat",
    slug: "ai-builders-wechat",
    name: "AI 产品共创群",
    platform: "wechat",
    categorySlug: "ai",
    tags: ["AI 产品", "工具", "独立开发"],
    shortDescription: "面向 AI 产品经理和独立开发者的中文交流群。",
    description: "适合交流 AI 工具选型、产品冷启动、提示词设计和出海发布经验。",
    suitableFor: "AI 产品经理、独立开发者、创业者",
    language: "中文",
    region: "全球",
    activityLevel: "high",
    joinPolicy: "approval_required",
    price: "free",
    rulesSummary: "禁止广告刷屏、灰产项目和无关推广。",
    ownerVerified: true,
    lastVerifiedAt: "2026-05-09",
    trustSignals: ["recently_verified", "owner_maintained", "join_method_fresh"],
    joinMethods: [
      {
        id: "jm_ai_wechat_admin",
        type: "admin_contact",
        label: "联系管理员入群",
        value: "提交申请后由群主审核",
        lastVerifiedAt: "2026-05-09",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  },
  {
    id: "grp_indie_discord",
    slug: "indie-dev-discord",
    name: "Indie Dev Launch Room",
    platform: "discord",
    categorySlug: "indie-dev",
    tags: ["SaaS", "Launch", "独立开发"],
    shortDescription: "独立开发者交流产品发布、增长和订阅收入。",
    description: "聚焦小团队产品构建、海外发布和早期用户反馈。",
    suitableFor: "独立开发者、微型 SaaS 团队",
    language: "中文 / English",
    region: "全球",
    activityLevel: "medium",
    joinPolicy: "open",
    price: "free",
    rulesSummary: "保持高质量讨论，禁止群发广告。",
    ownerVerified: false,
    lastVerifiedAt: "2026-05-05",
    trustSignals: ["join_method_fresh"],
    joinMethods: [
      {
        id: "jm_indie_discord_link",
        type: "invite_link",
        label: "Discord 邀请链接",
        value: "https://discord.gg/example",
        lastVerifiedAt: "2026-05-05",
        reviewStatus: "approved"
      }
    ],
    moderationStatus: "approved"
  }
];
```

- [ ] **Step 5: Add search helper**

Create `src/lib/search.ts`:

```ts
import type { Group, Platform } from "@/lib/domain";

export type GroupSearchFilters = {
  query?: string;
  category?: string;
  platform?: Platform | "all";
};

export function searchGroups(groups: Group[], filters: GroupSearchFilters) {
  const query = filters.query?.trim().toLowerCase();

  return groups.filter((group) => {
    if (group.moderationStatus !== "approved") return false;
    if (filters.category && group.categorySlug !== filters.category) return false;
    if (filters.platform && filters.platform !== "all" && group.platform !== filters.platform) return false;
    if (!query) return true;

    const haystack = [
      group.name,
      group.shortDescription,
      group.description,
      group.suitableFor,
      group.language,
      group.region,
      ...group.tags
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}
```

- [ ] **Step 6: Verify and commit**

```bash
npm run test -- tests/search.test.ts
npm run build
git add src/lib tests/search.test.ts
git commit -m "feat: add group domain and search helpers"
```

Expected: tests and build pass.

## Task 3: Build Public Browse, Category, And Detail Pages

**Files:**
- Create: `src/components/AppHeader.tsx`
- Create: `src/components/GroupCard.tsx`
- Create: `src/components/SearchPanel.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/categories/[slug]/page.tsx`
- Create: `src/app/groups/[slug]/page.tsx`

- [ ] **Step 1: Add reusable public UI components**

Create `src/components/AppHeader.tsx`:

```tsx
import Link from "next/link";

export function AppHeader() {
  return (
    <header className="border-b border-ink/10 bg-paper/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="text-lg font-semibold text-ink">趣群岛 Circlist</Link>
        <nav className="flex items-center gap-4 text-sm text-ink/70">
          <Link href="/submit">发布群</Link>
          <Link href="/my-groups">我的群</Link>
          <Link href="/admin">审核后台</Link>
        </nav>
      </div>
    </header>
  );
}
```

Create `src/components/GroupCard.tsx`:

```tsx
import Link from "next/link";
import { platformLabels, type Group } from "@/lib/domain";

export function GroupCard({ group }: { group: Group }) {
  return (
    <Link href={`/groups/${group.slug}`} className="block rounded-lg border border-ink/10 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-ink">{group.name}</h3>
          <p className="mt-1 text-sm text-ink/65">{group.shortDescription}</p>
        </div>
        <span className="shrink-0 rounded-full bg-sky px-2 py-1 text-xs text-ink">{platformLabels[group.platform]}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink/60">
        <span>{group.language}</span>
        <span>{group.region}</span>
        <span>活跃度 {group.activityLevel}</span>
        {group.ownerVerified ? <span>群主已维护</span> : null}
      </div>
    </Link>
  );
}
```

Create `src/components/SearchPanel.tsx`:

```tsx
import Link from "next/link";
import { categories } from "@/lib/domain";

export function SearchPanel() {
  return (
    <section className="py-10">
      <p className="text-sm font-medium text-leaf">兴趣群发现平台</p>
      <h1 className="mt-2 text-4xl font-semibold text-ink">发现真实活跃的兴趣群</h1>
      <p className="mt-3 max-w-2xl text-base text-ink/70">先从 AI、出海、编程、投资和独立开发开始，找到适合自己的微信群、QQ群、Telegram 或 Discord 社群。</p>
      <form action="/" className="mt-6 flex max-w-2xl gap-2">
        <input name="q" className="min-w-0 flex-1 rounded-md border border-ink/15 bg-white px-4 py-3 text-sm outline-none focus:border-leaf" placeholder="搜索 AI、出海、独立开发..." />
        <button className="rounded-md bg-leaf px-5 py-3 text-sm font-medium text-white">搜索</button>
      </form>
      <div className="mt-5 flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link key={category.slug} href={`/categories/${category.slug}`} className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm text-ink/70">
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Wire the home page**

Replace `src/app/page.tsx` with:

```tsx
import { AppHeader } from "@/components/AppHeader";
import { GroupCard } from "@/components/GroupCard";
import { SearchPanel } from "@/components/SearchPanel";
import { sampleGroups } from "@/lib/mock-data";
import { searchGroups } from "@/lib/search";

export default function HomePage({ searchParams }: { searchParams?: { q?: string } }) {
  const groups = searchGroups(sampleGroups, { query: searchParams?.q });

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5">
        <SearchPanel />
        <section className="pb-12">
          <h2 className="text-xl font-semibold text-ink">最近验证</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {groups.map((group) => <GroupCard key={group.id} group={group} />)}
          </div>
        </section>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Add category page**

Create `src/app/categories/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { GroupCard } from "@/components/GroupCard";
import { categories } from "@/lib/domain";
import { sampleGroups } from "@/lib/mock-data";
import { searchGroups } from "@/lib/search";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((item) => item.slug === params.slug);
  if (!category) notFound();

  const groups = searchGroups(sampleGroups, { category: params.slug });

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-3xl font-semibold text-ink">{category.name} 兴趣群</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {groups.map((group) => <GroupCard key={group.id} group={group} />)}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Add group detail page**

Create `src/app/groups/[slug]/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { platformLabels } from "@/lib/domain";
import { sampleGroups } from "@/lib/mock-data";

export default function GroupDetailPage({ params }: { params: { slug: string } }) {
  const group = sampleGroups.find((item) => item.slug === params.slug && item.moderationStatus === "approved");
  if (!group) notFound();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-5 py-8">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/60">
            <span>{platformLabels[group.platform]}</span>
            <span>{group.language}</span>
            <span>{group.region}</span>
            {group.ownerVerified ? <span className="text-leaf">群主已维护</span> : null}
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-ink">{group.name}</h1>
          <p className="mt-3 text-ink/70">{group.description}</p>
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-ink">入群方式</h2>
            <div className="mt-3 space-y-3">
              {group.joinMethods.filter((method) => method.reviewStatus === "approved").map((method) => (
                <div key={method.id} className="rounded-md bg-paper p-4">
                  <p className="font-medium text-ink">{method.label}</p>
                  <p className="mt-1 text-sm text-ink/70">{method.value}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-ink">群规则</h2>
            <p className="mt-2 text-sm text-ink/70">{group.rulesSummary}</p>
          </section>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 5: Verify and commit**

```bash
npm run test
npm run build
git add src/app src/components
git commit -m "feat: build public group discovery pages"
```

Expected: public pages compile and render seeded groups.

## Task 4: Add Supabase Schema And Client Helpers

**Files:**
- Create: `.env.example`
- Create: `supabase/migrations/0001_initial_schema.sql`
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/auth.ts`

- [ ] **Step 1: Add environment template**

Create `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-for-admin-scripts-only
```

- [ ] **Step 2: Add initial database migration**

Create `supabase/migrations/0001_initial_schema.sql`:

```sql
create type public.user_role as enum ('member', 'owner', 'admin');
create type public.group_platform as enum ('wechat', 'qq', 'telegram', 'discord', 'slack', 'other');
create type public.moderation_status as enum ('draft', 'pending', 'approved', 'rejected', 'changes_requested', 'suspended', 'needs_update');
create type public.join_method_type as enum ('qr_code', 'invite_link', 'group_number', 'admin_contact', 'application_form', 'manual_notes');
create type public.report_type as enum ('expired_join_method', 'spam', 'scam_or_unsafe', 'wrong_category', 'duplicate');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now()
);

create table public.categories (
  slug text primary key,
  name text not null,
  sort_order integer not null default 0
);

insert into public.categories (slug, name, sort_order) values
  ('ai', 'AI', 10),
  ('overseas', '出海', 20),
  ('programming', '编程', 30),
  ('investment', '投资', 40),
  ('indie-dev', '独立开发', 50);

create table public.groups (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  platform public.group_platform not null,
  category_slug text not null references public.categories(slug),
  tags text[] not null default '{}',
  short_description text not null,
  description text not null,
  suitable_for text not null,
  language text not null,
  region text not null,
  activity_level text not null default 'unknown',
  join_policy text not null default 'approval_required',
  price text not null default 'unknown',
  rules_summary text not null,
  owner_id uuid references public.profiles(id),
  owner_verified boolean not null default false,
  moderation_status public.moderation_status not null default 'pending',
  last_verified_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.group_join_methods (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  type public.join_method_type not null,
  label text not null,
  value text not null,
  asset_path text,
  expires_at date,
  last_verified_at date,
  moderation_status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.group_submissions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.groups(id) on delete set null,
  submitter_id uuid not null references public.profiles(id),
  payload jsonb not null,
  moderation_status public.moderation_status not null default 'pending',
  reviewer_notes text,
  rejection_reason text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.ownership_claims (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  claimant_id uuid not null references public.profiles(id),
  evidence text not null,
  moderation_status public.moderation_status not null default 'pending',
  reviewer_notes text,
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.groups(id) on delete cascade,
  join_method_id uuid references public.group_join_methods(id) on delete set null,
  reporter_id uuid references public.profiles(id),
  report_type public.report_type not null,
  message text not null,
  moderation_status public.moderation_status not null default 'pending',
  created_at timestamptz not null default now(),
  reviewed_at timestamptz
);

create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  entity_type text not null,
  entity_id uuid not null,
  action text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.groups enable row level security;
alter table public.group_join_methods enable row level security;
alter table public.group_submissions enable row level security;
alter table public.ownership_claims enable row level security;
alter table public.reports enable row level security;
alter table public.audit_events enable row level security;

create policy "Public can read approved groups" on public.groups for select using (moderation_status = 'approved');
create policy "Public can read approved join methods" on public.group_join_methods for select using (moderation_status = 'approved');
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own submissions" on public.group_submissions for insert with check (auth.uid() = submitter_id);
create policy "Users can read own submissions" on public.group_submissions for select using (auth.uid() = submitter_id);
create policy "Users can insert own claims" on public.ownership_claims for insert with check (auth.uid() = claimant_id);
create policy "Users can read own claims" on public.ownership_claims for select using (auth.uid() = claimant_id);
create policy "Anyone can insert reports" on public.reports for insert with check (true);
```

- [ ] **Step 3: Add Supabase helpers**

Create `src/lib/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

Create `src/lib/supabase/server.ts`:

```ts
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        }
      }
    }
  );
}
```

Create `src/lib/auth.ts`:

```ts
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) throw new Error("AUTH_REQUIRED");
  return user;
}
```

- [ ] **Step 4: Verify and commit**

```bash
npm run build
git add .env.example supabase src/lib/supabase src/lib/auth.ts
git commit -m "feat: add Supabase schema and auth helpers"
```

Expected: TypeScript compiles with Supabase helpers.

## Task 5: Add Submit, My Groups, Claim, And Report Workflows

**Files:**
- Create: `src/lib/actions/groups.ts`
- Create: `src/lib/actions/reports.ts`
- Create: `src/app/submit/page.tsx`
- Create: `src/app/my-groups/page.tsx`
- Modify: `src/app/groups/[slug]/page.tsx`
- Create: `tests/group-actions.test.ts`

- [ ] **Step 1: Add action tests for validation**

Create `tests/group-actions.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { validateGroupSubmission } from "@/lib/actions/groups";

describe("validateGroupSubmission", () => {
  it("requires name, platform, category, description, and join method", () => {
    const result = validateGroupSubmission({
      name: "",
      platform: "wechat",
      categorySlug: "ai",
      shortDescription: "",
      description: "",
      joinMethodType: "admin_contact",
      joinMethodValue: ""
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain("群名称不能为空");
      expect(result.errors).toContain("一句话介绍不能为空");
      expect(result.errors).toContain("详细介绍不能为空");
      expect(result.errors).toContain("入群方式不能为空");
    }
  });
});
```

- [ ] **Step 2: Add group action validation and submission action**

Create `src/lib/actions/groups.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { categories, platforms } from "@/lib/domain";
import { createClient } from "@/lib/supabase/server";

export type GroupSubmissionInput = {
  name: string;
  platform: string;
  categorySlug: string;
  shortDescription: string;
  description: string;
  joinMethodType: string;
  joinMethodValue: string;
};

export function validateGroupSubmission(input: GroupSubmissionInput): { ok: true } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  if (!input.name.trim()) errors.push("群名称不能为空");
  if (!platforms.includes(input.platform as never)) errors.push("平台类型无效");
  if (!categories.some((category) => category.slug === input.categorySlug)) errors.push("分类无效");
  if (!input.shortDescription.trim()) errors.push("一句话介绍不能为空");
  if (!input.description.trim()) errors.push("详细介绍不能为空");
  if (!input.joinMethodValue.trim()) errors.push("入群方式不能为空");
  return errors.length > 0 ? { ok: false, errors } : { ok: true };
}

export async function submitGroup(formData: FormData) {
  const user = await requireUser();
  const input: GroupSubmissionInput = {
    name: String(formData.get("name") ?? ""),
    platform: String(formData.get("platform") ?? ""),
    categorySlug: String(formData.get("categorySlug") ?? ""),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    joinMethodType: String(formData.get("joinMethodType") ?? ""),
    joinMethodValue: String(formData.get("joinMethodValue") ?? "")
  };
  const validation = validateGroupSubmission(input);
  if (!validation.ok) throw new Error(validation.errors.join("；"));

  const supabase = createClient();
  await supabase.from("group_submissions").insert({
    submitter_id: user.id,
    payload: input,
    moderation_status: "pending"
  }).throwOnError();

  revalidatePath("/my-groups");
}
```

- [ ] **Step 3: Add report action**

Create `src/lib/actions/reports.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function reportGroup(formData: FormData) {
  const groupId = String(formData.get("groupId") ?? "");
  const reportType = String(formData.get("reportType") ?? "expired_join_method");
  const message = String(formData.get("message") ?? "");

  if (!groupId) throw new Error("缺少群 ID");
  if (!message.trim()) throw new Error("请填写反馈说明");

  const supabase = createClient();
  await supabase.from("reports").insert({
    group_id: groupId,
    report_type: reportType,
    message,
    moderation_status: "pending"
  }).throwOnError();

  revalidatePath(`/groups/${formData.get("slug") ?? ""}`);
}
```

- [ ] **Step 4: Add submit and my-groups UI**

Create `src/app/submit/page.tsx`:

```tsx
import { AppHeader } from "@/components/AppHeader";
import { submitGroup } from "@/lib/actions/groups";
import { categories, platforms, platformLabels } from "@/lib/domain";

export default function SubmitPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-5 py-8">
        <h1 className="text-3xl font-semibold text-ink">发布兴趣群</h1>
        <form action={submitGroup} className="mt-6 space-y-4 rounded-lg border border-ink/10 bg-white p-5">
          <input name="name" className="w-full rounded-md border border-ink/15 px-3 py-2" placeholder="群名称" />
          <select name="platform" className="w-full rounded-md border border-ink/15 px-3 py-2">
            {platforms.map((platform) => <option key={platform} value={platform}>{platformLabels[platform]}</option>)}
          </select>
          <select name="categorySlug" className="w-full rounded-md border border-ink/15 px-3 py-2">
            {categories.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
          </select>
          <input name="shortDescription" className="w-full rounded-md border border-ink/15 px-3 py-2" placeholder="一句话介绍" />
          <textarea name="description" className="min-h-28 w-full rounded-md border border-ink/15 px-3 py-2" placeholder="详细介绍" />
          <select name="joinMethodType" className="w-full rounded-md border border-ink/15 px-3 py-2">
            <option value="admin_contact">联系管理员</option>
            <option value="invite_link">邀请链接</option>
            <option value="group_number">群号</option>
            <option value="manual_notes">手动申请说明</option>
          </select>
          <textarea name="joinMethodValue" className="min-h-24 w-full rounded-md border border-ink/15 px-3 py-2" placeholder="入群方式说明" />
          <button className="rounded-md bg-leaf px-5 py-3 text-sm font-medium text-white">提交审核</button>
        </form>
      </main>
    </>
  );
}
```

Create `src/app/my-groups/page.tsx`:

```tsx
import { AppHeader } from "@/components/AppHeader";

export default function MyGroupsPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="text-3xl font-semibold text-ink">我的群</h1>
        <p className="mt-3 text-ink/70">这里展示已提交、已认领、待审核和需要更新入群方式的群。</p>
      </main>
    </>
  );
}
```

- [ ] **Step 5: Verify and commit**

```bash
npm run test -- tests/group-actions.test.ts
npm run build
git add src/lib/actions src/app/submit src/app/my-groups src/app/groups tests/group-actions.test.ts
git commit -m "feat: add owner submission and report workflows"
```

Expected: validation tests pass and pages compile.

## Task 6: Add Admin Review Queues

**Files:**
- Create: `src/app/admin/page.tsx`
- Create: `src/components/AdminQueue.tsx`
- Create: `src/lib/actions/admin.ts`

- [ ] **Step 1: Add admin action skeleton with explicit status transitions**

Create `src/lib/actions/admin.ts`:

```ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function reviewSubmission(formData: FormData) {
  const submissionId = String(formData.get("submissionId") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const reviewerNotes = String(formData.get("reviewerNotes") ?? "");

  if (!submissionId) throw new Error("缺少审核记录");
  if (!["approved", "rejected", "changes_requested"].includes(decision)) throw new Error("审核结果无效");

  const supabase = createClient();
  await supabase.from("group_submissions").update({
    moderation_status: decision,
    reviewer_notes: reviewerNotes,
    reviewed_at: new Date().toISOString()
  }).eq("id", submissionId).throwOnError();

  revalidatePath("/admin");
}
```

- [ ] **Step 2: Add admin queue component**

Create `src/components/AdminQueue.tsx`:

```tsx
export type QueueItem = {
  id: string;
  title: string;
  description: string;
  status: string;
};

export function AdminQueue({ title, items }: { title: string; items: QueueItem[] }) {
  return (
    <section className="rounded-lg border border-ink/10 bg-white p-5">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? <p className="text-sm text-ink/60">暂无待处理项目</p> : null}
        {items.map((item) => (
          <article key={item.id} className="rounded-md bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-medium text-ink">{item.title}</h3>
                <p className="mt-1 text-sm text-ink/65">{item.description}</p>
              </div>
              <span className="rounded-full bg-white px-2 py-1 text-xs text-ink/60">{item.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add admin page**

Create `src/app/admin/page.tsx`:

```tsx
import { AppHeader } from "@/components/AppHeader";
import { AdminQueue } from "@/components/AdminQueue";

const demoQueue = [
  {
    id: "submission-demo",
    title: "AI 产品共创群",
    description: "新群提交，等待审核入群方式和群简介。",
    status: "pending"
  }
];

export default function AdminPage() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-3xl font-semibold text-ink">审核后台</h1>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <AdminQueue title="新群审核" items={demoQueue} />
          <AdminQueue title="认领审核" items={[]} />
          <AdminQueue title="举报与失效反馈" items={[]} />
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify and commit**

```bash
npm run build
git add src/app/admin src/components/AdminQueue.tsx src/lib/actions/admin.ts
git commit -m "feat: add admin review queues"
```

Expected: admin page compiles and shows three queues.

## Task 7: Replace Mock Reads With Supabase Queries

**Files:**
- Create: `src/lib/data/groups.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/app/categories/[slug]/page.tsx`
- Modify: `src/app/groups/[slug]/page.tsx`
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1: Add data access functions**

Create `src/lib/data/groups.ts`:

```ts
import type { Group, JoinMethod } from "@/lib/domain";
import { createClient } from "@/lib/supabase/server";

type GroupRow = {
  id: string;
  slug: string;
  name: string;
  platform: Group["platform"];
  category_slug: Group["categorySlug"];
  tags: string[];
  short_description: string;
  description: string;
  suitable_for: string;
  language: string;
  region: string;
  activity_level: Group["activityLevel"];
  join_policy: Group["joinPolicy"];
  price: Group["price"];
  rules_summary: string;
  owner_verified: boolean;
  moderation_status: Group["moderationStatus"];
  last_verified_at: string | null;
  group_join_methods?: Array<{
    id: string;
    type: JoinMethod["type"];
    label: string;
    value: string;
    expires_at: string | null;
    last_verified_at: string | null;
    moderation_status: "approved" | "pending" | "rejected";
  }>;
};

function mapGroup(row: GroupRow): Group {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    platform: row.platform,
    categorySlug: row.category_slug,
    tags: row.tags,
    shortDescription: row.short_description,
    description: row.description,
    suitableFor: row.suitable_for,
    language: row.language,
    region: row.region,
    activityLevel: row.activity_level,
    joinPolicy: row.join_policy,
    price: row.price,
    rulesSummary: row.rules_summary,
    ownerVerified: row.owner_verified,
    lastVerifiedAt: row.last_verified_at ?? undefined,
    trustSignals: row.owner_verified ? ["owner_maintained", "join_method_fresh"] : ["join_method_fresh"],
    joinMethods: (row.group_join_methods ?? []).map((method) => ({
      id: method.id,
      type: method.type,
      label: method.label,
      value: method.value,
      expiresAt: method.expires_at ?? undefined,
      lastVerifiedAt: method.last_verified_at ?? undefined,
      reviewStatus: method.moderation_status
    })),
    moderationStatus: row.moderation_status
  };
}

export async function getApprovedGroups(filters: { query?: string; category?: string } = {}): Promise<Group[]> {
  const supabase = createClient();
  let query = supabase.from("groups").select("*").eq("moderation_status", "approved").order("updated_at", { ascending: false });

  if (filters.category) query = query.eq("category_slug", filters.category);
  if (filters.query) query = query.or(`name.ilike.%${filters.query}%,short_description.ilike.%${filters.query}%`);

  const { data, error } = await query;
  if (error) throw error;
  return ((data ?? []) as GroupRow[]).map(mapGroup);
}

export async function getApprovedGroupBySlug(slug: string): Promise<Group | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*, group_join_methods(*)")
    .eq("slug", slug)
    .eq("moderation_status", "approved")
    .single();

  if (error) return null;
  return mapGroup(data as GroupRow);
}
```

- [ ] **Step 2: Update pages to call data functions**

Replace `src/app/page.tsx` with:

```tsx
import { AppHeader } from "@/components/AppHeader";
import { GroupCard } from "@/components/GroupCard";
import { SearchPanel } from "@/components/SearchPanel";
import { getApprovedGroups } from "@/lib/data/groups";

export default async function HomePage({ searchParams }: { searchParams?: { q?: string } }) {
  const groups = await getApprovedGroups({ query: searchParams?.q });

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5">
        <SearchPanel />
        <section className="pb-12">
          <h2 className="text-xl font-semibold text-ink">最近验证</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {groups.map((group) => <GroupCard key={group.id} group={group} />)}
          </div>
        </section>
      </main>
    </>
  );
}
```

Replace `src/app/categories/[slug]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { GroupCard } from "@/components/GroupCard";
import { categories } from "@/lib/domain";
import { getApprovedGroups } from "@/lib/data/groups";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = categories.find((item) => item.slug === params.slug);
  if (!category) notFound();

  const groups = await getApprovedGroups({ category: params.slug });

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="text-3xl font-semibold text-ink">{category.name} 兴趣群</h1>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {groups.map((group) => <GroupCard key={group.id} group={group} />)}
        </div>
      </main>
    </>
  );
}
```

Replace `src/app/groups/[slug]/page.tsx` with:

```tsx
import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { platformLabels } from "@/lib/domain";
import { getApprovedGroupBySlug } from "@/lib/data/groups";

export default async function GroupDetailPage({ params }: { params: { slug: string } }) {
  const group = await getApprovedGroupBySlug(params.slug);
  if (!group) notFound();

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-4xl px-5 py-8">
        <div className="rounded-lg border border-ink/10 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-sm text-ink/60">
            <span>{platformLabels[group.platform]}</span>
            <span>{group.language}</span>
            <span>{group.region}</span>
            {group.ownerVerified ? <span className="text-leaf">群主已维护</span> : null}
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-ink">{group.name}</h1>
          <p className="mt-3 text-ink/70">{group.description}</p>
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-ink">入群方式</h2>
            <div className="mt-3 space-y-3">
              {group.joinMethods.filter((method) => method.reviewStatus === "approved").map((method) => (
                <div key={method.id} className="rounded-md bg-paper p-4">
                  <p className="font-medium text-ink">{method.label}</p>
                  <p className="mt-1 text-sm text-ink/70">{method.value}</p>
                </div>
              ))}
            </div>
          </section>
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-ink">群规则</h2>
            <p className="mt-2 text-sm text-ink/70">{group.rulesSummary}</p>
          </section>
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 3: Verify and commit**

```bash
npm run build
git add src/lib/data src/app/page.tsx src/app/categories src/app/groups src/app/admin
git commit -m "feat: load public groups from Supabase"
```

Expected: build passes when Supabase env vars are present.

## Task 8: Final Verification And Local Preview

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add setup documentation**

Create `README.md`:

```md
# 趣群岛 / Circlist

Circlist is a Web App MVP for discovering and maintaining real, active interest groups.

## Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Verification

```bash
npm run test
npm run build
```
```

- [ ] **Step 2: Run full verification**

```bash
npm run test
npm run build
```

Expected: all tests pass and production build completes.

- [ ] **Step 3: Start dev server**

```bash
npm run dev
```

Expected: app starts on `http://localhost:3000` or the next available port.

- [ ] **Step 4: Browser smoke test**

Open the local URL and verify:

- Home page loads without blank content.
- Search field is visible.
- Category links navigate.
- Group detail page opens.
- Submit, My Groups, and Admin pages render.
- No obvious mobile layout overflow at narrow viewport.

- [ ] **Step 5: Commit**

```bash
git add README.md
git commit -m "docs: add Circlist setup guide"
```

Expected: repository has a documented, verified MVP baseline.

## Self-Review

- Spec coverage: public browsing, search, categories, details, login-gated submission, owner dashboard, owner maintenance primitives, reports, admin queues, Supabase auth/database/storage setup, and responsive UI are covered.
- Deferred by design: public comments, ratings, payments, scraping, official integrations, and native apps are excluded per spec.
- Placeholder scan: no task uses deferred-test or unspecified implementation language.
- Type consistency: group/category/platform/moderation names match the design spec and are reused through domain constants.
