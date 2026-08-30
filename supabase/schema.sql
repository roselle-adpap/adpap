-- =============================================================================
-- ADPAP Membership Application & Member Portal — Supabase Schema
-- =============================================================================
-- ADMIN SETUP REQUIRED
-- Run this entire file once in the Supabase SQL Editor (Project -> SQL Editor
-- -> New query -> paste -> Run) after creating your Supabase project.
--
-- This schema:
--   1. Creates all core tables (users, members, organizations, applications,
--      representatives, payments, membership_benefits, benefit_usage,
--      training_benefits, renewals, admin_users) with timestamps and
--      relationships.
--   2. Creates a Postgres sequence + function used to generate unique,
--      collision-free application reference numbers (ADPAP-YYYY-XXXXX).
--   3. Enables Row Level Security (RLS) on every table so the browser-side
--      "anon" key can be used safely — the public can only ever INSERT a new
--      application (via the Netlify Function, which uses the service_role
--      key and bypasses RLS) or SELECT the public verification view; regular
--      reads/writes to member and application data require an authenticated
--      admin_users account.
--   4. Creates a `public_members` VIEW that exposes only the fields that are
--      allowed to be shown on the public Membership Verification page.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ---------------------------------------------------------------------------
create extension if not exists "pgcrypto"; -- for gen_random_uuid()

-- ---------------------------------------------------------------------------
-- 2. REFERENCE NUMBER SEQUENCE
-- ---------------------------------------------------------------------------
create sequence if not exists applications_ref_seq start 1;

create or replace function next_application_sequence()
returns integer
language sql
as $$
  select nextval('applications_ref_seq')::integer;
$$;

-- ---------------------------------------------------------------------------
-- 3. CORE TABLES
-- ---------------------------------------------------------------------------

-- Generic auth-linked user profile (kept separate from Supabase Auth's own
-- auth.users table so the app can store additional profile fields).
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  email text unique not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Authorized Secretariat / admin accounts. An email must appear here (and be
-- a valid Supabase Auth user) to access the Admin Dashboard.
create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  role text not null default 'secretariat', -- 'secretariat' | 'superadmin'
  created_at timestamptz not null default now()
);

-- Organizations (for Institutional / Premium Institutional applications)
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  organization_type text,
  industry text,
  office_address text,
  website text,
  main_contact_name text,
  main_contact_position text,
  main_contact_email text,
  main_contact_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Membership applications. `payload` stores the complete submitted form as
-- JSONB (source of truth for full detail / audit trail); the individual
-- columns alongside it exist so the Secretariat can filter/search/report
-- without needing to unpack JSON on every query.
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  reference_number text unique not null,
  membership_type text not null check (membership_type in ('individual','institutional','premium_institutional')),
  status text not null default 'submitted' check (status in
    ('draft','submitted','for_review','payment_verification','approved','active','rejected','expired','renewal_due')),
  contact_name text not null,
  contact_email text not null,
  organization_id uuid references organizations(id) on delete set null,
  amount_due numeric(10,2) not null,
  proof_of_payment_url text,
  payload jsonb not null,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_applications_status on applications(status);
create index if not exists idx_applications_type on applications(membership_type);
create index if not exists idx_applications_email on applications(contact_email);

-- Representatives named on Institutional / Premium Institutional applications
create table if not exists representatives (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  organization_id uuid references organizations(id) on delete cascade,
  full_name text not null,
  email text not null,
  mobile text,
  position text,
  data_privacy_role text,
  created_at timestamptz not null default now()
);

-- Approved / active members. Created when the Secretariat approves an
-- application (see adminData.ts -> approveApplication).
create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  membership_number text unique not null,
  application_id uuid references applications(id) on delete set null,
  reference_number text,
  email text not null,
  full_name_or_org text not null,
  membership_type text not null check (membership_type in ('individual','institutional','premium_institutional')),
  organization text,
  status text not null default 'approved' check (status in
    ('approved','active','expired','renewal_due')),
  founding_member boolean not null default false,
  start_date date not null default current_date,
  expiration_date date not null,
  benefits jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_members_status on members(status);
create index if not exists idx_members_email on members(email);
create index if not exists idx_members_expiration on members(expiration_date);

