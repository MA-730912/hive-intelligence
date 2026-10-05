-- HIVE Intelligence RAG foundation
-- Apply to a dedicated HIVE Intelligence Supabase project.

create extension if not exists vector with schema extensions;

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'clinician' check (role in ('admin','clinician','viewer')),
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table if not exists public.knowledge_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  source_filename text,
  storage_path text,
  mime_type text,
  status text not null default 'uploaded'
    check (status in ('uploaded','processing','ready','needs_extraction','failed')),
  checksum text,
  metadata jsonb not null default '{}'::jsonb,
  uploaded_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.knowledge_chunks (
  id bigint generated always as identity primary key,
  document_id uuid not null references public.knowledge_documents(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  char_count integer not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding extensions.vector(1536),
  created_at timestamptz not null default now(),
  unique(document_id, chunk_index)
);

create index if not exists knowledge_documents_org_idx
  on public.knowledge_documents(organization_id, created_at desc);

create index if not exists knowledge_chunks_document_idx
  on public.knowledge_chunks(document_id, chunk_index);

create index if not exists knowledge_chunks_org_idx
  on public.knowledge_chunks(organization_id);

create index if not exists knowledge_chunks_embedding_hnsw_idx
  on public.knowledge_chunks
  using hnsw (embedding vector_cosine_ops)
  where embedding is not null;

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.knowledge_documents enable row level security;
alter table public.knowledge_chunks enable row level security;

grant select on public.organizations to authenticated;
grant select on public.organization_members to authenticated;
grant select, insert, update, delete on public.knowledge_documents to authenticated;
grant select, insert, delete on public.knowledge_chunks to authenticated;
grant usage, select on all sequences in schema public to authenticated;

create policy "members can view their organization"
on public.organizations for select to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = organizations.id
      and m.user_id = (select auth.uid())
  )
);

create policy "users can view their own organization memberships"
on public.organization_members for select to authenticated
using (user_id = (select auth.uid()));

create policy "members can view organization documents"
on public.knowledge_documents for select to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = knowledge_documents.organization_id
      and m.user_id = (select auth.uid())
  )
);

create policy "admins can insert organization documents"
on public.knowledge_documents for insert to authenticated
with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = knowledge_documents.organization_id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  )
);

create policy "admins can update organization documents"
on public.knowledge_documents for update to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = knowledge_documents.organization_id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = knowledge_documents.organization_id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  )
);

create policy "admins can delete organization documents"
on public.knowledge_documents for delete to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = knowledge_documents.organization_id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  )
);

create policy "members can query organization chunks"
on public.knowledge_chunks for select to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = knowledge_chunks.organization_id
      and m.user_id = (select auth.uid())
  )
);

create policy "admins can insert organization chunks"
on public.knowledge_chunks for insert to authenticated
with check (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = knowledge_chunks.organization_id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  )
);

create policy "admins can delete organization chunks"
on public.knowledge_chunks for delete to authenticated
using (
  exists (
    select 1 from public.organization_members m
    where m.organization_id = knowledge_chunks.organization_id
      and m.user_id = (select auth.uid())
      and m.role = 'admin'
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'hive-knowledge',
  'hive-knowledge',
  false,
  26214400,
  array[
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do nothing;

create policy "members can read organization knowledge files"
on storage.objects for select to authenticated
using (
  bucket_id = 'hive-knowledge'
  and exists (
    select 1 from public.organization_members m
    where m.user_id = (select auth.uid())
      and name like m.organization_id::text || '/%'
  )
);

create policy "admins can upload organization knowledge files"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'hive-knowledge'
  and exists (
    select 1 from public.organization_members m
    where m.user_id = (select auth.uid())
      and m.role = 'admin'
      and name like m.organization_id::text || '/%'
  )
);

create policy "admins can update organization knowledge files"
on storage.objects for update to authenticated
using (
  bucket_id = 'hive-knowledge'
  and exists (
    select 1 from public.organization_members m
    where m.user_id = (select auth.uid())
      and m.role = 'admin'
      and name like m.organization_id::text || '/%'
  )
)
with check (
  bucket_id = 'hive-knowledge'
  and exists (
    select 1 from public.organization_members m
    where m.user_id = (select auth.uid())
      and m.role = 'admin'
      and name like m.organization_id::text || '/%'
  )
);

create policy "admins can delete organization knowledge files"
on storage.objects for delete to authenticated
using (
  bucket_id = 'hive-knowledge'
  and exists (
    select 1 from public.organization_members m
    where m.user_id = (select auth.uid())
      and m.role = 'admin'
      and name like m.organization_id::text || '/%'
  )
);

create or replace function public.match_knowledge_chunks(
  query_embedding extensions.vector(1536),
  p_organization_id uuid,
  match_threshold float default 0.72,
  match_count int default 8
)
returns table (
  chunk_id bigint,
  document_id uuid,
  title text,
  source_filename text,
  content text,
  metadata jsonb,
  similarity float
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    kc.id as chunk_id,
    kd.id as document_id,
    kd.title,
    kd.source_filename,
    kc.content,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) as similarity
  from public.knowledge_chunks kc
  join public.knowledge_documents kd on kd.id = kc.document_id
  where kc.organization_id = p_organization_id
    and kd.organization_id = p_organization_id
    and kd.status = 'ready'
    and kc.embedding is not null
    and 1 - (kc.embedding <=> query_embedding) >= match_threshold
  order by kc.embedding <=> query_embedding
  limit least(match_count, 50);
$$;

grant execute on function public.match_knowledge_chunks(extensions.vector, uuid, float, int)
to authenticated;
