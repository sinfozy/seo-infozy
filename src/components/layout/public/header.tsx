"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import AuthButton from "@/components/ui/auth-button";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import Logo from "@/components/ui/logo";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();
  const isLoggedIn = false; // Replace with actual authentication logic

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
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                >
                  Keyword Research
                </Link>
                <Link
                  href="/ai-content-editor"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
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
            className="px-3 py-1 rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            Contact
          </Link>

          {/* Login */}
          <Link
            href="/login"
            className="px-3 py-1 rounded-md text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
          >
            Login
          </Link>
        </nav>

        {/* Auth / Dashboard Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <Button
              variant="default"
              className="h-11 text-lg font-medium text-white min-w-44 cursor-pointer"
              onClick={() => router.push("/workspace")}
            >
              Dashboard <ChevronRightIcon className="ml-1 h-6 w-6" />
            </Button>
          ) : (
            <AuthButton
              links={shareLinks}
              className="from-primary to-primary/70 h-11 bg-gradient-to-b text-lg font-medium text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset] min-w-44"
            >
              Get Started
            </AuthButton>
          )}
        </div>
      </div>
    </header>
  );
}
