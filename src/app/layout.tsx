import "./globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Providers from "@/components/Providers";
import { auth } from "@/auth";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SEO Infozy",
  description: "SEO Infozy - Your Ultimate SEO Companion",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased font-sans`}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
