create schema if not exists estatepilot;
set search_path to estatepilot, public;

create extension if not exists pgcrypto;
create extension if not exists vector;

create table if not exists organizations (
  id text primary key,
  name text not null,
  slug text unique not null,
  country text not null default 'PK',
  timezone text not null default 'Asia/Karachi',
  plan text not null default 'portfolio',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  email text unique not null,
  full_name text not null,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  organization_id text not null references organizations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null check(role in ('platform_admin','manager','agent','viewer')),
  status text not null default 'active',
  primary key(organization_id,user_id)
);

create table if not exists agents (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  user_id uuid references users(id),
  name text not null,
  title text not null,
  phone text not null,
  territories text[] not null default '{}',
  capacity integer not null default 10,
  availability jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists properties (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  slug text unique not null,
  title text not null,
  description text not null,
  purpose text not null check(purpose in ('buy','rent')),
  property_type text not null,
  city text not null,
  area text not null,
  address text not null,
  latitude numeric(10,7),
  longitude numeric(10,7),
  price bigint not null,
  currency text not null default 'PKR',
  price_label text not null,
  bedrooms integer not null default 0,
  bathrooms integer not null default 0,
  size numeric not null,
  size_unit text not null,
  furnished boolean not null default false,
  amenities text[] not null default '{}',
  status text not null default 'available',
  verified boolean not null default false,
  featured boolean not null default false,
  match_score integer not null default 0,
  agent_id text references agents(id),
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists properties_search_idx on properties(organization_id,city,area,purpose,status);
create index if not exists properties_price_idx on properties(price);

create table if not exists property_images (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  property_id text not null references properties(id) on delete cascade,
  url text not null,
  alt_text text,
  position integer not null default 0
);

create table if not exists leads (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  name text not null,
  email text,
  phone text not null,
  purpose text not null check(purpose in ('buy','rent')),
  budget text not null,
  preferred_area text not null,
  score integer not null default 0 check(score between 0 and 100),
  score_explanation jsonb not null default '{}',
  temperature text not null default 'cold',
  stage text not null default 'new',
  source text not null default 'Website',
  assigned_agent_id text references agents(id),
  consent jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists leads_pipeline_idx on leads(organization_id,stage,temperature);

create table if not exists lead_preferences (
  lead_id text primary key references leads(id) on delete cascade,
  organization_id text not null references organizations(id) on delete cascade,
  property_types text[] default '{}',
  cities text[] default '{}',
  areas text[] default '{}',
  min_price bigint,
  max_price bigint,
  bedrooms integer,
  amenities text[] default '{}',
  move_in_date date,
  financing text,
  raw_preferences jsonb not null default '{}'
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  lead_id text references leads(id) on delete set null,
  channel text not null default 'website',
  status text not null default 'ai_active',
  assigned_agent_id text references agents(id),
  ai_summary text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_type text not null check(sender_type in ('customer','ai','agent','system')),
  content text not null,
  tool_calls jsonb,
  sources jsonb,
  created_at timestamptz not null default now()
);

create table if not exists saved_properties (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  lead_id text references leads(id) on delete cascade,
  property_id text not null references properties(id) on delete cascade,
  decision text default 'saved',
  unique(user_id,property_id)
);

create table if not exists appointments (
  id text primary key,
  organization_id text not null references organizations(id) on delete cascade,
  property_id text not null references properties(id),
  lead_id text references leads(id),
  lead_name text not null,
  agent_name text not null,
  viewing_date date not null,
  viewing_time text not null,
  viewing_type text not null check(viewing_type in ('physical','virtual')),
  status text not null default 'pending',
  notes text,
  calendar_event_id text,
  created_at timestamptz not null default now()
);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  name text not null,
  storage_path text not null,
  mime_type text not null,
  status text not null default 'processing',
  uploaded_by uuid references users(id),
  created_at timestamptz not null default now()
);

create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  document_id uuid not null references documents(id) on delete cascade,
  content text not null,
  page_number integer,
  embedding vector(1536),
  metadata jsonb not null default '{}'
);

create index if not exists document_chunks_org_idx on document_chunks(organization_id,document_id);

create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  name text not null,
  trigger_type text not null,
  status text not null default 'draft',
  settings jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists workflow_steps (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  workflow_id uuid not null references workflows(id) on delete cascade,
  position integer not null,
  delay_minutes integer not null default 0,
  channel text not null,
  template text not null,
  unique(workflow_id,position)
);

create table if not exists follow_up_jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  workflow_id uuid references workflows(id),
  lead_id text not null references leads(id),
  run_at timestamptz not null,
  status text not null default 'scheduled',
  attempts integer not null default 0,
  payload jsonb not null default '{}'
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  user_id uuid references users(id),
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists activities (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  actor_id uuid references users(id),
  entity_type text not null,
  entity_id text not null,
  action text not null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id text unique not null references organizations(id) on delete cascade,
  provider_customer_id text,
  plan text not null default 'portfolio',
  status text not null default 'active',
  current_period_end timestamptz,
  usage jsonb not null default '{}'
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id text not null references organizations(id) on delete cascade,
  actor_id uuid references users(id),
  action text not null,
  resource_type text not null,
  resource_id text,
  ip_address inet,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

do $$ declare t text; begin
  foreach t in array array['organization_members','agents','properties','property_images','leads','lead_preferences','conversations','messages','saved_properties','appointments','documents','document_chunks','workflows','workflow_steps','follow_up_jobs','notifications','activities','subscriptions','audit_logs'] loop
    execute format('alter table %I enable row level security',t);
    execute format('drop policy if exists tenant_isolation on %I',t);
    execute format('create policy tenant_isolation on %I using (organization_id = coalesce(nullif(current_setting(''app.organization_id'', true), ''''), organization_id)) with check (organization_id = coalesce(nullif(current_setting(''app.organization_id'', true), ''''), organization_id))',t);
  end loop;
end $$;
