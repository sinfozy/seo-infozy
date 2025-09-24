import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Currency } from "@/types/enums";
import { User } from "./user";
import axiosInstance from "@/lib/axios";
import { sendError } from "@/lib/helpers/error-response";
import { toast } from "sonner";

export interface CreateResellerPayload {
  fullname: string;
  companyName: string;
  email: string;
  phone?: string;
  password: string;
  currency: Currency;
  isActive: boolean;
  notes?: string;
}

export interface CreateResellerResponse {
  message: string;
  resellerId: string;
}

export const useCreateReseller = () => {
  return useMutation<CreateResellerResponse, Error, CreateResellerPayload>({
    mutationFn: async (data: CreateResellerPayload) => {
      const res = await axiosInstance.post("/admin/resellers", data);
      return res.data;
    },
    onSuccess(data) {
      toast.success(data.message || "Reseller created successfully!");
    },
    onError(error) {
      sendError(error);
    },
  });
};

export interface Reseller {
  _id: string;
  fullname: string;
  companyName: string;
  email: string;
  phone?: string;
  currency: string;
  walletId: {
    balance: number;
  };
  isActive: boolean;
  notes?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetResellerResponse {
  message: string;
  reseller: Reseller;
}

export const useGetReseller = (resellerId: string) => {
  return useQuery({
    queryKey: ["reseller", resellerId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/resellers/${resellerId}`);
      return res.data.reseller as GetResellerResponse["reseller"];
    },
    enabled: !!resellerId,
  });
};

export function useGetResellers() {
  return useQuery<Reseller[]>({
    queryKey: ["resellers"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/resellers");

      return res.data.resellers as Reseller[];
    },
  });
}

export interface ToggleResellerStatusPayload {
  id: string;
  isActive: boolean;
}

export interface ToggleResellerStatusResponse {
  message: string;
  resellerId: string;
  isActive: boolean;
}

export const useToggleResellerStatus = () => {
  return useMutation<
    ToggleResellerStatusResponse,
    Error,
    ToggleResellerStatusPayload
  >({
    mutationFn: async ({ id, isActive }: ToggleResellerStatusPayload) => {
      const res = await axiosInstance.patch(`/admin/resellers/${id}/status`, {
        isActive,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update reseller status");
    },
  });
};

export interface UpdateResellerPayload {
  fullname?: string;
  companyName?: string;
  email?: string;
  phone?: string;
  currency?: string;
  isActive?: boolean;
  notes?: string;
}

export const useUpdateReseller = (resellerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateResellerPayload) => {
      const res = await axiosInstance.patch(
        `/admin/resellers/${resellerId}`,
        data
      );
      return res.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["reseller", resellerId] });
      toast.success(data.message || "Reseller updated successfully!");
    },
    onError(error) {
      sendError(error);
    },
  });
};

export const useDeleteReseller = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ resellerId }: { resellerId: string }) => {
      const res = await axiosInstance.delete(`/admin/resellers/${resellerId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["resellers"] });
      toast.success(data.message || "Reseller deleted successfully!");
    },
    onError: (error) => {
      sendError(error);
    },
  });
};

// Get users of a reseller
export const useGetResellerUsers = (resellerId: string) => {
  return useQuery({
    queryKey: ["reseller-users", resellerId],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/admin/resellers/${resellerId}/users`
      );
      return res.data.users as User[];
    },
    enabled: !!resellerId,
  });
};
