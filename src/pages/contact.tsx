import Layout from "@/components/layout";
import ContactForm from "@/components/sections/contact/contact-form";
import ContactHero from "@/components/sections/contact/contact-hero";
import FAQ, { faqs } from "@/components/sections/shared/faq";
import SEO from "@/components/seo";
import { appConfig } from "@/utils/app-config";

const ContactPage = () => {
  const contactPage = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: `Contacto | ${appConfig.name}`,
    description: "Cuéntame qué necesitas y te digo con franqueza si puedo ayudarte.",
    url: `${appConfig.url}/contact`,
    inLanguage: "es",
    mainEntity: {
      "@type": "Person",
      name: appConfig.name,
      email: "hola@contreras.dev",
      jobTitle: "Desarrollador full-stack",
      url: appConfig.url,
    },
  };

  // Las respuestas salen del mismo arreglo que se pinta en pantalla.
  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <SEO
        title={`Contacto | ${appConfig.name}`}
        description="Cuéntame qué necesitas y te digo con franqueza si puedo ayudarte. Escríbeme por el formulario o a hola@contreras.dev."
        canonicalUrl="/contact"
        ogType="website"
        jsonLd={[contactPage, faqPage]}
      />
      <Layout>
        <ContactHero />
        <ContactForm />
        <FAQ />
      </Layout>
    </>
  );
};

export default ContactPage;

