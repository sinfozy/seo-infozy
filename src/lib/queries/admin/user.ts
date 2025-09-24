import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Currency } from "@/types/enums";
import axiosInstance from "@/lib/axios";
import { sendError } from "@/lib/helpers/error-response";
import { toast } from "sonner";

export interface CreateUserPayload {
  resellerId: string;
  fullname: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
  currency: Currency;
  isActive: boolean;
  notes?: string;
}

export interface CreateUserResponse {
  message: string;
  userId: string;
}

export const useCreateUser = () => {
  return useMutation<CreateUserResponse, Error, CreateUserPayload>({
    mutationFn: async (data: CreateUserPayload) => {
      const res = await axiosInstance.post("/admin/users", data);
      return res.data;
    },
    onSuccess(data) {
      toast.success(data.message || "User created successfully!");
    },
    onError(error) {
      sendError(error);
    },
  });
};

export interface User {
  _id: string;
  avatar?: string;
  fullname: string;
  username: string;
  resellerId: {
    _id: string;
    companyName: string;
  };
  email: string;
  phone?: string;
  plan: {
    name: string;
    searchesLimit: number;
  };
  currency: string;
  walletId: {
    balance: number;
  };
  isActive: boolean;
  notes?: string;

  usedSearches: 0;
  websiteSearchHistory: {
    url: string;
    searchedAt: Date;
  }[];
  aiConversationHistory: {
    input: string;
    output: string;
    createdAt: Date;
  }[];

  createdAt: string;
}

export interface GetUserResponse {
  message: string;
  user: User;
}

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/users/${userId}`);
      return res.data.user as GetUserResponse["user"];
    },
    enabled: !!userId,
  });
};

export function useGetUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/users");
      return res.data.users as User[];
    },
  });
}

export interface UpdateUserPayload {
  fullname?: string;
  username?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  notes?: string;
}

export const useUpdateUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserPayload) => {
      const res = await axiosInstance.patch(`/admin/users/${userId}`, data);
      return res.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      toast.success(data.message || "User updated successfully!");
    },
    onError(error) {
      sendError(error);
    },
  });
};

export interface ToggleUserStatusPayload {
  id: string;
  isActive: boolean;
}

export interface ToggleUserStatusResponse {
  message: string;
  userId: string;
  isActive: boolean;
}

export const useToggleUserStatus = () => {
  return useMutation<ToggleUserStatusResponse, Error, ToggleUserStatusPayload>({
    mutationFn: async ({ id, isActive }: ToggleUserStatusPayload) => {
      const res = await axiosInstance.patch(`/admin/users/${id}/status`, {
        isActive,
      });
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user status");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      const res = await axiosInstance.delete(`/admin/users/${userId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message || "User deleted successfully!");
    },
    onError: (error) => {
      sendError(error);
    },
  });
};
