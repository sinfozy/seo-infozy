"use client";

import { BarChart3, Globe, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { useWebsiteResearch } from "@/lib/queries/user/seo";

export default function Page() {
  const [url, setUrl] = useState("");
  const [domain, setDomain] = useState<string | undefined>(undefined);

  const {
    mutate: runSearch,
    data: results = [],
    isPending,
  } = useWebsiteResearch();

  const handleSearch = () => {
    if (!url) {
      toast.error("Please enter a domain.");
      return;
    }
    runSearch(url);
    setDomain(url);
  };

  // Generate mock keywords based on result titles/snippets
  const keywords = useMemo(() => {
    if (!results.length) return [];
    const text = results.map((r) => r.title + " " + r.snippet).join(" ");
    const words =
      text
        .toLowerCase()
        .match(/\b[a-z]{4,}\b/g)
        ?.reduce((acc: Record<string, number>, w) => {
          acc[w] = (acc[w] || 0) + 1;
          return acc;
        }, {}) || {};
    return Object.entries(words)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }, [results]);

  // Mock backlinks
  const backlinks = useMemo(() => {
    if (!results.length) return [];
    return results.slice(0, 5).map((r, i) => ({
      source: `https://backlink${i + 1}.com`,
      target: r.link,
      anchor: r.title.split(" ")[0] || "Anchor",
    }));
  }, [results]);

  return (
    <section className="h-full flex flex-col justify-start p-6">
      <div className="max-w-7xl mx-auto w-full">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 flex items-center justify-center gap-2">
            <Globe className="w-8 h-8 text-primary" /> Website Research
          </h1>
          <p className="text-lg text-muted-foreground">
            Analyze any website’s keywords, backlinks, and top pages in seconds.
          </p>
        </div>

        {/* SEARCH BAR */}
        <div className="flex gap-2 justify-center mb-10">
          <Input
            type="text"
            placeholder="Enter domain (e.g., infozysms.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="max-w-md bg-background border"
          />
          <Button
            onClick={handleSearch}
            disabled={isPending}
            className="bg-primary text-primary-foreground"
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Searching..." : "Search"}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="grid gap-8">
            {/* DOMAIN OVERVIEW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Domain</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                  {domain}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Organic Traffic</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-emerald-600">
                  ~{results.length * 120}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Backlinks</CardTitle>
                </CardHeader>
                <CardContent className="text-2xl font-bold text-blue-600">
                  {backlinks.length * 15}
                </CardContent>
              </Card>
            </div>

            {/* KEYWORDS */}
            <Card>
              <CardHeader>
                <CardTitle>Top Keywords</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {keywords.map((k, i) => (
                  <Badge
                    key={i}
                    className="px-3 py-1 text-sm bg-emerald-100 text-emerald-800"
                  >
                    #{k.word} ({k.count})
                  </Badge>
                ))}
              </CardContent>
            </Card>

            {/* BACKLINKS */}
            <Card>
              <CardHeader>
                <CardTitle>Top Backlinks</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Anchor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backlinks.map((b, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Link
                            href={b.source}
                            target="_blank"
                            className="text-blue-500 hover:underline"
                          >
                            {b.source}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={b.target}
                            target="_blank"
                            className="text-blue-500 hover:underline"
                          >
                            {b.target}
                          </Link>
                        </TableCell>
                        <TableCell>{b.anchor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* TOP PAGES */}
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="flex gap-2 items-center">
                  <BarChart3 className="w-5 h-5 text-primary" /> Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Position</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Link</TableHead>
                      <TableHead>Snippet</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="text-left">
                    {results.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>
                          <Link
                            href={item.link}
                            target="_blank"
                            className="text-blue-500 hover:underline"
                          >
                            {item.link}
                          </Link>
                        </TableCell>
                        <TableCell>{item.snippet}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
