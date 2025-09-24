import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface Dashboard {
  stats: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
    totalResellers: number;
    newResellers: number;
  };
  planDistribution: {
    plan: string | null; // comes from Plan.name via $lookup
    count: number;
  }[];
  salesAnalytics: {
    month: number;
    sales: Record<string, number>; // { User?: number, Reseller?: number }
  }[];
  growthTrend: {
    users: { month: number; year: number; count: number }[];
    resellers: { month: number; year: number; count: number }[];
  };
}

export const useGetAdminDashboard = () => {
  return useQuery<Dashboard>({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/dashboard");
      return res.data as Dashboard;
    },
  });
};
