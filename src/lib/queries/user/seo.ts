import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { sendError } from "@/lib/helpers/error-response";

interface OrganicResult {
  position: number;
  title: string;
  link: string;
  snippet: string;
}

export const useWebsiteResearch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["website-research"],
    mutationFn: async (domain: string): Promise<OrganicResult[]> => {
      if (!domain) return [];
      const res = await axiosInstance.get(
        `/seo/website-search?domain=${domain}`
      );
      return res.data || [];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-plan"] });
    },
    onError: (error) => {
      sendError(error);
    },
  });
};
