import { RocketIcon, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function MainHeroSection() {
  const clientLogos = [
    "shopify.png",
    "capterra.png",
    "g2.png",
    "salesforce.png",
    "product-hunt.png",
    "trust-radius.png",
  ];

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Rating */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
          </div>
          <span className="text-gray-600 ml-2">
            Loved by 4,000+ active marketers
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          <span className="text-primary">Rank Higher. Grow Faster.</span>
        </h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          Smarter{" "}
          <span className="font-black text-primary">
            SEO & Marketing Insights
          </span>{" "}
          for Real Results <RocketIcon />
        </h2>

        {/* Subheading */}
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          All-in-one toolkit trusted by global brands, startups, and website
          owners to
          <span className="font-semibold text-gray-900">
            {" "}
            boost traffic, improve rankings, and convert visitors into
            customers.
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full text-lg shadow-lg"
          >
            <Link href="/signup">Start 7 Days Free Trial 🚀</Link>
          </Button>
        </div>

        {/* Why Marketers Use Section */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Why top marketers choose{" "}
            <span className="text-primbg-primary">SEO Infozy</span> 📊
          </h3>

          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <Image
              src="/home/hero-image.jpg"
              alt="SEO Infozy Dashboard showing website analytics and performance metrics"
              width={800}
              height={500}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>

        {/* Trusted By Section */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-8">
            Trusted by leading companies in SEO & Marketing:
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {clientLogos.map((logo) => (
              <div
                key={logo}
                className="relative w-28 h-14 mx-auto flex items-center justify-center"
              >
                <Image
                  src={`/home/clients/${logo}`}
                  alt={logo.split(".")[0]}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
