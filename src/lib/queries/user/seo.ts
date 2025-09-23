import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface OrganicResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
}

export const useGetWebsiteResearch = (domain?: string) => {
  return useQuery<OrganicResult[]>({
    queryKey: ["website-research", domain],
    queryFn: async () => {
      if (!domain) return [];
      const res = await axiosInstance.get(
        `/seo/website-search?domain=${domain}`
      );
      return res.data || [];
    },
    enabled: !!domain,
  });
};
