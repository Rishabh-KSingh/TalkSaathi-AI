import { NextRequest, NextResponse } from "next/server";
import { generateSpeechWithElevenLabs, TtsSpeed } from "@/lib/elevenlabs/client";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || typeof body.text !== "string" || !body.text.trim()) {
      return NextResponse.json(
        { error: "Text is required for speech synthesis." },
        { status: 400 }
      );
    }

    const trimmedText = body.text.trim().slice(0, 5000); // 5000 chars max
    const speed = (body.speed as TtsSpeed) || "normal";
    const voiceId = typeof body.voiceId === "string" ? body.voiceId : undefined;
    const modelId = typeof body.modelId === "string" ? body.modelId : undefined;

    const result = await generateSpeechWithElevenLabs({
      text: trimmedText,
      speed,
      voiceId,
      modelId,
    });

    if (result.provider === "elevenlabs" && result.audioBuffer) {
      // Return raw audio/mpeg stream directly without writing to disk
      return new Response(new Uint8Array(result.audioBuffer), {
        status: 200,
        headers: {
          "Content-Type": result.mimeType,
          "Content-Length": result.audioBuffer.length.toString(),
          "X-Voice-Provider": "elevenlabs",
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      });
    }

    // Fallback response for mock mode or API key absence
    return NextResponse.json(
      {
        provider: "mock-mode",
        fallback: true,
        text: trimmedText,
        error: result.error,
        message:
          "ElevenLabs API key not configured or mock mode enabled. Audio will be synthesized using browser speech engine.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in /api/voice/tts route:", error);
    return NextResponse.json(
      { error: "Failed to generate speech audio." },
      { status: 500 }
    );
  }
}
