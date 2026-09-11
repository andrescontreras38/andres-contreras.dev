import Layout from "@/components/layout";
import BlogDetailsContent from "@/components/sections/blog/blog-details-content";
import BlogDetailsHero from "@/components/sections/blog/blog-details-hero";
import MoreBlogs from "@/components/sections/blog/more-blogs";
import SEO from "@/components/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { useBlogPost } from "@/hooks/use-blog";
import { coverFor } from "@/lib/blog-covers";
import { excerptFromHtml } from "@/lib/utils";
import { appConfig } from "@/utils/app-config";
import { Navigate, useParams } from "react-router-dom";

const BlogDetails = () => {
  const { slug } = useParams();
  const { data: post, isLoading, isError } = useBlogPost(slug || "");

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-32 pb-20">
          <div className="max-w-4xl mx-auto px-4 space-y-8">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !post) {
    return <Navigate to="/blog" replace />;
  }

  const excerpt = excerptFromHtml(post.content || "");
  const url = `${appConfig.url}/blog/${post.slug}`;
  const cover = coverFor(post.image, post.category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: excerpt,
    author: {
      "@type": "Person",
      name: post.author,
      url: appConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: appConfig.name,
    },
    datePublished: post.date,
    dateModified: post.updated_at || post.date,
    articleSection: post.category,
    inLanguage: "es",
    image: `${appConfig.url}${cover}`,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  // El BreadcrumbList lo emite <BlogBreadcrumbs>, derivado de las migas
  // visibles. Duplicarlo aquí generaba dos bloques del mismo tipo.
  return (
    <>
      <SEO
        title={`${post.title} | ${appConfig.name}`}
        description={excerpt}
        canonicalUrl={`/blog/${post.slug}`}
        ogType="article"
        ogImage={cover}
        publishedTime={post.date}
        modifiedTime={post.updated_at || post.date}
        section={post.category}
        jsonLd={jsonLd}
      />
      <Layout>
        <BlogDetailsHero post={post} />
        <BlogDetailsContent post={post} />
        <MoreBlogs />
      </Layout>
    </>
  );
};

export default BlogDetails;
