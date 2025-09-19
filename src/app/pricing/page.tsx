"use client";

import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useState } from "react";

export default function PricingSection() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [planType, setPlanType] = useState<"Pro" | "Advance">("Pro");

  // Pricing Data for Pro & Advance
  const pricingData = {
    Pro: {
      INR: {
        symbol: "₹",
        prices: {
          "1": { price: 799, save: 0 },
          "3": { price: 2499, save: 200 },
          "6": { price: 4699, save: 700 },
          "12": { price: 7999, save: 2400 },
        },
      },
      USD: {
        symbol: "$",
        prices: {
          "1": { price: 11, save: 0 },
          "3": { price: 30, save: 3 },
          "6": { price: 56, save: 8 },
          "12": { price: 100, save: 29 },
        },
      },
      features: [
        "50 search/day",
        "15k export/day",
        "2 User Access",
        "Email Support",
      ],
    },
    Advance: {
      INR: {
        symbol: "₹",
        prices: {
          "1": { price: 1599, save: 0 },
          "3": { price: 4599, save: 400 },
          "6": { price: 7999, save: 1400 },
          "12": { price: 14999, save: 4800 },
        },
      },
      USD: {
        symbol: "$",
        prices: {
          "1": { price: 20, save: 0 },
          "3": { price: 55, save: 5 },
          "6": { price: 100, save: 15 },
          "12": { price: 180, save: 40 },
        },
      },
      features: [
        "100 search/day",
        "20k export/day",
        "3 User Access",
        "Priority Support",
      ],
    },
  };

  const plans = [
    { duration: "1", label: "1 Month", popular: false },
    { duration: "3", label: "3 Month", popular: true },
    { duration: "6", label: "6 Month", popular: false },
    { duration: "12", label: "12 Month", popular: false },
  ];

  return (
    <main className="py-20 px-4 bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-xl shadow-lg border border-emerald-100 overflow-hidden">
            <div
              onClick={() => setPlanType("Pro")}
              className={`px-8 py-4 cursor-pointer transition-colors font-semibold ${
                planType === "Pro"
                  ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Pro
            </div>
            <div
              onClick={() => setPlanType("Advance")}
              className={`px-8 py-4 cursor-pointer transition-colors font-semibold ${
                planType === "Advance"
                  ? "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Advance (more search)
            </div>
          </div>
        </div>

        {/* Currency Toggle */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-md border border-emerald-200 p-1">
            <button
              onClick={() => setCurrency("INR")}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                currency === "INR"
                  ? "bg-emerald-500 text-white shadow-md"
                  : "text-gray-600 hover:text-emerald-600"
              }`}
            >
              INR
            </button>
            <button
              onClick={() => setCurrency("USD")}
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

        {/* Plan Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            {planType.toUpperCase()} PLAN
          </h2>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {pricingData[planType].features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-gray-700"
              >
                <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const priceData =
              pricingData[planType][currency].prices[
                plan.duration as keyof typeof pricingData.Pro.INR.prices
              ];
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
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-xs font-bold transform rotate-12">
                    POPULAR
                  </Badge>
                )}

                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-emerald-600 mb-6">
                    {plan.label}
                  </h3>

                  <div className="mb-8">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {pricingData[planType][currency].symbol}
                      {priceData.price.toLocaleString()}
                    </div>
                  </div>

                  <Button
                    className={`w-full py-3 font-semibold transition-all ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg"
                        : "bg-emerald-500 hover:bg-emerald-600 text-white"
                    }`}
                  >
                    Buy Now
                  </Button>

                  <div className="mt-4 text-sm text-gray-500">
                    Save {pricingData[planType][currency].symbol}
                    {priceData.save.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Grow organic traffic with our SEO tool !!
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses already using our powerful SEO
            analytics platform to boost their search rankings and drive more
            organic traffic.
          </p>
        </div>
      </div>
    </main>
  );
}
