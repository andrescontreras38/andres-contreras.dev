import BlogLayout from "@/components/dashboard/blog-layout";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { getLeads, Lead } from "@/lib/services/leads-service";
import { formatBlogDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Download, Mail } from "lucide-react";
import { useMemo, useState } from "react";

const SOURCE_LABEL: Record<string, string> = {
  contacto: "Formulario",
  newsletter: "Suscripción",
  recurso: "Recurso",
};

const ContactsPage = () => {
  const [filter, setFilter] = useState<string>("todos");
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: getLeads,
  });

  const filtered = useMemo(
    () => (filter === "todos" ? leads : leads.filter((l) => l.source === filter)),
    [leads, filter]
  );

  const counts = useMemo(() => {
    const base: Record<string, number> = { todos: leads.length };
    for (const lead of leads) base[lead.source] = (base[lead.source] || 0) + 1;
    return base;
  }, [leads]);

  /** Exportar a CSV para pasarlo a la herramienta de correo que uses. */
  const exportCsv = () => {
    const rows = [
      ["correo", "nombre", "telefono", "origen", "recurso", "asunto", "mensaje", "fecha"],
      ...filtered.map((l) => [
        l.email,
        l.name || "",
        l.phone || "",
        SOURCE_LABEL[l.source] || l.source,
        l.resource_slug || "",
        l.subject || "",
        (l.message || "").replace(/\s+/g, " "),
        l.created_at.slice(0, 10),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const url = URL.createObjectURL(new Blob([`﻿${csv}`], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `contactos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: `${filtered.length} contactos exportados` });
  };

  return (
    <>
      <SEO title="Contactos | Panel" description="Contactos captados" canonicalUrl="/dashboard/contactos" noIndex />
      <BlogLayout breadcrumbs={[{ label: "Panel", to: "/dashboard/blog" }, { label: "Contactos" }]}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Contactos</h1>
            <p className="text-muted-foreground text-sm">
              Quien te ha escrito, se ha suscrito o ha pedido un recurso.
            </p>
          </div>
          <Button onClick={exportCsv} variant="outline" disabled={filtered.length === 0}>
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {["todos", "contacto", "newsletter", "recurso"].map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                filter === key
                  ? "bg-primary text-white"
                  : "bg-white/5 text-muted-foreground hover:text-white"
              }`}
            >
              {key === "todos" ? "Todos" : SOURCE_LABEL[key]}
              <span className="ml-1.5 opacity-60">{counts[key] || 0}</span>
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-white/10 rounded-xl p-12 text-center">
            <Mail className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-white mb-1">Todavía no hay contactos aquí</p>
            <p className="text-sm text-muted-foreground">
              Aparecerán en cuanto alguien use el formulario, se suscriba o pida un recurso.
            </p>
          </div>
        ) : (
          <div className="border border-white/10 rounded-xl divide-y divide-white/10 overflow-hidden">
            {filtered.map((lead: Lead) => (
              <div key={lead.id} className="p-5 hover:bg-white/[0.03] transition-colors">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-white font-medium hover:text-primary transition-colors break-all"
                    >
                      {lead.email}
                    </a>
                    {lead.name && <span className="text-muted-foreground ml-2">· {lead.name}</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant="secondary">{SOURCE_LABEL[lead.source] || lead.source}</Badge>
                    {lead.resource_slug && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {lead.resource_slug}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatBlogDate(lead.created_at.slice(0, 10))}
                    </span>
                  </div>
                </div>

                {lead.subject && <p className="text-sm text-white/80 mb-1">{lead.subject}</p>}
                {lead.message && (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {lead.message}
                  </p>
                )}
                {lead.phone && <p className="text-sm text-muted-foreground mt-1">{lead.phone}</p>}
              </div>
            ))}
          </div>
        )}
      </BlogLayout>
    </>
  );
};

export default ContactsPage;