-- Payment records (an application may eventually have more than one, e.g. a
-- corrected re-upload)
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  member_id uuid references members(id) on delete set null,
  method text,
  amount numeric(10,2),
  payment_date date,
  reference_number text,
  payor_name text,
  proof_url text,
  verified boolean not null default false,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- Catalog of benefits per membership type (used to keep member.benefits in
-- sync and to power future self-service benefit displays)
create table if not exists membership_benefits (
  id uuid primary key default gen_random_uuid(),
  membership_type text not null check (membership_type in ('individual','institutional','premium_institutional')),
  benefit_key text not null,
  benefit_label text not null,
  benefit_value text,
  created_at timestamptz not null default now(),
  unique (membership_type, benefit_key)
);

-- Tracks consumption of limited-use benefits (e.g. "1 free exam review
-- session") per member.
create table if not exists benefit_usage (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  benefit_key text not null,
  used_at timestamptz not null default now(),
  notes text
);

-- Training benefit vouchers (DPO Novice / 2.0 / 3.0, etc). Voucher codes are
-- generated automatically when an Institutional/Premium application is
-- approved (see adminData.ts -> approveApplication) and stored on the
-- member's `benefits.trainingVouchers` JSONB. Institutions are NOT asked to
-- nominate an attendee at application time — they redeem a voucher whenever
-- they're ready (this year or later, e.g. for a new hire) by emailing
-- secretariat@gkphilippines.com with the code. This table exists so the
-- Secretariat can optionally log who was actually nominated once a voucher
-- is redeemed, for recordkeeping.
create table if not exists training_benefits (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references applications(id) on delete cascade,
  member_id uuid references members(id) on delete set null,
  nominee_name text,
  nominee_email text,
  nominee_mobile text,
  nominee_position text,
  selected_benefit text,
  status text not null default 'pending' check (status in ('pending','scheduled','completed')),
  created_at timestamptz not null default now()
);

-- Renewal history / reminders
create table if not exists renewals (
  id uuid primary key default gen_random_uuid(),
  member_id uuid references members(id) on delete cascade,
  previous_expiration_date date,
  new_expiration_date date,
  status text not null default 'pending' check (status in ('pending','reminder_60','reminder_30','reminder_7','expired','renewed')),
  payment_id uuid references payments(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 4. UPDATED_AT TRIGGERS
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_applications_updated_at on applications;
create trigger trg_applications_updated_at before update on applications
  for each row execute function set_updated_at();

drop trigger if exists trg_members_updated_at on members;
create trigger trg_members_updated_at before update on members
  for each row execute function set_updated_at();

drop trigger if exists trg_organizations_updated_at on organizations;
create trigger trg_organizations_updated_at before update on organizations
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- 5. PUBLIC VERIFICATION VIEW
-- Exposes ONLY the fields allowed on the public Membership Verification page.
-- ---------------------------------------------------------------------------
create or replace view public_members as
select
  membership_number,
  full_name_or_org,
  membership_type,
  status,
  expiration_date,
  founding_member
from members;

-- ---------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table users enable row level security;
alter table admin_users enable row level security;
alter table organizations enable row level security;
alter table applications enable row level security;
alter table representatives enable row level security;
alter table members enable row level security;
alter table payments enable row level security;
alter table membership_benefits enable row level security;
alter table benefit_usage enable row level security;
alter table training_benefits enable row level security;
alter table renewals enable row level security;

-- Helper: is the current authenticated user an admin?
create or replace function is_admin()
returns boolean language sql stable as $$
  select exists (
    select 1 from admin_users a
    join auth.users u on u.email = a.email
    where u.id = auth.uid()
  );
$$;

-- applications: no direct public SELECT/INSERT/UPDATE via the anon key.
-- All writes go through the Netlify Function using the service_role key
-- (which bypasses RLS entirely), keeping applicant PII out of reach of the
-- public anon key. Admins (authenticated Supabase Auth users present in
-- admin_users) can read and update.
create policy "admins can read applications" on applications
  for select using (is_admin());
create policy "admins can update applications" on applications
  for update using (is_admin());

create policy "admins can read representatives" on representatives
  for select using (is_admin());

create policy "admins can read organizations" on organizations
  for select using (is_admin());
create policy "admins can update organizations" on organizations
  for update using (is_admin());

create policy "admins can read payments" on payments
  for select using (is_admin());
create policy "admins can update payments" on payments
  for update using (is_admin());

-- members: the public may SELECT only through the public_members view
-- (granted below); full-row select/update is admin-only via the anon key.
-- The Member Portal login (netlify/functions/member-login.ts) uses the
-- service_role key server-side, which bypasses RLS entirely, so it does not
-- rely on the policy below. The policy is kept as a fallback for a future
-- version that has members sign in with real Supabase Auth accounts.
create policy "admins can read members" on members
  for select using (is_admin());
create policy "admins can update members" on members
  for update using (is_admin());
create policy "admins can insert members" on members
  for insert with check (is_admin());
create policy "members can read own record" on members
  for select using (auth.jwt() ->> 'email' = email);

create policy "admins can read benefits" on membership_benefits for select using (true);
create policy "admins manage benefit usage" on benefit_usage for all using (is_admin());
create policy "admins manage training benefits" on training_benefits for all using (is_admin());
create policy "admins manage renewals" on renewals for all using (is_admin());
create policy "admins manage admin_users" on admin_users for select using (is_admin());
create policy "admins manage users" on users for all using (is_admin());

-- Grant public (anon) read access to the safe verification view only.
grant select on public_members to anon;
grant usage on schema public to anon;

-- ---------------------------------------------------------------------------
-- 7. STORAGE BUCKET (run in Supabase Dashboard -> Storage if not using SQL)
-- ---------------------------------------------------------------------------
-- Create a bucket named "proof-of-payment" (private, not public) either via
-- the Dashboard UI or by running:
--   insert into storage.buckets (id, name, public) values ('proof-of-payment', 'proof-of-payment', false)
--   on conflict (id) do nothing;
insert into storage.buckets (id, name, public)
values ('proof-of-payment', 'proof-of-payment', false)
on conflict (id) do nothing;

-- Only the service_role key (used server-side in the Netlify Function) can
-- write to this bucket; no public storage policies are created, so it stays
-- private by default. The function generates time-limited signed URLs for
-- Secretariat viewing instead of making files public.

-- ---------------------------------------------------------------------------
-- 8. SEED: membership_benefits catalog (optional reference data)
-- ---------------------------------------------------------------------------
insert into membership_benefits (membership_type, benefit_key, benefit_label, benefit_value) values
  ('individual', 'dpia_builder', 'DPIA Builder Access', '1 year, value PHP 9,000'),
  ('individual', 'convention_discount', 'National Convention Discount', '20%'),
  ('individual', 'exam_review', 'Certification Exam Review Session', '1 free session'),
  ('individual', 'exam_retake_discount', 'Exam Retake Discount', '20%'),
  ('individual', 'merch_discount', 'Merchandise Discount', '10%'),
  ('institutional', 'dpo_novice_training', 'Free DPO Novice Training', 'value PHP 18,000'),
  ('institutional', 'representatives', 'Official Representatives', '2'),
  ('premium_institutional', 'dpo_novice_training', 'Free DPO Novice Training', 'value PHP 18,000'),
  ('premium_institutional', 'dpo_2_training', 'Free DPO 2.0 Self-Paced Training', 'value PHP 15,000'),
  ('premium_institutional', 'dpo_3_training', 'Free DPO 3.0 Self-Paced Training', 'value PHP 15,000'),
  ('premium_institutional', 'representatives', 'Official Representatives', '3')
on conflict (membership_type, benefit_key) do nothing;

-- =============================================================================
-- End of schema. Next steps:
--   1. Add your first admin: insert into admin_users (email, full_name, role)
--      values ('you@gkphilippines.com', 'Your Name', 'superadmin');
--   2. In Supabase Auth, create/invite that same email as a user so it can
--      sign in to the Admin Dashboard.
--   3. Configure the "proof-of-payment" bucket's file size limit (5MB) under
--      Storage -> proof-of-payment -> Configuration if you want it enforced
--      server-side too (the app already enforces this in the browser).
-- =============================================================================
