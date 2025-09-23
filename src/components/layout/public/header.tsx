"use client";

import { ChevronRightIcon, Wallet } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useEffect, useState } from "react";

import AuthButton from "@/components/ui/auth-button";
import { Button } from "@/components/ui/button";
import { Currency } from "@/types/enums";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import Logo from "@/components/ui/logo";
import { useGetUserPlan } from "@/lib/queries/user/plan";
import { useGetWallet } from "@/lib/queries/wallet";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function Header() {
  const router = useRouter();
  const session = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { data: wallet, isPending: isGettingWallet } = useGetWallet(
    session?.data?.user?._id || "",
    "User"
  );

  const { data: userPlan, isLoading: isGettingPlan } = useGetUserPlan();

  useEffect(() => {
    if (
      session.status === "authenticated" &&
      session.data?.user.role === "user"
    ) {
      setIsLoggedIn(true);
    }
  }, [session.status, session.data]);

  const shareLinks = [
    {
      text: "Login",
      onClick: () => router.push("/login"),
      label: "Go to Sign In",
      className: `
      bg-gray-100 dark:bg-gray-200 hover:bg-gray-200 dark:hover:bg-gray-300
      text-neutral-800
      font-medium tracking-wide
      transition-colors duration-200
    `.trim(),
    },
    {
      text: "Sign Up",
      onClick: () => router.push("/signup"),
      label: "Go to Sign Up",
      className: `
      bg-primary dark:bg-primary/70
      text-white dark:text-white
      hover:bg-primary/80 dark:hover:bg-primary/60
      font-medium tracking-wide 
      shadow-md hover:shadow-lg
      transition-all duration-200
    `.trim(),
    },
  ];

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Logo />
        </Link>

        {/* Navigation */}
        {!isLoggedIn && (
          <nav className="hidden md:flex items-center space-x-8">
            {/* Pricing */}
            <Link
              href="/pricing"
              className="px-3 py-1 rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Pricing
            </Link>

            {/* Features HoverCard */}
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <span className="px-3 py-1 rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors">
                  Features
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="w-60 bg-white shadow-lg border rounded-lg p-2">
                <div className="flex flex-col space-y-1">
                  <Link
                    href="/website-research"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  >
                    Website Research
                  </Link>
                  <Link
                    href="/keyword-research"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-primary transition-colors"
                  >
                    Keyword Research
                  </Link>
                  <Link
                    href="/ai-content-editor"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-primary transition-colors"
                  >
                    AI Content Editor
                  </Link>
                </div>
              </HoverCardContent>
            </HoverCard>

            {/* Contact */}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://infozysms.com/contact"
              className="px-3 py-1 rounded-md text-gray-600 hover:bg-indigo-50 hover:text-primary transition-colors"
            >
              Contact
            </Link>
          </nav>
        )}

        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
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

              {(() => {
                if (isGettingPlan) {
                  return <></>;
                }
                if (
                  userPlan?.planEndsAt &&
                  new Date(userPlan.planEndsAt) > new Date()
                ) {
                  return (
                    <>
                      <Button
                        variant="secondary"
                        className="h-10 text-md font-medium min-w-40 cursor-pointer bg-primary/10 text-primary hover:bg-primary/20"
                        onClick={() => router.push("/pricing")}
                      >
                        Upgrade Plan
                      </Button>
                      <Button
                        variant="default"
                        className="h-10 text-md font-medium text-white min-w-40 cursor-pointer"
                        onClick={() => router.push("/dashboard/website-search")}
                      >
                        Dashboard <ChevronRightIcon className="h-6 w-6" />
                      </Button>
                    </>
                  );
                }
                return (
                  <Button
                    variant="default"
                    className="h-10 text-md font-medium text-white min-w-40 cursor-pointer gap-0.5"
                    onClick={() => router.push("/pricing")}
                  >
                    Purchase Plan <ChevronRightIcon className="h-6 w-6" />
                  </Button>
                );
              })()}
            </div>
          ) : (
            <AuthButton
              links={shareLinks}
              className="from-primary to-primary/70 h-10 bg-gradient-to-b text-lg font-medium text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] min-w-40"
            >
              Get Started
            </AuthButton>
          )}
        </div>
      </div>
    </header>
  );
}
