/**
 * La portada de un artículo sale de su categoría, no de la base de datos.
 *
 * Guardar la ruta en `blog_posts.image` obligaba a correr SQL cada vez que
 * cambiaba una imagen, y dejaba posts con portadas que no tenían nada que ver
 * con el tema. Una imagen subida de verdad (Supabase Storage o un archivo bajo
 * /images/blog/) sí manda sobre la de la categoría.
 */

const COVERS: Record<string, string> = {
  "migraciones": "/images/blog/migraciones.svg",
  "ia aplicada": "/images/blog/ia-aplicada.svg",
  "inteligencia artificial": "/images/blog/ia-aplicada.svg",
  "e-commerce": "/images/blog/ecommerce.svg",
  "ecommerce": "/images/blog/ecommerce.svg",
  "tiendas en línea": "/images/blog/ecommerce.svg",
  "rendimiento": "/images/blog/rendimiento.svg",
  "optimización": "/images/blog/rendimiento.svg",
};

const FALLBACK = "/images/blog/general.svg";

const isRealUpload = (image?: string | null) =>
  !!image && (image.startsWith("http") || image.startsWith("/images/blog/"));

export function coverFor(image?: string | null, category?: string | null): string {
  if (isRealUpload(image)) return image as string;
  const key = (category || "").toLowerCase().trim();
  return COVERS[key] ?? FALLBACK;
}
