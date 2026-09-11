import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";

const tools = [
    "Claude Code",
    "Next.js",
    "React",
    "Node.js",
    "Express",
    "PHP",
    "Python",
    "Supabase",
    "Claude API",
    "Stripe",
    "Automatización",
];

const Stack = () => {
    return (
        <section className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12">
            <Container>
                <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-20">
                    <AnimateOnView once blur className="lg:w-[380px] shrink-0">
                        <h2 className="h3 mb-4">Con qué trabajo</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Uso IA (Claude Code) como parte del flujo de trabajo, no como truco de marketing. Me deja moverme rápido en el stack que cada proyecto necesite, no solo en el que ya domino. Este mismo sitio lo construí así.
                        </p>
                    </AnimateOnView>

                    <div className="flex flex-wrap gap-3 flex-1">
                        {tools.map((tool, index) => (
                            <AnimateOnView key={tool} once y={20} delay={Math.min(index, 6) * 0.05}>
                                <span className="inline-block font-mono text-sm px-4 py-2.5 rounded-lg border border-border bg-card text-foreground/80">
                                    {tool}
                                </span>
                            </AnimateOnView>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default Stack;
