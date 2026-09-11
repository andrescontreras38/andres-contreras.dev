import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const MobileApp = () => {
  const features = [
    {
      title: "Un solo punto de contacto",
      description: "Diseño, desarrollo, IA y despliegue coordinados por una sola persona, sin múltiples proveedores.",
    },
    {
      title: "Proceso a la vista",
      description: "Avances reales, con errores incluidos, en vez de esperar a que todo esté \"perfecto\" para mostrarlo.",
    },
  ];

  return (
    <section className="md:pt-20 xl:pt-32 pt-12 bg-black" id="mobile-app">
      <Container className="flex flex-col md:flex-row justify-between md:gap-10 xl:gap-2xl gap-8">
        <StaggerContainer
          className="flex flex-col lg:max-w-[507px] pg-[120px]"
        >
          {/* Badge */}
          <AnimateOnView
            once
            blur
            className="md:mb-4 mb-1.5"
          >
            <Badge variant="secondary">
              Cómo trabajo
            </Badge>
          </AnimateOnView>

          {/* Headline */}
          <AnimateOnView
            once
            blur
            delay={0.2}
            className="md:mb-6 mb-3"
          >
            <h2 className="h2 text-white">
              Sin intermediarios, sin sorpresas.
            </h2>
          </AnimateOnView>

          {/* Description */}
          <AnimateOnView
            once
            blur
            delay={0.4}
            className="md:mb-6 mb-3"
          >
            <p className="text-lg text-white">Prefiero mostrar el proceso real a esperar a que todo esté perfecto para compartirlo.</p>
          </AnimateOnView>

          {/* Features List */}
          <StaggerContainer
            className="flex flex-col md:gap-6 gap-4 md:mb-10 mb-8 max-w-[459px]"
          >
            {features.map((feature, index) => (
              <AnimateOnView
                once
                blur
                delay={0.5 + index * 0.1}
                key={feature.title}
                className="flex flex-col md:flex-row md:gap-2 lg:gap-4 gap-1"
              >
                <div className="flex-shrink-0 mt-1">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted">
                    {feature.description}
                  </p>
                </div>
              </AnimateOnView>
            ))}
          </StaggerContainer>

          {/* CTA Button */}
          <AnimateOnView
            once
            delay={0.6}
            className="mb-6"
          >
            <Button asChild>
              <Link to="/contact">
                Cuéntame tu proyecto
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </AnimateOnView>
        </StaggerContainer>

        {/* Right Section - Process timeline card */}
        <AnimateOnView
          once
          blur
          delay={0.6}
          className="flex justify-center lg:justify-end w-full lg:max-w-[434px]"
        >
          <div className="w-full rounded-3xl bg-[#0d0d0f] border border-white/10 p-8 space-y-6">
            {[
              { step: "01", title: "Descubrimiento", desc: "Entiendo el problema real detrás del pedido." },
              { step: "02", title: "Construcción", desc: "Avances visibles semana a semana, no al final." },
              { step: "03", title: "Producción", desc: "Despliegue, monitoreo y ajustes con datos reales." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <span className="font-mono text-sm text-[#2563EB]">{item.step}</span>
                <div>
                  <p className="text-white font-medium mb-1">{item.title}</p>
                  <p className="text-muted text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimateOnView>
      </Container>
    </section>
  );
};

export default MobileApp;





