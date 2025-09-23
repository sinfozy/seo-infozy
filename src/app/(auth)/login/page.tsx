"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import Logo from "@/components/ui/logo";
import { MoveRightIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema
const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.email,
      password: data.password,
      login: "user",
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error(res.code || "Invalid credentials");
    } else {
      toast.success("Logged in successfully!");
      router.push("/pricing");
    }
  };

  return (
    <div className="flex items-center justify-center max-h-screen bg-background px-4">
      <div className="grid md:grid-cols-2 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden border border-primary">
        {/* Left side with image box */}
        <div className="hidden md:flex items-end justify-center p-6 pb-0">
          <div className="w-full h-full flex items-center justify-center">
            <Image
              src="/login-illustration.png"
              alt="Login Illustration"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>
        </div>

        {/* Right side with form box */}
        <div className="flex items-center justify-center bg-card p-8">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
              <Link href="/" className="inline-block">
                <Logo />
              </Link>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-4"
              >
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                    Welcome back
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Please enter your credentials to continue.
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
                          placeholder="john@example.com"
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

                {/* Forgot password link */}
                <div className="flex justify-end">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:text-primary/90 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader /> Logging in...
                    </>
                  ) : (
                    <>
                      Login <MoveRightIcon className="w-4 h-4" />
                    </>
                  )}
                </Button>

                <p className="text-sm text-center text-zinc-400">
                  Don’t have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary hover:text-primary/90 font-medium"
                  >
                    Sign up
                  </Link>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
