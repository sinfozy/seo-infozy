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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Currency } from "@/types/enums";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import Logo from "@/components/ui/logo";
import { MoveRightIcon } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSignup } from "@/lib/queries/user/auth";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const signUpSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  email: z.email("Enter a valid email"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  currency: z.enum(["USD", "INR"], {
    error: "Please select a currency",
  }),
});

type data = z.infer<typeof signUpSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status !== "loading" && status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const { mutate: signup, isPending: isSigningUp } = useSignup();

  const form = useForm<data>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullname: "",
      email: "",
      username: "",
      password: "",
      currency: Currency.INR,
    },
  });

  const onSubmit = (data: data) => {
    signup(data, {
      onSuccess: () => {
        router.push("/verify-email" + `?email=${data.email}`);
        toast.success("Signup successful! Please verify your email.");
      },
    });
  };

  return (
    <main className="flex items-center justify-center bg-background px-4">
      <div className="w-full min-w-sm max-w-md rounded-2xl bg-card p-8 shadow-xl border border-border m-0">
        <div className="flex justify-center mb-6">
          <Link className="flex items-center space-x-2" href="/">
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
                Create your account
              </h1>
              <p className="text-muted-foreground text-sm">
                Welcome! Please fill in the details to get started.
              </p>
            </div>

            {/* Step 1 fields */}
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Full Name*
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      className="bg-muted border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="bg-muted border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Username*
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="johndoe"
                      className="bg-muted border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency Select */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Preferred Currency*
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-muted border-border w-full">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Currency.INR}>INR (₹)</SelectItem>
                        <SelectItem value={Currency.USD}>USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                      className="bg-muted border-border"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
              // disabled={isSigningUp}
            >
              {isSigningUp ? (
                <Loader />
              ) : (
                <>
                  Sign Up <MoveRightIcon className="w-4 h-4" />
                </>
              )}
            </Button>

            <p className="text-sm text-center text-zinc-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/90 font-medium"
              >
                Login
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </main>
  );
}
