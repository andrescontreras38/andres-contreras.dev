export const appConfig = {
    name: "Andrés Contreras",
    description: "Desarrollador full-stack especializado en migraciones, e-commerce e inteligencia artificial aplicada a problemas reales de negocio.",
    // De aquí salen los canonical, el sitemap y el structured data.
    // Se define en VITE_SITE_URL; en Vercel hay que ponerla con la URL real
    // del despliegue, porque Vite la resuelve en tiempo de compilación.
    url: (import.meta.env.VITE_SITE_URL || "https://contreras.dev").replace(/\/$/, ""),
    logo: "/images/common/logo.svg",
    favicon: "/favicon.ico",
    ogImage: "/og-image.png",
}