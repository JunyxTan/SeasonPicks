# CelebrateHub — Event Vendor Marketplace (MVP)

A Next.js + Supabase starter project for an events/celebrations vendor platform:
- Browse vendors with filters
- Vendor profile pages + listings
- Quote / inquiry forms
- Simple admin approvals (MVP)

## 1) Setup

### Prerequisites
- Node.js 18+
- A Supabase project

### Install
```bash
npm install
```

### Configure environment
Copy `.env.example` → `.env.local` and fill:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 2) Create database tables
In Supabase SQL editor:
1) Run `supabase/schema.sql`
2) Run `supabase/seed.sql`

## 3) Run
```bash
npm run dev
```
Open http://localhost:3000

## 4) Notes (Important for production)
This MVP does NOT include authentication or Row Level Security (RLS).
Before launching publicly:
- Add Supabase Auth (vendors/admin)
- Enable RLS + policies
- Protect `/admin`
- Add vendor dashboard (CRUD listings, manage inquiries)

## Folder structure
- `src/app` — Next.js App Router pages
- `src/components` — UI components
- `src/lib` — Supabase client + types
- `supabase/` — schema + seed SQL
- `docs/` — UI layout, business model, landing copy

## Quick demo flow
1) Go to `/vendors/onboard` and submit a vendor (pending)
2) Go to `/admin` and approve vendor
3) Vendor appears on `/browse`
4) Click vendor → send quote request

---

Made for: event & celebration products/services (decor, catering, cakes, media, rentals, entertainment).
