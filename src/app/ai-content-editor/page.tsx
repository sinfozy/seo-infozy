"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  CheckCircle,
  FileText,
  Type,
  Users,
  Zap,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import Image from "next/image";

export default function ContentEditorPage() {
  return (
    <main className="bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-6">AI Content Editor</h1>
        <p className="text-lg max-w-3xl mx-auto">
          Create, optimize, and manage content effortlessly with{" "}
          <span className="font-semibold">SEO Infozy’s AI Content Editor</span>.
          From SEO suggestions to readability scoring, our tools help you craft
          content that ranks and engages.
        </p>
      </section>

      {/* What is Content Editor */}
      <section className="max-w-6xl mx-auto py-20 px-6 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">
            Why Use Our Content Editor?
          </h2>
          <p className="mb-4 text-gray-600 leading-relaxed">
            Compelling content is the cornerstone of digital marketing success.
            With <span className="font-semibold">SEO Infozy</span>, you can
            write smarter, optimize instantly, and collaborate with your team in
            real-time.
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-500" />
              Real-time SEO optimization
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-500" />
              Collaborative editing features
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-indigo-500" />
              Readability & engagement scoring
            </li>
          </ul>
        </div>
        <div className="relative">
          <Image
            src="/features/content-editor.png"
            alt="AI Content Editor Dashboard"
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
            Features of Our AI Content Editor
          </h2>
          <p className="text-gray-600">
            Intelligent features designed to make your content creation process
            faster and more effective.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <FileText className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">SEO Optimization</h3>
              <p className="text-gray-600 text-sm">
                Get real-time SEO suggestions to improve your content and rank
                higher.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <Type className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Content Templates</h3>
              <p className="text-gray-600 text-sm">
                Use customizable templates for blogs, ads, and landing pages.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <Users className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Collaborative Editing
              </h3>
              <p className="text-gray-600 text-sm">
                Work seamlessly with your team with real-time collaborative
                editing.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-xl transition">
            <CardContent className="text-center">
              <BarChart className="w-10 h-10 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Readability Scoring
              </h3>
              <p className="text-gray-600 text-sm">
                Ensure your content is engaging and easy to read with AI-driven
                scoring.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Benefits of Using SEO Infozy’s AI Content Editor
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
          Save time, boost SEO performance, and deliver high-quality content
          that resonates with your audience.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-lg font-semibold mb-2">
              Faster Content Creation
            </h3>
            <p className="text-gray-600 text-sm">
              Write and publish content in half the time with AI assistance.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-lg font-semibold mb-2">
              Better Search Rankings
            </h3>
            <p className="text-gray-600 text-sm">
              Optimized content that performs well in search engines
              automatically.
            </p>
          </div>
          <div className="p-6 bg-white shadow rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-600 text-sm">
              Keep everyone aligned with real-time editing and feedback.
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
                How does the SEO optimization work?
              </AccordionTrigger>
              <AccordionContent>
                SEO Infozy’s AI analyzes your content in real-time and suggests
                improvements based on keywords, structure, and SEO best
                practices.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                Can I collaborate with my team?
              </AccordionTrigger>
              <AccordionContent>
                Yes! The content editor allows multiple team members to edit and
                review content simultaneously with built-in version control.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Does it support templates for different content types?
              </AccordionTrigger>
              <AccordionContent>
                Absolutely. SEO Infozy provides customizable templates for blog
                posts, social media content, email campaigns, and more.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </main>
  );
}
