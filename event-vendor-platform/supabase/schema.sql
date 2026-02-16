-- CelebrateHub (Event Vendor Marketplace) Schema
-- Paste into Supabase SQL editor and run.

-- Enable required extensions
create extension if not exists pgcrypto;

-- Categories (2-level)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table if not exists subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  slug text unique not null
);

-- Vendor profiles
create table if not exists vendor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null, -- connect to auth.users in production
  category_id uuid null references categories(id) on delete set null,
  subcategory_id uuid null references subcategories(id) on delete set null,

  name text not null,
  description text,
  location text,
  coverage_area text,
  whatsapp text,
  min_budget numeric,
  lead_time_days int,
  is_halal boolean default false,
  tags text[],
  portfolio_urls text[],

  status text not null default 'pending', -- pending / approved / rejected
  created_at timestamptz not null default now()
);

-- Listings (products + services)
create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendor_profiles(id) on delete cascade,

  type text not null check (type in ('service','product')),
  title text not null,
  description text,
  price_type text not null check (price_type in ('fixed','from','quote')),
  price_value numeric,
  images text[],
  includes text[],
  addons text[],
  is_active boolean not null default true,

  created_at timestamptz not null default now()
);

-- Inquiries / Quote requests
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid not null references vendor_profiles(id) on delete cascade,
  listing_id uuid null references listings(id) on delete set null,

  event_type text not null check (event_type in ('birthday','wedding','corporate','baby_shower','graduation','festive','other')),
  event_date date,
  event_location text,
  budget_min numeric,
  budget_max numeric,
  pax int,

  customer_name text not null,
  customer_email text not null,
  customer_phone text,

  message text not null,
  status text not null default 'new', -- new / replied / closed
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_vendor_status on vendor_profiles(status);
create index if not exists idx_vendor_category on vendor_profiles(category_id);
create index if not exists idx_vendor_subcategory on vendor_profiles(subcategory_id);
create index if not exists idx_listings_vendor on listings(vendor_id);
create index if not exists idx_inquiries_vendor on inquiries(vendor_id);
