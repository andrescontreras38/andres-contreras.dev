-- Recursos descargables (lead magnets) y captura de contactos.
-- Ejecutar completo en el SQL Editor de Supabase.

-- ────────────────────────────────────────────────────────────── recursos --

create table public.resources (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  -- La palabra que la gente comenta en redes ("CRM"). Sirve para que sepas
  -- qué keyword corresponde a qué página cuando respondas los comentarios.
  keyword      text not null,
  title        text not null,
  summary      text not null,
  description  text,
  includes     text[] not null default '{}',
  -- Lo que se entrega: repo, archivo, carpeta.
  delivery_url text not null,
  -- true  → pide correo antes de entregar (recursos que armas tú).
  -- false → muestra el enlace de una (repos públicos, donde pedir correo
  --         sería un peaje falso: cualquiera los encuentra en tu GitHub).
  gated        boolean not null default true,
  image        text,
  status       text not null default 'draft' check (status in ('draft', 'published')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index resources_status_created_at_idx on public.resources (status, created_at desc);

create trigger resources_set_updated_at
  before update on public.resources
  for each row execute function public.set_updated_at();

-- ─────────────────────────────────────────────────────────────── leads --

create table public.leads (
  id            uuid primary key default gen_random_uuid(),
  email         text not null check (position('@' in email) > 1 and length(email) between 5 and 254),
  name          text check (length(name) <= 120),
  phone         text check (length(phone) <= 40),
  subject       text check (length(subject) <= 200),
  message       text check (length(message) <= 5000),
  source        text not null check (source in ('contacto', 'newsletter', 'recurso')),
  resource_slug text,
  created_at    timestamptz not null default now()
);

create index leads_created_at_idx on public.leads (created_at desc);
create index leads_source_idx on public.leads (source);

-- Un mismo correo puede pedir recursos distintos, pero no el mismo dos veces.
create unique index leads_email_resource_idx
  on public.leads (lower(email), resource_slug)
  where resource_slug is not null;

-- ──────────────────────────────────────────────────────────────── RLS --

alter table public.resources enable row level security;
alter table public.leads     enable row level security;

create policy "Los recursos publicados son públicos"
  on public.resources for select
  using (status = 'published');

create policy "Admin lee todos los recursos"
  on public.resources for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Solo admin escribe recursos"
  on public.resources for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Cualquiera puede dejar sus datos en un formulario...
create policy "Cualquiera puede enviar sus datos"
  on public.leads for insert
  with check (true);

-- ...pero NADIE puede leerlos salvo tú. Sin esta política, cualquier visitante
-- con la clave pública podría descargarse la lista entera de correos.
create policy "Solo admin lee los contactos"
  on public.leads for select
  using (public.has_role(auth.uid(), 'admin'));

create policy "Solo admin borra contactos"
  on public.leads for delete
  using (public.has_role(auth.uid(), 'admin'));

-- ────────────────────────────────────────── entrega del recurso --

-- En los recursos con `gated`, el enlace no puede salir en la consulta pública
-- de `resources`: bastaría con mirar la petición de red para saltarse el correo.
-- Esta función decide según el recurso y, si hay correo, lo registra.
create or replace function public.claim_resource(
  _slug  text,
  _email text default null,
  _name  text default null
)
returns table (delivery_url text, title text)
language plpgsql
security definer
set search_path = public
as $$
declare
  _resource public.resources%rowtype;
  _clean_email text := lower(trim(coalesce(_email, '')));
begin
  select * into _resource
  from public.resources
  where slug = _slug and status = 'published';

  if not found then
    raise exception 'Recurso no disponible';
  end if;

  if _resource.gated and position('@' in _clean_email) < 2 then
    raise exception 'Este recurso necesita un correo válido';
  end if;

  -- Se registra el contacto siempre que lo dejen, incluso en los abiertos:
  -- ahí es voluntario y por eso vale más.
  if position('@' in _clean_email) > 1 then
    insert into public.leads (email, name, source, resource_slug)
    values (_clean_email, nullif(trim(_name), ''), 'recurso', _slug)
    on conflict do nothing;
  end if;

  return query select _resource.delivery_url, _resource.title;
end;
$$;

grant execute on function public.claim_resource(text, text, text) to anon, authenticated;

-- El enlace de entrega queda fuera del alcance de lectura pública.
--
-- Ojo con esto: en PostgreSQL, `revoke select (columna)` NO hace nada si el rol
-- conserva `SELECT` sobre la tabla entera, y Supabase concede justamente eso por
-- defecto. La única forma que funciona es quitar el permiso de tabla y volver a
-- conceder solo las columnas públicas. Verificado: con esto, `select=*` y
-- cualquier consulta que toque delivery_url devuelven 42501.
revoke select on public.resources from anon, authenticated;

grant select (
  id, slug, keyword, title, summary, description,
  includes, gated, image, status, created_at, updated_at
) on public.resources to anon, authenticated;
