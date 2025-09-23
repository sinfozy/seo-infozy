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
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useResetPassword } from "@/lib/queries/user/auth";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema with confirmPassword validation
const resetSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage({
  token,
  email,
}: {
  token?: string;
  email?: string;
}) {
  const router = useRouter();

  const { mutate: resetPassword, isPending } = useResetPassword();

  useEffect(() => {
    if (!token || !email) {
      toast.error("Invalid or missing token or email.");
      router.push("/login");
    }
  }, [token, email, router]);

  const resetForm = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      token: token || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: ResetData) => {
    if (!token || !email) {
      toast.error("Invalid or missing token or email.");
      return;
    }

    resetPassword(
      { token, password: data.password, email },
      {
        onSuccess: () => {
          toast.success("Password reset successfully. Please log in.");
          router.push("/login");
        },
      }
    );
  };

  return (
    <main className="flex items-center justify-center bg-background px-4">
      <div className="w-full min-w-sm max-w-md rounded-2xl bg-card p-8 shadow-xl border">
        <h1 className="text-xl font-semibold text-center">Reset Password</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your new password below.
        </p>

        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Password */}
            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter new password"
                      className="border bg-muted"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={resetForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Confirm new password"
                      className="border bg-muted"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Loader /> : "Reset Password"}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
