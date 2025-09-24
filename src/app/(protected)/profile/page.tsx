"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader, LoaderBig } from "@/components/ui/loader";
import { useEffect, useState } from "react";
import { useGetProfile, useUpdateProfile } from "@/lib/queries/user/profile";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { format } from "date-fns";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  username: z.string().min(3, "Username must be at least 3 chars"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const phoneSchema = z.object({
  phone: z.string().min(7, "Enter a valid phone number"),
});
type PhoneFormValues = z.infer<typeof phoneSchema>;

export default function ProfilePage() {
  const { status } = useSession();
  const router = useRouter();

  const { data: user, isLoading } = useGetProfile();
  const updateProfile = useUpdateProfile();

  const [openPhoneDialog, setOpenPhoneDialog] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("You must be logged in to access the profile page.");
      router.push("/login");
    }
  }, [status, router]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullname: "",
      username: "",
    },
  });

  const phoneForm = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "" },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        fullname: user.fullname || "",
        username: user.username || "",
      });
      phoneForm.reset({ phone: user.phone || "" });
    }
  }, [user, form, phoneForm]);

  const onSubmitProfile = (values: ProfileFormValues) => {
    updateProfile.mutate(values, {
      onSuccess: () => toast.success("Profile updated successfully!"),
      onError: () => toast.error("Failed to update profile"),
    });
  };

  const onSubmitPhone = (values: PhoneFormValues) => {
    updateProfile.mutate(values, {
      onSuccess: () => {
        toast.success("Phone updated successfully!");
        setOpenPhoneDialog(false);
      },
      onError: () => toast.error("Failed to update phone"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <LoaderBig />
      </div>
    );
  }

  if (!user) {
    return <p className="text-center py-10">Profile not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-6">
      {/* Profile Header */}
      <Card className="shadow-sm rounded-2xl border">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user.avatar || "/profile.png"}
              alt={user.fullname}
            />
            <AvatarFallback>{user.fullname}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-bold">
              {user.fullname}
            </CardTitle>
            <p className="text-gray-600">{user.email}</p>
            <p
              className={`text-sm ${
                user.isVerified ? "text-green-600" : "text-red-600"
              }`}
            >
              {user.isVerified ? "Verified" : "Not Verified"}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Editable Form (Name + Username only) */}
      <Card className="shadow-sm rounded-2xl border">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitProfile)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full mt-4"
                disabled={updateProfile.isPending}
              >
                {updateProfile.isPending ? <Loader /> : "Update Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Phone + Password Section */}
      <Card className="shadow-sm rounded-2xl border">
        <CardHeader>
          <CardTitle>Security & Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Phone */}
          <div className="flex items-center justify-between">
            <p className="text-sm">
              <span className="font-semibold">Phone:</span>{" "}
              {user.phone || "Not set"}
            </p>
            <Dialog open={openPhoneDialog} onOpenChange={setOpenPhoneDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  {user.phone ? "Edit Phone" : "Add Phone Number"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {user.phone ? "Edit Phone Number" : "Add Phone Number"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...phoneForm}>
                  <form
                    onSubmit={phoneForm.handleSubmit(onSubmitPhone)}
                    className="space-y-4"
                  >
                    <FormField
                      control={phoneForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? <Loader /> : "Save"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Password */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Password</p>

            <Button asChild variant="outline" size="sm">
              <Link href="/forgot-password">Edit Password</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Read-Only Info */}
      <Card className="shadow-sm rounded-2xl border gap-2">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm">
          <p>
            <span className="font-semibold">Currency:</span> {user.currency}
          </p>
          <p>
            <span className="font-semibold">Plan: </span>
            {(() => {
              if (!user.planEndsAt) {
                return <span className="text-gray-500">No Plan</span>;
              } else if (new Date(user.planEndsAt) < new Date()) {
                return <span className="text-red-600">Expired</span>;
              } else {
                return user.plan.name;
              }
            })()}
          </p>
          {user.planActivatedAt && (
            <p>
              <span className="font-semibold">Plan Activated At:</span>{" "}
              {format(user.planActivatedAt, "PPP")}
            </p>
          )}
          {user.planEndsAt && (
            <p>
              <span className="font-semibold">Plan Ends At:</span>{" "}
              {format(user.planEndsAt, "PPP")}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
