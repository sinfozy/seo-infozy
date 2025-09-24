"use client";

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
import { Plus, Wallet } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { toast } from "sonner";
import { useGetWallet } from "@/lib/queries/wallet";
import { useRechargeAdminWallet } from "@/lib/queries/admin/wallet";

const ADMIN_ID = process.env.NEXT_PUBLIC_ADMIN_ID || "";

export default function AdminWalletPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const {
    data: wallet,
    refetch,
    isError,
    isPending: isGettingWallet,
  } = useGetWallet(ADMIN_ID, "Admin");

  const rechargeMutation = useRechargeAdminWallet();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load wallet data.");
    }
  }, [isError]);

  if (isGettingWallet) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <LoaderBig />
      </div>
    );
  }

  // ---- Display logic ----
  const walletCurrency = wallet?.currency || "INR";
  const symbol = walletCurrency === "USD" ? "$" : "₹";

  const displayedBalance = wallet ? wallet.balance.toFixed(2) : "0.00";

  const displayedTransactions =
    wallet?.transactions.map((tx) => ({
      ...tx,
      amount: tx.amount,
    })) || [];

  // ---- Handlers ----
  const handleAddFunds = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return;

    // Always send amount in INR
    rechargeMutation.mutate(
      {
        adminId: ADMIN_ID,
        amount: amt, // always INR
      },
      {
        onSuccess() {
          toast.success(`Wallet recharged successfully!`);
          refetch();
          setAmount("");
          setIsDialogOpen(false);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Admin Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-4">
            {isGettingWallet ? (
              <Loader className="text-muted-foreground" />
            ) : (
              `${symbol}${displayedBalance}`
            )}
          </div>

          <div className="flex space-x-2">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4" /> Add Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {displayedTransactions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-2">Date</th>
                    <th className="py-2">Type</th>
                    <th className="py-2">Amount (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTransactions.map((tx, idx) => (
                    <tr
                      key={tx.createdAt + idx}
                      className="border-b last:border-0"
                    >
                      <td className="py-2">
                        {format(new Date(tx.createdAt), "dd MMM yyyy, hh:mm a")}
                      </td>
                      <td
                        className={`py-2 ${
                          tx.type === "credit"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.type === "credit" ? "Credit" : "Debit"}
                      </td>
                      <td className="py-2">
                        {symbol}
                        {tx.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No transactions yet.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Add Funds Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>Enter the amount (INR).</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="add-amount">Amount</Label>
            <Input
              id="add-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="100"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddFunds}
              disabled={
                !amount || parseFloat(amount) <= 0 || rechargeMutation.isPending
                // ||
                // withdrawMutation.isPending
              }
            >
              {rechargeMutation.isPending ? (
                <Loader />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
