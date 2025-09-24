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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UpdateResellerPayload,
  useDeleteReseller,
  useGetReseller,
  useGetResellerUsers,
  useUpdateReseller,
} from "@/lib/queries/admin/reseller";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import TableData from "@/components/admin/TableData";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { useToggleUserStatus } from "@/lib/queries/admin/user";
import { useTransferWallet } from "@/lib/queries/wallet";

const columnConfig = [
  { key: "id", label: "ID", visible: false },
  { key: "name", label: "Name", visible: true },
  { key: "email", label: "Email", visible: true },
  { key: "contact", label: "Contact", visible: true },
  { key: "plan", label: "Plan", visible: true },
  { key: "walletBalance", label: "Wallet Balance", visible: true },
  { key: "status", label: "Status", visible: true },
  { key: "actions", label: "Actions", visible: true },
];

export default function ResellerDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const resellerId = params?.id as string;
  const session = useSession();
  const user = session?.data?.user;

  const { mutate: transferWallet, isPending: isTransferring } =
    useTransferWallet();
  const {
    data: reseller,
    isLoading,
    error,
    refetch,
  } = useGetReseller(resellerId);
  const { mutate: toggleStatus } = useToggleUserStatus();
  const { data: users, isLoading: isLoadingUsers } =
    useGetResellerUsers(resellerId);
  const { mutate: deleteReseller, isPending: isDeleting } = useDeleteReseller();
  const { mutate: updateResellerMutation, isPending: isUpdating } =
    useUpdateReseller(resellerId);

  const [isEditing, setIsEditing] = useState(false);
  const [isRechargeDialogOpen, setIsRechargeDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [editForm, setEditForm] = useState<UpdateResellerPayload>({
    fullname: "",
    companyName: "",
    email: "",
    phone: "",
    isActive: true,
    notes: "",
  });

  // Initialize editForm with reseller data when reseller is loaded
  useEffect(() => {
    if (reseller) {
      setEditForm({
        fullname: reseller.fullname || "",
        companyName: reseller.companyName || "",
        email: reseller.email || "",
        phone: reseller.phone || "",
        isActive: reseller.isActive ?? true,
        notes: reseller.notes || "",
      });
    }
  }, [reseller]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <LoaderBig />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Failed to load reseller details.</p>
      </div>
    );
  }

  if (!reseller) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Reseller Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The requested reseller could not be found.
          </p>
          <Button onClick={() => router.push("/admin/dashboard/resellers")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resellers
          </Button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    if (!isEditing) {
      setEditForm({
        fullname: reseller.fullname || "",
        companyName: reseller.companyName || "",
        email: reseller.email || "",
        phone: reseller.phone || "",
        isActive: reseller.isActive ?? true,
        notes: reseller.notes || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    // Reset form to original data when canceling
    setEditForm({
      fullname: reseller.fullname || "",
      companyName: reseller.companyName || "",
      email: reseller.email || "",
      phone: reseller.phone || "",
      isActive: reseller.isActive ?? true,
      notes: reseller.notes || "",
    });
    session.update();
    setIsEditing(false);
  };

  const handleSave = () => {
    updateResellerMutation(editForm, {
      onSuccess: (data) => {
        refetch();
        setEditForm({
          fullname: data.fullname || "",
          companyName: data.companyName || "",
          email: data.email || "",
          phone: data.phone || "",
          isActive: data.isActive ?? true,
          notes: data.notes || "",
        });
        setIsEditing(false);
      },
    });
  };

  const handleDelete = () => {
    deleteReseller(
      { resellerId },
      {
        onSuccess: () => {
          setIsDeleteDialogOpen(false);
          router.push("/admin/dashboard/resellers");
        },
      }
    );
  };

  const handleRecharge = () => {
    const amount = Number.parseFloat(rechargeAmount);
    if (amount > 0 && user?._id) {
      transferWallet(
        {
          fromId: user._id,
          fromModel: "Admin",
          toId: resellerId,
          toModel: "Reseller",
          amount,
          by: user._id,
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

  const handleToggle = (id: string, currentStatus: boolean) => {
    toggleStatus({ id, isActive: !currentStatus });
  };

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "default" : "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/dashboard/resellers")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resellers
          </Button>
          <h1 className="text-3xl font-bold">Reseller Details</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsRechargeDialogOpen(true)}
          >
            <Wallet className="h-4 w-4" />
            Recharge Wallet
          </Button>
          <Button variant="outline" onClick={handleEdit}>
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
                src={reseller.avatar || "/placeholder.svg"}
                alt={reseller.fullname}
              />
              <AvatarFallback className="text-2xl">
                {reseller.fullname?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{reseller.fullname}</CardTitle>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Badge variant={getStatusBadgeVariant(reseller.isActive)}>
                {reseller.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{reseller.email}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{reseller.phone}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              {reseller.createdAt && (
                <span className="text-sm text-muted-foreground">
                  Joined {format(new Date(reseller.createdAt), "MMM d, yyyy")}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                Balance:{" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: reseller.currency || "USD",
                }).format(
                  reseller.currency === "USD"
                    ? (reseller.walletId.balance ?? 0) /
                        Number(process.env.NEXT_PUBLIC_USD_RATE)
                    : (reseller.walletId.balance ?? 0)
                )}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {isEditing ? "Edit Reseller Information" : "Reseller Information"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              // Editing form
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname">Name</Label>
                  <Input
                    id="fullname"
                    value={editForm.fullname || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, fullname: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={editForm.phone || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company</Label>
                  <Input
                    id="companyName"
                    value={editForm.companyName || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, companyName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={editForm.isActive ? "Active" : "Inactive"}
                    onValueChange={(value) =>
                      setEditForm({ ...editForm, isActive: value === "Active" })
                    }
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
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={editForm.notes || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, notes: e.target.value })
                    }
                    rows={3}
                  />
                </div>
                <div className="md:col-span-2 flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={isUpdating}>
                    {isUpdating && <Loader />}
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            ) : (
              // Display info
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {reseller.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {reseller.phone}
                    </p>
                    <p>
                      <span className="font-medium">Company:</span>{" "}
                      {reseller.companyName}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Account Details</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Currency:</span>{" "}
                      {reseller.currency}
                    </p>
                    <p>
                      <span className="font-medium">Wallet Balance:</span>{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: reseller.currency || "USD",
                      }).format(
                        reseller.currency === "USD"
                          ? (reseller.walletId.balance ?? 0) /
                              Number(process.env.NEXT_PUBLIC_USD_RATE)
                          : (reseller.walletId.balance ?? 0)
                      )}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {reseller.isActive ? "Active" : "Inactive"}
                    </p>
                    <p>
                      <span className="font-medium">Join Date:</span>{" "}
                      {reseller.createdAt &&
                        format(new Date(reseller.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-muted-foreground">
                    {reseller.notes || "No notes available."}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {isLoadingUsers ? (
        <div className="flex justify-center items-center min-h-[40vh]">
          <LoaderBig />
        </div>
      ) : (
        <TableData
          label="user"
          columnConfig={columnConfig}
          data={users || []}
          showCreateBtn={false}
          onToggleStatus={handleToggle}
        />
      )}

      {/* Recharge Wallet Dialog */}
      <Dialog
        open={isRechargeDialogOpen}
        onOpenChange={setIsRechargeDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recharge Wallet</DialogTitle>
            <DialogDescription>
              Add funds to {reseller.fullname}&#39;s wallet.
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
                <Loader className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
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
            <DialogTitle>Delete Reseller</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {reseller.fullname}? This action
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
              {isDeleting ? "Deleting..." : "Delete Reseller"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
