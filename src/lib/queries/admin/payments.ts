import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export type OwnerModel = "User" | "Reseller";

export interface Payment {
  _id: string;
  ownerId: string;
  ownerModel: OwnerModel;
  ownerName: string;
  amount: number;
  currency: "INR" | "USD";
  status: "created" | "paid" | "failed";
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  createdAt: string;
  updatedAt: string;
}

export function useGetPayments() {
  return useQuery({
    queryKey: ["admin-payments"],
    queryFn: async (): Promise<Payment[]> => {
      const res = await axiosInstance.get("/admin/payments");
      return res.data as Payment[];
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
}
