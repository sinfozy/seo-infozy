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
import { useForgotPassword } from "@/lib/queries/user/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const emailSchema = z.object({
  email: z.email("Enter a valid email"),
});

type EmailData = z.infer<typeof emailSchema>;

export default function ForgotPasswordPage() {
  const { mutate, isPending } = useForgotPassword();
  const router = useRouter();

  const emailForm = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (data: EmailData) => {
    mutate(
      { email: data.email },
      {
        onSuccess: (res) => {
          router.push("/login");
          toast.success(res.message || "Reset link sent to your email");
        },
      }
    );
  };

  return (
    <main className="flex items-center justify-center bg-background px-4">
      <div className="w-full min-w-sm max-w-md rounded-2xl bg-card p-8 shadow-xl border">
        <h1 className="text-xl font-semibold text-center">Forgot Password</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Enter your registered email, and we’ll send you an OTP.
        </p>

        <Form {...emailForm}>
          <form
            onSubmit={emailForm.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      // disabled={isPending}
                      className="border bg-muted"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader /> Sending...{" "}
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}
