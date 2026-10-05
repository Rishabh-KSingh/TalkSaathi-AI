export type EnglishLevel = "beginner" | "intermediate";

export type ExplanationLanguage = "english" | "hindi" | "hinglish";

export type SpeechSpeed = "slow" | "normal" | "fast";

export type DailyMinutes = 10 | 15 | 20 | 30;

export interface UserProfile {
  name: string;
  level: EnglishLevel;
  learningGoal: string;
  dailyMinutes: DailyMinutes;
  interests: string[];
  preferredTopics: string[];
  speakingGoal: string;
  explanationLanguage: ExplanationLanguage;
  voiceId?: string;
  speechSpeed: SpeechSpeed;
  hasCompletedOnboarding: boolean;
  createdAt: string;
}

export interface Mistake {
  id: string;
  category: "grammar" | "vocabulary" | "pronunciation" | "fluency" | "sentence";
  topic: string;
  original: string;
  corrected: string;
  explanation: string;
  count: number;
  lastSeen: string;
}

export interface PracticeSession {
  id: string;
  date: string;
  durationMinutes: number;
  activities: string[];
  completed: boolean;
  scores?: {
    grammar?: number;
    fluency?: number;
    vocabulary?: number;
    clarity?: number;
  };
  mistakesFound: string[];
}

export interface SkillProgress {
  speaking: number;
  listening: number;
  grammar: number;
  vocabulary: number;
  pronunciation?: number;
  fluency: number;
}

export interface PhraseItem {
  id: string;
  phrase: string;
  meaning: string;
  example?: string;
  category: string;
  practiced: boolean;
  savedAt: string;
}

export interface TodayGoal {
  targetMinutes: number;
  completedMinutes: number;
  targetActivities: number;
  completedActivities: number;
  focusArea: string;
  completed: boolean;
}

export interface PlacementQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  topic: string;
  explanation: string;
}

export interface AssessmentResult {
  recommendedLevel: EnglishLevel;
  quizScore: number;
  totalQuestions: number;
  strongAreas: string[];
  areasToImprove: string[];
  speakingObservation: string;
}

export interface AppState {
  version: string;
  profile: UserProfile;
  progress: SkillProgress;
  mistakes: Mistake[];
  sessions: PracticeSession[];
  phrases: PhraseItem[];
  streak: number;
  xp: number;
  confidenceScore: number;
  todayGoal: TodayGoal;
  lastAssessment?: AssessmentResult;
}
