"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Mic,
  Volume2,
  Brain,
  Award,
  HelpCircle,
} from "lucide-react";
import { Card, HighlightCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/storage/local-storage";
import {
  PLACEMENT_QUESTIONS,
  AVAILABLE_INTERESTS,
  AVAILABLE_TOPICS,
} from "@/lib/onboarding/placement-data";
import { EnglishLevel, ExplanationLanguage, DailyMinutes } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const { state, updateState } = useAppState();

  // Wizard Step: 1 = Welcome, 2 = Profile, 3 = Self Assessment, 4 = Placement Test, 5 = Speaking Check, 6 = Results
  const [step, setStep] = React.useState(1);

  // Form State
  const [name, setName] = React.useState(state.profile.name || "");
  const [learningGoal, setLearningGoal] = React.useState(
    state.profile.learningGoal || "Speak fluently in interviews and everyday life without translating from Hindi"
  );
  const [dailyMinutes, setDailyMinutes] = React.useState<DailyMinutes>(
    state.profile.dailyMinutes || 15
  );
  const [selectedInterests, setSelectedInterests] = React.useState<string[]>(
    state.profile.interests.length > 0
      ? state.profile.interests
      : ["College & Campus Life", "Job Interviews & Careers", "Software Engineering & Tech"]
  );
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>(
    state.profile.preferredTopics.length > 0
      ? state.profile.preferredTopics
      : ["Introducing Myself Confidently", "Explaining Technical Projects"]
  );
  const [speakingGoal, setSpeakingGoal] = React.useState(
    state.profile.speakingGoal || "Overcome hesitation and stop translating mentally from Hindi"
  );
  const [explanationLanguage, setExplanationLanguage] = React.useState<ExplanationLanguage>(
    state.profile.explanationLanguage || "hinglish"
  );

  // Self assessment selection
  const [selfLevel, setSelfLevel] = React.useState<EnglishLevel>(
    state.profile.level || "intermediate"
  );

  // Placement Quiz State
  const [quizAnswers, setQuizAnswers] = React.useState<Record<string, number>>({});
  const [currentQuizIdx, setCurrentQuizIdx] = React.useState(0);

  // Speaking Assessment Simulated State
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordedDuration, setRecordedDuration] = React.useState(0);
  const [hasRecordedSample, setHasRecordedSample] = React.useState(false);

  // Calculate Quiz Score & Recommendation
  const quizScore = React.useMemo(() => {
    let correct = 0;
    PLACEMENT_QUESTIONS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    return correct;
  }, [quizAnswers]);

  const recommendedLevel: EnglishLevel = React.useMemo(() => {
    // If user answered at least 3 out of 4 correctly or self-assessed as intermediate with 2+ correct
    if (quizScore >= 3 || (selfLevel === "intermediate" && quizScore >= 2)) {
      return "intermediate";
    }
    return "beginner";
  }, [quizScore, selfLevel]);

  // Derived strong and improvement areas
  const { strongAreas, areasToImprove } = React.useMemo(() => {
    const strong: string[] = ["Listening Comprehension", "Conversational Intent"];
    const improve: string[] = [];

    if (quizAnswers["pq-1"] !== 1) {
      improve.push("Past Tense Auxiliary Verbs (e.g. didn't + base verb)");
    } else {
      strong.push("Basic Verb Tenses");
    }

    if (quizAnswers["pq-2"] !== 2) {
      improve.push("Natural Collocations (e.g. have breakfast)");
    } else {
      strong.push("Natural Collocations");
    }

    if (quizAnswers["pq-3"] !== 1) {
      improve.push("Prepositions of Movement");
    }

    if (improve.length === 0) {
      improve.push("Direct English Thinking (reducing mental translation time)");
      improve.push("Idiomatic Workplace Expressions");
    }

    return { strongAreas: strong, areasToImprove: improve };
  }, [quizAnswers]);

  // Handle Interest Toggles
  const toggleInterest = (item: string) => {
    setSelectedInterests((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  // Handle Topic Toggles
  const toggleTopic = (item: string) => {
    setSelectedTopics((prev) =>
      prev.includes(item) ? prev.filter((t) => t !== item) : [...prev, item]
    );
  };

  // Simulated Speaking Timer
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordedDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleFinishOnboarding = () => {
    const finalName = name.trim() || "Friend";

    updateState({
      profile: {
        name: finalName,
        level: recommendedLevel,
        learningGoal,
        dailyMinutes,
        interests: selectedInterests,
        preferredTopics: selectedTopics,
        speakingGoal,
        explanationLanguage,
        speechSpeed: "normal",
        hasCompletedOnboarding: true,
        createdAt: new Date().toISOString(),
      },
      lastAssessment: {
        recommendedLevel,
        quizScore,
        totalQuestions: PLACEMENT_QUESTIONS.length,
        strongAreas,
        areasToImprove,
        speakingObservation:
          recommendedLevel === "intermediate"
            ? "Good fundamental sentence structure; practice active speaking flow and eliminate past tense double-marking."
            : "Strong desire to learn; build basic sentence templates and practice listening with Hinglish explanations.",
      },
    });

    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background text-text-main flex flex-col justify-between p-6 sm:p-10 antialiased">
      {/* Top Navbar */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-200 text-primary shadow-xs ring-4 ring-lavender-100/60">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-text-main">
              TalkSaathi <span className="text-primary font-black">AI</span>
            </span>
            <span className="text-xs font-medium text-text-muted block">
              Your AI English Speaking Partner
            </span>
          </div>
        </div>

        {/* Step Counter */}
        <div className="flex items-center gap-2">
          <Badge variant="purple" className="px-3 py-1 font-semibold">
            Step {step} of 6
          </Badge>
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="max-w-3xl w-full mx-auto my-auto py-4">
        {/* Step Progress Tracker */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-text-light px-1">
            <span>Welcome</span>
            <span>Profile</span>
            <span>Self Check</span>
            <span>Placement</span>
            <span>Speaking</span>
            <span>Your Plan</span>
          </div>
          <div className="h-2 w-full rounded-full bg-border-subtle overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${(step / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* ================= STEP 1: WELCOME ================= */}
        {step === 1 && (
          <Card className="p-8 sm:p-10 space-y-8 animate-in fade-in duration-200">
            <div className="space-y-3 text-center sm:text-left">
              <Badge variant="purple" className="px-3 py-1">
                👋 Welcome to TalkSaathi AI
              </Badge>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-text-main">
                Let&apos;s improve your English speaking together.
              </h1>
              <p className="text-base text-text-muted leading-relaxed max-w-2xl">
                Do you understand English when listening or watching movies, but freeze or translate every word from Hindi when you speak? TalkSaathi gives you a friendly, non-judgmental partner to practice with every day.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle/80 space-y-2">
                <div className="h-10 w-10 rounded-xl bg-lavender-100 text-primary flex items-center justify-center font-bold">
                  🎧
                </div>
                <h4 className="font-bold text-sm text-text-main">Listen &amp; Speak</h4>
                <p className="text-xs text-text-muted">Active practice, not passive memorization.</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle/80 space-y-2">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  🌱
                </div>
                <h4 className="font-bold text-sm text-text-main">Zero Judgment</h4>
                <p className="text-xs text-text-muted">Make mistakes freely. Get gentle guidance.</p>
              </div>

              <div className="p-5 rounded-2xl bg-surface-subtle border border-border-subtle/80 space-y-2">
                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  🌉
                </div>
                <h4 className="font-bold text-sm text-text-main">Hindi Bridge</h4>
                <p className="text-xs text-text-muted">Use Hindi when stuck; graduate to English.</p>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button size="pill" onClick={() => setStep(2)} className="gap-2 px-8 font-bold text-base shadow-md">
                <span>Start Setup</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ================= STEP 2: PROFILE ================= */}
        {step === 2 && (
          <Card className="p-8 sm:p-10 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Step 2: Profile &amp; Preferences
              </span>
              <h2 className="text-2xl font-bold text-text-main">
                Tell your Saathi about yourself
              </h2>
              <p className="text-xs text-text-muted">
                Your profile helps TalkSaathi personalize conversation topics and session timing.
              </p>
            </div>

            <div className="space-y-5">
              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
                  <span>What should your Saathi call you?</span>
                  <span className="text-primary">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your first name or nickname (e.g. Rahul, Priya, Alex)"
                  className="h-12 text-base"
                />
              </div>

              {/* Daily Available Time */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main">
                  How many minutes can you practice speaking daily?
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {([10, 15, 20, 30] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setDailyMinutes(m)}
                      className={`rounded-2xl py-3 text-center border font-bold text-sm transition-all ${
                        dailyMinutes === m
                          ? "bg-primary text-white border-primary shadow-xs"
                          : "bg-surface text-text-muted border-border-subtle hover:border-lavender-300"
                      }`}
                    >
                      {m} Mins
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation Language */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main">
                  Preferred Explanation Language
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: "hinglish", label: "Hinglish (Recommended)", sub: "English + Hindi mix" },
                    { id: "english", label: "English Only", sub: "Complete immersion" },
                    { id: "hindi", label: "Hindi", sub: "Clear Hindi explanations" },
                  ].map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setExplanationLanguage(l.id as ExplanationLanguage)}
                      className={`rounded-2xl p-3 text-left border transition-all ${
                        explanationLanguage === l.id
                          ? "bg-lavender-50 border-primary ring-2 ring-lavender-200"
                          : "bg-surface border-border-subtle hover:border-lavender-300"
                      }`}
                    >
                      <span className="text-xs font-bold block text-text-main">{l.label}</span>
                      <span className="text-[10px] text-text-muted block mt-0.5">{l.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main">
                  Topics &amp; Areas of Interest (Select 2 or more)
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {AVAILABLE_INTERESTS.map((item) => {
                    const isSelected = selectedInterests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-primary text-white border-primary shadow-xs font-semibold"
                            : "bg-surface text-text-muted border-border-subtle hover:border-lavender-300"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Topics */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main">
                  Preferred Speaking Topics
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {AVAILABLE_TOPICS.map((topic) => {
                    const isSelected = selectedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => toggleTopic(topic)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium border transition-all ${
                          isSelected
                            ? "bg-lavender-200 text-primary border-primary/50 shadow-xs font-semibold"
                            : "bg-surface text-text-muted border-border-subtle hover:border-lavender-300"
                        }`}
                      >
                        {isSelected ? "✓ " : "+ "}
                        {topic}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Overall Learning Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main">
                  What is your main learning goal?
                </label>
                <Input
                  value={learningGoal}
                  onChange={(e) => setLearningGoal(e.target.value)}
                  placeholder="e.g. Speak fluently in interviews without translating from Hindi"
                />
              </div>

              {/* Speaking Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-main">
                  Specific Speaking Focus
                </label>
                <Input
                  value={speakingGoal}
                  onChange={(e) => setSpeakingGoal(e.target.value)}
                  placeholder="e.g. Overcome hesitation and past tense errors"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStep(1)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                size="pill"
                onClick={() => {
                  if (!name.trim()) {
                    alert("Please enter your name to continue.");
                    return;
                  }
                  setStep(3);
                }}
                className="gap-2 px-8 font-bold shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ================= STEP 3: SELF ASSESSMENT ================= */}
        {step === 3 && (
          <Card className="p-8 sm:p-10 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Step 3: Self Assessment
              </span>
              <h2 className="text-2xl font-bold text-text-main">
                How do you feel about your English right now?
              </h2>
              <p className="text-xs text-text-muted">
                Choose the description that fits your current speaking comfort level best.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
              <div
                onClick={() => setSelfLevel("beginner")}
                className={`cursor-pointer rounded-3xl p-6 border transition-all ${
                  selfLevel === "beginner"
                    ? "bg-lavender-50 border-primary ring-2 ring-lavender-200 shadow-sm"
                    : "bg-surface border-border-subtle hover:border-lavender-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple">Beginner Level</Badge>
                  {selfLevel === "beginner" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
                <h3 className="text-base font-bold text-text-main mb-1">
                  &ldquo;I hesitate and translate from Hindi&rdquo;
                </h3>
                <ul className="text-xs text-text-muted space-y-1.5 list-disc pl-4 mt-3">
                  <li>I understand English when someone else speaks.</li>
                  <li>When speaking, I pause to translate words in my head.</li>
                  <li>I feel shy or afraid of making grammatical errors.</li>
                </ul>
              </div>

              <div
                onClick={() => setSelfLevel("intermediate")}
                className={`cursor-pointer rounded-3xl p-6 border transition-all ${
                  selfLevel === "intermediate"
                    ? "bg-lavender-50 border-primary ring-2 ring-lavender-200 shadow-sm"
                    : "bg-surface border-border-subtle hover:border-lavender-300"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="secondary">Intermediate Level</Badge>
                  {selfLevel === "intermediate" && <CheckCircle2 className="h-5 w-5 text-primary" />}
                </div>
                <h3 className="text-base font-bold text-text-main mb-1">
                  &ldquo;I can talk, but make grammar errors&rdquo;
                </h3>
                <ul className="text-xs text-text-muted space-y-1.5 list-disc pl-4 mt-3">
                  <li>I can hold basic English conversations.</li>
                  <li>I often make mistakes with past tenses and prepositions.</li>
                  <li>I want to sound more natural and professional.</li>
                </ul>
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStep(2)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button size="pill" onClick={() => setStep(4)} className="gap-2 px-8 font-bold shadow-md">
                <span>Start Placement Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ================= STEP 4: PLACEMENT TEST ================= */}
        {step === 4 && (
          <Card className="p-8 sm:p-10 space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Step 4: Quick Placement Test
                </span>
                <h2 className="text-2xl font-bold text-text-main">
                  Question {currentQuizIdx + 1} of {PLACEMENT_QUESTIONS.length}
                </h2>
              </div>
              <Badge variant="purple">
                Topic: {PLACEMENT_QUESTIONS[currentQuizIdx].topic}
              </Badge>
            </div>

            {/* Question Card */}
            <div className="space-y-4 pt-2">
              <p className="text-base font-semibold text-text-main leading-relaxed">
                {PLACEMENT_QUESTIONS[currentQuizIdx].question}
              </p>

              <div className="space-y-2.5">
                {PLACEMENT_QUESTIONS[currentQuizIdx].options.map((option, optIdx) => {
                  const isSelected =
                    quizAnswers[PLACEMENT_QUESTIONS[currentQuizIdx].id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() =>
                        setQuizAnswers((prev) => ({
                          ...prev,
                          [PLACEMENT_QUESTIONS[currentQuizIdx].id]: optIdx,
                        }))
                      }
                      className={`w-full flex items-center gap-3.5 rounded-2xl p-4 text-left border transition-all ${
                        isSelected
                          ? "bg-lavender-50 border-primary ring-2 ring-lavender-200 shadow-xs"
                          : "bg-surface border-border-subtle hover:border-lavender-300"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full flex items-center justify-center border text-xs font-bold shrink-0 ${
                          isSelected
                            ? "bg-primary border-primary text-white"
                            : "border-border-subtle text-text-muted"
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="text-sm font-medium text-text-main leading-snug">
                        {option}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quiz Navigation */}
            <div className="pt-6 flex items-center justify-between border-t border-border-subtle">
              <Button
                variant="ghost"
                size="pill"
                onClick={() => {
                  if (currentQuizIdx > 0) {
                    setCurrentQuizIdx((prev) => prev - 1);
                  } else {
                    setStep(3);
                  }
                }}
                className="gap-1.5"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>

              {currentQuizIdx < PLACEMENT_QUESTIONS.length - 1 ? (
                <Button
                  size="pill"
                  onClick={() => setCurrentQuizIdx((prev) => prev + 1)}
                  disabled={quizAnswers[PLACEMENT_QUESTIONS[currentQuizIdx].id] === undefined}
                  className="gap-2 px-7 font-bold"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="pill"
                  onClick={() => setStep(5)}
                  disabled={quizAnswers[PLACEMENT_QUESTIONS[currentQuizIdx].id] === undefined}
                  className="gap-2 px-8 font-bold shadow-md"
                >
                  <span>Continue to Speaking Check</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* ================= STEP 5: SPEAKING ASSESSMENT ================= */}
        {step === 5 && (
          <Card className="p-8 sm:p-10 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Step 5: Speaking Check
              </span>
              <h2 className="text-2xl font-bold text-text-main">
                Try speaking a short sample
              </h2>
              <p className="text-xs text-text-muted">
                Describe your morning routine in 2 or 3 simple English sentences.
              </p>
            </div>

            {/* Speaking Prompt Card */}
            <div className="rounded-3xl border border-lavender-200 bg-lavender-50 p-6 space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Volume2 className="h-4 w-4" />
                <span>Sample Prompt</span>
              </div>
              <p className="text-sm font-semibold text-text-main italic">
                &ldquo;Tell me what time you usually wake up, what you have for breakfast, and what you do next.&rdquo;
              </p>
            </div>

            {/* Recording Interface Placeholder */}
            <div className="rounded-3xl border border-border-subtle bg-surface-subtle p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div
                onClick={() => {
                  if (!isRecording) {
                    setIsRecording(true);
                    setHasRecordedSample(true);
                  } else {
                    setIsRecording(false);
                  }
                }}
                className={`cursor-pointer flex h-20 w-20 items-center justify-center rounded-full transition-all ${
                  isRecording
                    ? "bg-red-600 text-white ring-8 ring-red-100 animate-pulse"
                    : "bg-primary text-white hover:bg-primary-hover ring-8 ring-lavender-100 shadow-md"
                }`}
              >
                <Mic className="h-9 w-9" />
              </div>

              <div>
                <h4 className="text-base font-bold text-text-main">
                  {isRecording ? "Listening to your voice..." : hasRecordedSample ? "Audio Sample Captured ✓" : "Click Microphone to Record"}
                </h4>
                <p className="text-xs text-text-muted mt-1">
                  {isRecording
                    ? `Recording: 00:0${recordedDuration}`
                    : hasRecordedSample
                    ? "Sample recorded (approx 8 seconds). Ready to generate your plan!"
                    : "Take a deep breath and speak freely. There is no right or wrong answer."}
                </p>
              </div>

              {isRecording && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsRecording(false)}
                  className="rounded-full text-xs font-semibold"
                >
                  Stop Recording
                </Button>
              )}
            </div>

            {/* Note on real AI analysis */}
            <div className="flex items-start gap-2.5 px-2 text-xs text-text-muted">
              <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Note:</strong> In this MVP onboarding step, we simulate the state flow and UI. Full live ElevenLabs STT will be connected in Phase 6.
              </span>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStep(4)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button
                size="pill"
                onClick={() => setStep(6)}
                className="gap-2 px-8 font-bold shadow-md"
              >
                <span>View My Recommended Level</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ================= STEP 6: RECOMMENDED LEVEL & PLAN ================= */}
        {step === 6 && (
          <Card className="p-8 sm:p-10 space-y-8 animate-in fade-in duration-200">
            <div className="space-y-2 text-center sm:text-left">
              <Badge variant="purple" className="px-3 py-1 font-bold">
                🎉 Assessment Complete
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-text-main">
                Here is your personalized speaking plan, {name}!
              </h2>
              <p className="text-xs text-text-muted">
                Based on your quiz performance ({quizScore} / {PLACEMENT_QUESTIONS.length} correct) and self assessment.
              </p>
            </div>

            {/* Level Recommendation Banner */}
            <HighlightCard className="p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Calibrated English Level
                  </span>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-black text-text-main capitalize">
                      {recommendedLevel} Learner
                    </h3>
                    <Badge variant={recommendedLevel === "intermediate" ? "secondary" : "purple"}>
                      Ready for Daily Practice
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted mt-1">
                    Your daily practice sessions will automatically adapt to this difficulty.
                  </p>
                </div>

                <div className="text-right sm:text-right shrink-0">
                  <span className="text-xs font-bold text-text-light block">Daily Commitment</span>
                  <span className="text-lg font-black text-primary">{dailyMinutes} Mins / day</span>
                </div>
              </div>
            </HighlightCard>

            {/* Strong Areas & Areas to Improve */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Strong Areas */}
              <div className="rounded-3xl border border-border-subtle bg-surface p-6 space-y-3">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <Award className="h-5 w-5 text-emerald-600" />
                  <h4>Strong Areas</h4>
                </div>
                <div className="space-y-2">
                  {strongAreas.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-text-main font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Areas to Improve */}
              <div className="rounded-3xl border border-border-subtle bg-surface p-6 space-y-3">
                <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
                  <Brain className="h-5 w-5 text-amber-600" />
                  <h4>Areas to Improve</h4>
                </div>
                <div className="space-y-2">
                  {areasToImprove.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-text-main font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ready to go */}
            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStep(5)} className="gap-1.5">
                <ArrowLeft className="h-4 w-4" />
                <span>Review Assessment</span>
              </Button>
              <Button
                size="pill"
                onClick={handleFinishOnboarding}
                className="gap-2.5 px-8 font-bold text-base shadow-md"
              >
                <span>Go to My Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-text-light py-4">
        TalkSaathi AI • Built for a Friend • Hacktoberfest Weekend Challenge 2026
      </footer>
    </div>
  );
}
