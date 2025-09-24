import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface ResellerPayment {
  _id: string;
  ownerId: string;
  ownerModel: "User"; // reseller fetch only user payments
  ownerName: string;
  amount: number;
  currency: string;
  status: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useGetResellerPayments() {
  return useQuery({
    queryKey: ["reseller-payments"],
    queryFn: async () => {
      const res = await axiosInstance.get("/reseller/payments");
      return res.data as ResellerPayment[];
    },
  });
}
