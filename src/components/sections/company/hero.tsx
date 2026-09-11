import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CompanyHero = () => {
    return (
        <section className="relative bg-black overflow-hidden banner-top-padding pb-20 md:pb-28 lg:pb-32">
            <Container className="relative z-10">
                <AnimateOnView blur className="text-center max-w-3xl mx-auto mb-6" delay={0.1}>
                    <h1 className="h1 text-white">
                        Desarrollador full-stack con IA aplicada
                    </h1>
                </AnimateOnView>

                <StaggerContainer className="max-w-2xl mx-auto text-center space-y-4 mb-10">
                    <AnimateOnView blur delay={0.2}>
                        <p className="text-lg text-muted">
                            Soy Andrés Contreras. Construyo software para empresas y productos propios, desde migraciones de WordPress a stacks propios en Node.js hasta tiendas en línea completas, y cada vez más con IA aplicada al desarrollo y a la operación del negocio.
                        </p>
                    </AnimateOnView>
                    <AnimateOnView blur delay={0.3}>
                        <p className="text-lg text-muted">
                            Este sitio reúne ese trabajo: los proyectos que he construido, cómo los resolví, y los tutoriales que salen de ese proceso.
                        </p>
                    </AnimateOnView>
                </StaggerContainer>

                <StaggerContainer className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <AnimateOnView delay={0.4}>
                        <Button asChild>
                            <Link to="/contact">
                                Cuéntame tu proyecto
                                <ArrowRight className="w-5 h-5 ml-1" />
                            </Link>
                        </Button>
                    </AnimateOnView>
                    <AnimateOnView delay={0.5}>
                        <Button variant="link" asChild>
                            <Link to="/features">
                                En qué puedo ayudarte
                            </Link>
                        </Button>
                    </AnimateOnView>
                </StaggerContainer>
            </Container>
        </section>
    );
};

export default CompanyHero;
