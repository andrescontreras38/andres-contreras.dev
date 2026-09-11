import Container from "@/components/container";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";

const milestones = [
    { value: "2018", label: "empecé Ingeniería de Sistemas" },
    { value: "3", label: "proyectos reales en el portafolio" },
    { value: "10+", label: "tecnologías distintas en producción" },
];

const story = [
    "Soy de Lorica, Córdoba. En 2018 empecé Ingeniería de Sistemas en la Universidad de Córdoba y, al terminar, no tenía claro si quería dedicarme a programar. Gracias a mi prima Lilibeth conseguí mi primer trabajo en Barranquilla, como diseñador y desarrollador de todo tipo de sitios web, todo muy manual y artesanal, sin ayuda de IA. Ahí trabajé dos años, con un jefe, Giomar, al que le tengo mucho aprecio y admiración.",
    "Por cosas de la vida volví a mi pueblo a descansar, sin pensar en lo difícil que sería después conseguir trabajo de nuevo. Así que decidí emprender con un amigo y compañero de la universidad, desarrollando sitios web. Conseguimos un cliente: una empresa de acueducto rural, a la que le hicimos una página informativa por 2 millones de pesos. Con el tiempo nos dimos cuenta de que conseguir clientes en Córdoba era difícil, así que guardamos lo que habíamos ganado y decidimos aventurarnos a Medellín en busca de mejores oportunidades, con esos dos millones de pesos, sin trabajo asegurado, sin amigos ni contactos, pero con la esperanza de mejorar.",
    "Cuando uno cambia de ciudad sabe que las cosas no van a ser fáciles. A los 15 días de estar en Medellín sin conseguir nada, la frustración y la desesperación eran tan fuertes que estuvimos a punto de abortar la misión. En ese momento llamé a mis papás y les conté la situación; se les ocurrió que fuéramos a visitar a mis tíos en El Peñol, en el oriente antioqueño. Allá mi primo conocía al dueño de una panadería, donde él había trabajado, y lo convenció de darme la oportunidad de trabajar como panadero. Nunca se me había pasado por la cabeza hacer ese tipo de malabares, trabajar en algo totalmente distinto a lo que había estudiado, pero gracias a Dios me fue muy bien: trabajé ahí cuatro meses. Desde el principio le había dicho a mi jefe, Ilde, que si me salía una oportunidad en mi carrera la iba a tomar, y él, una excelente persona, lo entendió sin problema.",
    "En octubre de 2025 volví a Itagüí, un municipio cerca de Medellín, donde un amigo de infancia de mi pueblo nos hospedó a mí y a mi compañero de la universidad durante 22 días. Ahí conseguimos trabajo en una agencia de trámites de visas, en el CC La Central de Miraflores, pero duramos solo unos meses, porque los dueños cerraron la empresa por una mejor oportunidad de negocio en el extranjero. Volví a quedar sin trabajo. Me postulé a varias empresas de tecnología en Medellín y ninguna me contactó para una entrevista; tal vez no preparé bien la hoja de vida, o simplemente no era el momento.",
    "Mientras tanto trabajé como independiente, unos seis meses, para agencias de Bogotá con las que había hecho contacto durante mi época en Barranquilla, desde el apartaestudio que ya habíamos logrado arrendar con mucho esfuerzo. En medio de un proyecto, volví a postularme a varias empresas, esta vez sin la urgencia de antes, aunque en cada entrevista seguía poniendo el mismo entusiasmo de siempre. Por cosas de la vida, una de ellas me contactó: Uniremington, una universidad grande y reconocida con sedes en todo el país. Melisa, en ese entonces directora de Comunicaciones, me dio la oportunidad que había estado buscando desde hacía tanto tiempo. Le estaré siempre agradecido a ella y a Uniremington por ese logro. De ahí en adelante, cada proyecto de este portafolio es el resultado de ese camino.",
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

                {/* Medida corta a propósito: son cinco párrafos largos y la línea
                    tiene que quedar cómoda de leer. */}
                <div className="max-w-[68ch] space-y-7">
                    {story.map((paragraph, index) => (
                        <AnimateOnView key={index} once y={24} delay={Math.min(index, 3) * 0.06}>
                            <p
                                className={
                                    index === 0
                                        ? "text-lg leading-[1.75] text-foreground"
                                        : "leading-[1.75] text-muted-foreground"
                                }
                            >
                                {paragraph}
                            </p>
                        </AnimateOnView>
                    ))}
                </div>
            </Container>
        </section>
    );
};

export default Story;
