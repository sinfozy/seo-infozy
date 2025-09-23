import { Currency, Plan } from "@/types/enums";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { sendError } from "@/lib/helpers/error-response";

export interface Profile {
  fullname: string;
  username?: string;
  email: string;
  phone?: string;
  avatar?: string;
  isVerified: boolean;
  plan: {
    _id: string;
    name: Plan;
    price: number;
  };
  planActivatedAt?: string | null;
  planEndsAt?: string | null;
  currency: Currency;
  usedSearches: number | null;
  aiConversations?: number | null;
  resellerId?: {
    name: string;
  };
  createdAt: string;
}

export const useGetProfile = () => {
  return useQuery<Profile>({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await axiosInstance.get("/profile");
      return res.data;
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      fullname?: string;
      username?: string;
      phone?: string;
    }) => {
      const res = await axiosInstance.put(`/profile`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile"],
      });
    },
    onError(err) {
      sendError(err);
    },
  });
};
