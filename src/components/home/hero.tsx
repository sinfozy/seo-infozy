import { BarChart3, Edit3, MapPin, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="bg-black text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
          SEO Infozy Tools For Smarter Growth 🚀
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-gray-800 border-gray-700 p-6 text-white">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-2">Website Research Tool</h3>
            <p className="text-gray-300 text-sm">
              Spy on competitors, track traffic, and uncover hidden growth
              opportunities in seconds.
            </p>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6 text-white">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-2">Keyword Research Tool</h3>
            <p className="text-gray-300 text-sm">
              Find high-traffic, low-competition keywords that skyrocket your
              rankings and sales.
            </p>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6 text-white">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-2">Bulk Analysis</h3>
            <p className="text-gray-300 text-sm">
              Analyze thousands of URLs at once and get instant SEO insights to
              scale smarter, faster.
            </p>
          </Card>

          <Card className="bg-gray-800 border-gray-700 p-6 text-white">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Edit3 className="w-5 h-5" />
            </div>
            <h3 className="font-semibold mb-2">AI Content Editor</h3>
            <p className="text-gray-300 text-sm">
              Write, optimize, and rank your content with an AI co-pilot built
              for marketers.
            </p>
          </Card>
        </div>

        <div className="text-center">
          <Button
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full"
          >
            <Link href="/signup">Start 7 Days Free Trial 🚀</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
