import ResellerDashboardLayout from "@/components/layout/reseller/ResellerDashboardLayout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session?.user?.role || session.user.role === "user") {
    redirect("/");
  }

  if (!session?.user?.role || session.user.role === "admin") {
    redirect("/admin");
  }

  return <ResellerDashboardLayout>{children}</ResellerDashboardLayout>;
}
