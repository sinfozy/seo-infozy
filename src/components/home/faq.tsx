import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle, HelpCircle, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";

export function FaqSection() {
  const faqs = [
    {
      question: "What is SEO Infozy and how does it work?",
      answer:
        "SEO Infozy is a comprehensive SEO research platform that helps you analyze keywords, track competitors, and optimize your content for better search engine rankings. Our AI-powered tools provide real-time insights and actionable recommendations.",
      category: "Getting Started",
    },
    {
      question: "Is SEO Infozy a monthly subscription-based service?",
      answer:
        "Yes, SEO Infozy offers flexible monthly and annual subscription plans to suit different needs and budgets, with options for individuals, teams, and enterprises. Annual plans come with significant savings.",
      category: "Pricing",
    },
    {
      question: "Does SEO Infozy provide a free trial?",
      answer:
        "We offer a 14-day free trial with full access to all features so you can explore how SEO Infozy can transform your SEO strategy before committing to a subscription.",
      category: "Trial",
    },
    {
      question: "How accurate is the keyword difficulty analysis?",
      answer:
        "Our keyword difficulty analysis uses advanced machine learning algorithms and real-time SERP data to provide 95%+ accuracy. We analyze over 200 ranking factors to give you the most precise difficulty scores in the industry.",
      category: "Features",
    },
    {
      question: "Can I track my competitors' SEO strategies?",
      answer:
        "Yes! Our competitor analysis feature lets you monitor your competitors' keyword rankings, backlink profiles, content strategies, and SERP positions. Get alerts when they make significant changes to their SEO approach.",
      category: "Features",
    },
    {
      question: "What kind of reporting and analytics do you provide?",
      answer:
        "We offer comprehensive reporting including keyword ranking reports, traffic analysis, backlink audits, technical SEO reports, and custom white-label reports. All reports can be automated and scheduled for delivery.",
      category: "Reporting",
    },
    {
      question: "Do you support multiple languages and regions?",
      answer:
        "Yes, SEO Infozy supports over 150 countries and 40+ languages. You can track local SEO performance, analyze regional search trends, and optimize for international markets with location-specific data.",
      category: "Global",
    },
    {
      question: "How does the AI content optimization work?",
      answer:
        "Our AI analyzes top-ranking content for your target keywords and provides specific recommendations for content length, semantic keywords, readability scores, and content structure to help you outrank competitors.",
      category: "AI Features",
    },
    {
      question: "Can I integrate SEO Infozy with other tools?",
      answer:
        "We offer integrations with Google Analytics, Google Search Console, WordPress, Shopify, and 50+ other popular marketing tools. Our API also allows custom integrations.",
      category: "Integrations",
    },
    {
      question: "What level of customer support do you provide?",
      answer:
        "We provide 24/7 customer support via live chat, email, and phone. Premium plans include dedicated account managers, priority support, and personalized onboarding sessions with SEO experts.",
      category: "Support",
    },
  ];

  const getCategoryColor = (category: string) => {
    const colors = {
      "Getting Started": "bg-emerald-100 text-emerald-700 border-emerald-200",
      Pricing: "bg-blue-100 text-blue-700 border-blue-200",
      Trial: "bg-purple-100 text-purple-700 border-purple-200",
      Features: "bg-orange-100 text-orange-700 border-orange-200",
      Reporting: "bg-teal-100 text-teal-700 border-teal-200",
      Global: "bg-indigo-100 text-indigo-700 border-indigo-200",
      "AI Features": "bg-pink-100 text-pink-700 border-pink-200",
      Integrations: "bg-cyan-100 text-cyan-700 border-cyan-200",
      Support: "bg-green-100 text-green-700 border-green-200",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  return (
    <section
      id="faq"
      className="py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <HelpCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <Badge
              variant="secondary"
              className="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Frequently Asked
            </Badge>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-balance">
            Everything You Need to Know
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto text-pretty">
            Get instant answers to common questions about SEO Infozy&#39;s
            features, pricing, and capabilities
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={`item-${index + 1}`}
              value={`item-${index + 1}`}
              className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              <AccordionTrigger className="px-6 py-5 text-left hover:no-underline group-hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start gap-4 w-full">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${getCategoryColor(
                          faq.category
                        )}`}
                      >
                        {faq.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 text-base leading-relaxed">
                      {faq.question}
                    </h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="ml-12 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our SEO experts are here to help you succeed. Get personalized
              answers and recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                <Link
                  target="_blank"
                  href="https://infozysms.com/contact"
                  rel="noreferrer noopener"
                >
                  Contact Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
