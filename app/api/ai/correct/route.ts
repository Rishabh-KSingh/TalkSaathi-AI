import { NextRequest, NextResponse } from "next/server";
import { correctEnglishSpeech, CorrectionRequest } from "@/lib/ai/open-weight-client";
import { EnglishLevel, ExplanationLanguage } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload. Expected JSON object." },
        { status: 400 }
      );
    }

    const { text, level, explanationLanguage, context } = body;

    // Validate text input
    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Spoken text is required for AI evaluation." },
        { status: 400 }
      );
    }

    if (text.length > 2000) {
      return NextResponse.json(
        { error: "Input text exceeds maximum length of 2000 characters." },
        { status: 400 }
      );
    }

    // Sanitize parameters
    const safeLevel: EnglishLevel =
      level === "beginner" || level === "intermediate" ? level : "intermediate";

    const safeLang: ExplanationLanguage =
      explanationLanguage === "hindi" ||
      explanationLanguage === "english" ||
      explanationLanguage === "hinglish"
        ? explanationLanguage
        : "hinglish";

    const params: CorrectionRequest = {
      text: text.trim(),
      level: safeLevel,
      explanationLanguage: safeLang,
      context: typeof context === "string" ? context.trim() : undefined,
    };

    // Execute open-weight LLM correction
    const result = await correctEnglishSpeech(params);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API /api/ai/correct error:", error);
    return NextResponse.json(
      {
        error: "Something went wrong while processing your English speech. Please try again.",
      },
      { status: 500 }
    );
  }
}
