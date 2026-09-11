import Container from "@/components/container";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Se exporta para que /contact genere el structured data FAQPage a partir de
// estas mismas preguntas: el marcado tiene que coincidir con lo visible.
export const faqs = [
  {
    question: "¿Quién es Andrés Contreras?",
    answer:
      "Desarrollador full-stack. Construyo software que resuelve problemas reales de negocio: automatización de procesos, agentes con IA, integraciones entre sistemas y plataformas a medida. No maquetas bonitas que se quedan en Figma.",
  },
  {
    question: "¿Con qué tecnologías trabajas?",
    answer:
      "Principalmente Next.js, React, Node.js/Express, PHP y Supabase, con IA aplicada al desarrollo mediante la API de Claude. Uso Claude Code dentro del flujo de trabajo, así que puedo moverme en el stack que tu proyecto ya tenga y no solo en el que domino de memoria.",
  },
  {
    question: "¿Qué proyectos has construido?",
    answer:
      "Migré todo el sitio de una universidad de WordPress a un stack propio con un asistente de IA integrado, lancé de cero una tienda en línea de perfumes con pagos y cuentas, y construí una alternativa a WeTransfer sin los límites de tamaño que todos odiamos. Los casos completos, con el problema y la solución de cada uno, están en la página de servicios.",
  },
  {
    question: "¿Trabajas con plataformas que ya existen o solo desde cero?",
    answer:
      "Las dos cosas. Buena parte de mi trabajo es justamente tomar algo que ya está corriendo (un WordPress lento, un sistema hecho años atrás) y modernizarlo sin perder contenido, SEO ni continuidad del negocio. Si no hace falta reconstruir todo, no lo reconstruyo.",
  },
  {
    question: "¿Qué significa que uses IA en el desarrollo?",
    answer:
      "Que la uso como herramienta de trabajo, no como truco de marketing. Me permite entregar más rápido y trabajar en tecnologías distintas según lo que el proyecto necesite. Y cuando el proyecto lo pide, también construyo IA hacia adentro: agentes y automatizaciones que ejecutan tareas reales del negocio, no un chatbot de vitrina para la demo.",
  },
  {
    question: "¿Cómo empezamos?",
    answer:
      "Escríbeme por el formulario de esta página o a hola@contreras.dev contándome qué necesitas. Reviso el caso, te digo con franqueza si es algo en lo que puedo ayudarte y cómo lo abordaría, y de ahí definimos alcance y tiempos.",
  },
];

const FAQ = () => {

  return (
    <section className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12">
      <Container>
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="max-w-[507px] md:sticky static top-24 self-start">
            <AnimateOnView once blur>
              <Badge className="md:mb-4 mb-1.5">Preguntas frecuentes</Badge>
              <h2 className="h2 md:mb-6 mb-3">Lo que suelen preguntarme</h2>
              <Button asChild>
                <Link to="/contact">
                  Cuéntame tu proyecto <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </AnimateOnView>
          </div>
          <div className="md:max-w-[612px]">
            <AnimateOnView once y={40}>
              <Accordion type="single" collapsible defaultValue="item-0" className="w-full space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card rounded-xl p-5">
                    <AccordionTrigger className="text-left py-0">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="pb-0 data-[state=closed]:pt-0 pt-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimateOnView>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FAQ;

