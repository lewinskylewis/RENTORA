-- 0001_extensions_and_enums.sql
-- RENTORA core: extensions + enumerated types.
-- Enums keep status columns honest at the database layer (no invalid states).

create extension if not exists "pgcrypto";      -- gen_random_uuid(), digest()
create extension if not exists "citext";         -- case-insensitive email

-- ── Identity / roles ─────────────────────────────────────────────────────────
do $$ begin
  create type public.account_status as enum ('active', 'suspended', 'disabled');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.app_role as enum ('tenant', 'agent', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.role_status as enum ('pending', 'active', 'suspended', 'rejected');
exception when duplicate_object then null; end $$;

-- ── Agent / agency ───────────────────────────────────────────────────────────
do $$ begin
  create type public.verification_status as enum ('pending', 'verified', 'rejected', 'suspended');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.agency_status as enum ('active', 'suspended');
exception when duplicate_object then null; end $$;

-- ── Property / unit ──────────────────────────────────────────────────────────
do $$ begin
  create type public.property_status as enum ('draft', 'active', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.occupancy_status as enum ('vacant', 'reserved', 'occupied', 'maintenance');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.listing_status as enum ('private', 'published', 'hidden');
exception when duplicate_object then null; end $$;

-- ── Tenancy / invitation ─────────────────────────────────────────────────────
do $$ begin
  create type public.tenancy_status as enum (
    'invited', 'pending_confirmation', 'active', 'notice_given', 'ended', 'cancelled', 'disputed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.invitation_status as enum (
    'pending', 'matched', 'accepted', 'rejected', 'expired', 'cancelled'
  );
exception when duplicate_object then null; end $$;

-- ── Agent application ────────────────────────────────────────────────────────
do $$ begin
  create type public.application_status as enum (
    'pending', 'approved', 'rejected', 'needs_more_information'
  );
exception when duplicate_object then null; end $$;
