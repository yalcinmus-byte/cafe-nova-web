# cafe-nova-web

Cafe Nova Bistro website + **Nova Studio** CMS (Next.js 16 + Payload 3).

## Run it locally (Mac)
```bash
cd "~/Documents/Workspace/Cafe Nova/web"
npm install
cp .env.example .env     # first time only
npm run dev              # http://localhost:3000  ·  CMS: http://localhost:3000/admin
```
Dev login (change it on first sign-in): `owner@cafenova.local` / `nova-change-me`

Reset the demo content: `npx payload run src/seed/seed.ts`

## What's inside
| Path | What |
|---|---|
| `src/components/HeroFilm.tsx` | Scroll-scrubbed hero film (34.5 s), scene captions, chapter dots, reduced-motion fallback |
| `public/film/` | `hero-1280/960` in WebM (VP9) + MP4 (H.264), 6-frame keyframe interval for smooth reverse scrubbing; poster |
| `src/app/(frontend)/` | Home, `/menu`, `/events`, `/visit`, `/order?add=slug:qty`, `/llms.txt`, `/api/v1/menu`, `/api/v1/status` |
| `src/collections/` | Dishes, Menu sections, Festive & events, Seasonal themes (auto on/off), Photos, Team |
| `src/globals/` | **Service control** (pause all, website orders, collection, delivery, coffee shop, delivery-app links) and **Café details** |
| `src/admin/` | Nova Studio branding + "Today" dashboard |
| `src/seed/menu-data.ts` | October 2026 menu (91 dishes). Dishes without a price stay hidden on the site |

## Production (next step)
- Database: swap `@payloadcms/db-sqlite` for `@payloadcms/db-postgres` with Supabase (London) `DATABASE_URL`.
- Media: Supabase Storage via `@payloadcms/storage-s3`.
- Hosting: Vercel (region lhr1); domain `cafenovabistro.co.uk` via Cloudflare DNS.
- Ordering: Stripe checkout + kitchen screen (planned for 4 Jan 2027). Today `/order` shows the basket and points to the counter/delivery apps.
