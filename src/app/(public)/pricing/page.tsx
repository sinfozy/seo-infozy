"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { Currency, Plan } from "@/types/enums";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PurchasePlanResponse,
  useGetUserPlan,
  usePurchasePlan,
} from "@/lib/queries/user/plan";
import { plans, pricingData } from "@/lib/constants/PLANS";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import { format } from "date-fns";
import { sendError } from "@/lib/helpers/error-response";
import { toast } from "sonner";
import { useState } from "react";

export default function PlansPage() {
  const [currency, setCurrency] = useState<Currency>(Currency.INR);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    data: userPlan,
    isLoading: isPlanLoading,
    refetch,
  } = useGetUserPlan();
  const { mutate: purchasePlan, isPending } = usePurchasePlan();

  // Map durations → Plan enum
  const mapping: Record<string, Plan> = {
    "1": Plan.MONTHLY,
    "3": Plan.THREE_MONTHS,
    "6": Plan.SIX_MONTHS,
    "12": Plan.YEARLY,
  };

  const handleConfirmPurchase = () => {
    if (!selectedPlan) return;

    const targetPlan = mapping[selectedPlan];

    purchasePlan(
      { planName: targetPlan },
      {
        onSuccess: (data: PurchasePlanResponse) => {
          setConfirmOpen(false);
          refetch();
          toast.success(`${data.message}`, {
            description: (
              <span style={{ color: "black" }}>
                Your plan is now active until{" "}
                {format(new Date(data.planEndsAt), "PPP")}
              </span>
            ),
          });
        },
        onError: (err) => {
          setConfirmOpen(false);
          sendError(err);
        },
      }
    );
  };

  const getPlanButtonState = (planKey: string) => {
    if (!userPlan) return { label: "Buy Now", disabled: false };

    const targetPlan = mapping[planKey];

    if (userPlan.name === targetPlan) {
      return { label: "Current Plan", disabled: true };
    }

    // Order: TRIAL < MONTHLY < 3MONTHS < 6MONTHS < YEARLY
    const order = [
      Plan.TRIAL,
      Plan.MONTHLY,
      Plan.THREE_MONTHS,
      Plan.SIX_MONTHS,
      Plan.YEARLY,
    ];
    const currentIndex = order.indexOf(userPlan.name);
    const targetIndex = order.indexOf(targetPlan);

    if (targetIndex < currentIndex) {
      return { label: "Unavailable", disabled: true };
    }

    return { label: "Upgrade", disabled: isPending };
  };

  return (
    <main className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex justify-center items-center gap-2">
            <Sparkles className="w-8 h-8 text-emerald-500" />
            Infyra Search Plans
          </h1>
          <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
            Choose the right plan and unlock{" "}
            <span className="font-semibold text-emerald-700">
              AI-powered SEO
            </span>{" "}
            insights for your business.
          </p>
        </div>

        {/* Current Plan */}
        {isPlanLoading ? (
          <p className="text-center text-gray-500">Loading your plan...</p>
        ) : userPlan ? (
          <div className="text-center mb-12">
            <Badge className="bg-emerald-500 text-white px-4 py-2 text-sm font-semibold rounded-lg">
              Current Plan: {userPlan.name} (ends{" "}
              {format(new Date(userPlan.planEndsAt), "PPP")})
            </Badge>
          </div>
        ) : null}

        {/* Currency Toggle */}
        <div className="flex justify-center mb-10">
          <div className="flex bg-white rounded-lg shadow-md border border-emerald-200 p-1">
            <button
              onClick={() => setCurrency(Currency.INR)}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                currency === "INR"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              INR
            </button>
            <button
              onClick={() => setCurrency(Currency.USD)}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                currency === "USD"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              USD
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
          {pricingData.Pro.features.map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-gray-700 justify-center md:justify-start"
            >
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const priceData =
              pricingData.Pro[currency].prices[
                plan.duration as keyof typeof pricingData.Pro.INR.prices
              ];

            const buttonState = getPlanButtonState(plan.duration);

            return (
              <Card
                key={plan.duration}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  plan.popular
                    ? "border-2 border-emerald-400 shadow-lg scale-105"
                    : "border border-gray-200 hover:border-emerald-300"
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-2 -right-3 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 pt-3 pb-1 text-xs font-bold transform rotate-12">
                    POPULAR
                  </Badge>
                )}

                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-emerald-600 mb-6">
                    {plan.label}
                  </h3>

                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {pricingData.Pro[currency].symbol}
                      {priceData.price.toLocaleString(undefined, {
                        minimumFractionDigits: currency === "USD" ? 2 : 0,
                      })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {priceData.searches} searches
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedPlan(plan.duration);
                      setConfirmOpen(true);
                    }}
                    disabled={buttonState.disabled}
                    className={`w-full py-3 font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    {buttonState.label}
                  </Button>

                  <div className="mt-4 text-sm text-gray-500">
                    Save {pricingData.Pro[currency].symbol}
                    {priceData.save.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Purchase</DialogTitle>
            <DialogDescription>
              {selectedPlan && (
                <>
                  <span>
                    You are about to purchase the{" "}
                    <span className="font-semibold">
                      {plans.find((p) => p.duration === selectedPlan)?.label}
                    </span>{" "}
                    plan.
                  </span>
                  <span className="block text-lg text-green-500 font-medium mt-2">
                    Price: {pricingData.Pro[currency].symbol}
                    {pricingData.Pro[currency].prices[
                      selectedPlan as keyof typeof pricingData.Pro.INR.prices
                    ].price.toLocaleString(undefined, {
                      minimumFractionDigits: currency === "USD" ? 2 : 0,
                    })}
                  </span>
                  {userPlan?.name && (
                    <span className="text-sm text-muted-foreground block mt-2">
                      Your current plan: <strong>{userPlan.name}</strong>{" "}
                      (expires {format(new Date(userPlan.planEndsAt), "PPP")})
                    </span>
                  )}
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmPurchase}
              disabled={isPending}
              className="bg-primary text-white"
            >
              {isPending ? (
                <>
                  <Loader /> Processing...
                </>
              ) : (
                "Confirm Purchase"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
