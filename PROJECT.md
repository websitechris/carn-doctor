# Carnivore.Doctor — Project Master Reference

## What We Are Building

A US-wide directory of metabolic health practitioners open to carnivore and ketogenic approaches. The site captures traffic from people searching for carnivore doctors by state. It uses the framing of **metabolic health** and **therapeutic carbohydrate restriction** because practitioners cannot publicly endorse carnivore diets due to medical board guidelines.

Long-term monetisation is through test/scan referrals and pay-per-call health advisors.

## Current Tech Stack

| Area | Choice |
|------|--------|
| Framework | Next.js 16 (App Router) |
| Hosting | Vercel |
| Database | Supabase (PostgreSQL), `carnivore` schema |
| Styling | Tailwind CSS + `@tailwindcss/typography` |
| Language | TypeScript |
| Repository | GitHub: [websitechris/carn-doctor](https://github.com/websitechris/carn-doctor) |
| Preview / staging | Vercel: [carn-doctor.vercel.app](https://carn-doctor.vercel.app) |
| Production domain | [carnivore.doctor](https://carnivore.doctor) (WordPress — live, keep running) |
| IDE | Cursor |
| Bulk articles | ZimmWriter |

## Live URLs

| URL | Purpose |
|-----|---------|
| [https://carn-doctor.vercel.app](https://carn-doctor.vercel.app) | Next.js app (in development) |
| [https://carnivore.doctor](https://carnivore.doctor) | WordPress — live; keep running |
| [https://carn-doctor.vercel.app/directory/alabama](https://carn-doctor.vercel.app/directory/alabama) | Example state directory (working) |
| [https://carn-doctor.vercel.app/admin](https://carn-doctor.vercel.app/admin) | Admin dashboard |
| [https://carn-doctor.vercel.app/articles](https://carn-doctor.vercel.app/articles) | Articles index |

## Database Structure (Supabase)

Schema: **`carnivore`**.

### 1. `experts`

YouTube / national doctors (`state_code` NULL) and state practitioners (`state_code` = `'AL'`, etc.).

**Key columns:** `name`, `credentials`, `practice_name`, `category`, `tier` (1/2/3), `flags`, `phone`, `evidence_summary`, `state_code`, `is_telehealth`, `site_id`, `youtube_id`, `scientific_hook`, `website`, `address`, `city`, `lat`, `lng`

### 2. `state_directory_content`

Research content per state.

**Key columns:** `state_slug`, `state_name`, `executive_summary`, `academic_vanguard`, `private_sector_analysis`, `functional_landscape`, `dpc_revolution`, `meta_description`

### 3. `clinical_tests`

Lab tests for the `/labs` page.

### 4. `articles`

Blog posts (ZimmWriter output).

**Key columns:** `slug`, `title`, `content` (HTML), `state_code`, `category`, `published`, `excerpt`, `meta_description`

## Site Architecture (Pages & Routes)

| Route | Description |
|-------|-------------|
| `/` | Homepage: hero, state grid, YouTube experts |
| `/directory/[state]` | State directory with 5 tabs: **Overview** \| **Directory** \| **Insights** \| **National Experts** \| **Tests & Guidance** |
| `/articles` | Articles index |
| `/articles/[slug]` | Individual article |
| `/labs` | Clinical tests broker page |
| `/admin` | Admin dashboard (Experts, Tests, Articles tabs) |

All legacy WordPress URLs use **301 redirects** in `next.config.ts` to the new clean URLs.

## Auth & Security

### Admin login flow

The `/admin` area is gated by a signed-cookie session.

- **`proxy.ts`** — runs on every `/admin/*` request. Lets `/admin/login` and `/admin/logout` through unauthenticated; otherwise verifies the `admin_session` cookie or redirects to `/admin/login`.
- **`lib/admin-session.ts`** — HMAC-SHA-256 signs and verifies the cookie. 30-day TTL; httpOnly; sameSite=lax; secure in production. Uses Web Crypto, no external dependencies.
- **`app/admin/login/page.tsx`** + **`app/admin/login/actions.ts`** — password form. The `loginAction` server action does a timing-safe compare against `ADMIN_PASSWORD`, signs a session, and sets the cookie.
- **`app/admin/logout/route.ts`** — clears the cookie and redirects.

### Server-action pattern for admin writes

All admin writes go through server actions. Pattern (see `app/admin/actions.ts`):

1. `'use server'` directive at the top of the file.
2. `requireAdmin()` reads the session cookie and calls `verifySession`. Throws if invalid.
3. The handler uses `getSupabaseAdmin()` from `lib/supabase-admin.ts`, which builds a Supabase client with `SUPABASE_SERVICE_ROLE_KEY`.
4. `lib/supabase-admin.ts` imports `'server-only'` so it cannot be accidentally bundled to the client.

The service role key bypasses RLS, which is why these writes succeed against tables that anon cannot write to.

### RLS model

- All carnivore-schema tables have RLS enabled.
- Anon role: SELECT-only policies (e.g. `articles` filters drafts via `published = true`).
- No INSERT/UPDATE/DELETE policies for anon. Any non-SELECT request from the anon key returns `42501`.
- Service role bypasses RLS. Admin writes use this key from the server only.
- **`supabase/migrations/0001_lock_admin_writes.sql` is the source of truth for the current RLS policy state.** If the policies in Supabase ever drift from that file, re-applying it should restore them — it's idempotent (`DROP POLICY IF EXISTS`).

### Don't break this

- **Never** call `supabase.from(...).insert/update/delete(...)` from a client component or page. Client code uses the anon key, which is write-blocked. All mutations go through a server action that uses `getSupabaseAdmin()`.
- **When adding a new table to the carnivore schema:**
  1. `ALTER TABLE carnivore.<name> ENABLE ROW LEVEL SECURITY;`
  2. Add an explicit anon `SELECT` policy if the table is publicly readable.
  3. Do not add INSERT/UPDATE/DELETE policies for anon. Writes go through service_role.
  4. Add a new numbered migration in `supabase/migrations/` so the policy state stays reproducible.
- Never log or commit `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, or `ADMIN_SESSION_SECRET`.

### Required environment variables

| Var | Where used | Notes |
|-----|------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase.ts`, `lib/supabase-admin.ts` | Public — exposed to the browser. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` | Public. RLS is what protects the data. |
| `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase-admin.ts` (server only) | **Secret.** Bypasses RLS. Never expose. |
| `ADMIN_PASSWORD` | `app/admin/login/actions.ts` | **Secret.** Single shared admin password. |
| `ADMIN_SESSION_SECRET` | `lib/admin-session.ts` | **Secret.** HMAC key for the session cookie. Rotating this invalidates all existing sessions. |

## Content Strategy

- **51 state pages** with unique, deep research content.
- **Minimum 255 articles:** 5 blog posts per state.
- **Article categories** align with Insights tab accordion themes: `abom`, `dpc`, `functional`, `telehealth`.
- **ZimmWriter** generates articles using keyword research (Keysearch, Keywords Everywhere).
- **Internal linking** via ZimmWriter link packs: all 51 state URLs + all article slugs.
- **Key Trends** accordion in the Insights tab links out to articles.

## ZimmWriter Content Pipeline

1. Keyword research with [Keysearch.co](https://keysearch.co).
2. **SEO Keywords to Titles** produces 5 title options per keyword.
3. Export **CSV** with titles and slugs.
4. Build a **link pack**: all 51 state URLs + planned article URLs (pipe symbol for URLs not yet live).
5. Run **Bulk Blog Writer** for all articles in one job.
6. **Output:** HTML files + image assets.
7. Paste HTML into **Admin → Articles**; save to Supabase.
8. Articles auto-link to state directories and other posts.

## Monetisation Plan

| Stream | Notes |
|--------|--------|
| **Primary** | Test/scan referrals (e.g. CAC scan, DEXA, fasting insulin, NMR lipid panel). |
| **Secondary** | Pay-per-call health advisor broker. |
| **Future** | Affiliate links (home test kits, supplements). |

**Funnel:** The **Tests & Guidance** tab on every state page and the central **`/labs`** page drive conversions. Personal experience with tests supports credibility content.

## Current Status & What's Done

### Completed

- Next.js app deployed on Vercel.
- Supabase `carnivore` schema with all four tables.
- Alabama directory complete (56 practitioners, 5 tabs).
- Homepage: hero, state grid, YouTube experts.
- Admin dashboard (Experts, Tests, Articles).
- Admin area locked down: cookie auth, server-action writes via service-role key, RLS migration. (See Auth & Security.)
- Articles pipeline: table, page template, admin tab.
- 301 redirects for all 51 WordPress state URLs.
- `LEGACY_REDIRECTS` wired up in `next.config.ts`.
- Holding pages for `/labs`, `/tools/fat-ratio-calculator`, `/privacy-policy`, plus a global `app/not-found.tsx`.
- GitHub: `websitechris/carn-doctor`.

### In Progress

- YouTube video IDs need refresh (some stale).
- Overview tab: stat hero row needs a visual upgrade.
- ZimmWriter setup for article generation.

## Known Issues

- **Homepage hardcodes "12 National Experts"** rather than counting from the `experts` table — drifts whenever the YouTube experts list changes.
- **Four legacy article slugs redirect to non-existent articles.** `vegetarian-carnivore-design`, `very-low-carb-vegetarian`, `human-nutritional-science`, and `great-green-delusion` are wired up in `LEGACY_REDIRECTS` but the target slugs don't exist in `carnivore.articles` yet — these currently land on the styled 404. Either write the articles or repoint the redirects.
- **NavBar has no `/articles` link.** The articles index exists but isn't reachable from the global nav.
- **Admin "All articles" sidebar uses the anon client.** Works because RLS allows anon SELECT, but should be a server action for consistency with the rest of the admin write-pattern.
- **`/labs` is a holding page.** No longer a 404 trap, but needs real content built from the `clinical_tests` table.

## Immediate Next Steps

1. Polish `/labs` into a real page using the `clinical_tests` table (currently a holding page).
2. Visual upgrade to Overview tab (stat hero row).
3. Load remaining 50 states’ content into Supabase.
4. Set up ZimmWriter with keyword research.
5. Generate first article batch (Alabama — 5 posts).
6. Fix YouTube video IDs in the admin dashboard.
7. Eventually point **carnivore.doctor** at Vercel.

## Future Features (Backlog)

- State picker on homepage (dropdown or map).
- Individual practitioner detail pages with map.
- Referral/lead capture before outbound links to practice sites.
- Pay-per-call integration.
- Personal test-experience content (author credibility).
- Newsletter / email capture.
- Mobile app (evaluate).
- Automated practitioner data updates.
