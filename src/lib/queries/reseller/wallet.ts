import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/lib/axios";
import { sendError } from "@/lib/helpers/error-response";

export const useWithdrawUserWallet = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    Error,
    { ownerId: string; ownerModel: string; amount: number; by: string }
  >({
    mutationFn: async ({ ownerId, ownerModel, amount, by }) => {
      const res = await axiosInstance.post("/reseller/wallet/withdraw", {
        ownerId,
        ownerModel,
        amount,
        by,
      });
      return res.data;
    },
    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: ["wallet", variables.ownerId],
      });
    },
    onError(error) {
      sendError(error);
    },
  });
};
