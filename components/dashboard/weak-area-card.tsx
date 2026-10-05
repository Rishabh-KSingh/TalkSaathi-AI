"use client";

import Link from "next/link";
import { Brain, ArrowRight, BookOpen } from "lucide-react";
import { HighlightCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mistake } from "@/types";

interface WeakAreaCardProps {
  topMistake?: Mistake;
}

export function WeakAreaCard({ topMistake }: WeakAreaCardProps) {
  const topic = topMistake?.topic || "Past Tense";
  const original = topMistake?.original || "Yesterday I didn't went to college.";
  const corrected = topMistake?.corrected || "Yesterday I didn't go to college.";
  const count = topMistake?.count || 4;

  return (
    <HighlightCard className="relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-xs">
          <Brain className="h-6 w-6" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Smart Adaptive Feedback
              </span>
              <Badge variant="secondary" className="text-[10px] py-0.5">
                {count} Occurrences Logged
              </Badge>
            </div>
            <span className="text-xs text-text-light font-medium">
              Mistake Memory Active
            </span>
          </div>

          <div>
            <h3 className="text-lg font-bold text-text-main">
              Your recent practice shows that {topic} needs attention.
            </h3>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              When translating from Hindi, it&apos;s common to double-mark the past tense. TalkSaathi identified repeated patterns like saying{" "}
              <span className="font-semibold text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                &ldquo;{original}&rdquo;
              </span>{" "}
              instead of{" "}
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                &ldquo;{corrected}&rdquo;
              </span>.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/practice">
              <Button size="pill" className="gap-2 font-bold px-7">
                <span>Practice {topic}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/progress">
              <Button variant="outline" size="pill" className="gap-2 text-xs">
                <BookOpen className="h-3.5 w-3.5 text-primary" />
                <span>Review All {count} Mistakes</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </HighlightCard>
  );
}
