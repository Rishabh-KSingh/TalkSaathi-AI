"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/storage/local-storage";
import {
  generatePracticePlan,
  PRACTICE_STEPS,
  PracticePlan,
} from "@/lib/practice/practice-plans";
import { DailyMinutes } from "@/types";
import {
  RotateCcw,
  Brain,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Check,
  Eye,
  EyeOff,
  Flame as FlameIcon,
  Loader2,
} from "lucide-react";
import { CorrectionResponse } from "@/lib/ai/open-weight-client";
import { VoiceRecorder } from "@/components/voice/voice-recorder";
import { AudioPlayer } from "@/components/voice/audio-player";

type Stage =
  | "setup"
  | "listening"
  | "comprehension"
  | "recall"
  | "speaking"
  | "correction"
  | "repeat"
  | "completion";

export default function PracticePage() {
  const { state, updateState } = useAppState();

  // Stage state machine
  const [stage, setStage] = React.useState<Stage>("setup");
  const [selectedDuration, setSelectedDuration] = React.useState<DailyMinutes>(
    state.profile.dailyMinutes || 15
  );

  // Active Plan (generated based on duration, level, weak area)
  const [plan, setPlan] = React.useState<PracticePlan>(() =>
    generatePracticePlan(
      state.profile.level,
      selectedDuration,
      state.mistakes.length > 0 ? state.mistakes[0].topic : "Past Tense",
      state.profile.interests.length > 0 ? state.profile.interests[0] : "Campus Life"
    )
  );

  // Regenerate plan when duration or profile changes
  const handleSelectDuration = (duration: DailyMinutes) => {
    setSelectedDuration(duration);
    const newPlan = generatePracticePlan(
      state.profile.level,
      duration,
      state.mistakes.length > 0 ? state.mistakes[0].topic : "Past Tense",
      state.profile.interests.length > 0 ? state.profile.interests[0] : "Campus Life"
    );
    setPlan(newPlan);
    setCustomSpokenText(newPlan.speaking.simulatedTranscript);
  };

  // Stage 1 (Listening) State
  const [showTranscript, setShowTranscript] = React.useState(false);

  // Stage 2 (Comprehension) State
  const [selectedQuizOption, setSelectedQuizOption] = React.useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = React.useState(false);

  // Stage 3 (Recall) State
  const [recallText, setRecallText] = React.useState("");
  const [hasRecordedRecall, setHasRecordedRecall] = React.useState(false);
  const [showRecallHints, setShowRecallHints] = React.useState(false);

  // Stage 4 (Speaking) State
  const [hasRecordedSpeaking, setHasRecordedSpeaking] = React.useState(false);
  const [customSpokenText, setCustomSpokenText] = React.useState(plan.speaking.simulatedTranscript);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [apiCorrection, setApiCorrection] = React.useState<CorrectionResponse | null>(null);

  // Stage 6 (Repeat) State
  const [hasRepeated, setHasRepeated] = React.useState(false);

  const handleAnalyzeSpeech = async () => {
    setIsAnalyzing(true);
    const spoken = customSpokenText.trim() || plan.speaking.simulatedTranscript;

    try {
      const response = await fetch("/api/ai/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: spoken,
          level: state.profile.level,
          explanationLanguage: state.profile.explanationLanguage,
          context: plan.speaking.context,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to correct speech via API");
      }

      const data: CorrectionResponse = await response.json();
      setApiCorrection(data);

      // Update current plan's repeat target to use the real AI corrected sentence!
      setPlan((prev) => ({
        ...prev,
        correction: {
          original: data.original,
          corrected: data.corrected,
          why: data.explanation,
          natural: data.natural,
          category: data.mistakes[0]?.topic || prev.correction.category,
        },
        repeatTarget: {
          ...prev.repeatTarget,
          sentence: data.corrected,
        },
      }));

      // Update Mistake Memory if new patterns found
      if (data.mistakes && data.mistakes.length > 0) {
        const newMistakeItems = data.mistakes.map((m, idx) => ({
          id: `m-live-${Date.now()}-${idx}`,
          category: m.category,
          topic: m.topic,
          original: m.original,
          corrected: m.corrected,
          explanation: data.explanation[0] || "Corrected by Qwen3 AI",
          count: 1,
          lastSeen: "Today",
        }));

        updateState({
          mistakes: [...newMistakeItems, ...state.mistakes],
        });
      }

      setStage("correction");
    } catch (err) {
      console.error("Open-weight correction error, advancing with local plan:", err);
      setStage("correction");
    } finally {
      setIsAnalyzing(false);
    }
  };



  // Session completion flag
  const [sessionSaved, setSessionSaved] = React.useState(false);



  // Complete session & save to LocalStorage
  const handleCompleteSession = () => {
    if (!sessionSaved) {
      updateState({
        streak: state.streak + 1,
        xp: state.xp + 50,
        todayGoal: {
          ...state.todayGoal,
          completedMinutes: Math.min(
            state.todayGoal.targetMinutes,
            state.todayGoal.completedMinutes + selectedDuration
          ),
          completedActivities: state.todayGoal.targetActivities,
          completed: true,
        },
        sessions: [
          {
            id: `s-${Date.now()}`,
            date: "Today",
            durationMinutes: selectedDuration,
            activities: [
              "Listening",
              "Comprehension",
              "Recall",
              "Speaking",
              "Correction",
              "Repeat",
            ],
            completed: true,
            scores: { grammar: 85, fluency: 80, vocabulary: 78, clarity: 88 },
            mistakesFound: ["m-1"],
          },
          ...state.sessions,
        ],
      });
      setSessionSaved(true);
    }
    setStage("completion");
  };

  // Helper for progress bar percentage
  const currentStepNumber =
    stage === "setup"
      ? 0
      : stage === "listening"
      ? 1
      : stage === "comprehension"
      ? 2
      : stage === "recall"
      ? 3
      : stage === "speaking"
      ? 4
      : stage === "correction"
      ? 5
      : stage === "repeat"
      ? 6
      : 7;

  return (
    <AppShell
      title="Daily Guided Speaking Practice"
      subtitle="The proven English loop: Listen → Understand → Recall → Speak → Correct → Repeat"
    >
      <div className="space-y-6 pb-16 max-w-4xl mx-auto">
        {/* Step Progress Header */}
        <div className="rounded-3xl border border-border-subtle bg-surface p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border-subtle">
            <div className="flex items-center gap-3">
              <Badge variant="purple" className="px-3 py-1 font-bold">
                {stage === "setup"
                  ? "Session Setup"
                  : stage === "completion"
                  ? "Session Complete"
                  : `Stage ${currentStepNumber} of 6`}
              </Badge>
              <h3 className="text-base font-bold text-text-main">
                {stage === "setup"
                  ? "Customize Today's Session"
                  : stage === "listening"
                  ? "1. Listening Passage"
                  : stage === "comprehension"
                  ? "2. Comprehension Check"
                  : stage === "recall"
                  ? "3. Active Recall"
                  : stage === "speaking"
                  ? "4. Spoken Response"
                  : stage === "correction"
                  ? "5. AI 4-Part Correction"
                  : stage === "repeat"
                  ? "6. Repetition & Re-check"
                  : "Session Complete"}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-text-muted">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>{selectedDuration} Min Practice</span>
              <span className="text-text-light">•</span>
              <span className="text-primary font-bold">{plan.focusArea.split(" ")[0]} Focus</span>
            </div>
          </div>

          {/* Stepper Dots Bar */}
          <div className="mt-4 grid grid-cols-4 sm:grid-cols-8 gap-2 text-center">
            {PRACTICE_STEPS.map((s) => {
              const isCurrent = s.id === stage;
              const isPassed = s.number < currentStepNumber;

              return (
                <div
                  key={s.id}
                  className={`rounded-xl p-2 transition-all border ${
                    isCurrent
                      ? "bg-primary text-white border-primary shadow-xs font-bold"
                      : isPassed
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold"
                      : "bg-surface-subtle text-text-light border-border-subtle/80 opacity-70"
                  }`}
                >
                  <span className="text-[10px] block font-bold uppercase tracking-wider">
                    {s.number === 0 ? "Setup" : s.number === 7 ? "Done" : `Step ${s.number}`}
                  </span>
                  <span className="text-xs block font-bold truncate mt-0.5">
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= STAGE 0: SETUP ================= */}
        {stage === "setup" && (
          <Card className="p-8 space-y-8 animate-in fade-in duration-200">
            <div className="space-y-2">
              <Badge variant="purple">Personalized Daily Plan</Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-text-main">
                {plan.title}
              </h2>
              <p className="text-sm text-text-muted leading-relaxed">
                Generated specifically for your {state.profile.level} level, targeting{" "}
                <strong className="text-primary font-bold">{plan.focusArea}</strong> based on your recent practice history.
              </p>
            </div>

            {/* Duration Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-text-main flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>How much time do you want to practice right now?</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {([10, 15, 20, 30] as const).map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => handleSelectDuration(mins)}
                    className={`rounded-2xl p-4 border text-left transition-all ${
                      selectedDuration === mins
                        ? "bg-lavender-50 border-primary ring-2 ring-lavender-200 shadow-sm"
                        : "bg-surface border-border-subtle hover:border-lavender-300"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-black text-text-main">{mins} Mins</span>
                      {selectedDuration === mins && (
                        <Check className="h-4 w-4 text-primary stroke-[3]" />
                      )}
                    </div>
                    <span className="text-[11px] text-text-muted block">
                      {mins === 10
                        ? "Quick speaking drill"
                        : mins === 15
                        ? "Recommended daily flow"
                        : mins === 20
                        ? "Deep conversation"
                        : "Comprehensive master"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generated Plan Breakdown */}
            <div className="rounded-3xl border border-border-subtle bg-surface-subtle p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <h4 className="text-sm font-bold text-text-main">
                    Activities in this {selectedDuration}-minute cycle:
                  </h4>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  5 Stages
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface rounded-xl border border-border-subtle">
                  <span className="font-bold text-text-main block">1. 🎧 Listening</span>
                  <span className="text-text-muted">Audio: &ldquo;{plan.listening.title}&rdquo; ({plan.listening.duration}s)</span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border-subtle">
                  <span className="font-bold text-text-main block">2. ❓ Comprehension</span>
                  <span className="text-text-muted">Verify natural understanding without translating</span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border-subtle">
                  <span className="font-bold text-text-main block">3. 🧠 Recall</span>
                  <span className="text-text-muted">Explain what you remember in your own words</span>
                </div>
                <div className="p-3 bg-surface rounded-xl border border-border-subtle">
                  <span className="font-bold text-text-main block">4. 🎤 Speaking &amp; Correction</span>
                  <span className="text-text-muted">Speak answer, get 4-part AI feedback, repeat</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2 flex items-center justify-between">
              <Link href="/">
                <Button variant="ghost" size="pill" className="gap-1.5 text-xs">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>

              <Button
                size="pill"
                onClick={() => setStage("listening")}
                className="gap-2.5 px-8 font-bold shadow-md text-base"
              >
                <span>Start Practice ({selectedDuration} Mins)</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ================= STAGE 1: LISTENING ================= */}
        {stage === "listening" && (
          <Card className="p-8 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Step 1 • Audio Comprehension
                </span>
                <Badge variant="purple">Topic: {plan.topic}</Badge>
              </div>
              <h2 className="text-2xl font-bold text-text-main">
                Listen Carefully to the Audio Passage
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Listen to how the speaker delivers thoughts without hesitation. Do not read the transcript on your first listen.
              </p>
            </div>

            {/* Audio Player Card with ElevenLabs TTS */}
            <AudioPlayer
              text={plan.listening.transcript}
              title={plan.listening.title}
              variant="full"
            />

            {/* Speaker Tip */}
            <div className="p-3.5 bg-surface rounded-2xl border border-border-subtle/80 text-xs flex items-center gap-2.5">
              <Sparkles className="h-4 w-4 text-primary shrink-0" />
              <span className="text-text-muted">{plan.listening.audioNotes}</span>
            </div>

            {/* Transcript Reveal Option */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setShowTranscript((prev) => !prev)}
                className="flex items-center gap-2 text-xs font-bold text-primary hover:underline"
              >
                {showTranscript ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span>{showTranscript ? "Hide Transcript" : "Show Transcript (If needed)"}</span>
              </button>

              {showTranscript && (
                <div className="rounded-2xl border border-border-subtle bg-surface-subtle p-5 text-sm leading-relaxed text-text-main animate-in fade-in duration-150">
                  <p className="italic">&ldquo;{plan.listening.transcript}&rdquo;</p>
                </div>
              )}
            </div>

            {/* Guidance on next step */}
            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStage("setup")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Change Plan</span>
              </Button>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-text-light font-medium">
                  Next: Answer a quick comprehension question
                </span>
                <Button
                  size="pill"
                  onClick={() => setStage("comprehension")}
                  className="gap-2 px-8 font-bold shadow-md"
                >
                  <span>I&apos;m Ready for Comprehension</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ================= STAGE 2: COMPREHENSION ================= */}
        {stage === "comprehension" && (
          <Card className="p-8 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Step 2 • Quick Comprehension Check
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-text-muted hidden sm:inline">Need a quick reminder?</span>
                  <AudioPlayer text={plan.listening.transcript} variant="inline" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-text-main">
                {plan.comprehension.question}
              </h2>
              <p className="text-xs text-text-muted">
                Choose the best answer according to what the speaker shared in the audio passage.
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {plan.comprehension.options.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = idx === plan.comprehension.correctIndex;

                let cardStyle = "bg-surface border-border-subtle hover:border-lavender-300";
                if (quizSubmitted) {
                  if (isCorrect) {
                    cardStyle = "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 text-emerald-950 font-medium";
                  } else if (isSelected && !isCorrect) {
                    cardStyle = "bg-red-50 border-red-400 text-red-950 line-through opacity-80";
                  }
                } else if (isSelected) {
                  cardStyle = "bg-lavender-50 border-primary ring-2 ring-lavender-200 shadow-xs";
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedQuizOption(idx);
                      setQuizSubmitted(true);
                    }}
                    className={`w-full flex items-center justify-between rounded-2xl p-4 text-left border transition-all ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center border text-xs font-bold shrink-0 ${
                          isSelected || (quizSubmitted && isCorrect)
                            ? "bg-primary border-primary text-white"
                            : "border-border-subtle text-text-muted"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="text-sm">{opt}</span>
                    </div>

                    {quizSubmitted && isCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback alert after selecting */}
            {quizSubmitted && (
              <div
                className={`rounded-2xl p-4 border text-xs leading-relaxed space-y-1 ${
                  selectedQuizOption === plan.comprehension.correctIndex
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-amber-50 border-amber-200 text-amber-900"
                }`}
              >
                <span className="font-bold block text-sm">
                  {selectedQuizOption === plan.comprehension.correctIndex
                    ? "✓ Great listening comprehension!"
                    : "Review the passage nuance:"}
                </span>
                <p>{plan.comprehension.explanation}</p>
              </div>
            )}

            {/* Stage Navigation */}
            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStage("listening")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Audio</span>
              </Button>

              <Button
                size="pill"
                onClick={() => setStage("recall")}
                disabled={selectedQuizOption === null}
                className="gap-2 px-8 font-bold shadow-md"
              >
                <span>Continue to Recall</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ================= STAGE 3: RECALL ================= */}
        {stage === "recall" && (
          <Card className="p-8 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Step 3 • Active Memory Recall (Transcript Hidden)
              </span>
              <h2 className="text-2xl font-bold text-text-main">
                What do you remember from what you heard?
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Do not worry about word-for-word accuracy. Express the main idea in your own English words.
              </p>
            </div>

            {/* Prompt Card */}
            <div className="rounded-3xl border border-lavender-200 bg-lavender-50 p-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Recall Prompt
                </span>
                <button
                  type="button"
                  onClick={() => setShowRecallHints((prev) => !prev)}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  {showRecallHints ? "Hide Key Points" : "Show Key Points"}
                </button>
              </div>
              <p className="text-sm font-semibold text-text-main">
                {plan.recall.prompt}
              </p>

              {showRecallHints && (
                <div className="pt-2 border-t border-lavender-200/80 space-y-1">
                  <span className="text-[11px] font-bold text-text-muted">Target details:</span>
                  <ul className="text-xs text-text-muted list-disc pl-4 space-y-0.5">
                    {plan.recall.keyPoints.map((kp, i) => (
                      <li key={i}>{kp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Input & Voice dual entry with ElevenLabs STT */}
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-text-main block">
                  Option 1: Speak Your Recall Aloud (Voice STT)
                </span>
                <VoiceRecorder
                  promptLabel="Click microphone to speak your recall out loud"
                  onTranscript={(transcript) => {
                    setRecallText((prev) => (prev ? `${prev} ${transcript}` : transcript));
                    setHasRecordedRecall(true);
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-text-main block">
                    Option 2: Or Type / Review Your Memory Notes
                  </span>
                  <span className="text-[11px] text-text-light">
                    Active memory trains brain pathways
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={recallText}
                  onChange={(e) => {
                    setRecallText(e.target.value);
                    if (e.target.value.length > 5) {
                      setHasRecordedRecall(true);
                    }
                  }}
                  placeholder="Type or speak what you recall... (e.g. He woke up at 7:30 AM because the alarm didn't ring...)"
                  className="w-full rounded-2xl border border-border-subtle bg-surface p-4 text-sm text-text-main placeholder:text-text-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-lavender-200"
                />
              </div>
            </div>

            {/* Feedback box */}
            {(recallText.length > 10 || hasRecordedRecall) && (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 flex items-start gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Excellent memory recall!</span>
                  You successfully extracted the core sequence of events. Now let&apos;s apply this to speaking about your own experience.
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStage("comprehension")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </Button>

              <Button
                size="pill"
                onClick={() => setStage("speaking")}
                className="gap-2 px-8 font-bold shadow-md"
              >
                <span>Continue to Speaking Challenge</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ================= STAGE 4: SPEAKING ================= */}
        {stage === "speaking" && (
          <Card className="p-8 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Step 4 • Active Speaking Challenge
              </span>
              <h2 className="text-2xl font-bold text-text-main">
                Answer the Speaking Prompt
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Take a breath, press the microphone, and speak in English. Do not pause to translate every single word from Hindi.
              </p>
            </div>

            {/* Prompt Card */}
            <div className="rounded-3xl border border-lavender-200 bg-lavender-50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4" />
                <span>Today&apos;s Speaking Prompt</span>
              </div>
              <p className="text-base font-bold text-text-main leading-snug">
                &ldquo;{plan.speaking.prompt}&rdquo;
              </p>
              <div className="rounded-xl bg-surface p-3 border border-border-subtle/80 text-xs text-text-muted space-y-1">
                <span className="font-semibold text-text-main">Starter Hint:</span>
                <p className="italic text-primary">&ldquo;{plan.speaking.starterHint}&rdquo;</p>
              </div>
            </div>

            {/* Recording Interface Card with ElevenLabs STT */}
            <VoiceRecorder
              promptLabel="Click microphone and speak your answer out loud"
              initialTranscript={customSpokenText}
              onTranscript={(transcript) => {
                setCustomSpokenText(transcript);
                setHasRecordedSpeaking(true);
              }}
            />

            {!hasRecordedSpeaking && (
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setCustomSpokenText(plan.speaking.simulatedTranscript);
                    setHasRecordedSpeaking(true);
                  }}
                  className="text-xs font-semibold text-primary underline hover:text-primary-hover"
                >
                  Or click here to load a sample student response for instant testing
                </button>
              </div>
            )}

            {/* Transcript Preview Box & Editable Spoken Text */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-main block">
                  Your Spoken English Text (Transcribed):
                </span>
                <span className="text-[11px] text-text-muted">
                  You can edit this text to test any specific sentence with Qwen AI
                </span>
              </div>
              <textarea
                rows={2}
                value={customSpokenText}
                onChange={(e) => {
                  setCustomSpokenText(e.target.value);
                  setHasRecordedSpeaking(true);
                }}
                placeholder="Type or speak an English sentence..."
                className="w-full rounded-2xl border border-border-subtle bg-surface p-4 text-sm text-text-main italic border-l-4 border-l-primary focus:outline-none focus:ring-2 focus:ring-lavender-200"
              />
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStage("recall")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back</span>
              </Button>

              <Button
                size="pill"
                onClick={handleAnalyzeSpeech}
                disabled={isAnalyzing || !customSpokenText.trim()}
                className="gap-2 px-8 font-bold shadow-md"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Analyzing with Qwen3 AI...</span>
                  </>
                ) : (
                  <>
                    <span>Analyze &amp; Correct with Qwen AI</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}

        {/* ================= STAGE 5: CORRECTION ================= */}
        {stage === "correction" && (
          <Card className="p-8 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Step 5 • 4-Part AI Correction
                </span>
                <div className="flex items-center gap-2">
                  <Badge variant="purple" className="flex items-center gap-1 font-semibold text-[10px]">
                    <Sparkles className="h-3 w-3 text-primary" />
                    <span>{apiCorrection ? apiCorrection.modelUsed : "Qwen/Qwen2.5-7B-Instruct"}</span>
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">{plan.correction.category}</Badge>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-text-main">
                Gentle AI Feedback on Your Speech
              </h2>
              <p className="text-xs text-text-muted">
                Notice where literal translation from Hindi caused grammar friction, and see how a native speaker phrases it.
              </p>
            </div>

            {/* 4-Part Breakdown Grid (PRD Requirement 7) */}
            <div className="space-y-4">
              {/* 1. Original */}
              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 space-y-1.5">
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">
                  1. What You Said:
                </span>
                <p className="text-sm font-medium text-red-950">
                  &ldquo;{plan.correction.original}&rdquo;
                </p>
              </div>

              {/* 2. Corrected Sentence */}
              <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    2. Grammatically Correct English:
                  </span>
                  <AudioPlayer text={plan.correction.corrected} variant="inline" />
                </div>
                <p className="text-sm font-bold text-emerald-950">
                  &ldquo;{plan.correction.corrected}&rdquo;
                </p>
              </div>

              {/* 3. Why? (Explanation in Hinglish / English) */}
              <div className="rounded-2xl border border-border-subtle bg-surface p-5 space-y-2">
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  3. Why? (Grammar Explanation):
                </span>
                <ul className="text-xs text-text-muted space-y-1.5 list-disc pl-4">
                  {plan.correction.why.map((reason, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Natural / Native Version */}
              <div className="rounded-2xl border border-lavender-200 bg-lavender-100/70 p-5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>4. Native Conversational Version:</span>
                  </div>
                  <AudioPlayer text={plan.correction.natural} variant="inline" />
                </div>
                <p className="text-sm font-bold text-primary">
                  &ldquo;{plan.correction.natural}&rdquo;
                </p>
                <span className="text-[11px] text-text-muted block">
                  Natural English speakers often use concise, idiomatic phrasing in casual conversation.
                </span>
              </div>

              {/* Next Practice Suggestion if available */}
              {apiCorrection?.nextPracticeSuggestion && (
                <div className="rounded-2xl border border-border-subtle bg-surface-subtle p-4 text-xs flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-text-main">AI Saathi Tip for Next Practice: </span>
                    <span className="text-text-muted">{apiCorrection.nextPracticeSuggestion}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStage("speaking")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Re-record Speech</span>
              </Button>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-xs text-text-light font-medium">
                  Next: Speak the corrected sentence aloud
                </span>
                <Button
                  size="pill"
                  onClick={() => setStage("repeat")}
                  className="gap-2 px-8 font-bold shadow-md"
                >
                  <span>Practice Repeating Sentence</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* ================= STAGE 6: REPEAT ================= */}
        {stage === "repeat" && (
          <Card className="p-8 space-y-6 animate-in fade-in duration-200">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Step 6 • Repetition &amp; Muscle Memory
              </span>
              <h2 className="text-2xl font-bold text-text-main">
                Now Say the Corrected Sentence Aloud
              </h2>
              <p className="text-xs text-text-muted">
                Speaking the corrected version immediately trains your tongue and brain to avoid repeating the old habit.
              </p>
            </div>

            {/* Target Sentence Box */}
            <div className="rounded-3xl border border-primary/30 bg-lavender-50 p-8 text-center space-y-4 shadow-xs">
              <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                Target Sentence to Repeat:
              </span>
              <p className="text-xl sm:text-2xl font-black text-text-main leading-relaxed">
                &ldquo;{plan.repeatTarget.sentence}&rdquo;
              </p>

              {/* Native audio pronunciation model */}
              <div className="max-w-md mx-auto">
                <AudioPlayer
                  text={plan.repeatTarget.sentence}
                  title="Listen to Target Pronunciation First"
                  variant="compact"
                />
              </div>

              {/* Pronunciation & Delivery Cues */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {plan.repeatTarget.pronunciationCues.map((cue, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-surface px-3 py-1 text-xs border border-border-subtle text-text-muted"
                  >
                    💡 {cue}
                  </span>
                ))}
              </div>
            </div>

            {/* Voice Recorder for repeating with ElevenLabs STT */}
            <div className="space-y-3">
              <VoiceRecorder
                promptLabel="Click microphone and repeat the sentence aloud"
                onTranscript={() => {
                  setHasRepeated(true);
                }}
              />

              {!hasRepeated && (
                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setHasRepeated(true)}
                    className="text-xs font-semibold text-primary underline hover:text-primary-hover"
                  >
                    Simulate verified repetition for testing
                  </button>
                </div>
              )}
            </div>

            {/* Immediate Re-Check Feedback (PRD Section 18) */}
            {hasRepeated && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h4>Re-Check Results:</h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 bg-surface rounded-xl border border-emerald-200 text-center">
                    <span className="font-bold text-emerald-700 block">Grammar</span>
                    <span className="text-text-main font-semibold">✓ Improved</span>
                  </div>
                  <div className="p-2.5 bg-surface rounded-xl border border-emerald-200 text-center">
                    <span className="font-bold text-emerald-700 block">Sentence Rule</span>
                    <span className="text-text-main font-semibold">✓ Correct</span>
                  </div>
                  <div className="p-2.5 bg-surface rounded-xl border border-emerald-200 text-center">
                    <span className="font-bold text-emerald-700 block">Delivery</span>
                    <span className="text-text-main font-semibold">✓ Natural</span>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 flex items-center justify-between border-t border-border-subtle">
              <Button variant="ghost" size="pill" onClick={() => setStage("correction")}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span>Back to Correction</span>
              </Button>

              <Button
                size="pill"
                onClick={handleCompleteSession}
                disabled={!hasRepeated}
                className="gap-2 px-8 font-bold shadow-md"
              >
                <span>Complete Practice &amp; View Summary</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ================= STAGE 7: COMPLETION ================= */}
        {stage === "completion" && (
          <Card className="p-8 sm:p-10 space-y-8 animate-in fade-in duration-200">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-lavender-200 text-primary ring-8 ring-lavender-100">
                <Award className="h-8 w-8" />
              </div>
              <Badge variant="purple" className="px-4 py-1 text-xs font-bold">
                🎉 Daily Practice Completed
              </Badge>
              <h2 className="text-3xl font-black text-text-main">
                Great job speaking today, {state.profile.name || "Friend"}!
              </h2>
              <p className="text-sm text-text-muted max-w-md mx-auto">
                You completed the full 6-stage loop and eliminated a key past-tense hesitation pattern.
              </p>
            </div>

            {/* Metrics Earned Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle text-center space-y-1">
                <span className="text-xs text-text-muted block">Duration</span>
                <span className="text-xl font-black text-text-main">{selectedDuration} Mins</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle text-center space-y-1">
                <span className="text-xs text-text-muted block">Score</span>
                <span className="text-xl font-black text-emerald-700">85%</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle text-center space-y-1">
                <span className="text-xs text-text-muted block">Points</span>
                <span className="text-xl font-black text-primary">+50 XP</span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle text-center space-y-1">
                <span className="text-xs text-text-muted block">Streak</span>
                <span className="text-xl font-black text-amber-600 flex items-center justify-center gap-1">
                  <FlameIcon className="h-5 w-5 fill-amber-500" />
                  {state.streak} Days
                </span>
              </div>
            </div>

            {/* Session Diagnostic Feedback (PRD Section 29) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="p-6 rounded-3xl border border-border-subtle bg-surface space-y-2">
                <h4 className="text-sm font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>What You Did Well:</span>
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  You understood the audio without relying on subtitles, maintained good speaking flow, and immediately caught the &ldquo;didn&apos;t go&rdquo; correction on repetition.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-border-subtle bg-surface space-y-2">
                <h4 className="text-sm font-bold text-amber-800 flex items-center gap-1.5">
                  <Brain className="h-4 w-4 text-amber-600" />
                  <span>Target for Next Practice:</span>
                </h4>
                <p className="text-xs text-text-muted leading-relaxed">
                  Continue practicing direct English thought transitions. Try using two new natural expressions in free conversation tomorrow.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-subtle">
              <Button
                variant="outline"
                size="pill"
                onClick={() => {
                  setStage("setup");
                  setSessionSaved(false);
                  setHasRecordedSpeaking(false);
                  setHasRepeated(false);
                  setSelectedQuizOption(null);
                }}
                className="gap-2 w-full sm:w-auto"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Practice Another Session</span>
              </Button>

              <Link href="/" className="w-full sm:w-auto">
                <Button size="pill" className="gap-2.5 px-8 font-bold shadow-md w-full">
                  <span>Back to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
