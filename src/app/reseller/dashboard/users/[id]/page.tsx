"use client";

import { ArrowLeft, Edit, Mail, Phone, Plus, Wallet } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader, LoaderBig } from "@/components/ui/loader";
import { useEffect, useState } from "react";
import { useGetUser, useUpdateResellerUser } from "@/lib/queries/reseller/user";
import { useParams, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useTransferWallet } from "@/lib/queries/wallet";

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const session = useSession();
  const reseller = session?.data?.user;

  const { mutate: transferWallet, isPending: isTransferring } =
    useTransferWallet();
  const { data: user, isLoading, refetch } = useGetUser(userId);
  const updateUserMutation = useUpdateResellerUser(userId);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<{
    fullname?: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
  }>({});

  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");

  useEffect(() => {
    if (user) {
      setEditForm({
        fullname: user.fullname,
        username: user.username || "",
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (editForm.password && editForm.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    updateUserMutation.mutate(editForm, {
      onSuccess: () => {
        refetch();
        setIsEditing(false);
      },
    });
  };

  const handleRecharge = () => {
    const amount = Number.parseFloat(rechargeAmount);
    if (amount > 0 && reseller?._id) {
      transferWallet(
        {
          fromId: reseller._id,
          fromModel: "Reseller",
          toId: userId,
          toModel: "User",
          amount,
          by: reseller._id,
        },
        {
          onSuccess: () => {
            refetch();
            setIsRechargeDialogOpen(false);
            setRechargeAmount("");
          },
        }
      );
    }
  };

  const getPlanBadgeVariant = (plan: string) => {
    switch (plan) {
      case "Gold":
        return "default";
      case "Silver":
        return "secondary";
      case "Bronze":
        return "outline";
      default:
        return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <LoaderBig />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">User Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested user could not be found.
          </p>
          <Button onClick={() => router.push("/reseller/dashboard/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/reseller/dashboard/users")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
          <h1 className="text-3xl font-bold">User Details</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsRechargeDialogOpen(true)}
          >
            <Wallet className="h-4 w-4" />
            Recharge Wallet
          </Button>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            <Edit className="h-4 w-4" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto mb-4">
              <AvatarImage
                src={user.avatar || "/placeholder.svg"}
                alt={user.fullname}
              />
              <AvatarFallback className="text-2xl">
                {user.fullname.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{user.fullname}</CardTitle>
            <div className="flex items-center justify-center space-x-2 mt-2">
              {user.plan ? (
                <Badge variant={getPlanBadgeVariant(user.plan.name || "")}>
                  {user.plan.name}
                </Badge>
              ) : (
                <Badge variant="outline">No Plan</Badge>
              )}
              <Badge variant={user.isActive ? "default" : "destructive"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{user.phone || "-"}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Balance:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: user.currency || "USD",
                }).format(
                  user.currency === "USD"
                    ? (user.walletId.balance ?? 0) /
                        Number(process.env.NEXT_PUBLIC_USD_RATE)
                    : (user.walletId.balance ?? 0)
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2 gap-2">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit User Information" : "User Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullname">Full Name</Label>
                  <Input
                    id="fullname"
                    value={editForm.fullname || ""}
                    onChange={(e) =>
                      handleInputChange("fullname", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={editForm.username || ""}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter new password"
                    value={editForm.password || ""}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                  />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={updateUserMutation.isPending}
                  >
                    {updateUserMutation.isPending && <Loader />}
                    {updateUserMutation.isPending
                      ? "Saving..."
                      : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Full Name:</span>{" "}
                      {user.fullname}
                    </p>
                    <p>
                      <span className="font-medium">Username:</span>{" "}
                      {user.username || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {user.phone || "-"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recharge Wallet Dialog */}
      <Dialog
        open={isRechargeDialogOpen}
        onOpenChange={setIsRechargeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recharge Wallet</DialogTitle>
            <DialogDescription>
              Add funds to {user.fullname}&#39;s wallet. Current balance: $
              {user.walletId?.balance.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Add</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                min="0"
                step="100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsRechargeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRecharge}
              disabled={
                !rechargeAmount ||
                Number.parseFloat(rechargeAmount) <= 0 ||
                isTransferring
              }
            >
              {isTransferring ? (
                <Loader className="h-4 w-4 mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              {isTransferring ? "Processing..." : "Add Funds"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
