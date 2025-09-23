const USD_RATE = process.env.NEXT_PUBLIC_USD_RATE
  ? parseFloat(process.env.NEXT_PUBLIC_USD_RATE)
  : 83.71;

export const pricingData = {
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
        "1": { price: 799 / USD_RATE, save: 0, searches: 50 },
        "3": { price: 2499 / USD_RATE, save: 3, searches: 180 },
        "6": { price: 4699 / USD_RATE, save: 8, searches: 400 },
        "12": { price: 7999 / USD_RATE, save: 29, searches: 950 },
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

export const plans = [
  { duration: "1", label: "1 Month", popular: false },
  { duration: "3", label: "3 Month", popular: true },
  { duration: "6", label: "6 Month", popular: false },
  { duration: "12", label: "12 Month", popular: false },
];
