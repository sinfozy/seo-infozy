import { GoogleData } from "@/app/api/business-data/google/route";
import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useGetBizGoogleData = (query: string, location: string) => {
  return useQuery<GoogleData[]>({
    queryKey: ["biz-google-data", query, location],
    queryFn: async () => {
      const res = await axiosInstance.post("/business-data/google", {
        query,
        location,
      });
      return res.data || [];
    },
    enabled: !!query && !!location,
  });
};
