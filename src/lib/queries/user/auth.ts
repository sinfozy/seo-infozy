import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export interface SignupPayload {
  fullname: string;
  username: string;
  email: string;
  password: string;
  currency: string;
}

export interface SignupResponse {
  message: string;
  userId: string;
  email: string;
}

export const useSignup = () => {
  return useMutation<SignupResponse, Error, SignupPayload>({
    mutationFn: async (data: SignupPayload): Promise<SignupResponse> => {
      const res = await axiosInstance.post("/auth/signup", data);
      return res.data;
    },
    onError(error) {
      toast.error(error.message);
    },
  });
};

export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export const useVerifyOtp = () => {
  return useMutation<VerifyOtpResponse, Error, VerifyOtpPayload>({
    mutationFn: async (data: VerifyOtpPayload): Promise<VerifyOtpResponse> => {
      const res = await axiosInstance.post("/auth/verify-email", data);
      return res.data;
    },
    onError(error) {
      toast.error(error.message);
    },
  });
};

export interface ResendOtpPayload {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
}

export const useResendOtp = () => {
  return useMutation<ResendOtpResponse, Error, ResendOtpPayload>({
    mutationFn: async (data: ResendOtpPayload): Promise<ResendOtpResponse> => {
      const res = await axiosInstance.post("/auth/resend-otp", data);
      return res.data;
    },
    onError(error) {
      toast.error(error.message);
    },
  });
};

type ForgotPasswordPayload = {
  email: string;
};

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (payload: ForgotPasswordPayload) => {
      const { data } = await axiosInstance.post(
        "/auth/forgot-password",
        payload
      );
      return data;
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({
      token,
      password,
      email,
    }: {
      token: string;
      password: string;
      email: string;
    }) => {
      const { data } = await axiosInstance.post("/auth/reset-password", {
        token,
        password,
        email,
      });
      return data;
    },

    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });
};
