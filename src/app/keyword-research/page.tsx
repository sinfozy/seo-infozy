"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart3,
  CheckCircle,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";

export default function KeywordResearchPage() {
  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">Keyword Research Tool</h1>
        <p className="text-lg max-w-3xl mx-auto">
          Unlock the power of keywords with{" "}
          <span className="font-semibold">
            SEO Infozy’s Keyword Research Tool
          </span>
          . Discover, analyze, and optimize keywords to fuel your SEO strategy.
        </p>
      </section>

      {/* What is Keyword Research */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Why Keyword Research Matters
          </h2>
          <p className="mb-4 text-gray-600 leading-relaxed">
            Keyword research is the foundation of any successful SEO and digital
            marketing campaign. With{" "}
            <span className="font-semibold">SEO Infozy</span>, you can identify
            the exact terms your audience is searching for, discover new
            opportunities, and optimize your content strategy.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Discover high-performing keywords
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Analyze keyword competition & difficulty
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              Stay ahead with trend analysis
            </li>
          </ul>
        </div>
        <div className="relative">
          <Image
            src="/features/keyword-research.png"
            alt="Keyword Research Dashboard"
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
            Our Keyword Research Features
          </h2>
          <p className="text-gray-600">
            Everything you need to discover and optimize profitable keywords.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <Search className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Comprehensive Database
              </h3>
              <p className="text-gray-600 text-sm">
                Access a vast database of keywords with search volume, CPC, and
                trends.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <Target className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Long-Tail Keywords</h3>
              <p className="text-gray-600 text-sm">
                Find long-tail opportunities with low competition and high
                intent.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <BarChart3 className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Competitor Insights
              </h3>
              <p className="text-gray-600 text-sm">
                Analyze competitor keyword strategies and spot ranking gaps.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <TrendingUp className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Trend Analysis</h3>
              <p className="text-gray-600 text-sm">
                Stay ahead with keyword trend tracking to predict future demand.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Benefits of SEO Infozy Keyword Research
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
          Empower your SEO strategy with actionable keyword data. From content
          creation to paid campaigns, keyword research is your roadmap to online
          visibility.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-lg font-semibold mb-2">
              Target the Right Audience
            </h3>
            <p className="text-gray-600 text-sm">
              Focus on keywords that match your audience’s search intent.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Outrank Competitors</h3>
            <p className="text-gray-600 text-sm">
              Gain an edge by identifying gaps in your competitors’ strategies.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Maximize ROI</h3>
            <p className="text-gray-600 text-sm">
              Prioritize keywords with the best balance of search volume and
              difficulty.
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
                How do I find long-tail keywords?
              </AccordionTrigger>
              <AccordionContent>
                SEO Infozy helps you identify long-tail keywords by analyzing
                search data, competition, and user intent, giving you actionable
                opportunities.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Can I check competitor keyword strategies?
              </AccordionTrigger>
              <AccordionContent>
                Yes! Our competitor analysis feature lets you uncover which
                keywords your competitors rank for and how you can compete.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                How often should I perform keyword research?
              </AccordionTrigger>
              <AccordionContent>
                Regular keyword research ensures your SEO strategy adapts to
                changing trends, seasonal demand, and shifts in user behavior.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
