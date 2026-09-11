import Layout from "@/components/layout";
import CompanyHero from "@/components/sections/company/hero";
import SEO from "@/components/seo";
import { appConfig } from "@/utils/app-config";
import { lazy, Suspense } from "react";

const Story = lazy(() => import("@/components/sections/company/story"));
const Principles = lazy(() => import("@/components/sections/company/principles"));
const Stack = lazy(() => import("@/components/sections/company/stack"));

const CompanyPage = () => {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
            "@type": "Person",
            "name": "Andrés Contreras",
            "jobTitle": "Desarrollador full-stack",
            "description": appConfig.description,
            "url": appConfig.url,
            "email": "hola@contreras.dev",
            "sameAs": ["https://github.com/andrescontreras38"],
            "knowsAbout": [
                "Next.js",
                "React",
                "Node.js",
                "PHP",
                "Python",
                "Supabase",
                "Claude API",
                "Migraciones de sitios web",
                "E-commerce",
                "Inteligencia artificial aplicada",
            ],
        },
        "url": `${appConfig.url}/company`,
    };

    return (
        <>
            <SEO
                title={`Sobre mí | ${appConfig.name}`}
                description="Desarrollador full-stack con IA aplicada. De Lorica a Medellín: cómo llegué a construir migraciones, tiendas en línea e IA aplicada a problemas reales de negocio."
                canonicalUrl="/company"
                ogType="profile"
                jsonLd={jsonLd}
            />
            <Layout>
                <CompanyHero />
                <Suspense fallback={null}>
                    <Story />
                </Suspense>
                <Suspense fallback={null}>
                    <Principles />
                </Suspense>
                <Suspense fallback={null}>
                    <Stack />
                </Suspense>
            </Layout>
        </>
    );
};

export default CompanyPage;
