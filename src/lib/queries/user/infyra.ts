import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";

interface InfyraSearchResponse {
  text: string;
}

export const useInfyraSearch = () => {
  const queryClient = useQueryClient();

  return useMutation<InfyraSearchResponse, Error, string>({
    mutationFn: async (prompt: string) => {
      const res = await axiosInstance.post("/infyra-search", { prompt });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-plan"] });
    },
  });
};
