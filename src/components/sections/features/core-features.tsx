import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { useIsMobile } from "@/hooks/use-mobile";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    id: "uniremington",
    title: "Uniremington",
    tag: "Proyecto para cliente",
    description:
      "De WordPress + WPBakery a un stack propio en Node.js, rescatando el contenido con scraping en Python.",
    problem:
      "El sitio corría en WordPress con WPBakery Page Builder, un constructor visual que limitaba seriamente el diseño. WPBakery guarda el contenido de cada página como shortcodes en la base de datos, un formato que solo tiene sentido renderizado por WordPress y ese plugin específico.",
    solution:
      "Para rescatar el contenido real hubo que hacer scraping de las páginas ya renderizadas, no del export de WordPress, con un script en Python. El sitio se reconstruyó en Express + EJS, con el contenido migrado a SQLite, un CMS propio con panel protegido con 2FA (TOTP), procesamiento de imágenes con Sharp, y «Remi», un asistente de orientación para aspirantes construido sobre la API de Claude.",
    stack: ["Node.js", "Express", "EJS", "SQLite", "Claude API", "Python"],
    role: "Reconstrucción completa, scraping y asistente con IA",
  },
  {
    id: "scentual-bliss",
    title: "Scentual Bliss",
    tag: "En producción",
    description:
      "Tienda en línea de perfumes: más de 150 fragancias, checkout y un quiz olfativo.",
    problem:
      "Una marca de perfumes nueva necesitaba una tienda propia, no solo un catálogo, sino carrito, pagos, cuentas, correos transaccionales y visibilidad real de qué falla en producción.",
    solution:
      "Construí la tienda completa en Next.js 15 con Supabase como base de datos y autenticación, checkout con pagos en línea, correos transaccionales con Resend, notificaciones push y Sentry monitoreando errores en cliente, servidor y edge. El catálogo (más de 150 fragancias de 28 marcas) se importa desde Excel/CSV. Incluye un quiz de 5 preguntas para recomendar la fragancia ideal.",
    stack: ["Next.js", "React", "Supabase", "Stripe", "Sentry", "Resend"],
    role: "Desarrollo full-stack completo, de la base de datos al checkout",
  },
  {
    id: "remitransfer",
    title: "RemiTransfer",
    tag: "Proyecto personal",
    description: "Alternativa a WeTransfer sin límites de tamaño ni cuentas.",
    problem:
      "Compartir archivos grandes normalmente implica límites de tamaño, crear una cuenta, o pagar un plan premium en herramientas como WeTransfer.",
    solution:
      "RemiTransfer sube cada archivo en fragmentos de 8MB desde el navegador, con reintentos automáticos y hasta 3 conexiones en paralelo: el tamaño total deja de depender de los límites de PHP y pasa a depender solo del disco del servidor. Las subidas son reanudables si se corta la conexión, las descargas se sirven en streaming con soporte de rangos, y cada transferencia puede autodestruirse entre 1 y 30 días o nunca.",
    stack: ["PHP", "MySQL", "JavaScript"],
    role: "Diseño y desarrollo completo: backend, subida por fragmentos y panel",
  },
];

type Case = (typeof features)[number];

const CaseDetail = ({ item }: { item: Case }) => (
  <div className="rounded-2xl border border-border bg-card p-6 md:p-8 space-y-6">
    <div>
      <p className="text-sm font-medium text-[#2563EB] mb-2">El problema</p>
      <p className="text-muted-foreground leading-relaxed">{item.problem}</p>
    </div>
    <div>
      <p className="text-sm font-medium text-[#2563EB] mb-2">La solución</p>
      <p className="text-muted-foreground leading-relaxed">{item.solution}</p>
    </div>
    <div className="border-t border-border pt-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {item.stack.map((tech) => (
          <span
            key={tech}
            className="font-mono text-xs px-2.5 py-1 rounded-md bg-foreground/5 text-foreground/70"
          >
            {tech}
          </span>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        <span className="text-foreground font-medium">Rol:</span> {item.role}
      </p>
    </div>
  </div>
);

