import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    name: "Uniremington",
    tag: "Proyecto para cliente",
    description: "Migración de WordPress + WPBakery a un stack propio en Node.js, con scraping en Python para rescatar todo el contenido existente.",
  },
  {
    name: "Scentual Bliss",
    tag: "En producción",
    description: "Tienda en línea de perfumes con más de 150 fragancias, sistema de checkout propio y un quiz olfativo para recomendar productos.",
  },
  {
    name: "RemiTransfer",
    tag: "Proyecto personal",
    description: "Alternativa a WeTransfer sin límites de tamaño ni necesidad de crear una cuenta para enviar archivos.",
  },
];

const Testimonials = () => {
  return (
    <section className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12" id="projects">
      <Container className="md:space-y-10 xl:space-y-2xl space-y-8">
        {/* Section Header */}
        <StaggerContainer
          className="max-w-[683px]"
        >
          <AnimateOnView
            once
            blur
            className="flex items-center gap-2 md:mb-4 mb-1.5">
            <Badge>
              Proyectos
            </Badge>
          </AnimateOnView>
          <AnimateOnView
            once
            blur
            delay={0.1}
          >
            <h2 className="h3">
              Proyectos reales, no mockups.
            </h2>
          </AnimateOnView>
        </StaggerContainer>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <AnimateOnView key={project.name} once y={40} delay={index * 0.1}>
              <Card className="h-full hover-lift">
                <CardContent className="p-6 flex flex-col h-full justify-between gap-8">
                  <div>
                    <Badge variant="secondary" className="mb-4">{project.tag}</Badge>
                    <h3 className="h5 mb-2">{project.name}</h3>
                    <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium text-[#2563EB]">
                    Ver detalle
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </AnimateOnView>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Testimonials;
