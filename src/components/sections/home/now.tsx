import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

// ─────────────────────────────────────────────────────────────────────────────
// EDITA ESTO. Es la única parte del sitio pensada para cambiar seguido.
// Si lleva meses sin tocarse, dice lo contrario de lo que quiere decir, así que
// más vale borrar una línea que dejarla vieja. Actualiza también `updatedAt`.
// ─────────────────────────────────────────────────────────────────────────────

const updatedAt = "2026-09-11";

type Status = "en curso" | "recién lanzado" | "explorando";

const items: { title: string; description: string; status: Status; href?: string }[] = [
  {
    title: "Rehaciendo contreras.dev",
    description:
      "Este mismo sitio: identidad propia, blog conectado a base de datos y panel para publicar sin tocar código.",
    status: "en curso",
  },
  {
    title: "Escribiendo sobre lo que me preguntan",
    description:
      "Migraciones sin perder SEO, tienda a medida o plantilla, y qué es la IA aplicada de verdad. Las dudas que más me repiten, resueltas por escrito.",
    status: "recién lanzado",
    href: "/blog",
  },
];

const statusStyles: Record<Status, { dot: string; label: string }> = {
  "en curso": { dot: "bg-[#2563EB]", label: "text-[#2563EB]" },
  "recién lanzado": { dot: "bg-emerald-500", label: "text-emerald-600" },
  "explorando": { dot: "bg-muted-foreground", label: "text-muted-foreground" },
};

const Now = () => {
  const formatted = new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${updatedAt}T00:00:00`));

  return (
    <section className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12" id="ahora">
      <Container>
        <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-20">
          <AnimateOnView once blur className="lg:w-[380px] shrink-0">
            <Badge className="mb-4">Construir en público</Badge>
            <h2 className="h3 mb-4">En qué ando ahora</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Prefiero mostrar el proceso real, con errores incluidos, a esperar a que todo esté perfecto para compartirlo.
            </p>
            <p className="text-sm text-muted-foreground">
              Actualizado el <time dateTime={updatedAt}>{formatted}</time>
            </p>
          </AnimateOnView>

          {/* Lista, no tarjetas: esto es una bitácora y debe leerse como tal. */}
          <StaggerContainer className="flex-1 divide-y divide-border border-t border-border">
            {items.map((item, index) => {
              const style = statusStyles[item.status];
              const body = (
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-8 py-6">
                  <div className="flex items-center gap-2.5 sm:w-[150px] shrink-0 sm:pt-1">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${style.dot}`} />
                    <span className={`text-sm font-medium ${style.label}`}>{item.status}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-1.5 flex items-center gap-1.5">
                      {item.title}
                      {item.href && <ArrowUpRight className="w-4 h-4 text-[#2563EB]" />}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );

              return (
                <AnimateOnView key={item.title} once y={24} delay={index * 0.08}>
                  {item.href ? (
                    <Link to={item.href} className="block group hover:bg-card transition-colors">
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </AnimateOnView>
              );
            })}
          </StaggerContainer>
        </div>
      </Container>
    </section>
  );
};

export default Now;
