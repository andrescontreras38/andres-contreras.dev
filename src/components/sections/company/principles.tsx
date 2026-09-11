import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";

const principles = [
    {
        title: "Construir en público",
        description:
            "Prefiero mostrar el proceso real, con errores incluidos, a esperar a que todo esté perfecto para compartirlo.",
    },
    {
        title: "IA como herramienta, no como truco",
        description:
            "Uso Claude Code y la API de Claude para moverme rápido en el stack que cada proyecto necesite, no para inflar features ni limitarme a lo que ya domino.",
    },
    {
        title: "Producto antes que código bonito",
        description:
            "Un proyecto que resuelve un problema real de un cliente vale más que una arquitectura perfecta que nadie usa.",
    },
];

const Principles = () => {
    return (
        <section className="bg-black text-white md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12">
            <Container>
                <AnimateOnView once blur className="mb-12 md:mb-16">
                    <h2 className="h2 max-w-2xl">Cómo trabajo</h2>
                </AnimateOnView>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                    {principles.map((principle, index) => (
                        <AnimateOnView key={principle.title} once y={40} delay={index * 0.1}>
                            <div className="border-t border-white/15 pt-6">
                                <h3 className="h5 text-white mb-3">{principle.title}</h3>
                                <p className="text-muted leading-relaxed">{principle.description}</p>
                            </div>
                        </AnimateOnView>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Principles;
