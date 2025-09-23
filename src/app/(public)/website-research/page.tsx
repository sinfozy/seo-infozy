"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BarChart2, CheckCircle, Globe, Link, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";

export default function WebsiteResearchPage() {
  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Website Research Tool</h1>
        <p className="text-lg max-w-3xl mx-auto">
          Understand your competitors, uncover opportunities, and refine your
          SEO strategy with{" "}
          <span className="font-semibold">
            SEO Infozy’s Website Research Tool
          </span>
          .
        </p>
      </section>

      {/* What is Website Research */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">What is Website Research?</h2>
          <p className="mb-4 text-gray-600 leading-relaxed">
            Website research is the backbone of any successful digital marketing
            strategy. At <span className="font-semibold">SEO Infozy</span>, we
            equip you with the tools to analyze websites, study competitors, and
            identify high-value opportunities to grow your online presence.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Competitor Insights & Keyword Strategies
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Backlink & Domain Authority Monitoring
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Technical Site Audits
            </li>
          </ul>
        </div>
        <div className="relative">
          <Image
            src="/features/website-research.png"
            alt="Website Research Dashboard"
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Explore Our Research Features
          </h2>
          <p className="text-gray-600">
            Gain data-driven insights to make informed SEO and marketing
            decisions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <Globe className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Competitor Analysis
              </h3>
              <p className="text-gray-600 text-sm">
                Discover competitor keywords, traffic sources, and strategies to
                stay ahead.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <Search className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Keyword Research</h3>
              <p className="text-gray-600 text-sm">
                Find high-performing and long-tail keywords that drive targeted
                traffic.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <BarChart2 className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Site Audits</h3>
              <p className="text-gray-600 text-sm">
                Get actionable insights on site health, performance, and SEO
                compliance.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <Link className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Backlink Analysis</h3>
              <p className="text-gray-600 text-sm">
                Track backlinks, monitor authority, and analyze link-building
                success.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Why It Matters */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Why Website Research Matters
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
          In today’s fast-paced digital world, decisions backed by research can
          be the difference between success and failure. Our Website Research
          Tool helps you stay competitive, identify new growth opportunities,
          and optimize your online strategies.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Data-Driven Strategy</h3>
            <p className="text-gray-600 text-sm">
              Make informed choices based on real-time SEO insights.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-lg font-semibold mb-2">
              Stay Ahead of Competitors
            </h3>
            <p className="text-gray-600 text-sm">
              Benchmark performance and refine your campaigns with competitive
              data.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Maximize ROI</h3>
            <p className="text-gray-600 text-sm">
              Allocate resources effectively by knowing what works best.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="bg-gray-100 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                How does competitor analysis work?
              </AccordionTrigger>
              <AccordionContent>
                Our tool scans competitor websites, identifying their keyword
                usage, backlinks, and top-performing content, helping you
                understand what drives their success.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Can I track my website’s performance?
              </AccordionTrigger>
              <AccordionContent>
                Yes, you can run detailed site audits and monitor your backlink
                profile, domain authority, and organic visibility over time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Why should I invest in website research?
              </AccordionTrigger>
              <AccordionContent>
                Research gives you the insights needed to compete effectively,
                refine marketing efforts, and achieve higher ROI in SEO
                campaigns.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
