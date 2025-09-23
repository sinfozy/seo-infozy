"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Currency, Plan } from "@/types/enums";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  ShieldCheckIcon,
  UserIcon,
  Wallet,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { DashboardSidebarLinks } from "./DashboardSidebarLinks";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import Logo from "@/components/ui/logo";
import { RemainingSearches } from "@/components/RemainingSearches";
import { TrialTimer } from "@/components/TrialTimer";
import { useGetUserPlan } from "@/lib/queries/user/plan";
import { useGetWallet } from "@/lib/queries/wallet";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const session = useSession();
  const userId = session?.data?.user?._id || "";

  const { data: userPlan, isPending: isGettingUserPlan } = useGetUserPlan();

  // Fetch wallet data
  const { data: wallet, isPending: isGettingWallet } = useGetWallet(
    userId,
    "User"
  );

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="px-2 py-2">
            <Link href="/">
              <Logo />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <DashboardSidebarLinks />
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-medium">Dashboard</h1>
          </div>

          {/* Right Side: Wallet + Profile */}
          <div className="flex items-center gap-4">
            {!isGettingUserPlan && userPlan?.name === Plan.TRIAL && (
              <TrialTimer
                planEndsAt={userPlan.planEndsAt}
                planName={userPlan.name}
              />
            )}

            {!isGettingUserPlan && userPlan && (
              <div className="hidden md:block">
                <RemainingSearches
                  planName={userPlan.name}
                  totalSearches={userPlan.totalSearches}
                  remainingSearches={userPlan.remainingSearches}
                />
              </div>
            )}

            {/* Wallet Button */}
            <Button
              variant="outline"
              size="sm"
              className="h-10 flex items-center gap-2 cursor-pointer"
              onClick={() => router.push("/wallet")}
            >
              <Wallet className="h-5 w-5" />
              {isGettingWallet ? (
                <Loader className="h-4 w-4 text-muted-foreground" />
              ) : (
                `${wallet?.currency === Currency.USD ? "$" : "₹"} ${wallet?.balance?.toFixed(2) || "0.00"}`
              )}
            </Button>

            {/* Profile Dropdown Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="min-h-12 w-auto aspect-square flex items-center justify-center rounded-full bg-transparent border border-primary cursor-pointer">
                  <Avatar className="h-full w-full">
                    <AvatarImage src="/profile.png" alt="Profile" />
                    <AvatarFallback className="bg-muted">GP</AvatarFallback>
                  </Avatar>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel className="font-semibold">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/pricing")}>
                  <ShieldCheckIcon className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/website-search")}
                >
                  <LayoutDashboardIcon className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 focus:text-red-600"
                >
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="min-h-[calc(100vh-80px)] flex-1 p-4 md:p-8 bg-muted/30">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
