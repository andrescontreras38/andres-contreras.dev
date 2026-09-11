import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { cn } from "@/lib/utils";

const milestones = [
    { value: "2018", label: "empecé Ingeniería de Sistemas" },
    { value: "3", label: "proyectos reales en el portafolio" },
    { value: "10+", label: "tecnologías distintas en producción" },
];

const story = [
    "Soy de Lorica, Córdoba. En 2018 entré a Ingeniería de Sistemas en la Universidad de Córdoba y salí sin tener claro si quería dedicarme a programar. Mi prima Lilibeth me consiguió el primer trabajo, en Barranquilla: diseñar y desarrollar sitios web de todo tipo, a mano, artesanal, sin una sola línea escrita por IA. Estuve dos años. Giomar, mi jefe de entonces, me enseñó bastante más de lo que cabía en el cargo, y todavía le tengo aprecio y admiración.",
    "Por cosas de la vida volví al pueblo a descansar, sin medir lo difícil que sería conseguir trabajo otra vez. Así que emprendí con un amigo de la universidad. Nuestro primer cliente fue una empresa de acueducto rural: una página informativa por dos millones de pesos. Con el tiempo entendimos que conseguir clientes en Córdoba iba a ser cuesta arriba, así que guardamos lo ganado y nos fuimos a Medellín con esos dos millones. Sin trabajo asegurado, sin amigos allá, sin un solo contacto. Con la esperanza de que las cosas se movieran.",
    "Uno sabe que cambiar de ciudad no va a ser fácil. Lo que no se imagina son los quince días siguientes. Quince días en Medellín sin conseguir nada, hasta que la frustración llegó al punto en que estuvimos a punto de devolvernos. Llamé a mis papás y les conté. Se les ocurrió que fuéramos donde mis tíos, en El Peñol, en el oriente antioqueño. Allá mi primo habló con el dueño de la panadería donde él había trabajado y lo convenció de darme la oportunidad. Nunca me había pasado por la cabeza amasar pan para sostenerme, pero gracias a Dios me fue bien y estuve cuatro meses. Desde el primer día le dije a Ilde, mi jefe, que si me salía algo de mi carrera lo iba a tomar. Lo entendió sin un solo reproche.",
    "En octubre de 2025 volví a Itagüí. Un amigo de infancia del pueblo nos hospedó a mi compañero y a mí durante veintidós días. Conseguimos trabajo en una agencia de trámites de visas, en el CC La Central de Miraflores, y duró pocos meses: los dueños cerraron la empresa para irse tras una oportunidad en el extranjero. Otra vez sin trabajo. Me postulé a varias empresas de tecnología en Medellín y ninguna me contactó para una entrevista. Quizá no preparé bien la hoja de vida, quizá no era el momento.",
    "Mientras tanto trabajé por mi cuenta cerca de seis meses, para agencias de Bogotá que había conocido en la época de Barranquilla, desde el apartaestudio que habíamos logrado arrendar con mucho esfuerzo. En mitad de un proyecto volví a postularme, esta vez sin la urgencia de antes, aunque a cada entrevista llegué con el mismo entusiasmo de siempre. Una respondió: Uniremington, una universidad grande y reconocida, con sedes en todo el país. Melisa, entonces directora de Comunicaciones, me dio la oportunidad que llevaba tanto tiempo buscando. A ella y a Uniremington les voy a estar siempre agradecido.",
    "Cuento todo esto porque explica cómo trabajo. Nada de lo que sé me llegó fácil: lo aprendí resolviendo con lo que tenía a la mano, en una panadería, en un apartaestudio arrendado con esfuerzo, en cada proyecto que me dieron. Por eso, cuando un negocio me cuenta su problema, no pienso primero en qué tecnología quiero usar. Pienso en cómo sacarlo adelante.",
];

const Story = () => {
    return (
        <section className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12">
            <Container>
                <AnimateOnView once className="flex flex-wrap gap-x-12 gap-y-6 pb-12 mb-16 border-b border-border">
                    {milestones.map((item) => (
                        <div key={item.value} className="flex items-baseline gap-3">
                            <span className="text-2xl font-semibold text-[#2563EB]">{item.value}</span>
                            <span className="text-muted-foreground">{item.label}</span>
                        </div>
                    ))}
                </AnimateOnView>

                <AnimateOnView once blur className="mb-10">
                    <h2 className="h2 max-w-2xl">Cómo llegué aquí</h2>
                </AnimateOnView>

                {/* Medida corta a propósito: son párrafos largos y la línea
                    tiene que quedar cómoda de leer. */}
                <div className="max-w-[68ch] space-y-7">
                    {story.map((paragraph, index) => {
                        const esApertura = index === 0;
                        // El último párrafo es la conclusión: es donde el camino
                        // se conecta con la forma de trabajar de hoy. Si se pinta
                        // del mismo gris que los intermedios, el lector lo cruza
                        // sin notarlo y la historia se queda sin remate.
                        const esCierre = index === story.length - 1;

                        return (
                            <AnimateOnView key={index} once y={24} delay={Math.min(index, 3) * 0.06}>
                                <p
                                    className={cn(
                                        "leading-[1.75]",
                                        esApertura && "text-lg text-foreground",
                                        esCierre &&
                                            "text-lg text-foreground border-l-2 border-[#2563EB] pl-6 mt-12",
                                        !esApertura && !esCierre && "text-muted-foreground"
                                    )}
                                >
                                    {paragraph}
                                </p>
                            </AnimateOnView>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
};

export default Story;
