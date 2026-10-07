import { EnglishLevel, ExplanationLanguage, Mistake } from "@/types";

export interface CorrectionRequest {
  text: string;
  level?: EnglishLevel;
  explanationLanguage?: ExplanationLanguage;
  context?: string;
}

export interface MistakeDetail {
  category: Mistake["category"];
  topic: string;
  original: string;
  corrected: string;
  explanation?: string;
}

export interface CorrectionResponse {
  original: string;
  corrected: string;
  natural: string;
  explanation: string[];
  mistakes: MistakeDetail[];
  nextPracticeSuggestion: string;
  provider: "qwen-open-weight" | "mock-mode";
  modelUsed: string;
}

const TALKSAATHI_SYSTEM_PROMPT = `You are TalkSaathi AI, a warm, supportive, and culturally intelligent English-speaking companion built for an Indian learner.
Your persona:
- Friendly teacher during learning
- Natural friend during conversation
- Supportive tutor during correction
- Encouraging coach during speaking

NEVER shame, criticize, or judge the learner. Always encourage their effort.
Learners often mentally translate from Hindi, leading to patterns like:
1. Double past tense ("didn't went" -> "didn't go")
2. Missing destination prepositions ("going college" -> "going to college")
3. Literal translation of idioms/collocations ("took breakfast" -> "had breakfast")
4. Present continuous for habitual action ("I am living here since 2 years" -> "I have been living here for 2 years")

Your task:
Analyze the learner's spoken English text and return a STRICT JSON object with these exact keys:
{
  "original": string (the exact learner text),
  "corrected": string (the clean, grammatically correct version),
  "natural": string (how a fluent, native speaker would casually say this),
  "explanation": string[] (2 to 3 bullet points explaining WHY the corrections were made, tailored to the requested explanation language),
  "mistakes": [
    {
      "category": "grammar" | "vocabulary" | "sentence" | "preposition" | "tense",
      "topic": string (e.g. "Past Tense Auxiliary", "Prepositions"),
      "original": string (the error segment),
      "corrected": string (the corrected segment)
    }
  ],
  "nextPracticeSuggestion": string (a short 1-sentence prompt for what to practice next)
}

Important for "explanationLanguage":
- If "hinglish": Explain rules using a friendly mix of simple Hindi & English for fast intuition (e.g. "Jab bhi 'did' ya 'didn't' use karte hain, verb ki first form aati hai ('didn't go', na ki 'didn't went').")
- If "hindi": Explain in clear, simple Hindi.
- If "english": Explain in simple, accessible English.

Return ONLY the raw JSON object. Do not add markdown code blocks, backticks, or introductory chat.`;

/**
 * Parses and sanitizes JSON from LLM responses even if wrapped in markdown or partial text.
 */
function extractJsonFromText(rawText: string): unknown {
  const trimmed = rawText.trim();
  // Strip ```json and ``` if present
  const cleaned = trimmed.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  // Try direct parse
  try {
    return JSON.parse(cleaned);
  } catch {
    // Attempt regex match for first outer { ... }
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error("No valid JSON found in model output");
  }
}

/**
 * Intelligent deterministic mock generator used when HF_TOKEN is absent
 * or AI_PROVIDER_MODE=mock, ensuring zero downtime and offline testability.
 */
