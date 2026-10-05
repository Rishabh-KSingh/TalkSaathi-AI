"use client";

import { Flame, Check, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StreakCardProps {
  streak: number;
}

export function StreakCard({ streak }: StreakCardProps) {
  // Weekly days representation (Monday through Sunday)
  const days = [
    { label: "M", completed: true },
    { label: "T", completed: true },
    { label: "W", completed: true }, // Today
    { label: "T", completed: false },
    { label: "F", completed: false },
    { label: "S", completed: false },
    { label: "S", completed: false },
  ];

  return (
    <Card className="p-6 hover:border-lavender-300 transition-all">
      <CardContent className="p-0 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 shadow-xs">
              <Flame className="h-6 w-6 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-text-main">
                  {streak} Day Streak
                </h3>
                <Badge variant="warning" className="text-[10px] py-0">
                  On Fire 🔥
                </Badge>
              </div>
              <p className="text-xs text-text-muted">
                Daily English habit in progress
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Calendar className="h-3.5 w-3.5 text-text-light" />
            <span>This Week</span>
          </div>
        </div>

        {/* 7-day tracker dots */}
        <div className="rounded-2xl bg-surface-subtle p-3.5 border border-border-subtle/80">
          <div className="flex items-center justify-between gap-1">
            {days.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="text-[10px] font-bold text-text-light">{d.label}</span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    d.completed
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-surface border border-border-subtle text-text-light"
                  }`}
                >
                  {d.completed ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : "·"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-text-muted leading-relaxed">
          Consistency beats intensity! Speaking for just <strong>10–15 minutes</strong> each day rewires your speech reflexes from Hindi translation to direct English thinking.
        </p>
      </CardContent>
    </Card>
  );
}
