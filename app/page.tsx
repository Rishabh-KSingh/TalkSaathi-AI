"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { useAppState } from "@/lib/storage/local-storage";
import { HeroCard } from "@/components/dashboard/hero-card";
import { SkillGrid } from "@/components/dashboard/skill-grid";
import { StreakCard } from "@/components/dashboard/streak-card";
import { GoalCard } from "@/components/dashboard/goal-card";
import { WeakAreaCard } from "@/components/dashboard/weak-area-card";
import { QuickModes } from "@/components/dashboard/quick-modes";

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const router = useRouter();
  const { state } = useAppState();
  const greeting = getTimeGreeting();

  const { profile, progress, streak, todayGoal, mistakes } = state;
  const topMistake = mistakes.length > 0 ? mistakes[0] : undefined;

  React.useEffect(() => {
    if (!profile.hasCompletedOnboarding || !profile.name) {
      router.push("/onboarding");
    }
  }, [profile.hasCompletedOnboarding, profile.name, router]);

  return (
    <AppShell
      title={`${greeting}, ${profile.name || "Friend"} 👋`}
      subtitle={`Ready for your ${profile.dailyMinutes}-minute daily speaking practice without hesitation?`}
    >
      <div className="space-y-8 pb-16">
        {/* 1. Large Today's Practice Hero Card */}
        <HeroCard profile={profile} goal={todayGoal} streak={streak} />

        {/* 2. Core English Skill Cards */}
        <SkillGrid progress={progress} />

        {/* 3. Streak & Today's Goal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StreakCard streak={streak} />
          <GoalCard goal={todayGoal} />
        </div>

        {/* 4. Recommended Weak Area Card (Adaptive Mistake Memory) */}
        <WeakAreaCard topMistake={topMistake} />

        {/* 5. Quick Practice Modes (Hindi -> English, Photo OCR, Free Talk) */}
        <QuickModes />
      </div>
    </AppShell>
  );
}
