"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useEffect, useState } from "react";
import { useResendOtp, useVerifyOtp } from "@/lib/queries/user/auth";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  code: z.string().min(6, "Enter the 6-digit code"),
});

type Data = z.infer<typeof schema>;

export default function VerifyEmailPage({ email }: { email: string | null }) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const session = useSession();

  const { mutate: verifyOtp, isPending: isVerifyingOtp } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResendingOtp } = useResendOtp();

  const form = useForm<Data>({
    resolver: zodResolver(schema),
    defaultValues: { code: "" },
  });

  useEffect(() => {
    if (session?.data?.user?.isVerified) {
      toast.success("Your email is already verified.");
      router.push("/");
    }
  }, [session, router]);

  useEffect(() => {
    if (countdown === 0) return;
    const timer = setInterval(
      () => setCountdown((p) => (p > 0 ? p - 1 : 0)),
      1000
    );
    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = (data: Data) => {
    if (!email) {
      toast.error("Invalid link. Email not found.");
      return;
    }

    verifyOtp(
      { email, code: data.code },
      {
        onSuccess: () => {
          toast.success("Email verified successfully!");
          router.push("/login");
        },
      }
    );
  };

  const handleResend = () => {
    if (!email) {
      toast.error("Invalid link. Email not found.");
      return;
    }

    resendOtp(
      { email },
      {
        onSuccess: () => {
          setCountdown(30);
          toast.success("OTP resent successfully! Check your email.");
        },
      }
    );
  };

  return (
    <main className="flex items-center justify-center bg-background px-4">
      <div className="w-full min-w-sm max-w-md rounded-2xl bg-card p-8 shadow-xl border">
        <h1 className="text-xl font-semibold text-center mb-4">
          Verify your email
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          We’ve sent a 6-digit code to{" "}
          <span className="font-medium">{email}</span>. Enter it below to
          continue.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center space-y-2">
                  <FormLabel>Email Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup className="gap-1">
                        {[...Array(6)].map((_, i) => (
                          <InputOTPSlot
                            key={i}
                            index={i}
                            className="w-12 h-12 border rounded-md text-center text-xl font-semibold bg-muted"
                          />
                        ))}
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isVerifyingOtp} type="submit" className="w-full">
              {isVerifyingOtp ? (
                <>
                  Verifying... <Loader />
                </>
              ) : (
                "Verify Code"
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                disabled={isResendingOtp || countdown > 0}
                onClick={handleResend}
                className="text-sm"
              >
                {isResendingOtp ? (
                  <Loader />
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  "Resend OTP"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
