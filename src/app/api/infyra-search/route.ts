import { NextRequest, NextResponse } from "next/server";

import { GoogleGenAI } from "@google/genai";
import { User } from "@/models/user";
import { auth } from "@/auth";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user._id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const user = await User.findById(session.user._id);

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }
    if (!(await user.canUseWebsiteSearch())) {
      return NextResponse.json(
        { message: "You have reached your search limit." },
        { status: 403 }
      );
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { message: "Prompt is required" },
        { status: 400 }
      );
    }

    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    const text = res.text as string;

    user.addAIConversation(prompt, text);
    await user.save();

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Infyra Search Error:", err);
    return NextResponse.json(
      { message: "Failed to generate response" },
      { status: 500 }
    );
  }
}
