import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { User } from "../admin/user";
import axiosInstance from "@/lib/axios";
import { sendError } from "@/lib/helpers/error-response";
import { toast } from "sonner";

export interface GetUserResponse {
  message: string;
  user: User;
}

export const useGetUser = (userId: string) => {
  return useQuery({
    queryKey: ["reseller-user", userId],
    queryFn: async () => {
      const res = await axiosInstance.get(`/reseller/users/${userId}`);
      return res.data.user as GetUserResponse["user"];
    },
    enabled: !!userId,
  });
};

// Get users of a reseller
export const useGetResellerUsers = () => {
  return useQuery({
    queryKey: ["reseller-users"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/reseller/users`);
      return res.data.users as User[];
    },
  });
};

export interface CreateUserPayload {
  fullname: string;
  username?: string;
  email: string;
  phone?: string;
  password: string;
  currency: "USD" | "INR";
}

export interface CreateUserResponse {
  message: string;
  userId: string;
}

export const useCreateUserByReseller = () => {
  return useMutation<CreateUserResponse, Error, CreateUserPayload>({
    mutationFn: async (data: CreateUserPayload) => {
      const res = await axiosInstance.post("/reseller/users", data);
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

export interface UpdateResellerUserPayload {
  fullname?: string;
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export const useUpdateResellerUser = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateResellerUserPayload) => {
      const res = await axiosInstance.patch(`/reseller/users/${userId}`, data);
      return res.data;
    },
    onSuccess(data) {
      queryClient.invalidateQueries({ queryKey: ["reseller-user", userId] });
      toast.success(data.message || "User updated successfully!");
    },
    onError(error) {
      sendError(error);
    },
  });
};
