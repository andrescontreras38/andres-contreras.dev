import Container from "@/components/container";
import Layout from "@/components/layout";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { StaggerContainer } from "@/components/ui/motion/stagger";
import { Skeleton } from "@/components/ui/skeleton";
import { useResources } from "@/hooks/use-resources";
import { appConfig } from "@/utils/app-config";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ResourcesPage = () => {
  const { data: resources = [], isLoading } = useResources();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Recursos | ${appConfig.name}`,
    description: "Plantillas, repositorios y herramientas listas para adaptar a tu negocio.",
    url: `${appConfig.url}/recursos`,
    inLanguage: "es",
  };

  return (
    <>
      <SEO
        title={`Recursos gratis para tu negocio | ${appConfig.name}`}
        description="Repositorios, plantillas y herramientas que puedes adaptar al negocio de tu cliente. Gratis, a cambio de tu correo."
        canonicalUrl="/recursos"
        jsonLd={jsonLd}
      />
      <Layout>
        <section className="relative bg-black overflow-hidden banner-top-padding pb-20 md:pb-28">
          <Container className="relative z-10">
            <AnimateOnView blur className="text-center max-w-3xl mx-auto mb-6">
              <h1 className="h1 text-white">Recursos que puedes usar hoy</h1>
            </AnimateOnView>
            <AnimateOnView blur delay={0.2} className="text-center max-w-2xl mx-auto">
              <p className="text-lg text-muted">
                Repositorios y plantillas que uso en proyectos reales, listos para que los adaptes al negocio de tu cliente. Te los llevas dejando tu correo.
              </p>
            </AnimateOnView>
          </Container>
        </section>

        <section className="md:pt-20 xl:pt-32 pt-12 md:pb-20 xl:pb-32 pb-12">
          <Container>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-7 w-24" />
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground mb-2">Todavía no hay recursos publicados.</p>
                <p className="text-muted-foreground">
                  Estoy preparando los primeros.{" "}
                  <Link to="/contact" className="text-[#2563EB] underline underline-offset-4">
                    Escríbeme
                  </Link>{" "}
                  si hay alguno que te sirva y lo priorizo.
                </p>
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources.map((resource, index) => (
                  <AnimateOnView key={resource.id} once y={40} delay={index * 0.08}>
                    <Link to={`/recursos/${resource.slug}`} className="block h-full group">
                      <Card className="h-full border-border border shadow-sm hover-lift">
                        <CardContent className="p-8 flex flex-col h-full gap-5">
                          <Badge variant="secondary" className="w-fit font-mono">
                            {resource.keyword}
                          </Badge>
                          <div className="flex-1">
                            <h2 className="h5 mb-2">{resource.title}</h2>
                            <p className="text-muted-foreground leading-relaxed">{resource.summary}</p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2563EB]">
                            Lo quiero
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </CardContent>
                      </Card>
                    </Link>
                  </AnimateOnView>
                ))}
              </StaggerContainer>
            )}
          </Container>
        </section>
      </Layout>
    </>
  );
};

export default ResourcesPage;
