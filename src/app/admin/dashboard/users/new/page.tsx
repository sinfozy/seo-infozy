"use client";

import { ArrowLeft, EyeIcon, Save, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader } from "@/components/ui/loader";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCreateUser } from "@/lib/queries/admin/user";
import { useGetResellers } from "@/lib/queries/admin/reseller";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewUserPage() {
  const router = useRouter();
  const { data: resellersData, isLoading: isResellersLoading } =
    useGetResellers();
  const createUserMutation = useCreateUser();

  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    status: "Active",
    currency: Currency.USD,
    initialBalance: "0",
    resellerId: "",
    notes: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.resellerId) {
      toast.error("Please select a reseller.");
      return;
    }

    createUserMutation.mutate(
      {
        resellerId: formData.resellerId,
        fullname: formData.fullname,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        currency: formData.currency,
        isActive: formData.status === "Active",
        notes: formData.notes,
      },
      {
        onSuccess: () => router.push("/admin/dashboard/users"),
      }
    );
  };

  if (isResellersLoading) {
    return <div>Loading resellers...</div>;
  }

  const resellers = resellersData || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/dashboard/users")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold">Create New User</h1>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullname">Full Name *</Label>
                <Input
                  id="fullname"
                  required
                  value={formData.fullname}
                  onChange={(e) =>
                    handleInputChange("fullname", e.target.value)
                  }
                  placeholder="Enter full name"
                />
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                  placeholder="Enter username"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  placeholder="Enter password"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone"
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="INR">INR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reseller */}
              <div className="space-y-2">
                <Label htmlFor="reseller">Reseller *</Label>
                <Select
                  value={formData.resellerId}
                  onValueChange={(value) =>
                    handleInputChange("resellerId", value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {resellers.map((reseller) => (
                      <SelectItem key={reseller._id} value={reseller._id}>
                        {reseller.fullname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {formData.resellerId && (
                  <div className="flex justify-end mt-2">
                    <Link
                      href={`/admin/dashboard/resellers/${formData.resellerId}`}
                      className="flex items-center text-blue-600 text-sm"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Reseller
                    </Link>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Additional notes"
                  rows={3}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/dashboard/users")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createUserMutation.isPending}>
                {createUserMutation.isPending ? (
                  <Loader />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                {createUserMutation.isPending ? "Creating..." : "Create User"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
