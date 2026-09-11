import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { ArrowRight, Bot, GitBranch, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const CoreFeatures = () => {

  return (
    <section className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12" id="core-features">
      <Container className="md:space-y-10 xl:space-y-2xl space-y-8">
        {/* Section Title */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between md:gap-8 gap-4">
          <div className="flex-1 max-w-[683px]">
            <AnimateOnView
              once
              blur
              className="md:mb-4 mb-1.5"
            >
              <Badge>
                Servicios
              </Badge>
            </AnimateOnView>

            <AnimateOnView
              once
              blur
              delay={0.2}
              className="h2 md:mb-6 mb-3"
            >
              Todo lo que tu proyecto necesita, de principio a fin.
            </AnimateOnView>

            <AnimateOnView
              once
              delay={0.3}
              className="text-lg"
            >
              Desde migrar un sitio sin romper nada hasta lanzar una tienda o integrar IA: un único punto de contacto para diseño, desarrollo, IA y despliegue.
            </AnimateOnView>
          </div>

          <AnimateOnView
            once
            delay={0.4}
          >
            <Button asChild>
              <Link to="/contact">
                Cuéntame tu proyecto
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </AnimateOnView>
        </div>

        <div>
          {/* Big Card */}
          <AnimateOnView
            once
            y={40}
            delay={0.5}
            className="rounded-2xl md:rounded-4xl p-6 md:p-12 lg:p-16 mb-4 overflow-hidden bg-[#0d0d0f] md:min-h-[597px] relative grid"
          >
            <div className="flex flex-col justify-between items-start h-full max-w-[427px]">
              <StaggerContainer>
                <AnimateOnView
                  once
                  blur
                  delay={0.3}
                >
                  <h4 className="h4 text-white mb-3 max-w-[400px]">
                    Procesos que se ejecutan solos.
                  </h4>
                </AnimateOnView>
                <AnimateOnView
                  once
                  delay={0.4}
                  blur
                >
                  <p className="text-muted mb-8 leading-relaxed">
                    Conecto por API los sistemas que hoy no se hablan y delego a una máquina el trabajo repetitivo: sincronizar datos, generar reportes, disparar tareas programadas. Incluidas las migraciones desde plataformas legadas.
                  </p>
                </AnimateOnView>
              </StaggerContainer>
              <AnimateOnView
                once
                delay={0.5}
              >
                <Button asChild>
                  <Link to="/contact">
                    Cuéntame tu proyecto
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
              </AnimateOnView>
            </div>
            <AnimateOnView
              once
              delay={0.6}
              className="max-w-[300px] md:max-w-[414px] w-full md:absolute right-10 bottom-10 mt-10 md:mt-0 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 font-mono text-xs text-white/70 space-y-1.5"
            >
              <p className="flex items-center gap-2 text-white"><GitBranch className="w-4 h-4 text-[#2563EB]" /> migración-wordpress → node</p>
              <p className="text-white/40">scraping de contenido con Python</p>
              <p className="flex items-center gap-2 text-[#4ec9b0]"><ShieldCheck className="w-4 h-4" /> 0 páginas perdidas</p>
            </AnimateOnView>
          </AnimateOnView>

          {/* Small Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">

            <AnimateOnView
              once
              y={40}
              delay={0.6}
              className="lg:col-span-7 col-span-1"
            >
              <Card className="h-full">
                <CardHeader className="flex justify-center items-center md:py-16 py-4 md:px-8 px-4">
                  <div className="w-full max-w-[298px] rounded-xl border border-border bg-card p-5 space-y-3">
                    {[
                      { label: "Carrito & checkout", active: false },
                      { label: "Quiz de recomendación", active: true },
                      { label: "Pasarela de pago", active: false },
                    ].map((row) => (
                      <div
                        key={row.label}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${row.active ? "bg-[#2563EB]/10 border border-[#2563EB]/30 text-foreground" : "text-muted-foreground"}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${row.active ? "bg-[#2563EB]" : "bg-muted"}`} />
                        {row.label}
                      </div>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="mt-6 p-2 max-w-[420px]">
                  <h3 className="h5 mb-2">
                    E-commerce que vende
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Tiendas en línea con checkout claro, catálogos grandes y experiencias como quizzes de recomendación que convierten mejor.
                  </p>
                </CardContent>
              </Card>
            </AnimateOnView>

            <AnimateOnView
              once
              y={40}
              delay={0.7}
              className="lg:col-span-5 col-span-1"
            >
              <Card className="h-full p-0">
                <CardHeader className="flex justify-center items-center md:py-16 py-10">
                  <div aria-hidden="true" className="w-28 h-28 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                    <Bot className="w-12 h-12 text-[#2563EB]" strokeWidth={1.5} />
                  </div>
                </CardHeader>
                <CardContent className="pt-6 pb-10 px-6 max-w-[420px]">
                  <h3 className="h5 mb-2">
                    IA aplicada
                  </h3>

                  <p className="text-muted-foreground leading-relaxed">
                    Automatizaciones y asistentes con Claude API para resolver tareas reales de tu negocio, no demos bonitas.
                  </p>
                </CardContent>
              </Card>
            </AnimateOnView>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default CoreFeatures;

