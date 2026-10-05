import { NextRequest, NextResponse } from "next/server";
import { transcribeAudioWithElevenLabs } from "@/lib/elevenlabs/client";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = (formData.get("file") || formData.get("audio")) as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Audio file is required. Please provide a valid voice recording." },
        { status: 400 }
      );
    }

    // Validate size (max 15MB)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Audio file exceeds maximum size limit of 15MB." },
        { status: 400 }
      );
    }

    // Ephemeral in-memory buffer conversion
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = file.type || "audio/webm";

    // Transcribe via server-side ElevenLabs STT
    const result = await transcribeAudioWithElevenLabs(buffer, mimeType);

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API /api/voice/stt error:", error);
    return NextResponse.json(
      { error: "Failed to process audio recording. Please try speaking again." },
      { status: 500 }
    );
  }
}
