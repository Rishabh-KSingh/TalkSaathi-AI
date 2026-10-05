"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Clock, Layers, Flame, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserProfile, TodayGoal } from "@/types";

interface HeroCardProps {
  profile: UserProfile;
  goal: TodayGoal;
  streak: number;
}

export function HeroCard({ profile, goal, streak }: HeroCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-surface p-8 shadow-[0_2px_24px_rgba(36,27,43,0.04)]">
      {/* Background soft decorative accent */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lavender-100/50 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-2xl space-y-3.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="purple" className="px-3 py-1 font-bold">
              <Sparkles className="h-3 w-3 mr-1 text-primary" />
              Today&apos;s Recommended Session
            </Badge>
            <span className="flex items-center gap-1 text-xs font-semibold text-text-muted">
              <Clock className="h-3.5 w-3.5 text-text-light" />
              {profile.dailyMinutes} Minutes
            </span>
            <span className="text-xs text-text-light">•</span>
            <span className="text-xs font-semibold capitalize text-primary">
              {profile.level} Level
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-main leading-tight">
            What Should I Practice Today?
          </h2>

          <p className="text-sm leading-relaxed text-text-muted">
            Focus: <strong className="text-text-main font-semibold">{goal.focusArea}</strong>. 
            {" "}Follow the complete speaking loop to eliminate mental translation from Hindi and build genuine conversational speed.
          </p>

          {/* Interactive Steps Preview */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-text-main flex items-center gap-1 mr-1">
              <Layers className="h-3.5 w-3.5 text-primary" />
              5 Activities:
            </span>
            {[
              "1. 🎧 Listen (2m)",
              "2. ❓ Comprehend (2m)",
              "3. 🧠 Recall (3m)",
              "4. 🎤 Speak & Correct (4m)",
              "5. 💬 Converse (4m)",
            ].map((step, idx) => (
              <span
                key={idx}
                className="rounded-full bg-surface-subtle px-3 py-1 border border-border-subtle text-text-muted text-[11px] font-medium"
              >
                {step}
              </span>
            ))}
          </div>
        </div>

        {/* Right side stats box */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 rounded-2xl bg-surface-subtle p-4 border border-border-subtle/80 shrink-0">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-sm">
            <Flame className="h-5 w-5 fill-amber-500 text-amber-500" />
            <span>{streak} Day Streak</span>
          </div>
          <span className="text-[11px] text-text-muted">
            Target: {profile.dailyMinutes} mins daily
          </span>
          <div className="h-1.5 w-28 rounded-full bg-border-subtle overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full"
              style={{ width: `${Math.min(100, (goal.completedMinutes / goal.targetMinutes) * 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-text-light font-medium">
            {goal.completedMinutes} of {goal.targetMinutes}m done today
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-8 flex flex-wrap items-center gap-3.5 pt-2">
        <Link href="/practice">
          <Button size="pill" className="gap-2.5 px-8 font-bold shadow-md hover:shadow-lg">
            <span>Start Today&apos;s Practice</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/conversation">
          <Button variant="outline" size="pill" className="gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <span>Jump to Free Conversation</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
