import DashboardLayout from "@/components/layout/protected/DashboardLayout";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "user") {
    redirect("/login");
  }

  if (!session.user.isActive) {
    toast.error("Your account is deactivated. Please contact support.");
    redirect("/login");
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
