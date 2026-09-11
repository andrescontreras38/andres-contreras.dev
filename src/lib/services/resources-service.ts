import { supabase } from "@/integrations/supabase/client";

export interface Resource {
  id: string;
  slug: string;
  /** La palabra que la gente comenta en redes para pedirlo. */
  keyword: string;
  title: string;
  summary: string;
  description: string | null;
  includes: string[];
  /** true = pide correo antes de entregar; false = enlace directo. */
  gated: boolean;
  image: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
}

/**
 * `delivery_url` no se pide nunca en estas consultas: el permiso de lectura de
 * esa columna está revocado para el público, así que el enlace no viaja al
 * navegador hasta que alguien deja su correo y lo obtiene por `claimResource`.
 */
const PUBLIC_FIELDS =
  "id, slug, keyword, title, summary, description, includes, gated, image, status, created_at, updated_at";

export const getResources = async (includeDrafts = false): Promise<Resource[]> => {
  let query = supabase
    .from("resources")
    .select(PUBLIC_FIELDS)
    .order("created_at", { ascending: false });

  if (!includeDrafts) query = query.eq("status", "published");

  const { data, error } = await query;

  if (error) {
    console.error("Error al leer los recursos:", error);
    return [];
  }

  return (data || []) as Resource[];
};

export const getResourceBySlug = async (slug: string): Promise<Resource | null> => {
  const { data, error } = await supabase
    .from("resources")
    .select(PUBLIC_FIELDS)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error("Error al leer el recurso:", error);
    return null;
  }

  return (data as Resource) || null;
};

/**
 * Registra el contacto y devuelve el enlace en la misma llamada, del lado del
 * servidor. Así el enlace no se puede obtener mirando la petición de red.
 */
export const claimResource = async (
  slug: string,
  email?: string,
  name?: string
): Promise<{ deliveryUrl: string; title: string }> => {
  const { data, error } = await supabase.rpc("claim_resource", {
    _slug: slug,
    _email: email?.trim() || null,
    _name: name?.trim() || null,
  });

  if (error) throw error;

  const row = Array.isArray(data) ? data[0] : data;
  if (!row?.delivery_url) throw new Error("El recurso no está disponible.");

  return { deliveryUrl: row.delivery_url, title: row.title };
};

// ─────────────────────────────────────────────────── administración ──

export interface ResourceInput {
  slug: string;
  keyword: string;
  title: string;
  summary: string;
  description?: string | null;
  includes: string[];
  delivery_url: string;
  gated: boolean;
  status: "draft" | "published";
}

export interface AdminResource extends Resource {
  delivery_url: string;
}

/** Pasa por una función con SECURITY DEFINER: el rol `authenticated` no tiene
 *  permiso de lectura sobre `delivery_url` y no debe tenerlo. */
export const adminListResources = async (): Promise<AdminResource[]> => {
  const { data, error } = await supabase.rpc("admin_list_resources");
  if (error) {
    console.error("Error al leer los recursos:", error);
    return [];
  }
  return (data || []) as AdminResource[];
};

export const adminGetResource = async (id: string): Promise<AdminResource | null> => {
  const { data, error } = await supabase.rpc("admin_get_resource", { _id: id });
  if (error) {
    console.error("Error al leer el recurso:", error);
    return null;
  }
  const row = Array.isArray(data) ? data[0] : data;
  return (row as AdminResource) || null;
};

export const createResource = async (input: ResourceInput): Promise<void> => {
  // Sin `.select()`: devolver la fila exigiría leer delivery_url, que está vetado.
  const { error } = await supabase.from("resources").insert(input);
  if (error) throw error;
};

export const updateResource = async (id: string, input: Partial<ResourceInput>): Promise<void> => {
  const { error } = await supabase.from("resources").update(input).eq("id", id);
  if (error) throw error;
};

export const deleteResource = async (id: string): Promise<void> => {
  const { error } = await supabase.from("resources").delete().eq("id", id);
  if (error) throw error;
};
