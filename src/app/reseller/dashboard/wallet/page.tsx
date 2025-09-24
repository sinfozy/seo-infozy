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
import { Plus, Wallet } from "lucide-react";
import { RazorpayHandlerResponse, RazorpayOptions } from "@/types/razorpay";
import { useEffect, useState } from "react";
import { useGetWallet, useInitRecharge } from "@/lib/queries/wallet";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import axiosInstance from "@/lib/axios";
import { format } from "date-fns";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

export default function ResellerWalletPage() {
  const session = useSession();
  const userId = session?.data?.user?._id || "";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");

  const {
    data: wallet,
    refetch,
    isError,
    isPending: isGettingWallet,
  } = useGetWallet(userId, "Reseller");

  const rechargeMutation = useInitRecharge();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load wallet data.");
    }
  }, [isError]);

  // UI still respects wallet currency for displaying balance/transactions
  const currencySymbol =
    wallet?.currency === "USD" ? "$" : wallet?.currency === "INR" ? "₹" : "";

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if (window.Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddFunds = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    rechargeMutation.mutate(
      {
        ownerId: userId,
        ownerModel: "Reseller",
        amount: amt,
      },
      {
        onSuccess: async (data) => {
          setAmount("");
          setIsDialogOpen(false);

          // Step 1: Load Razorpay script dynamically
          const isLoaded = await loadRazorpayScript();
          if (!isLoaded) {
            toast.error(
              "Payment gateway not available. Please refresh and try again."
            );
            return;
          }

          // Step 3: Prepare Razorpay options
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            amount: data.order.amount,
            currency: data.order.currency,
            order_id: data.order.orderId,
            name: "SEO Infozy",
            description: "Wallet Recharge",
            handler: async function (response: RazorpayHandlerResponse) {
              try {
                const res = await axiosInstance.post("/wallet/verify-payment", {
                  ownerId: userId,
                  ownerModel: "Reseller",
                  amount: amt,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                });

                if (res.data.success) {
                  toast.success("Wallet recharged successfully!");
                  refetch();
                } else {
                  toast.error("Payment verification failed.");
                }
              } catch (err) {
                console.error("Payment verification error:", err);
                toast.error("Something went wrong during verification.");
              }
            },
            prefill: {
              name: session?.data?.user?.name || "",
              email: session?.data?.user?.email || "",
            },
            theme: {
              color: "#ff7600",
            },
          };

          // Step 4: Initialize Razorpay
          try {
            type RazorpayConstructor = new (options: RazorpayOptions) => {
              open: () => void;
            };
            const Razorpay = (
              window as unknown as { Razorpay: RazorpayConstructor }
            ).Razorpay;
            const rzp = new Razorpay(options);
            rzp.open();
          } catch (error) {
            console.error("Razorpay initialization error:", error);
            toast.error("Failed to initialize payment gateway.");
          }
        },
        onError(err) {
          toast.error("Failed to initiate recharge.");
          console.error("Recharge initiation error:", err);
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Wallet Balance Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>Reseller Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold mb-4">
            {isGettingWallet ? (
              <Loader className="text-muted-foreground" />
            ) : (
              `${currencySymbol}${wallet?.balance?.toFixed(2) || "0.00"}`
            )}
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Funds
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
          {(() => {
            if (isGettingWallet) {
              return (
                <div className="flex justify-center py-4">
                  <Loader className="text-muted-foreground" />
                </div>
              );
            }
            if (!wallet?.transactions || wallet.transactions.length === 0) {
              return (
                <p className="text-sm text-muted-foreground">
                  No transactions yet.
                </p>
              );
            }
            return (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b">
                      <th className="py-2">Date</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wallet.transactions.map((tx, idx) => (
                      <tr
                        key={tx.createdAt + idx}
                        className="border-b last:border-0"
                      >
                        <td className="py-2">
                          {format(
                            new Date(tx.createdAt),
                            "dd MMM yyyy, hh:mm a"
                          )}
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
                          {currencySymbol}
                          {tx.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Add Funds Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Funds</DialogTitle>
            <DialogDescription>
              Enter the amount to add to your wallet (INR only).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="add-amount">Amount (₹)</Label>
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
              }
            >
              {rechargeMutation.isPending ? (
                <Loader />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
