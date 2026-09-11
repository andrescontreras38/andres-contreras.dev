import Container from "@/components/container";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import {
  BarChart3,
  Bot,
  Boxes,
  Database,
  Gauge,
  LayoutTemplate,
  MessageSquare,
  Plug,
  RefreshCw,
  ShoppingCart,
  Sparkles,
  Workflow,
  Wrench,
  Zap,
} from "lucide-react";

// Los cuatro primeros llevan `proof`: ya están construidos y corriendo, y el
// proyecto que lo demuestra pesa más que cualquier descripción.
const proven = [
  {
    Icon: RefreshCw,
    title: "Migración y modernización",
    description:
      "Llevar una plataforma legacy (WordPress, sistemas hechos a la medida años atrás) a un stack moderno, sin perder contenido, SEO ni continuidad del negocio.",
    proof: "Uniremington: de WordPress + WPBakery a Node.js",
  },
  {
    Icon: ShoppingCart,
    title: "E-commerce a medida",
    description:
      "Tiendas en línea completas: catálogo, checkout, cuentas, correos transaccionales y monitoreo en producción, no una plantilla genérica.",
    proof: "Scentual Bliss: 150+ fragancias en producción",
  },
  {
    Icon: Bot,
    title: "Agentes y automatizaciones con IA",
    description:
      "Automatizaciones y agentes que ejecutan tareas reales del negocio, no un chatbot de vitrina para la demo.",
    proof: "Remi, asistente de orientación sobre la API de Claude",
  },
  {
    Icon: Wrench,
    title: "Herramientas internas",
    description:
      "Utilidades a medida para procesos específicos del equipo: paneles de administración, transferencia de archivos, reportes.",
    proof: "RemiTransfer: archivos sin límite de tamaño",
  },
];

const catalog = [
  {
    group: "Web y plataformas",
    items: [
      {
        Icon: Boxes,
        title: "Aplicaciones web a medida y MVPs",
        description:
          "De la idea a un producto funcionando: base de datos, cuentas, panel y despliegue. Un MVP que puedes poner frente a usuarios reales, no un prototipo de Figma.",
      },
      {
        Icon: Gauge,
        title: "Optimización de sitios WordPress",
        description:
          "Sitios lentos, inseguros o con problemas de SEO: rendimiento, limpieza de plugins, caché, imágenes y Core Web Vitals, sin reconstruir todo si no hace falta.",
      },
      {
        Icon: LayoutTemplate,
        title: "Landing pages y sitios de campaña",
        description:
          "Páginas rápidas, medibles y conectadas a tu CRM, pensadas para convertir, no solo para verse bien en el portafolio del diseñador.",
      },
    ],
  },
  {
    group: "IA aplicada",
    items: [
      {
        Icon: MessageSquare,
        title: "Chatbots de atención y ventas",
        description:
          "Conectados a tu catálogo, tu CRM o tu base de conocimiento, para responder preguntas frecuentes, calificar leads o acompañar la compra.",
      },
      {
        Icon: Zap,
        title: "Automatización de procesos internos",
        description:
          "Tareas repetitivas del equipo (clasificar correos, generar reportes, mover datos entre sistemas) ejecutadas solas y con registro de lo que pasó.",
      },
      {
        Icon: Sparkles,
        title: "Sitios web asistidos por IA",
        description:
          "Sitios propios en tu VPS, versionados con Git, sin depender de un equipo grande para mantenerlos.",
      },
    ],
  },
  {
    group: "Datos e integraciones",
    items: [
      {
        Icon: Plug,
        title: "APIs e integraciones a medida",
        description:
          "Conectar sistemas que hoy no se hablan: APIs propias, webhooks y sincronizaciones entre las herramientas que ya usas.",
      },
      {
        Icon: Workflow,
        title: "Integraciones de CRM",
        description:
          "Conectar tu sitio con el CRM que ya usas para no perder ningún lead, como la integración con Clientify que construí para Uniremington.",
      },
      {
        Icon: Database,
        title: "Scraping y migración de datos",
        description:
          "Rescatar información atrapada en plataformas cerradas o formatos ilegibles y dejarla en una base con la que sí se pueda trabajar.",
      },
      {
        Icon: BarChart3,
        title: "Dashboards y reportes",
        description:
          "Paneles que muestran lo que el negocio necesita decidir hoy, alimentados de tus propias fuentes, no una plantilla de métricas que nadie mira.",
      },
    ],
  },
];

const FeaturesGrid = () => {
  return (
    <section className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12">
      <Container className="md:space-y-10 xl:space-y-2xl space-y-8">
        <AnimateOnView once blur className="max-w-3xl mb-16">
          <h2 className="h2">Cuatro cosas que ya están corriendo en producción</h2>
        </AnimateOnView>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proven.map((service, index) => (
            <AnimateOnView key={service.title} once y={40} delay={index * 0.1}>
              <Card className="h-full border-border border shadow-sm">
                <CardContent className="p-8 flex flex-col h-full gap-6">
                  <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                    <service.Icon className="w-6 h-6 text-[#2563EB]" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h3 className="h5 mb-3">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                  <p className="text-sm font-medium text-[#2563EB] border-t border-border pt-4">
                    {service.proof}
                  </p>
                </CardContent>
              </Card>
            </AnimateOnView>
          ))}
        </div>

        <AnimateOnView once blur className="max-w-3xl pt-12">
          <h2 className="h4 mb-3">Y todo esto también entra</h2>
          <p className="text-muted-foreground leading-relaxed">
            Trabajo con IA (Claude Code) dentro del flujo, así que el stack deja de ser la restricción: me muevo en el que tu proyecto ya tenga, no solo en el que domino de memoria.
          </p>
        </AnimateOnView>

        <div className="space-y-12 pt-4">
          {catalog.map((section, sectionIndex) => (
            <div key={section.group}>
              <AnimateOnView once y={20} delay={sectionIndex * 0.05}>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#2563EB] mb-6 pb-3 border-b border-border">
                  {section.group}
                </h3>
              </AnimateOnView>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {section.items.map((service, index) => (
                  <AnimateOnView key={service.title} once y={30} delay={index * 0.08}>
                    <div className="flex gap-4">
                      <service.Icon className="w-5 h-5 text-[#2563EB] shrink-0 mt-1" strokeWidth={1.5} />
                      <div>
                        <h4 className="text-lg font-medium mb-1.5">{service.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </AnimateOnView>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default FeaturesGrid;
