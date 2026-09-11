import Layout from "@/components/layout";
import Features from "@/components/sections/home/features";
import Hero from "@/components/sections/home/hero";
import SEO from "@/components/seo";
import { appConfig } from "@/utils/app-config";
import { lazy, Suspense, useRef } from "react";

// Lazy load below-the-fold components for code splitting
const Blog = lazy(() => import("@/components/sections/home/blog"));
const BusinessAccount = lazy(() => import("@/components/sections/home/business-account"));
const CoreFeatures = lazy(() => import("@/components/sections/home/core-features"));
const Integrations = lazy(() => import("@/components/sections/home/integrations"));
const MobileApp = lazy(() => import("@/components/sections/home/mobile-app"));
const SecurityCompliance = lazy(() => import("@/components/sections/home/security-compliance"));
const Testimonials = lazy(() => import("@/components/sections/home/testimonials"));
const Now = lazy(() => import("@/components/sections/home/now"));

const Home = () => {
  const heroRef = useRef<HTMLElement>(null);
  const metaTitle = "Andrés Contreras | Desarrollador Full-Stack con IA";
  const metaDescription = "Migraciones sin downtime, e-commerce que vende e IA aplicada a problemas reales de negocio. Un único punto de contacto para diseño, desarrollo, IA y despliegue.";
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${appConfig.url}/#andres-contreras`,
    "name": "Andrés Contreras",
    "jobTitle": "Desarrollador full-stack",
    "description": appConfig.description,
    "url": appConfig.url,
    "email": "hola@contreras.dev",
    "image": `${appConfig.url}/og-image.png`,
    "sameAs": ["https://github.com/andrescontreras38"],
    "knowsLanguage": "es",
    "knowsAbout": [
      "Desarrollo web full-stack",
      "Migraciones de WordPress",
      "E-commerce a medida",
      "Inteligencia artificial aplicada",
      "Next.js",
      "React",
      "Node.js",
      "PHP",
      "Python",
      "Supabase",
    ],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${appConfig.url}/#website`,
    "url": appConfig.url,
    "name": appConfig.name,
    "description": appConfig.description,
    "inLanguage": "es",
    "publisher": { "@id": `${appConfig.url}/#andres-contreras` },
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": appConfig.name,
    "description": appConfig.description,
    "url": appConfig.url,
    "logo": appConfig.logo,
    "image": appConfig.ogImage,
    "areaServed": "Worldwide",
    "serviceType": "Software Development",
    "knowsAbout": [
      "Next.js",
      "React",
      "Node.js",
      "Python",
      "Supabase",
      "Migraciones de sitios web",
      "E-commerce",
      "Inteligencia artificial aplicada",
      "Claude API"
    ]
  };

  return (
    <>
      <SEO
        title={metaTitle}
        description={metaDescription}
        canonicalUrl="/"
        ogType="profile"
        jsonLd={[person, website, jsonLd]}
      />
      <Layout>
        <Hero heroRef={heroRef} />
        <Features heroRef={heroRef} />
        <Suspense fallback={null}>
          <CoreFeatures />
        </Suspense>
        <Suspense fallback={null}>
          <MobileApp />
        </Suspense>
        <Suspense fallback={null}>
          <BusinessAccount />
        </Suspense>
        <Suspense fallback={null}>
          <Integrations />
        </Suspense>
        <Suspense fallback={null}>
          <SecurityCompliance />
        </Suspense>
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>
        <Suspense fallback={null}>
          <Now />
        </Suspense>
        <Suspense fallback={null}>
          <Blog />
        </Suspense>
      </Layout>
    </>
  );
};

export default Home;
