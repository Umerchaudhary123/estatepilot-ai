create schema if not exists estatepilot;
set search_path to estatepilot, public;

create extension if not exists pgcrypto;
alter table users add column if not exists password_hash text;
alter table users add column if not exists password_updated_at timestamptz;
alter table organization_members drop constraint if exists organization_members_role_check;
alter table organization_members add constraint organization_members_role_check check(role in ('platform_admin','manager','agent','support','viewer'));
create index if not exists organization_members_access_idx on organization_members(organization_id, user_id, status);
