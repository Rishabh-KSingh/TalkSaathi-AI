export interface SttResult {
  text: string;
  languageCode?: string;
  provider: "elevenlabs" | "mock-mode";
  durationSeconds?: number;
}

/**
 * Transcribes audio buffer or blob using ElevenLabs Speech-to-Text (Scribe API).
 * Never permanently stores the audio file.
 */
export async function transcribeAudioWithElevenLabs(
  audioBuffer: Buffer,
  mimeType: string = "audio/webm"
): Promise<SttResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const providerMode = process.env.AI_PROVIDER_MODE || "live";

  // If no API key configured or mock mode enabled, provide deterministic fallback
  if (!apiKey || providerMode === "mock") {
    return {
      text: "Yesterday morning I wake up at 8 AM and I didn't went to college because I was having a mild fever.",
      languageCode: "eng",
      provider: "mock-mode",
    };
  }

  // Construct multipart/form-data for ElevenLabs Scribe API
  const formData = new FormData();
  const fileExtension = mimeType.includes("wav")
    ? "wav"
    : mimeType.includes("mp4") || mimeType.includes("m4a")
    ? "m4a"
    : mimeType.includes("ogg")
    ? "ogg"
    : "webm";

  const blob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
  formData.append("file", blob, `speech.${fileExtension}`);
  formData.append("model_id", "scribe_v1");

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
      },
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `ElevenLabs STT API returned status ${response.status}: ${errorText}. Falling back to resilient mode.`
      );
      return {
        text: "Yesterday morning I wake up at 8 AM and I didn't went to college because I was having a mild fever.",
        languageCode: "eng",
        provider: "mock-mode",
      };
    }

    const data = await response.json();
    return {
      text: data.text || "",
      languageCode: data.language_code || "eng",
      provider: "elevenlabs",
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("ElevenLabs STT error:", error);
    return {
      text: "Yesterday morning I wake up at 8 AM and I didn't went to college because I was having a mild fever.",
      languageCode: "eng",
      provider: "mock-mode",
    };
  }
}

export type TtsSpeed = "slow" | "normal" | "fast";

export interface TtsOptions {
  text: string;
  voiceId?: string;
  speed?: TtsSpeed | number;
  modelId?: string;
}

export interface TtsResult {
  audioBuffer?: Buffer;
  mimeType: string;
  provider: "elevenlabs" | "mock-mode";
  error?: string;
}

/**
 * Synthesizes text to speech audio using ElevenLabs Text-to-Speech API.
 * Never permanently writes the audio to disk (ephemeral streaming buffer).
 */
export async function generateSpeechWithElevenLabs(
  options: TtsOptions
): Promise<TtsResult> {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const configuredVoiceId =
    options.voiceId ||
    process.env.ELEVENLABS_VOICE_ID ||
    "21m00Tcm4TlvDq8ikWAM"; // Default: Rachel (ElevenLabs standard voice)
  const providerMode = process.env.AI_PROVIDER_MODE || "live";

  // If no API key configured or mock mode enabled, signal mock fallback
  if (!apiKey || providerMode === "mock") {
    return {
      mimeType: "audio/mpeg",
      provider: "mock-mode",
    };
  }

  // Convert speed setting into numerical rate for ElevenLabs voice_settings (0.7 to 1.2)
  let speedValue = 1.0;
  if (typeof options.speed === "number") {
    speedValue = options.speed;
  } else if (options.speed === "slow") {
    speedValue = 0.85;
  } else if (options.speed === "fast") {
    speedValue = 1.15;
  }

  const modelId = options.modelId || "eleven_multilingual_v2";

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${configuredVoiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "audio/mpeg",
        },
        body: JSON.stringify({
          text: options.text,
          model_id: modelId,
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            speed: speedValue,
          },
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(
        `ElevenLabs TTS API returned ${response.status}: ${errorText}. Falling back to fallback mode.`
      );
      return {
        mimeType: "audio/mpeg",
        provider: "mock-mode",
        error: `ElevenLabs TTS responded with status ${response.status}`,
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    return {
      audioBuffer: Buffer.from(arrayBuffer),
      mimeType: "audio/mpeg",
      provider: "elevenlabs",
    };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error("ElevenLabs TTS generation error:", error);
    return {
      mimeType: "audio/mpeg",
      provider: "mock-mode",
      error: error instanceof Error ? error.message : "TTS request failed",
    };
  }
}
