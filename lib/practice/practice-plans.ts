import { DailyMinutes, EnglishLevel } from "@/types";

export interface PracticeStepItem {
  id: "setup" | "listening" | "comprehension" | "recall" | "speaking" | "correction" | "repeat" | "completion";
  number: number;
  label: string;
  description: string;
}

export const PRACTICE_STEPS: PracticeStepItem[] = [
  { id: "setup", number: 0, label: "Session Plan", description: "Choose duration & focus" },
  { id: "listening", number: 1, label: "Listen", description: "Audio passage comprehension" },
  { id: "comprehension", number: 2, label: "Understand", description: "Quick comprehension check" },
  { id: "recall", number: 3, label: "Recall", description: "Express what you remember" },
  { id: "speaking", number: 4, label: "Speak", description: "Active speaking prompt" },
  { id: "correction", number: 5, label: "Correction", description: "4-part AI feedback" },
  { id: "repeat", number: 6, label: "Repeat", description: "Say the natural expression" },
  { id: "completion", number: 7, label: "Summary", description: "Session analysis & XP" },
];

export interface PracticePlan {
  id: string;
  title: string;
  topic: string;
  focusArea: string;
  level: EnglishLevel;
  durationMinutes: DailyMinutes;
  activitiesCount: number;
  listening: {
    title: string;
    speaker: string;
    duration: number; // in seconds
    transcript: string;
    audioNotes: string;
  };
  comprehension: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  recall: {
    prompt: string;
    keyPoints: string[];
  };
  speaking: {
    prompt: string;
    context: string;
    starterHint: string;
    simulatedTranscript: string;
  };
  correction: {
    original: string;
    corrected: string;
    why: string[];
    natural: string;
    category: string;
  };
  repeatTarget: {
    sentence: string;
    pronunciationCues: string[];
  };
}

