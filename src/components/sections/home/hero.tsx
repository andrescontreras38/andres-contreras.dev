import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Container from "../../container";
import { Badge } from "../../ui/badge";

const Hero = ({ heroRef }: {
  heroRef?: React.RefObject<HTMLElement> | null
}) => {
  const isMobile = useIsMobile();
  
  return (
    <section ref={heroRef} className="relative min-h-screen bg-black overflow-hidden banner-top-padding md:pb-20 lg:pb-24 pb-[60px]">
      <Container className="relative z-10">
        <StaggerContainer className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:gap-4 xl:gap-6 mb-4 md:mb-8">
          <AnimateOnView>
            <Badge variant="color">Desarrollador Full-Stack</Badge>
          </AnimateOnView>
          <AnimateOnView delay={0.1}>
            <Badge variant="color">
              <span>IA aplicada a <span className="text-white">problemas reales</span> de negocio</span>
            </Badge>
          </AnimateOnView>
        </StaggerContainer>

        <AnimateOnView blur className="text-center max-w-3xl mx-auto lg:mb-6 md:mb-5 mb-4" delay={0.2}>
          <h1 className="h1 text-white">
            Construyo el software que tu negocio necesita
          </h1>
        </AnimateOnView>

        <AnimateOnView blur className="text-center max-w-2xl mx-auto lg:mb-10 md:mb-8 mb-4" delay={0.3}>
          <p className="text-lg text-muted">
            Automatizo procesos que hoy se hacen a mano, construyo agentes con IA que ejecutan tareas de punta a punta e integro los sistemas que tu negocio ya usa, con un único punto de contacto para diseño, desarrollo, IA y despliegue.
          </p>
        </AnimateOnView>

        <StaggerContainer className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <AnimateOnView delay={0.4}>
            <Button asChild>
              <Link to="/contact">
                Cuéntame tu proyecto
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </Button>
          </AnimateOnView>
          <AnimateOnView delay={0.6}>
            <Button variant="link" asChild>
              <Link to="/features">
                Ver servicios
              </Link>
            </Button>
          </AnimateOnView>
        </StaggerContainer>

        {/* Visual Composition */}
        <div className="relative flex justify-between xl:gap-10 gap-4 flex-wrap lg:flex-nowrap mt-[50px] xl:mt-24 max-w-[904px] mx-auto">
          {/* Code snippet card - Left */}
          <div className="relative z-10">
            <AnimateOnView
              delay={0.6}
              className={`relative sm:max-w-[395px] w-full ${isMobile ? '' : 'animate-float'}`}
              style={{ perspective: "1000px" }}
            >
              <div className="rounded-2xl overflow-hidden bg-[#0d0d0f] border border-white/10 shadow-2xl font-mono text-sm">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="ml-2 text-xs text-white/40">agente.ts</span>
                </div>
                <div className="p-5 space-y-1.5 text-[#d4d4d4]">
                  <p><span className="text-[#c586c0]">const</span> <span className="text-[#9cdcfe]">agente</span> = <span className="text-[#dcdcaa]">crearAgente</span>({'{'} <span className="text-[#9cdcfe]">tools</span>, <span className="text-[#9cdcfe]">datos</span> {'}'});</p>
                  <p><span className="text-[#c586c0]">await</span> <span className="text-[#9cdcfe]">agente</span>.<span className="text-[#dcdcaa]">ejecutar</span>(<span className="text-[#9cdcfe]">proceso</span>);</p>
                  <p className="text-white/30">// sin intervención manual</p>
                  <p className="text-[#4ec9b0]">✓ proceso automatizado</p>
                </div>
              </div>
            </AnimateOnView>
          </div>

          {/* Status card - Right */}
          <div className="relative z-10">
            <AnimateOnView
              delay={0.7}
              className={`relative sm:max-w-[307px] w-full ${isMobile ? '' : 'animate-float-slow'}`}
            >
              <div className="rounded-2xl bg-white p-5 shadow-2xl">
                <p className="text-xs text-muted-foreground mb-3">Stack en producción</p>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-sm font-medium">Next.js · React · Node</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-sm font-medium">PHP · Python · Supabase</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-sm font-medium">Stripe · Claude API</span>
                </div>
              </div>
            </AnimateOnView>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