function generateDeterministicCorrection(
  text: string,
  level: EnglishLevel = "intermediate",
  explanationLanguage: ExplanationLanguage = "hinglish"
): CorrectionResponse {
  const lower = text.toLowerCase();

  // Pattern 1: didn't went / didn't came
  if (lower.includes("didn't went") || lower.includes("did not went")) {
    const isHinglish = explanationLanguage === "hinglish";
    const isHindi = explanationLanguage === "hindi";

    const explanation = isHinglish
      ? [
          "Jab bhi sentence me 'did' ya 'didn't' aata hai, uske baad hamesha base verb (first form) aati hai: say 'didn't go', na ki 'didn't went'.",
          "Kal ki baat karte waqt 'yesterday morning' ke sath main verb past me hoti hai ('woke up').",
          "Bimari ya fever ke liye 'I had a mild fever' kehna zyada natural lagta hai, 'I was having' ke mukable.",
        ]
      : isHindi
      ? [
          "'did' या 'didn't' के बाद हमेशा क्रिया का पहला रूप (base form) उपयोग होता है: 'didn't go', 'didn't went' नहीं।",
          "बीते कल के लिए 'wake up' के स्थान पर भूतकाल 'woke up' बोलें।",
          "बुखार आदि के लिए 'I had a mild fever' बोलना अधिक स्वाभाविक है।",
        ]
      : [
          "After 'did' or 'didn't', always use the base form of the verb ('didn't go', not 'didn't went').",
          "Use the past form 'woke up' when referring to yesterday.",
          "In English, it is more natural to say 'I had a mild fever' rather than 'I was having a mild fever'.",
        ];

    const nextPracticeSuggestion =
      level === "beginner"
        ? "Practice simple past tense: I woke up, I went, I didn't go."
        : "Practice 3 sentences using 'didn't + base verb' (e.g. didn't see, didn't call).";

    return {
      original: text,
      corrected: text
        .replace(/didn't went/gi, "didn't go")
        .replace(/did not went/gi, "did not go")
        .replace(/wake up/gi, "woke up")
        .replace(/was having a mild fever/gi, "had a mild fever"),
      natural:
        "Yesterday, I woke up around 8 AM but couldn't attend college because I had a mild fever.",
      explanation,
      mistakes: [
        {
          category: "grammar",
          topic: "Past Tense Auxiliary",
          original: "didn't went",
          corrected: "didn't go",
        },
        {
          category: "grammar",
          topic: "Past Time Marker",
          original: "wake up",
          corrected: "woke up",
        },
      ],
      nextPracticeSuggestion,
      provider: "mock-mode",
      modelUsed: "Qwen/Qwen2.5-7B-Instruct (Development Fallback)",
    };
  }

  // Pattern 2: take breakfast / took breakfast
  if (lower.includes("take breakfast") || lower.includes("took breakfast")) {
    const isHinglish = explanationLanguage === "hinglish";
    return {
      original: text,
      corrected: text
        .replace(/take breakfast/gi, "have breakfast")
        .replace(/took breakfast/gi, "had breakfast"),
      natural: "I usually have a quick breakfast around 8 AM before starting work.",
      explanation: isHinglish
        ? [
            "English me khane-peene ke liye 'take' ki jagah 'have' bolte hain: jaise 'have breakfast' ya 'have lunch'.",
            "Sentence ka flow natural banane ke liye 'around 8 AM' use karein.",
          ]
        : [
            "In English, we say 'have breakfast' or 'eat breakfast' rather than 'take breakfast'.",
            "Use 'around 8 AM' for a natural conversational delivery.",
          ],
      mistakes: [
        {
          category: "vocabulary",
          topic: "Collocations",
          original: "take breakfast",
          corrected: "have breakfast",
        },
      ],
      nextPracticeSuggestion: "Practice sentences with meal collocations: have coffee, have lunch.",
      provider: "mock-mode",
      modelUsed: "Qwen/Qwen2.5-7B-Instruct (Development Fallback)",
    };
  }

  // General fallback
  const isHinglish = explanationLanguage === "hinglish";
  return {
    original: text,
    corrected: text,
    natural: `In casual English: "${text}"`,
    explanation: isHinglish
      ? [
          "Aapka sentence samajh aa raha hai aur communication clear hai!",
          "Sentence me rhythm maintain karne ke liye short pauses kam karein.",
        ]
      : [
          "Your sentence is clear and conveys your intended meaning effectively.",
          "Keep focusing on natural pacing and direct expression.",
        ],
    mistakes: [],
    nextPracticeSuggestion: "Continue with the next conversation prompt to build fluency.",
    provider: "mock-mode",
    modelUsed: "Qwen/Qwen2.5-7B-Instruct (Development Fallback)",
  };
}

/**
 * Server-side caller for open-weight Qwen inference via Hugging Face.
 */
export async function correctEnglishSpeech(
  params: CorrectionRequest
): Promise<CorrectionResponse> {
  const { text, level = "intermediate", explanationLanguage = "hinglish", context = "" } = params;

  const hfToken = process.env.HF_TOKEN;
  const hfModel = process.env.HF_MODEL || "Qwen/Qwen2.5-7B-Instruct";
  const providerMode = process.env.AI_PROVIDER_MODE || "live";

  // If no token provided or explicitly in mock mode, use deterministic generator
  if (!hfToken || providerMode === "mock") {
    return generateDeterministicCorrection(text, level, explanationLanguage);
  }

  const promptUserMessage = `Learner Level: ${level}
Explanation Language: ${explanationLanguage}
Context: ${context || "Spoken daily practice"}
Learner Spoken Input: "${text}"

Please evaluate and output strictly in JSON format.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout

  try {
    // Call Hugging Face Router endpoint (OpenAI chat completions compatible)
    const response = await fetch("https://router.huggingface.co/hf-inference/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${hfToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: hfModel,
        messages: [
          { role: "system", content: TALKSAATHI_SYSTEM_PROMPT },
          { role: "user", content: promptUserMessage },
        ],
        temperature: 0.2,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Hugging Face API returned ${response.status}: ${errorText}. Falling back to resilient mode.`);
      return generateDeterministicCorrection(text, level, explanationLanguage);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("Empty response from open-weight model");
    }

    const parsed = extractJsonFromText(rawContent) as Partial<CorrectionResponse>;

    // Validate structured contract
    return {
      original: parsed.original || text,
      corrected: parsed.corrected || text,
      natural: parsed.natural || parsed.corrected || text,
      explanation: Array.isArray(parsed.explanation) && parsed.explanation.length > 0
        ? parsed.explanation
        : ["Sentence analyzed by Qwen2.5 open-weight engine."],
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
      nextPracticeSuggestion:
        parsed.nextPracticeSuggestion || "Practice saying the natural version out loud.",
      provider: "qwen-open-weight",
      modelUsed: hfModel,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    console.error("Open-weight LLM inference error:", error);
    // Graceful fallback to deterministic engine to ensure 100% uptime for user
    return generateDeterministicCorrection(text, level, explanationLanguage);
  }
}
