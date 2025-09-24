"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { signIn, useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import Logo from "@/components/ui/logo";
import { MoveRightIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function ResellerLoginPage() {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (
      session.status === "authenticated" &&
      session.data.user.role === "reseller"
    ) {
      router.push("/reseller/dashboard");
    } else if (
      session.status === "authenticated" &&
      session.data.user.role === "admin"
    ) {
      router.push("/admin/dashboard");
    } else if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session.status, router, session.data]);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginData) => {
    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.email,
      password: data.password,
      login: "reseller",
    });

    if (res?.ok) {
      toast.success("Logged in successfully!", { position: "top-center" });
      router.push("/admin/dashboard");
    } else {
      toast.error(res?.error || "Invalid credentials");
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-background px-4">
      {/* Main Box */}
      <div className="h-[70vh] min-w-[80vw] flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg border bg-card">
        {/* Left Side - Full Size Image */}
        <div className="hidden md:flex md:w-1/2 relative">
          <Image
            src="/reseller-login.png"
            alt="SEO Infozy Banner"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right Side - Login */}
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-6 py-8">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Reseller Login
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Empower your Business with AI Reselling
                  </p>
                </div>

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Email*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="reseller@example.com"
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-muted-foreground">
                        Password*
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="••••••••"
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center text-md"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader /> Logging in...
                    </>
                  ) : (
                    <>
                      Login <MoveRightIcon className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 w-full text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} SEO Infozy. All rights reserved. |
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://infozysms.com/ai-policy"
            className="mx-2 hover:underline"
          >
            Privacy Policy
          </Link>
          |
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href="https://infozysms.com/ai-terms-of-use"
            className="ml-2 hover:underline"
          >
            Terms of Service
          </Link>
        </p>
      </footer>
    </div>
  );
}
