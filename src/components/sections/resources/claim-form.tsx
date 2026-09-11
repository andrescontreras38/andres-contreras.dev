import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { claimResource, Resource } from "@/lib/services/resources-service";
import { community, hasCommunity } from "@/utils/community";
import { ArrowRight, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Dos modos según el recurso:
 *
 * - Abierto (`gated: false`): el enlace se muestra al entrar. Es lo correcto
 *   para repos públicos, donde pedir correo sería un peaje falso porque
 *   cualquiera los encuentra en GitHub igual. La suscripción queda al lado,
 *   voluntaria.
 * - Con correo (`gated: true`): para lo que armas tú y no existe en otro lado.
 *   Ahí la barrera es honesta.
 */
const ClaimForm = ({ resource }: { resource: Resource }) => {
  const { user, profile } = useAuth();
  // Si ya hay sesión no tiene sentido volver a pedir lo que ya sabemos.
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState(profile?.first_name ?? "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [delivered, setDelivered] = useState<string | null>(null);
  const [loadingOpen, setLoadingOpen] = useState(!resource.gated);

  // En los abiertos el enlace se pide solo, sin que nadie escriba nada.
  useEffect(() => {
    if (resource.gated) return;

    let cancelled = false;
    claimResource(resource.slug)
      .then(({ deliveryUrl }) => {
        if (!cancelled) setDelivered(deliveryUrl);
      })
      .catch((err) => {
        console.error("Error al obtener el recurso:", err);
        if (!cancelled) setError("No se pudo cargar el enlace. Recarga la página.");
      })
      .finally(() => {
        if (!cancelled) setLoadingOpen(false);
      });

    return () => {
      cancelled = true;
    };
  }, [resource.gated, resource.slug]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (sending) return;

    setSending(true);
    setError(null);

    try {
      const { deliveryUrl } = await claimResource(resource.slug, email, name);
      setDelivered(deliveryUrl);
    } catch (err) {
      console.error("Error al entregar el recurso:", err);
      setError("No se pudo entregar el recurso. Inténtalo de nuevo o escríbeme a hola@contreras.dev.");
    } finally {
      setSending(false);
    }
  };

  if (loadingOpen) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 flex items-center gap-3 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" />
        Cargando el enlace
      </div>
    );
  }

  if (delivered) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8">
        {resource.gated ? (
          <div className="flex items-center gap-2 text-emerald-600 mb-4">
            <Check className="w-5 h-5" />
            <span className="font-medium">Listo, es tuyo</span>
          </div>
        ) : (
          <p className="font-medium mb-4">Tuyo, sin dar nada a cambio</p>
        )}

        {/* El título del recurso puede ser largo; en un botón se desborda. */}
        <Button asChild className="w-full mb-6">
          <a href={delivered} target="_blank" rel="noreferrer">
            Abrir el recurso
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </Button>

        <div className="border-t border-border pt-6 space-y-4">
          {hasCommunity() && (
            <div>
              <p className="font-medium mb-1.5">Únete a {community.platform}</p>
              <p className="text-sm text-muted-foreground mb-3">{community.promise}</p>
              <Button variant="outline" asChild className="w-full">
                <a href={community.url!} target="_blank" rel="noreferrer">
                  Entrar
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-8">
      <p className="font-medium mb-1.5">Te lo paso ahora mismo</p>
      <p className="text-sm text-muted-foreground mb-6">
        Déjame tu correo y te doy el acceso de inmediato en esta misma página.
      </p>

      <div className="space-y-3 mb-4">
        <Input
          type="text"
          placeholder="Tu nombre (opcional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <Input
          type="email"
          placeholder="tucorreo@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={sending}>
        {sending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando
          </>
        ) : (
          <>
            Quiero {resource.keyword}
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

      <p className="text-xs text-muted-foreground mt-4">
        Sin spam. Te escribo cuando publique algo que valga la pena, y te puedes salir cuando quieras.
      </p>
    </form>
  );
};

export default ClaimForm;
