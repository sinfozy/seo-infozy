import axiosInstance from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface InfyraSearchResponse {
  text: string;
}

export const useInfyraSearch = () => {
  return useMutation<InfyraSearchResponse, Error, string>({
    mutationFn: async (prompt: string) => {
      const res = await axiosInstance.post("/infyra-search", { prompt });
      return res.data;
    },
  });
};
