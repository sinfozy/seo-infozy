import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();

  if (!session) {
    redirect("/admin/login");
  }

  if (session && session?.user?.role === "user") {
    redirect("/");
  }

  if (session && session?.user?.role === "reseller") {
    redirect("/reseller");
  }

  if (session && session?.user?.role === "admin") {
    redirect("/admin/dashboard");
  }

  return redirect("/");
}
