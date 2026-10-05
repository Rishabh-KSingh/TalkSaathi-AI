"use client";

import { Target, CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TodayGoal } from "@/types";

interface GoalCardProps {
  goal: TodayGoal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const percentage = Math.min(
    100,
    Math.round((goal.completedMinutes / goal.targetMinutes) * 100)
  );

  const milestones = [
    { label: "Morning audio listening check", done: true },
    { label: "Spoken routine description", done: true },
    { label: "Target weak area drill (Past Tense)", done: false },
    { label: "5-minute free conversation", done: false },
  ];

  return (
    <Card className="p-6 hover:border-lavender-300 transition-all">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-100 text-primary border border-lavender-200/80 shadow-xs">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-text-main">
                  Today&apos;s Goal
                </h3>
                <Badge variant={goal.completed ? "success" : "purple"} className="text-[10px] py-0">
                  {goal.completed ? "Completed" : "In Progress"}
                </Badge>
              </div>
              <p className="text-xs text-text-muted">
                {goal.completedMinutes} of {goal.targetMinutes} minutes spoken ({percentage}%)
              </p>
            </div>
          </div>

          <span className="text-sm font-black text-primary">
            {percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2.5 w-full rounded-full bg-surface-subtle overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-text-light font-medium">
            <span>{goal.completedActivities} of {goal.targetActivities} activities completed</span>
            <span>{goal.targetMinutes - goal.completedMinutes} mins remaining</span>
          </div>
        </div>

        {/* Checklist of today's activities */}
        <div className="space-y-2 pt-1">
          {milestones.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition-all ${
                m.done
                  ? "bg-emerald-50/60 text-emerald-800"
                  : "bg-surface-subtle text-text-muted"
              }`}
            >
              {m.done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              ) : (
                <Circle className="h-4 w-4 text-text-light shrink-0" />
              )}
              <span className={m.done ? "line-through opacity-80" : "font-medium"}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
