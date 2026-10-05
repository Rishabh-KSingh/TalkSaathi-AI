"use client";

import { Mic, Volume2, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SkillProgress } from "@/types";

interface SkillGridProps {
  progress: SkillProgress;
}

export function SkillGrid({ progress }: SkillGridProps) {
  const skills = [
    {
      name: "Speaking",
      score: progress.speaking,
      icon: Mic,
      status: "Intermediate",
      badgeVariant: "purple" as const,
      color: "text-purple-700",
      bg: "bg-lavender-100",
      tip: "Pacing & sentence delivery",
    },
    {
      name: "Listening",
      score: progress.listening,
      icon: Volume2,
      status: "Strongest Area",
      badgeVariant: "success" as const,
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      tip: "High natural comprehension",
    },
    {
      name: "Grammar",
      score: progress.grammar,
      icon: BookOpen,
      status: "Needs Attention",
      badgeVariant: "warning" as const,
      color: "text-amber-700",
      bg: "bg-amber-50",
      tip: "Focus on verb tenses",
    },
    {
      name: "Vocabulary",
      score: progress.vocabulary,
      icon: Sparkles,
      status: "Growing",
      badgeVariant: "secondary" as const,
      color: "text-indigo-700",
      bg: "bg-indigo-50",
      tip: "Natural conversational idioms",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-text-main">
          Core English Skills
        </h3>
        <span className="text-xs text-text-muted">
          Continuously calibrated from your spoken responses
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((skill) => {
          const Icon = skill.icon;
          return (
            <Card
              key={skill.name}
              className="p-5 hover:border-lavender-300 transition-all shadow-xs"
            >
              <CardContent className="p-0 space-y-3.5">
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${skill.bg} ${skill.color}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <Badge variant={skill.badgeVariant} className="text-[10px] py-0.5">
                    {skill.status}
                  </Badge>
                </div>

                <div>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-base font-bold text-text-main">
                      {skill.name}
                    </h4>
                    <span className="text-xl font-black text-text-main">
                      {skill.score}%
                    </span>
                  </div>
                  <p className="text-[11px] text-text-muted mt-0.5">{skill.tip}</p>
                </div>

                {/* Visual Progress Bar */}
                <div className="space-y-1">
                  <div className="h-2 w-full rounded-full bg-surface-subtle overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-text-light font-medium">
                    <span>Baseline: 50%</span>
                    <span>Target: 90%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
