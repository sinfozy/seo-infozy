"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "./ui/sonner";
import { useState } from "react";

// import { Session } from "next-auth";
// import { SessionProvider } from "next-auth/react";

export default function Providers({
  children,
  // session,
}: {
  children: React.ReactNode;
  // session: Session | null;
}) {
  const [client] = useState(() => new QueryClient());

  return (
    // <SessionProvider session={session}>
    <>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
      <Toaster position="top-center" />
    </>
    // </SessionProvider>
  );
}
