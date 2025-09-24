import AdminDashboardLayout from "@/components/layout/admin/AdminDashboardLayout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  if (!session?.user?.role || session.user.role === "user") {
    redirect("/");
  }

  if (!session?.user?.role || session.user.role === "reseller") {
    redirect("/reseller");
  }

  return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
