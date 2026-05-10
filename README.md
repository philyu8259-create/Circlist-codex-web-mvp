# 趣群岛 / Circlist

趣群岛 / Circlist is a Web App MVP for discovering and maintaining real, active interest groups. The MVP helps visitors browse approved groups, inspect group details, and use community signals to find useful circles across AI, overseas business, programming, investing, and indie development.

## Development

Install dependencies and start the local Next.js app:

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app reads Supabase configuration from:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for browser/server access to Supabase-backed public data. `NEXT_PUBLIC_SITE_URL` should be the deployed public origin, for example `https://circlist.example.com`, so SEO metadata, sitemap, and auth links use the right URL. `SUPABASE_SERVICE_ROLE_KEY` is for admin scripts and server-only auth email generation only; it must not be exposed to the browser.

For local preview, the public group catalog falls back to bundled sample data when the public Supabase env vars are not configured.

## Supabase Setup

Apply the database migrations to a linked Supabase project:

```bash
npx supabase db push
```

Then seed the bundled real-community catalog into Supabase:

```bash
npm run seed:samples -- --dry-run
npm run seed:samples
```

The seed command reads `.env.local` and requires `NEXT_PUBLIC_SUPABASE_URL` plus `SUPABASE_SERVICE_ROLE_KEY`. The service role key is only used by the local script and must stay out of browser-exposed environments.

To make a signed-in user an admin, have them sign in once, then run:

```bash
npm run admin:promote -- user@example.com
```

Supabase's built-in email provider is heavily rate-limited. For local testing,
you can generate a one-time login link without sending email:

```bash
npm run auth:link -- user@example.com
```

For production sign-in emails, configure the Resend channel in `.env.local` or
your deployment environment:

```bash
RESEND_API_KEY=
AUTH_EMAIL_FROM=Circlist <login@yourdomain.com>
AUTH_EMAIL_REPLY_TO=
```

When `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, and `SUPABASE_SERVICE_ROLE_KEY` are
present, Circlist generates the Supabase magic link on the server and sends it
through Resend. Otherwise it falls back to Supabase's default email provider.

## Deployment Checklist

Before opening the MVP to external users:

1. Set these environment variables on the hosting platform:
   `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`,
   `RESEND_API_KEY`, `AUTH_EMAIL_FROM`, and optionally
   `AUTH_EMAIL_REPLY_TO`.
2. In Supabase Auth URL settings, add the deployed origin and callback URLs:
   `/auth/callback` and `/auth/confirm`.
3. Apply migrations and seed the catalog:
   `npx supabase db push`, then `npm run seed:samples`.
4. Promote the first operator account:
   `npm run admin:promote -- user@example.com`.
5. Confirm `/privacy`, `/terms`, `/robots.txt`, and `/sitemap.xml` resolve on
   the deployed domain.
6. Deployment commands:
   ```bash
   npm run deploy      # preview deployment
   npm run deploy:prod # production deployment
   ```
7. If CLI prompts for auth, run:
   ```bash
   npx vercel login
   ```
   then rerun step 6.

## Bilingual Behavior

Circlist supports Chinese and English in the MVP. Use `?lang=zh` or `?lang=en` on supported routes to select a language directly. The in-app language switch preserves the current path and updates the `lang` query parameter.

## Verification

Run these checks before handing off changes:

```bash
npm run test
npm run lint
npm run build
```
