export const appConfig = {
    name: "Andrés Contreras",
    // El posicionamiento va deliberadamente amplio: automatización, agentes y
    // software a medida cubren lo que se hace, sin encasillarlo en un tipo de
    // proyecto. Migraciones y tiendas en línea siguen apareciendo en las listas
    // de servicios, como ejemplos de lo que cabe aquí dentro y no como el techo.
    description: "Desarrollador full-stack con IA. Automatizo procesos, construyo agentes y desarrollo software a medida para problemas reales de negocio.",
    // De aquí salen los canonical, el sitemap y el structured data.
    // Se define en VITE_SITE_URL; en Vercel hay que ponerla con la URL real
    // del despliegue, porque Vite la resuelve en tiempo de compilación.
    url: (import.meta.env.VITE_SITE_URL || "https://contreras.dev").replace(/\/$/, ""),
    logo: "/images/common/logo.svg",
    favicon: "/favicon.ico",
    ogImage: "/og-image.png",
}