create table public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  decided_at timestamptz not null default now(),
  owner text,
  question jsonb not null,
  options jsonb not null default '[]',
  reasons jsonb not null default '[]',
  ai_stance text not null,
  confidence jsonb not null,
  revisit_by timestamptz,
  resolution jsonb,
  version int not null default 1,
  category text,
  created_at timestamptz not null default now()
);

alter table public.decisions enable row level security;

create policy "own_select" on public.decisions for select using (auth.uid() = user_id);
create policy "own_insert" on public.decisions for insert with check (auth.uid() = user_id);
create policy "own_update" on public.decisions for update using (auth.uid() = user_id);
create policy "own_delete" on public.decisions for delete using (auth.uid() = user_id);

create index decisions_user_decided_idx on public.decisions (user_id, decided_at desc);
