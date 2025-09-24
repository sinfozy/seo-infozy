"use client";

import {
  ArrowLeft,
  Calendar,
  Edit,
  Mail,
  Phone,
  Plus,
  Trash2,
  Wallet,
} from "lucide-react";
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
import {
  UpdateUserPayload,
  useDeleteUser,
  useGetUser,
  useUpdateUser,
} from "@/lib/queries/admin/user";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import UserHistory from "@/components/admin/UserHistory";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useTransferWallet } from "@/lib/queries/wallet";

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string;

  const session = useSession();
  const admin = session?.data?.user;

  const { mutate: transferWallet, isPending: isTransferring } =
    useTransferWallet();
  const { data: user, isLoading, refetch } = useGetUser(userId);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(userId);

  const [isEditing, setIsEditing] = useState(false);
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");

  // Edit form state with only editable fields
  const [editForm, setEditForm] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    isActive: true,
    notes: "",
  });

  // Update form state when user data changes
  useEffect(() => {
    if (user) {
      setEditForm({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        isActive: user.isActive ?? true,
        notes: user.notes || "",
      });
    }
  }, [user]);

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
          <Button onClick={() => router.push("/admin/dashboard/users")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    const updatedFields: UpdateUserPayload = {};

    // User fields
    if (editForm.fullname !== user.fullname)
      updatedFields.fullname = editForm.fullname;
    if (editForm.username !== user.username)
      updatedFields.username = editForm.username;
    if (editForm.email !== user.email) updatedFields.email = editForm.email;
    if (editForm.phone !== user.phone) updatedFields.phone = editForm.phone;
    if (editForm.isActive !== user.isActive)
      updatedFields.isActive = editForm.isActive;
    if (editForm.notes !== user.notes) updatedFields.notes = editForm.notes;

    if (Object.keys(updatedFields).length > 0) {
      updateUser(updatedFields, {
        onSuccess: () => {
          refetch();
          setIsEditing(false);
          session.update();
        },
      });
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    deleteUser(
      { userId },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          router.push("/admin/dashboard/users");
        },
      }
    );
  };

  const handleRecharge = () => {
    const amount = Number.parseFloat(rechargeAmount);
    if (amount > 0 && admin?._id) {
      transferWallet(
        {
          fromId: admin._id,
          fromModel: "Admin",
          toId: userId,
          toModel: "User",
          amount,
          by: admin._id,
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

  const getStatusBadgeVariant = (status: string) => {
    return status === "Active" ? "default" : "destructive";
  };

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
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            disabled={isUpdating}
          >
            <Edit className="h-4 w-4" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4" />
            Delete
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
              <Badge
                variant={getStatusBadgeVariant(
                  user.isActive ? "Active" : "Inactive"
                )}
              >
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
              <span className="text-sm">{user.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {user.createdAt && (
                <span className="text-sm text-muted-foreground">
                  Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
                </span>
              )}
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
            {/* Searches */}
            <div className="flex items-center space-x-3">
              <Badge variant="secondary">
                Total Searches: {user.plan?.searchesLimit ?? 0}
              </Badge>
              <Badge variant="default">
                Remaining Searches:{" "}
                {(user.plan?.searchesLimit ?? 0) - (user.usedSearches ?? 0)}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Details Card with Tabs */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit User Information" : "User Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Full Name</Label>
                    <Input
                      id="fullname"
                      value={editForm.fullname}
                      onChange={(e) =>
                        handleInputChange("fullname", e.target.value)
                      }
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editForm.username}
                      onChange={(e) =>
                        handleInputChange("username", e.target.value)
                      }
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                {/* Account Status */}
                <div className="space-y-2">
                  <Label>Account Status</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editForm.isActive}
                      onCheckedChange={(checked) =>
                        handleInputChange("isActive", checked)
                      }
                    />
                    <span className="text-sm">
                      {editForm.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editForm.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Enter notes about this user"
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isUpdating}>
                    {isUpdating ? (
                      <>
                        <Loader className="h-4 w-4 mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    {user.username && (
                      <p>
                        <span className="font-medium">Username:</span>{" "}
                        {user.username}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {user.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Account Details</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Plan:</span>{" "}
                      {user.plan.name}
                    </p>
                    <p>
                      <span className="font-medium">Currency:</span>{" "}
                      {user.currency}
                    </p>
                    <p>
                      <span className="font-medium">Wallet Balance:</span>{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: user.currency || "USD",
                      }).format(
                        user.currency === "USD"
                          ? (user.walletId.balance ?? 0) /
                              Number(process.env.NEXT_PUBLIC_USD_RATE)
                          : (user.walletId.balance ?? 0)
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {user.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.notes || "No notes available."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Search & AI History */}
      <UserHistory user={user} />

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
              {user.walletId.balance.toFixed(2)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {user.fullname}? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              {isDeleting ? (
                <Loader className="h-4 w-4" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isDeleting ? "Deleting..." : "Delete User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
