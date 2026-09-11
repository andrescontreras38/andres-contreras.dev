-- Freno de inundación para la tabla de contactos.
--
-- El problema: la política de inserción de `leads` es `with check (true)`, y
-- tiene que serlo. Quien escribe en el formulario es alguien anónimo, no hay
-- sesión que comprobar. El precio es que cualquiera con la clave publicable
-- (que viaja dentro del JavaScript del sitio, por diseño) puede llamar a la API
-- directamente y llenar la tabla. No es teoría: tres POST seguidos con curl
-- crearon tres filas sin oponer resistencia.
--
-- Dónde poner el freno: en un trigger, no en la política. Una política RLS solo
-- cubre la ruta que la invoca; si mañana se añade otra vía de escritura (otra
-- función SECURITY DEFINER, un import, un panel), la política se queda mirando.
-- Un trigger BEFORE INSERT se ejecuta siempre, venga la fila de PostgREST, de
-- `claim_resource` o de una consulta escrita a mano.

-- ─────────────────────────────────────────────── de quién contar los envíos --

alter table public.leads
  add column if not exists ip_hash text;

create index if not exists leads_ip_hash_idx
  on public.leads (ip_hash, created_at desc);

comment on column public.leads.ip_hash is
  'md5 de la IP del visitante. Existe solo para contar envíos recientes y '
  'frenar inundaciones. No se muestra en ninguna interfaz ni se exporta.';

-- ──────────────────────────────────────────────────────────────── el freno --

create or replace function public.leads_frenar_inundacion()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  cabeceras  json;
  ip         text;
  por_ip     int;
  por_correo int;
begin
  -- PostgREST expone las cabeceras de la petición HTTP. Hace falta leer la IP
  -- de ahí y no de inet_client_addr(): entre el visitante y Postgres hay
  -- proxys (Vercel, el pooler de Supabase), así que inet_client_addr()
  -- devolvería siempre la misma dirección, la del proxy, y el límite frenaría
  -- a todo el mundo a la vez.
  cabeceras := nullif(current_setting('request.headers', true), '')::json;

  ip := trim(coalesce(
    nullif(cabeceras ->> 'cf-connecting-ip', ''),
    -- x-forwarded-for es una lista: "cliente, proxy1, proxy2". El cliente es
    -- el primero.
    nullif(split_part(coalesce(cabeceras ->> 'x-forwarded-for', ''), ',', 1), ''),
    ''
  ));

  new.ip_hash := nullif(md5(nullif(ip, '')), md5(''));
  new.email   := lower(trim(new.email));

  -- Sin IP no hay a quién contar: pasa cuando la fila se inserta desde el
  -- editor SQL o una migración. Se deja pasar a propósito. El límite es contra
  -- bots de internet, no contra el dueño de la base.
  if new.ip_hash is not null then
    select count(*) into por_ip
      from public.leads
     where ip_hash = new.ip_hash
       and created_at > now() - interval '1 hour';

    if por_ip >= 5 then
      raise exception
        'Ya recibí varios mensajes desde esta conexión. Espera un rato y vuelve a intentarlo.'
        using errcode = 'P0001';
    end if;
  end if;

  -- Segundo cerco, por si el atacante rota de IP pero no de correo.
  select count(*) into por_correo
    from public.leads
   where lower(email) = new.email
     and created_at > now() - interval '1 hour';

  if por_correo >= 3 then
    raise exception
      'Ya recibí varios mensajes de este correo. Espera un rato y vuelve a intentarlo.'
      using errcode = 'P0001';
  end if;

  return new;
end;
$$;

-- SECURITY DEFINER es imprescindible aquí, no es descuido: las dos consultas
-- de arriba leen `leads`, y quien inserta (anon) no tiene permiso de lectura
-- sobre esa tabla. Sin DEFINER, ambos count() devolverían 0 y el freno no
-- frenaría nada mientras aparentaba funcionar.

drop trigger if exists leads_frenar_inundacion on public.leads;

create trigger leads_frenar_inundacion
  before insert on public.leads
  for each row execute function public.leads_frenar_inundacion();

-- ────────────────────────────────────────────── que anon no pueda ni mirar --

-- Hoy los contactos están ocultos porque `leads` no tiene ninguna política de
-- SELECT para anon. Eso basta, pero depende de una ausencia: el día que
-- alguien añada una política de lectura sin fijarse, la tabla de correos queda
-- expuesta. Quitar el permiso de tabla cierra esa puerta por debajo de RLS.
revoke select on public.leads from anon;
grant insert on public.leads to anon, authenticated;

-- El panel de administración sí lee, y entra como `authenticated`.
grant select on public.leads to authenticated;
