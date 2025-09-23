"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PricingSection() {
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");

  // Pricing Data with Searches per duration (Pro)
  const pricingData = {
    Pro: {
      INR: {
        symbol: "₹",
        prices: {
          "1": { price: 799, save: 0, searches: 50 },
          "3": { price: 2499, save: 200, searches: 180 },
          "6": { price: 4699, save: 700, searches: 400 },
          "12": { price: 7999, save: 2400, searches: 950 },
        },
      },
      USD: {
        symbol: "$",
        prices: {
          "1": { price: 11, save: 0, searches: 50 },
          "3": { price: 30, save: 3, searches: 180 },
          "6": { price: 56, save: 8, searches: 400 },
          "12": { price: 100, save: 29, searches: 950 },
        },
      },
      features: [
        "AI-powered SEO with Infyra Search (Unlimited)",
        "Business & Industry-based Responses",
        "Live Chat & 24/7 Support",
        "Email Support",
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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent flex justify-center items-center gap-2">
            <Sparkles className="w-8 h-8 text-emerald-500" />
            Infyra Search
          </h1>
          <p className="text-lg text-gray-700 mt-4 max-w-2xl mx-auto">
            Supercharge your SEO with{" "}
            <span className="font-semibold text-emerald-700">
              Infyra Search AI
            </span>
            — delivering business data insights and industry-based responses to
            help you grow smarter and faster.
          </p>
        </div>

        {/* Currency Toggle */}
        <div className="flex justify-center mb-10">
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

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-12">
          {pricingData.Pro.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-gray-700 justify-center md:justify-start"
            >
              <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* Free Trial */}
        <Card className="max-w-3xl mx-auto mb-12 border-2 border-emerald-400 shadow-lg">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-emerald-700 mb-3">
              Start with a 7-Day Free Trial
            </h3>
            <p className="text-gray-600 mb-6">
              Explore Infyra Search with full access to AI-powered SEO insights.{" "}
              <span className="font-bold">No credit card required.</span>
            </p>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-8 py-3 shadow-lg">
              Start Free Trial
            </Button>
          </CardContent>
        </Card>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const priceData =
              pricingData.Pro[currency].prices[
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

                  <div className="mb-4">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {pricingData.Pro[currency].symbol}
                      {priceData.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {priceData.searches} searches
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
                    Save {pricingData.Pro[currency].symbol}
                    {priceData.save.toLocaleString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            AI + SEO = Infyra Advantage 🚀
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of businesses already using{" "}
            <span className="font-semibold text-emerald-700">
              Infyra Search
            </span>{" "}
            to uncover growth opportunities, get industry-level insights, and
            drive more organic traffic.
          </p>
        </div>
      </div>
    </main>
  );
}
