-- Acceso de administración a los recursos.
--
-- Al revocar el SELECT de tabla para proteger `delivery_url`, el propio panel
-- se quedó sin poder leerlo (el admin también es `authenticated`). Devolver ese
-- permiso a todo el rol expondría el enlace a cualquiera con sesión, así que la
-- lectura completa pasa por una función que comprueba el rol.

create or replace function public.admin_list_resources()
returns setof public.resources
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.resources
  where public.has_role(auth.uid(), 'admin')
  order by created_at desc;
$$;

create or replace function public.admin_get_resource(_id uuid)
returns setof public.resources
language sql
stable
security definer
set search_path = public
as $$
  select *
  from public.resources
  where id = _id
    and public.has_role(auth.uid(), 'admin');
$$;

revoke execute on function public.admin_list_resources() from anon;
revoke execute on function public.admin_get_resource(uuid) from anon;
grant execute on function public.admin_list_resources() to authenticated;
grant execute on function public.admin_get_resource(uuid) to authenticated;
