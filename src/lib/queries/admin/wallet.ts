import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { sendError } from "@/lib/helpers/error-response";

export interface AdminRechargeWalletPayload {
  adminId: string;
  amount: number;
}

export interface AdminRechargeWalletResponse {
  success: boolean;
  balance: number;
}

export const useRechargeAdminWallet = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AdminRechargeWalletResponse,
    Error,
    AdminRechargeWalletPayload
  >({
    mutationFn: async (data: AdminRechargeWalletPayload) => {
      const res = await axiosInstance.post("/admin/wallet/recharge", data);
      return res.data;
    },
    onSuccess(data, variables) {
      queryClient.invalidateQueries({
        queryKey: ["wallet", variables.adminId, "Admin"],
      });
    },
    onError(error) {
      sendError(error);
    },
  });
};
