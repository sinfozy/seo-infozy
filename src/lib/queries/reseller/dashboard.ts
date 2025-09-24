import axiosInstance from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface IPlanDistribution {
  plan: string | null;
  count: number;
}

export interface ISalesAnalytics {
  month: number;
  totalSales: number;
}

export interface IRecentSale {
  name: string;
  plan: string;
  amount: number;
  createdAt: string;
}

export interface IUserGrowth {
  month: number;
  year: number;
  count: number;
}

export interface IResellerDashboard {
  stats: {
    totalUsers: number;
    newUsers: number;
    activeUsers: number;
  };
  planDistribution: IPlanDistribution[];
  salesAnalytics: ISalesAnalytics[];
  recentSales: IRecentSale[];
  growthTrend: {
    users: IUserGrowth[];
  };
}

export const useGetResellerDashboard = () => {
  return useQuery<IResellerDashboard>({
    queryKey: ["reseller", "dashboard"],
    queryFn: async () => {
      const res = await axiosInstance.get("/reseller/dashboard");
      return res.data;
    },
  });
};
