"use client";

import { Activity, UserPlus, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

import { LoaderBig } from "@/components/ui/loader";
import { defaultPlans } from "@/lib/seedPlans"; // Use same plan list as admin
import { useGetResellerDashboard } from "@/lib/queries/reseller/dashboard";

function AnimatedCounter({
  value,
  duration = 2000,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function ResellerDashboard() {
  const { data, isLoading, error } = useGetResellerDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <LoaderBig />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <p className="text-red-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  const { stats, planDistribution, salesAnalytics, growthTrend, recentSales } =
    data;

  // Map plan distribution using defaultPlans for consistent chart
  const planChartData = defaultPlans.map((plan) => {
    const found = planDistribution.find((p) => p.plan === plan.name);
    return {
      name: plan.name,
      value: found ? found.count : 0,
    };
  });

  // Sales chart data (monthly)
  const salesData = salesAnalytics.map((s) => ({
    month: s.month,
    sales: s.totalSales,
  }));

  // Growth trend
  const userGrowth = growthTrend.users.map((g) => ({
    month: `${g.month}-${g.year}`,
    users: g.count,
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              <AnimatedCounter value={stats.totalUsers} />
            </div>
            <p className="text-xs text-muted-foreground">All users under you</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Users</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              <AnimatedCounter value={stats.newUsers} />
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              <AnimatedCounter value={stats.activeUsers} />
            </div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Sales Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Analytics</CardTitle>
            <CardDescription>Monthly sales from your users</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="var(--primary)" name="Sales" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Plan Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Plan Distribution</CardTitle>
            <CardDescription>Users across different plans</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={planChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {planChartData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={`var(--chart-${(index % 6) + 1})`}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent User Purchases</CardTitle>
          <CardDescription>Latest transactions from your users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSales.map((sale, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{sale.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {sale.plan} Plan
                  </span>
                </div>
                <div className="text-right font-bold text-primary">
                  ₹{sale.amount}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Growth Trend */}
      <Card>
        <CardHeader>
          <CardTitle>User Growth Trend</CardTitle>
          <CardDescription>Growth of your users over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="users"
                stroke="var(--primary)"
                strokeWidth={3}
                name="Users"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
