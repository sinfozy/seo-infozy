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
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import Logo from "@/components/ui/logo";
import { MoveRightIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
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

export default function AdminLoginPage() {
  const router = useRouter();

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginData) => {
    const res = await signIn("credentials", {
      redirect: false,
      identifier: data.email,
      password: data.password,
      login: "admin",
    });

    if (res?.error) {
      toast.error(res.code || "Invalid credentials");
    } else {
      toast.success("Logged in successfully!");
      router.push("/admin/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center bg-background px-4 min-h-screen">
      <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-xl border">
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
                Admin Login
              </h1>
              <p className="text-muted-foreground text-sm">
                Enter your credentials to access the dashboard.
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
                      placeholder="admin@example.com"
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
  );
}