const CoreFeatures = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const featureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isMobile = useIsMobile();

  const handleFeatureClick = (index: number) => {
    if (isMobile) {
      setActiveFeature(index);
    } else {
      scrollToFeature(index);
    }
  };

  const scrollToFeature = (index: number) => {
    const element = featureRefs.current[index];
    if (element) {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = rect.height;
      const windowHeight = window.innerHeight;
      const scrollPosition = elementTop - (windowHeight / 2) + (elementHeight / 2);

      window.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: "smooth",
      });
    }
  };

  // Detect which feature is centered on scroll (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestIndex = activeFeature;
      let closestDistance = Infinity;

      featureRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const elementCenter = rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - elementCenter);

          if (rect.top < window.innerHeight && rect.bottom > 0 && distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
          }
        }
      });

      if (closestIndex !== activeFeature) {
        setActiveFeature(closestIndex);
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [activeFeature, isMobile]);

  return (
    <section ref={sectionRef} className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12">
      <Container className="md:space-y-10 xl:space-y-2xl space-y-8">
        {/* Section Title */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between md:gap-8 gap-4">
          <div className="flex-1 max-w-[683px]">
            <AnimateOnView once blur className="md:mb-4 mb-1.5">
              <Badge variant="default">Casos</Badge>
            </AnimateOnView>

            <AnimateOnView once blur delay={0.2}>
              <h2 className="h2">
                Cómo resolví cada uno
              </h2>
            </AnimateOnView>
          </div>

          <AnimateOnView once delay={0.4}>
            <Button asChild>
              <Link to="/contact">
                Cuéntame tu proyecto
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </AnimateOnView>
        </div>

        {/* Mobile Navigation - Vertical List (Text only, no bg) */}
        <div className="block md:hidden">
          <nav className="flex flex-col">
            {features.map((feature, index) => {
              const isActive = activeFeature === index;
              return (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(index)}
                  className={`
                    w-full text-left py-2 transition-colors duration-200
                    ${isActive
                      ? "text-primary font-semibold" // Active: Primary color, bold text, no bg
                      : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <span className="block">{feature.title}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-8 lg:gap-16">
          {/* Left Navigation - Sticky (Desktop Only) */}
          <div className="hidden md:block md:w-[375px] md:flex-shrink-0 relative">
            <div className="absolute top-0 left-0 w-[2px] h-full bg-border"></div>
            <div className="lg:sticky lg:top-24">
              <nav className="space-y-1">
                {features.map((feature, index) => {
                  const isActive = activeFeature === index;
                  return (
                    <button
                      key={feature.id}
                      onClick={() => handleFeatureClick(index)}
                      className={`
                        w-full text-left px-4 py-3 rounded-lg transition-all duration-300 relative
                        ${isActive
                          ? "text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground"
                        }
                      `}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary rounded-full"
                          initial={false}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 block">{feature.title}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Features Content */}
          <div className="flex-1 lg:pl-8 flex flex-col gap-2xl max-w-[717px]">
            {isMobile ? (
              // Mobile: Show only active feature with fade transition
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature}
                  className="w-full"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <Badge variant="secondary" className="mb-3">{features[activeFeature].tag}</Badge>
                  <h3 className="h6 mb-3">{features[activeFeature].title}</h3>
                  <p className="mb-6 text-muted-foreground">
                    {features[activeFeature].description}
                  </p>
                  <CaseDetail item={features[activeFeature]} />
                </motion.div>
              </AnimatePresence>
            ) : (
              // Desktop: Show all features stacked
              features.map((feature, index) => (
                <div
                  key={feature.id}
                  ref={(el) => {
                    featureRefs.current[index] = el;
                  }}
                  className="pb-10 border-b border-border last:border-0"
                  data-feature-index={index}
                >
                  <div className="w-full">
                    <AnimateOnView once blur className="mb-4">
                      <Badge variant="secondary" className="mb-3">{feature.tag}</Badge>
                      <h3 className="h6 mb-4">{feature.title}</h3>
                    </AnimateOnView>

                    <AnimateOnView once delay={0.2}>
                      <p className="mb-8">
                        {feature.description}
                      </p>
                    </AnimateOnView>

                    <AnimateOnView once delay={0.3}>
                      <div className="w-full max-w-[717px]">
                        <CaseDetail item={feature} />
                      </div>
                    </AnimateOnView>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CoreFeatures;