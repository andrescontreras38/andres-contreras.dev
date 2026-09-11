// Cliente de Supabase.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Sin estas variables, createClient lanza al importarse y la aplicación entera
// muere antes de montar: pantalla en blanco, sin pista de qué pasó. Vite las
// incrusta al compilar, así que si faltan en el build no hay nada que hacer en
// caliente; al menos que el error diga qué falta y dónde ponerlo.
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  const faltan = [
    !SUPABASE_URL && "VITE_SUPABASE_URL",
    !SUPABASE_PUBLISHABLE_KEY && "VITE_SUPABASE_PUBLISHABLE_KEY",
  ].filter(Boolean);

  throw new Error(
    `Faltan variables de entorno: ${faltan.join(", ")}. ` +
      `Defínelas en el .env local o en el panel del hosting y vuelve a construir ` +
      `(Vite las incrusta durante el build, no las lee al ejecutar).`
  );
}


function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    // New Supabase API keys are opaque strings, not bearer JWTs.
    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  global: {
    fetch: createSupabaseFetch(SUPABASE_PUBLISHABLE_KEY),
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
