# contreras.dev

Sitio personal de Andrés Contreras: portafolio, blog y biblioteca de recursos
con captura de contactos.

## Puesta en marcha

```bash
npm install
cp .env.example .env   # y rellena las dos variables
npm run dev            # http://localhost:8080
```

Las variables salen de Supabase, en *Project Settings → API*:

| Variable | Qué es |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Clave pública (`sb_publishable_...`) |

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Sitemap + build + prerenderizado |
| `npm run sitemap` | Regenera `public/sitemap.xml` |
| `npm run prerender` | Prerenderiza sobre un `dist/` ya construido |
| `npm run lint` | ESLint |

## Base de datos

Las migraciones de `supabase/migrations/` se ejecutan en orden desde el SQL
Editor de Supabase. Crean:

- `blog_posts`, `profiles` y `user_roles`, con RLS y la función `has_role`.
- `resources` y `leads`, para la biblioteca de recursos y los contactos.

En `supabase/seed/` están los artículos iniciales. El archivo es reejecutable:
si el slug ya existe, actualiza en vez de duplicar.

### Dos detalles de seguridad que conviene no romper

**El enlace de entrega de un recurso no es legible públicamente.** No basta con
RLS: en PostgreSQL, revocar el `SELECT` de una columna no surte efecto si el rol
conserva el `SELECT` de la tabla entera, que es lo que Supabase concede por
defecto. Por eso se revoca el permiso de tabla y se conceden solo las columnas
públicas. La entrega pasa por `claim_resource`, que registra el contacto y
devuelve el enlace en la misma llamada del lado del servidor.

**Los contactos solo los lee el admin.** Cualquiera puede insertar en `leads`
(es un formulario público), pero la política de lectura exige el rol `admin`.
Sin eso, cualquier visitante con la clave pública se descargaría la lista de
correos.

## Prerenderizado

El sitio es una SPA. Googlebot ejecuta JavaScript, pero los rastreadores de los
motores de respuesta (GPTBot, PerplexityBot, ClaudeBot) en general no, y verían
una página vacía.

`scripts/prerender.mjs` corre después del build: levanta el `dist/`, visita cada
ruta con un navegador real y guarda el HTML ya renderizado. El visitante sigue
recibiendo la SPA; React arranca encima.

**Consecuencia a tener presente:** el contenido queda congelado como estaba en
el build. Al publicar un artículo o un recurso hay que volver a desplegar.

## Administración

No hay registro público: la única cuenta es la del administrador, creada desde
Supabase. El acceso está en `/login` y el panel en `/dashboard`, protegido por
el rol `admin`.

## Contenido que se edita a mano

| Archivo | Qué controla |
|---|---|
| `src/utils/app-config.ts` | Dominio, nombre y descripción. De ahí salen las URLs canónicas y el structured data. |
| `src/utils/community.ts` | Enlace de la comunidad. Mientras sea `null`, no se muestra ninguna invitación. |
| `src/components/sections/home/now.tsx` | Sección «En qué ando ahora». Si se queda vieja, comunica lo contrario de lo que pretende. |

## Stack

React · TypeScript · Vite · Tailwind · shadcn/ui · Supabase
