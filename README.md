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
SUPABASE_SERVICE_ROLE_KEY=
```

`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are required for browser/server access to Supabase-backed public data. `SUPABASE_SERVICE_ROLE_KEY` is for admin scripts only and must not be exposed to the browser.

For local preview, the public group catalog falls back to bundled sample data when the public Supabase env vars are not configured.

## Bilingual Behavior

Circlist supports Chinese and English in the MVP. Use `?lang=zh` or `?lang=en` on supported routes to select a language directly. The in-app language switch preserves the current path and updates the `lang` query parameter.

## Verification

Run these checks before handing off changes:

```bash
npm run test
npm run lint
npm run build
```
