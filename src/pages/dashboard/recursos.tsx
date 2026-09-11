import BlogLayout from "@/components/dashboard/blog-layout";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  AdminResource,
  adminListResources,
  createResource,
  deleteResource,
  ResourceInput,
  updateResource,
} from "@/lib/services/resources-service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Package, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const EMPTY: ResourceInput = {
  slug: "",
  keyword: "",
  title: "",
  summary: "",
  description: "",
  includes: [],
  delivery_url: "",
  gated: false,
  status: "draft",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const ResourcesAdmin = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<AdminResource | null>(null);
  const [form, setForm] = useState<ResourceInput | null>(null);

  const { data: resources = [], isLoading } = useQuery({
    queryKey: ["admin-resources"],
    queryFn: adminListResources,
  });

  const save = useMutation({
    mutationFn: async (input: ResourceInput) =>
      editing ? updateResource(editing.id, input) : createResource(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({ title: editing ? "Recurso actualizado" : "Recurso creado" });
      setForm(null);
      setEditing(null);
    },
    onError: (error: { message?: string }) =>
      toast({
        title: "No se pudo guardar",
        description: error?.message ?? "Revisa que el identificador no esté repetido.",
        variant: "destructive",
      }),
  });

  const remove = useMutation({
    mutationFn: deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-resources"] });
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({ title: "Recurso eliminado" });
    },
  });

  const startNew = () => {
    setEditing(null);
    setForm({ ...EMPTY });
  };

  const startEdit = (resource: AdminResource) => {
    setEditing(resource);
    setForm({
      slug: resource.slug,
      keyword: resource.keyword,
      title: resource.title,
      summary: resource.summary,
      description: resource.description ?? "",
      includes: resource.includes,
      delivery_url: resource.delivery_url,
      gated: resource.gated,
      status: resource.status,
    });
  };

  const update = (patch: Partial<ResourceInput>) => setForm((f) => (f ? { ...f, ...patch } : f));

  return (
    <>
      <SEO title="Recursos | Panel" description="Gestión de recursos" canonicalUrl="/dashboard/recursos" noIndex />
      <BlogLayout breadcrumbs={[{ label: "Panel", to: "/dashboard/blog" }, { label: "Recursos" }]}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-1">Recursos</h1>
            <p className="text-muted-foreground text-sm">
              Lo que entregas cuando alguien comenta la palabra clave en redes.
            </p>
          </div>
          {!form && (
            <Button onClick={startNew}>
              <Plus className="w-4 h-4" />
              Nuevo recurso
            </Button>
          )}
        </div>

        {form ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              save.mutate(form);
            }}
            className="border border-white/10 rounded-xl p-6 space-y-5 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-white">Título</Label>
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    update({ title, slug: editing ? form.slug : slugify(title) });
                  }}
                  placeholder="CRM listo para adaptar"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Palabra clave</Label>
                <Input
                  value={form.keyword}
                  onChange={(e) => update({ keyword: e.target.value })}
                  placeholder="CRM"
                  required
                />
                <p className="text-xs text-muted-foreground">La que pides que comenten en el reel.</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Identificador en la URL</Label>
              <Input value={form.slug} onChange={(e) => update({ slug: slugify(e.target.value) })} required />
              <p className="text-xs text-muted-foreground">
                Este es el enlace que pegas: contreras.dev/recursos/{form.slug || "..."}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Resumen</Label>
              <Textarea
                value={form.summary}
                onChange={(e) => update({ summary: e.target.value })}
                placeholder="Una frase que explique para qué sirve."
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Qué incluye</Label>
              <Textarea
                value={form.includes.join("\n")}
                onChange={(e) =>
                  update({ includes: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
                }
                placeholder={"Una línea por punto\nGestión de contactos\nPanel de administración"}
                className="min-h-[110px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Cómo usarlo (opcional)</Label>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => update({ description: e.target.value })}
                className="min-h-[110px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Enlace de entrega</Label>
              <Input
                type="url"
                value={form.delivery_url}
                onChange={(e) => update({ delivery_url: e.target.value })}
                placeholder="https://github.com/andrescontreras38/..."
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
              <div>
                <p className="text-white text-sm font-medium">Pedir correo antes de entregar</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-md">
                  Actívalo solo si el recurso no existe en otro lado. Para un repo público es un peaje
                  falso: cualquiera lo encuentra en tu GitHub igual.
                </p>
              </div>
              <Switch checked={form.gated} onCheckedChange={(gated) => update({ gated })} />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-white/10 p-4">
              <div>
                <p className="text-white text-sm font-medium">Publicado</p>
                <p className="text-xs text-muted-foreground mt-1">Si está apagado, nadie lo ve.</p>
              </div>
              <Switch
                checked={form.status === "published"}
                onCheckedChange={(on) => update({ status: on ? "published" : "draft" })}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Guardando..." : editing ? "Guardar cambios" : "Crear recurso"}
              </Button>
              <Button
                type="button"
                variant="link"
                onClick={() => {
                  setForm(null);
                  setEditing(null);
                }}
              >
                Cancelar
              </Button>
            </div>
          </form>
        ) : null}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="border border-white/10 rounded-xl p-12 text-center">
            <Package className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-white mb-1">Todavía no has publicado recursos</p>
            <p className="text-sm text-muted-foreground">
              Crea el primero y ya tendrás el enlace para pegar en los comentarios.
            </p>
          </div>
        ) : (
          <div className="border border-white/10 rounded-xl divide-y divide-white/10 overflow-hidden">
            {resources.map((resource) => (
              <div key={resource.id} className="p-5 flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-white font-medium">{resource.title}</span>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {resource.keyword}
                    </Badge>
                    {resource.status === "draft" && <Badge variant="secondary">Borrador</Badge>}
                    {resource.gated && <Badge variant="secondary">Pide correo</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{resource.summary}</p>
                  <a
                    href={`/recursos/${resource.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-primary inline-flex items-center gap-1 font-mono"
                  >
                    /recursos/{resource.slug}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" onClick={() => startEdit(resource)}>
                    Editar
                  </Button>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => {
                      if (confirm(`¿Eliminar "${resource.title}"? No se puede deshacer.`)) {
                        remove.mutate(resource.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </BlogLayout>
    </>
  );
};

export default ResourcesAdmin;
