import { supabase } from "@/integrations/supabase/client";

export type LeadSource = "contacto" | "newsletter" | "recurso";

export interface Lead {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  source: LeadSource;
  resource_slug: string | null;
  created_at: string;
}

interface NewLead {
  email: string;
  name?: string | null;
  phone?: string | null;
  subject?: string | null;
  message?: string | null;
  source: LeadSource;
}

/** Guarda un contacto. Las políticas RLS permiten insertar pero no leer. */
export const createLead = async (lead: NewLead): Promise<void> => {
  const { error } = await supabase.from("leads").insert({
    ...lead,
    email: lead.email.trim().toLowerCase(),
  });

  if (error) throw error;
};

/** Solo funciona con sesión de admin; para cualquiera otro devuelve vacío. */
export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error al leer los contactos:", error);
    return [];
  }

  return (data || []) as Lead[];
};