export function generatePracticePlan(
  level: EnglishLevel = "intermediate",
  duration: DailyMinutes = 15,
  weakArea: string = "Past Tense",
  interest: string = "College & Campus Life"
): PracticePlan {
  // Generate realistic tailored plan
  const isPastTenseFocus = weakArea.toLowerCase().includes("past") || weakArea.toLowerCase().includes("tense");

  if (isPastTenseFocus) {
    return {
      id: `plan-past-tense-${duration}`,
      title: "Mastering Past Tense & Daily Routine Flow",
      topic: `${interest} & Morning Routine`,
      focusArea: "Past Tense (Did + Base Verb) & Natural Time Markers",
      level,
      durationMinutes: duration,
      activitiesCount: 5,
      listening: {
        title: "Yesterday's Campus Morning Rush",
        speaker: "Aman (AI English Voice)",
        duration: 38,
        transcript:
          "Yesterday morning, I woke up around 7:30 AM because my alarm didn't ring on time. I quickly took a shower, had a warm cup of chai with toast, and ran to catch the college shuttle. Luckily, I didn't miss my 9 o'clock lecture, but my friend Rahul arrived ten minutes late because of traffic.",
        audioNotes: "Focus on how the speaker connects events without long pauses or Hindi filler words.",
      },
      comprehension: {
        question: "Why was the speaker rushing yesterday morning?",
        options: [
          "His alarm did not ring on time, so he woke up late.",
          "He had to submit an urgent assignment before 8 AM.",
          "He missed the early morning bus to the library.",
          "His friend Rahul called him for an emergency meeting.",
        ],
        correctIndex: 0,
        explanation:
          "Correct! The speaker clearly mentioned: 'I woke up around 7:30 AM because my alarm didn't ring on time.' Notice the grammar: 'didn't ring' (base form 'ring', not 'rang').",
      },
      recall: {
        prompt:
          "Without looking back at the text, describe in your own words what happened to the speaker yesterday morning. Mention at least 2 details you remember.",
        keyPoints: [
          "Woke up at 7:30 AM because alarm failed",
          "Had chai/breakfast quickly",
          "Ran for college shuttle",
          "Reached 9 AM lecture on time, but friend was late",
        ],
      },
      speaking: {
        prompt:
          "Now speak about your own day yesterday: What time did you wake up, what did you do in the morning, and was there any challenge you faced?",
        context:
          "Aim for 2 to 4 full sentences. Try to speak without stopping to translate every word from Hindi.",
        starterHint: "Yesterday, I woke up around... and then I had...",
        simulatedTranscript:
          "Yesterday morning I wake up at 8 AM and I didn't went to college because I was having a mild fever.",
      },
      correction: {
        original: "Yesterday morning I wake up at 8 AM and I didn't went to college because I was having a mild fever.",
        corrected: "Yesterday morning I woke up at 8 AM and I didn't go to college because I had a mild fever.",
        why: [
          "Use past tense 'woke up' instead of present tense 'wake up' when talking about yesterday.",
          "After 'didn't', always use the base form of the verb: say 'didn't go', never 'didn't went'.",
          "In English, it's more natural to say 'I had a mild fever' rather than 'I was having a mild fever'.",
        ],
        natural: "Yesterday, I woke up around 8 AM but couldn't attend college because I had a mild fever.",
        category: "Past Tense & Auxiliary Verbs",
      },
      repeatTarget: {
        sentence: "Yesterday morning I woke up at 8 AM and I didn't go to college because I had a mild fever.",
        pronunciationCues: [
          "Stress 'woke up' smoothly without an unnatural pause.",
          "Say 'didn't go' with a clean, crisp 't' sound at the end of 'didn't'.",
        ],
      },
    };
  }

  // Fallback Professional / Interview Plan
  return {
    id: `plan-professional-${duration}`,
    title: "Speaking About Technical Projects Confidently",
    topic: "Career & Project Presentation",
    focusArea: "Action Verbs & Confident Introduction",
    level,
    durationMinutes: duration,
    activitiesCount: 5,
    listening: {
      title: "Introducing a Web Application",
      speaker: "Priya (AI Voice)",
      duration: 42,
      transcript:
        "Last week, our team completed the initial prototype of an AI English assistant. We chose Next.js and Tailwind CSS because they allow rapid UI development. One challenge we encountered was managing local audio state, but we solved it by designing a dedicated client store.",
      audioNotes: "Listen for strong action verbs: 'completed', 'chose', 'encountered', 'solved'.",
    },
    comprehension: {
      question: "What main technical challenge did Priya's team encounter?",
      options: [
        "Managing local audio state cleanly on the client.",
        "Choosing between Next.js and Python for the frontend.",
        "Deploying the database to AWS servers.",
        "Integrating payment gateways for subscription users.",
      ],
      correctIndex: 0,
      explanation:
        "Correct! Priya stated: 'One challenge we encountered was managing local audio state, but we solved it by designing a dedicated client store.'",
    },
    recall: {
      prompt: "What technologies did Priya mention, and what was her team's key takeaway?",
      keyPoints: ["Next.js and Tailwind CSS", "Built an AI English assistant", "Solved audio state with client store"],
    },
    speaking: {
      prompt: "Describe a project you worked on recently: What problem did it solve, and what tech stack did you pick?",
      context: "Explain in 3 to 4 sentences as if answering an interview question.",
      starterHint: "Recently, I worked on a project called... We built it using...",
      simulatedTranscript: "I am working on TalkSaathi project since 2 weeks and it help students to speak English.",
    },
    correction: {
      original: "I am working on TalkSaathi project since 2 weeks and it help students to speak English.",
      corrected: "I have been working on the TalkSaathi project for two weeks, and it helps students speak English.",
      why: [
        "Use present perfect continuous ('have been working') with 'for two weeks' to show an action started in the past and continuing now.",
        "Use 'for' with duration ('for two weeks'), not 'since' (which is for points in time like 'since Monday').",
        "Add 's' to singular verbs: 'it helps', not 'it help'.",
      ],
      natural: "For the past two weeks, I've been building TalkSaathi to help students speak English with confidence.",
      category: "Present Perfect & Subject-Verb Agreement",
    },
    repeatTarget: {
      sentence: "I have been working on the TalkSaathi project for two weeks, and it helps students speak English.",
      pronunciationCues: [
        "Contract 'I have' to 'I've' if you want to sound more conversational.",
        "Link 'helps students' smoothly without hesitation.",
      ],
    },
  };
}
