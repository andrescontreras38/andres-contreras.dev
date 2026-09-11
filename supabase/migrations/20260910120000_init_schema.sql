-- Esquema inicial: perfiles, roles y blog.
-- Ejecutar completo en el SQL Editor de Supabase (o con `supabase db push`).

-- ---------------------------------------------------------------- roles --

create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  role    public.app_role not null default 'user',
  unique (user_id, role)
);

-- SECURITY DEFINER a propósito: las policies de user_roles llaman a esta
-- función, y sin el bypass de RLS la comprobación se llamaría a sí misma.
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  );
$$;

-- ------------------------------------------------------------- perfiles --

create table public.profiles (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null unique references auth.users (id) on delete cascade,
  first_name text,
  last_name  text,
  phone      text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------- blog --

create table public.blog_posts (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  slug         text not null unique,
  category     text not null,
  author       text not null,
  author_image text,
  image        text not null,
  read_time    text not null,
  date         text not null,
  content      text,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index blog_posts_status_created_at_idx on public.blog_posts (status, created_at desc);
create index blog_posts_category_idx on public.blog_posts (category);

-- ------------------------------------------------------------- triggers --

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- Cada usuario nuevo obtiene su perfil y el rol 'user'. El cliente asume que
-- el perfil ya existe justo después del signup y solo hace UPDATE sobre él.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  full_name text := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    ''
  );
begin
  insert into public.profiles (user_id, first_name, last_name, avatar_url)
  values (
    new.id,
    nullif(split_part(full_name, ' ', 1), ''),
    case
      when position(' ' in full_name) > 0
        then nullif(trim(substring(full_name from position(' ' in full_name))), '')
      else null
    end,
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  )
  on conflict (user_id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------------ RLS --

alter table public.profiles   enable row level security;
alter table public.user_roles enable row level security;
alter table public.blog_posts enable row level security;

create policy "Cada quien lee su perfil"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Cada quien crea su perfil"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Cada quien edita su perfil"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Cada quien lee sus roles"
  on public.user_roles for select
  using (auth.uid() = user_id);

create policy "Solo admin administra roles"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

create policy "Los posts publicados son públicos"
  on public.blog_posts for select
  using (status = 'published');

create policy "Admin lee borradores"
  on public.blog_posts for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Solo admin escribe posts"
  on public.blog_posts for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- -------------------------------------------------------------- storage --

insert into storage.buckets (id, name, public)
values
  ('blog-images', 'blog-images', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "Imágenes del blog públicas"
  on storage.objects for select
  using (bucket_id = 'blog-images');

create policy "Admin sube imágenes del blog"
  on storage.objects for insert
  with check (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admin reemplaza imágenes del blog"
  on storage.objects for update
  using (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admin borra imágenes del blog"
  on storage.objects for delete
  using (bucket_id = 'blog-images' and public.has_role(auth.uid(), 'admin'));

create policy "Avatares públicos"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- El cliente sube a `<user_id>/avatar.ext`, así que la carpeta raíz es el dueño.
create policy "Cada quien sube su avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Cada quien reemplaza su avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Cada quien borra su avatar"
  on storage.objects for delete
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
