import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Currency } from "@/types/enums";
import axiosInstance from "@/lib/axios";
import { sendError } from "@/lib/helpers/error-response";
import { toast } from "sonner";

export interface WalletTransaction {
  amount: number;
  type: "credit" | "debit";
  description: string;
  createdAt: string;
  by: string;
}

export interface Wallet {
  ownerId: string;
  ownerModel: "User" | "Reseller" | "Admin";
  balance: number;
  currency: Currency;
  transactions: WalletTransaction[];
}

export const useGetWallet = (
  ownerId: string,
  ownerModel: "User" | "Reseller" | "Admin"
) => {
  return useQuery({
    queryKey: ["wallet", ownerId, ownerModel],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/wallet/${ownerId}?ownerModel=${ownerModel}`
      );
      return res.data as Wallet;
    },
    enabled: !!ownerId && !!ownerModel,
  });
};

export interface InitRechargePayload {
  ownerId: string;
  ownerModel: "User" | "Reseller";
  amount: number;
}

export interface InitRechargeResponse {
  success: boolean;
  order: {
    orderId: string;
    amount: number;
    currency: string;
  };
}

export const useInitRecharge = () => {
  return useMutation<InitRechargeResponse, Error, InitRechargePayload>({
    mutationFn: async (data: InitRechargePayload) => {
      const res = await axiosInstance.post("/wallet/recharge-init", data);
      return res.data;
    },
    onSuccess() {
      toast.success("Razorpay order created. Proceed to payment.");
    },
    onError(error) {
      sendError(error);
    },
  });
};

export interface TransferWalletPayload {
  fromId: string;
  fromModel: "Admin" | "Reseller";
  toId: string;
  toModel: "Reseller" | "User";
  amount: number;
  by: string;
}

export interface TransferWalletResponse {
  success: boolean;
  fromBalance: number;
  toBalance: number;
}

export const useTransferWallet = () => {
  const queryClient = useQueryClient();

  return useMutation<TransferWalletResponse, Error, TransferWalletPayload>({
    mutationFn: async (data: TransferWalletPayload) => {
      const res = await axiosInstance.post("/wallet/transfer", data);
      return res.data;
    },
    onSuccess(data, variables) {
      queryClient.invalidateQueries({ queryKey: ["wallet", variables.fromId] });
      queryClient.invalidateQueries({ queryKey: ["wallet", variables.toId] });
      toast.success("Wallet transfer successful!");
    },
    onError(error) {
      sendError(error);
    },
  });
};
