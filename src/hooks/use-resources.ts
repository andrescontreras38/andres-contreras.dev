import { getResourceBySlug, getResources } from "@/lib/services/resources-service";
import { useQuery } from "@tanstack/react-query";

export const useResources = (includeDrafts = false) =>
  useQuery({
    queryKey: ["resources", { includeDrafts }],
    queryFn: () => getResources(includeDrafts),
  });

export const useResource = (slug: string) =>
  useQuery({
    queryKey: ["resource", slug],
    queryFn: () => getResourceBySlug(slug),
    enabled: !!slug,
  });
