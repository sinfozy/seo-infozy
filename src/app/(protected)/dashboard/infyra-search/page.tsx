"use client";

import { Bot, Loader2, Send, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useInfyraSearch } from "@/lib/queries/user/infyra";

interface FormValues {
  prompt: string;
}

export default function InfyraSearchDemo() {
  const { mutateAsync, isPending } = useInfyraSearch();
  const [messages, setMessages] = useState<
    { role: "user" | "ai"; text: string }[]
  >([]);

  const form = useForm<FormValues>({
    defaultValues: { prompt: "" },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!values.prompt) return;

    // Add user message
    const newMessages: { role: "user" | "ai"; text: string }[] = [
      ...messages,
      { role: "user" as const, text: values.prompt },
    ].slice(-10);
    setMessages(newMessages);

    try {
      const res = await mutateAsync(values.prompt);

      // Add AI response
      setMessages((prev) =>
        [
          ...prev,
          { role: "ai", text: res?.text || "No response." } as const,
        ].slice(-10)
      );
    } catch (err) {
      console.error(err);
    }

    form.reset();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-center">Infyra Search</h1>
      <p className="text-center text-muted-foreground">
        AI-powered insights for SEO, business research & industry-specific
        needs.
      </p>

      {/* Messages */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 mt-4">
        {messages.map((msg, idx) => (
          <Card
            key={idx}
            className={`border py-0 ${
              msg.role === "user"
                ? "bg-blue-50 ml-auto w-fit"
                : "bg-gray-50 mr-auto w-fit"
            }`}
          >
            <CardContent className="flex items-start gap-2 p-3">
              {msg.role === "user" ? (
                <User className="w-5 h-5 text-blue-600 mt-1" />
              ) : (
                <Bot className="w-5 h-5 text-green-600 mt-1" />
              )}
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex gap-2 items-start"
        >
          <FormField
            control={form.control}
            name="prompt"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Ask Infyra (e.g., Analyze example.com SEO)"
                    className="resize-none"
                    rows={3}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending} className="mt-auto">
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
