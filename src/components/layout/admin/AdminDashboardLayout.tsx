"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AdminSidebarLinks } from "./AdminSidebarLinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { signOut } from "next-auth/react"; // Auth.js v5
import { useState } from "react";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogout = async () => {
    setIsDialogOpen(false);
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="px-2 py-2">
            <Link href="/admin/dashboard">
              <Logo />
            </Link>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <AdminSidebarLinks />
        </SidebarContent>
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-lg font-medium">Admin Dashboard</h1>
          </div>

          {/* Logout Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Logout</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogDescription>
                  Are you sure you want to log out?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  Logout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
