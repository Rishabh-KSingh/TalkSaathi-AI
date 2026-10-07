"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/storage/local-storage";
import {
  Flame,
  Award,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export default function ProgressPage() {
  const { state, updateState } = useAppState();
  const { progress, mistakes, streak, xp, confidenceScore } = state;
  const userConfidence = confidenceScore || 3;

  const handleSetConfidence = (lvl: number) => {
    updateState({ confidenceScore: lvl });
  };

  const confidenceLabels = [
    "Very Hesitant",
    "Hesitant",
    "Okay",
    "Confident",
    "Very Confident",
  ];

  return (
    <AppShell
      title="Speaking Progress &amp; Mistake Memory"
      subtitle="Track your measurable gains and eliminate recurring patterns from Hindi mental translation."
    >
      <div className="space-y-8 pb-12">
        {/* Top Summary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <Flame className="h-6 w-6 fill-amber-500 text-amber-500" />
              </div>
              <div>
                <span className="text-2xl font-black text-text-main">{streak} Days</span>
                <p className="text-xs text-text-muted">Current Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-primary">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-text-main">{xp} XP</span>
                <p className="text-xs text-text-muted">Speaking Points</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-text-main">45 mins</span>
                <p className="text-xs text-text-muted">Spoken This Week</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-black text-text-main">{mistakes.length} Logged</span>
                <p className="text-xs text-text-muted">Mistakes to Master</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Daily Confidence Tracker (PRD Section 28) */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-text-main">
                  Daily Speaking Confidence Check
                </h3>
                <p className="text-xs text-text-muted">
                  How confident do you feel speaking English today?
                </p>
              </div>
              <Badge variant="purple">
                Rating: {userConfidence} — {confidenceLabels[userConfidence - 1]}
              </Badge>
            </div>

            <div className="flex items-center gap-3 pt-2">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => handleSetConfidence(lvl)}
                  className={`flex-1 rounded-2xl p-3 text-center border transition-all ${
                    userConfidence === lvl
                      ? "bg-primary text-white border-primary shadow-xs font-bold"
                      : "bg-surface-subtle border-border-subtle text-text-muted hover:border-lavender-300"
                  }`}
                >
                  <span className="text-lg block font-bold">{lvl}</span>
                  <span className="text-[10px] block mt-0.5 line-clamp-1">
                    {confidenceLabels[lvl - 1]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Mistake Memory Section (PRD Section 26) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-main">
                Mistake Memory (Adaptive Learning)
              </h2>
              <p className="text-xs text-text-muted">
                TalkSaathi records recurring patterns from your speech so future daily practice targets your specific weak spots.
              </p>
            </div>
            <Badge variant="secondary" className="px-3 py-1 font-semibold">
              {mistakes.length} Active {mistakes.length === 1 ? "Pattern" : "Patterns"}
            </Badge>
          </div>

          <div className="space-y-3">
            {mistakes.map((m) => (
              <Card key={m.id} className="p-5 hover:border-lavender-300 transition-all">
                <CardContent className="p-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge variant="warning" className="text-[10px]">
                        {m.topic}
                      </Badge>
                      <span className="text-xs font-bold text-red-600">
                        Made {m.count} times
                      </span>
                      <span className="text-xs text-text-light">• Last seen {m.lastSeen}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                      <span className="rounded-lg bg-red-50 text-red-700 px-2.5 py-1 border border-red-200 line-through">
                        &ldquo;{m.original}&rdquo;
                      </span>
                      <ArrowRight className="hidden sm:inline h-3.5 w-3.5 text-text-light" />
                      <span className="rounded-lg bg-emerald-50 text-emerald-700 px-2.5 py-1 border border-emerald-200 font-semibold">
                        &ldquo;{m.corrected}&rdquo;
                      </span>
                    </div>

                    <p className="text-xs text-text-muted">{m.explanation}</p>
                  </div>

                  <div className="shrink-0">
                    <Button size="sm" variant="outline" className="rounded-full text-xs gap-1.5 font-semibold">
                      <Sparkles className="h-3 w-3 text-primary" />
                      <span>Target in Drill</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Skill Breakdown */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-text-main mb-4">
            Skill Breakdown &amp; Benchmark
          </h3>
          <div className="space-y-4">
            {Object.entries(progress).map(([key, val]) => (
              <div key={key} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="capitalize text-text-main">{key}</span>
                  <span className="text-primary font-bold">{val}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${val}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
