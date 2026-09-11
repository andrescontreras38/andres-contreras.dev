import { Helmet } from "react-helmet-async";
import { appConfig } from "@/utils/app-config";

interface SEOProps {
    title: string;
    description: string;
    canonicalUrl: string;
    ogType?: "website" | "article" | "profile";
    ogImage?: string;
    twitterCard?: "summary" | "summary_large_image";
    jsonLd?: object | object[];
    /** Solo para artículos: alimenta las etiquetas article:* de Open Graph. */
    publishedTime?: string;
    modifiedTime?: string;
    section?: string;
    /** Páginas que no deben indexarse (login, panel, utilidades). */
    noIndex?: boolean;
}

const SEO = ({
    title,
    description,
    canonicalUrl,
    ogType = "website",
    ogImage = "/og-image.png",
    twitterCard = "summary_large_image",
    jsonLd,
    publishedTime,
    modifiedTime,
    section,
    noIndex = false,
}: SEOProps) => {
    // Una sola fuente de verdad para el dominio. Antes estaba escrito a mano
    // apuntando a otro sitio, así que cada canonical señalaba a un dominio ajeno.
    const siteUrl = appConfig.url.replace(/\/$/, "");

    // Bloqueado por defecto: mientras el sitio viva en una URL provisional, que
    // se indexe crearía una versión que luego competiría con el dominio real.
    // Se abre poniendo VITE_ALLOW_INDEXING=true en el despliegue definitivo.
    const indexingAllowed = import.meta.env.VITE_ALLOW_INDEXING === "true";
    const blockIndex = noIndex || !indexingAllowed;
    const fullUrl = `${siteUrl}${canonicalUrl}`;
    const fullImageUrl = ogImage.startsWith("http") ? ogImage : `${siteUrl}${ogImage}`;
    const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

    return (
        <Helmet>
            <html lang="es" />
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph */}
            <meta property="og:type" content={ogType} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:image" content={fullImageUrl} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={title} />
            <meta property="og:site_name" content={appConfig.name} />
            <meta property="og:locale" content="es_CO" />

            {ogType === "article" && publishedTime && (
                <meta property="article:published_time" content={publishedTime} />
            )}
            {ogType === "article" && modifiedTime && (
                <meta property="article:modified_time" content={modifiedTime} />
            )}
            {ogType === "article" && section && (
                <meta property="article:section" content={section} />
            )}
            {ogType === "article" && <meta property="article:author" content={appConfig.name} />}

            {/* Twitter */}
            <meta name="twitter:card" content={twitterCard} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImageUrl} />
            <meta name="twitter:image:alt" content={title} />

            <meta name="author" content={appConfig.name} />
            <meta
                name="robots"
                content={blockIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"}
            />

            {blocks.map((block, index) => (
                <script type="application/ld+json" key={index}>
                    {JSON.stringify(block)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
