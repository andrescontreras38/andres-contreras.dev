import Layout from "@/components/layout";
import CoreFeatures from "@/components/sections/features/core-features";
import FeaturesGrid from "@/components/sections/features/features-grid";
import FeaturesHero from "@/components/sections/features/hero";
import SEO from "@/components/seo";
import { appConfig } from "@/utils/app-config";

const Features = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Servicios | ${appConfig.name}`,
    "description": `${appConfig.description}`,
    "url": `${appConfig.url}/features`
  };

  return (
    <>
      <SEO
        title={`Servicios de desarrollo web e IA | ${appConfig.name}`}
        description="Migraciones sin perder SEO, tiendas en línea a medida, agentes con IA, integraciones y herramientas internas. Cada servicio anclado a un proyecto real en producción."
        canonicalUrl="/features"
        ogType="website"
        jsonLd={jsonLd}
      />

      <Layout>
        <FeaturesHero />
        <FeaturesGrid />
        <CoreFeatures />
      </Layout>
    </>
  );
};

export default Features;

