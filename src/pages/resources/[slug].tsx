import Container from "@/components/container";
import Layout from "@/components/layout";
import BlogBreadcrumbs from "@/components/sections/blog/blog-breadcrumbs";
import ClaimForm from "@/components/sections/resources/claim-form";
import SEO from "@/components/seo";
import { Badge } from "@/components/ui/badge";
import { AnimateOnView } from "@/components/ui/motion/animate-on-view";
import { Skeleton } from "@/components/ui/skeleton";
import { useResource } from "@/hooks/use-resources";
import { appConfig } from "@/utils/app-config";
import { Check } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

const ResourceDetail = () => {
  const { slug } = useParams();
  const { data: resource, isLoading, isError } = useResource(slug || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-20">
          <Container className="max-w-4xl space-y-6">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-24 w-full" />
          </Container>
        </div>
      </Layout>
    );
  }

  if (isError || !resource) return <Navigate to="/recursos" replace />;

  const url = `${appConfig.url}/recursos/${resource.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: resource.title,
    description: resource.summary,
    url,
    inLanguage: "es",
    isAccessibleForFree: true,
    author: { "@type": "Person", name: appConfig.name, url: appConfig.url },
  };

  return (
    <>
      <SEO
        title={`${resource.title} | Recurso gratis | ${appConfig.name}`}
        description={resource.summary}
        canonicalUrl={`/recursos/${resource.slug}`}
        jsonLd={jsonLd}
      />
      <Layout>
        <section className="relative bg-black overflow-hidden banner-top-padding pb-16 md:pb-20">
          <Container className="relative z-10">
            <BlogBreadcrumbs
              className="mb-8"
              items={[
                { label: "Inicio", to: "/" },
                { label: "Recursos", to: "/recursos" },
                { label: resource.title, to: `/recursos/${resource.slug}` },
              ]}
            />
            <AnimateOnView blur className="max-w-3xl">
              <Badge variant="color" className="mb-4 font-mono">
                Comenta {resource.keyword} y te lo paso
              </Badge>
              <h1 className="h1 text-white mb-5">{resource.title}</h1>
              <p className="text-lg text-muted">{resource.summary}</p>
            </AnimateOnView>
          </Container>
        </section>

        <section className="md:pt-20 xl:pt-24 pt-12 md:pb-20 xl:pb-32 pb-12">
          <Container className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
            <div className="flex-1 max-w-[640px]">
              {resource.includes.length > 0 && (
                <AnimateOnView once className="mb-10">
                  <h2 className="h4 mb-6">Qué incluye</h2>
                  <ul className="space-y-3">
                    {resource.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <Check className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </AnimateOnView>
              )}

              {resource.description && (
                <AnimateOnView once delay={0.1}>
                  <h2 className="h4 mb-4">Cómo usarlo</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {resource.description}
                  </p>
                </AnimateOnView>
              )}
            </div>

            <AnimateOnView once y={30} className="w-full lg:w-[400px] lg:sticky lg:top-28 shrink-0">
              <ClaimForm resource={resource} />
            </AnimateOnView>
          </Container>
        </section>
      </Layout>
    </>
  );
};

export default ResourceDetail;
