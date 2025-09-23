import { useMutation, useQuery } from "@tanstack/react-query";

import { Plan } from "@/types/enums";
import axiosInstance from "@/lib/axios";

export interface UserPlan {
  name: Plan;
  planActivatedAt: string;
  planEndsAt: string;
  remainingDays: number | null;
  totalSearches: number | null;
  remainingSearches: number | null;
}

export function useGetUserPlan() {
  return useQuery({
    queryKey: ["user-plan"],
    queryFn: async () => {
      const res = await axiosInstance.get("/plan");
      return res.data.plan as UserPlan | null;
    },
  });
}

export interface PurchasePlanPayload {
  planName: string;
}

export interface PurchasePlanResponse {
  message: string;
  plan: {
    name: string;
  };
  planEndsAt: string;
  walletBalance: number;
}

export function usePurchasePlan() {
  return useMutation({
    mutationFn: async (payload: PurchasePlanPayload) => {
      const res = await axiosInstance.post("/plan/purchase", payload);
      return res.data as PurchasePlanResponse;
    },
  });
}
