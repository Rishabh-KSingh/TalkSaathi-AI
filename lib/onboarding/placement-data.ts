import { PlacementQuestion } from "@/types";

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: "pq-1",
    question: "Which of the following sentences is grammatically correct?",
    options: [
      "Yesterday I didn't went to the lecture.",
      "Yesterday I didn't go to the lecture.",
      "Yesterday I was not go to the lecture.",
      "Yesterday I am not going to the lecture.",
    ],
    correctIndex: 1,
    topic: "Past Tense Auxiliaries",
    explanation: "After 'did' or 'didn't', the verb remains in its base form ('go', not 'went').",
  },
  {
    id: "pq-2",
    question: "Choose the natural English way to describe your morning meal:",
    options: [
      "I usually take my breakfast around 8:30 AM.",
      "I usually do breakfast around 8:30 AM.",
      "I usually have breakfast around 8:30 AM.",
      "I usually intake breakfast around 8:30 AM.",
    ],
    correctIndex: 2,
    topic: "Natural Collocations",
    explanation: "In modern English, we say 'have breakfast' or 'eat breakfast', never 'take/do breakfast'.",
  },
  {
    id: "pq-3",
    question: "Complete the sentence: 'He is traveling ___ Mumbai for an interview tomorrow.'",
    options: ["in", "to", "at", "for"],
    correctIndex: 1,
    topic: "Prepositions of Movement",
    explanation: "We use 'to' to indicate movement or direction toward a destination.",
  },
  {
    id: "pq-4",
    question: "Which sentence sounds most natural when asking someone to clarify their point?",
    options: [
      "Say it again from start.",
      "Could you elaborate on that point, please?",
      "Repeat what you said just now.",
      "Tell me more about this immediately.",
    ],
    correctIndex: 1,
    topic: "Conversational Politeness",
    explanation: "'Could you elaborate on that?' is a polite, professional way to request clarification.",
  },
];

export const AVAILABLE_INTERESTS = [
  "Software Engineering & Tech",
  "College & Campus Life",
  "Job Interviews & Careers",
  "Startups & Business",
  "Movies & Web Series",
  "Cricket & Sports",
  "Travel & Food",
  "Daily Routines & Habits",
];

export const AVAILABLE_TOPICS = [
  "Introducing Myself Confidently",
  "Explaining Technical Projects",
  "Answering Behavioral Interview Questions",
  "Casual Conversations with Peers",
  "Ordering at Restaurants & Travel",
  "Overcoming Hesitation when Speaking",
];
