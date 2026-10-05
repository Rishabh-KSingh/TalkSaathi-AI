"use client";

import Link from "next/link";
import { Mic, Camera, MessagesSquare, ArrowRight, Languages } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function QuickModes() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-text-main">
          Speaking &amp; Learning Modes
        </h3>
        <span className="text-xs text-text-muted">
          Choose a tailored practice method
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Hindi -> English Bridge */}
        <Card className="p-6 relative overflow-hidden group hover:border-lavender-300 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-100 text-primary group-hover:scale-105 transition-transform">
                <Languages className="h-5 w-5" />
              </div>
              <Badge variant="purple" className="text-[10px]">
                Voice Bridge
              </Badge>
            </div>

            <div>
              <h4 className="text-base font-bold text-text-main">
                Hindi → English Mode
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Stuck on how to express a thought? Speak in Hindi; TalkSaathi gives the natural English equivalent and asks you to repeat it.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-border-subtle/80">
            <Link href="/practice">
              <Button variant="outline" size="sm" className="w-full rounded-full gap-2 text-xs font-semibold">
                <Mic className="h-3.5 w-3.5 text-primary" />
                <span>Speak in Hindi →</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Photo Grammar Checker */}
        <Card className="p-6 relative overflow-hidden group hover:border-lavender-300 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-100 text-primary group-hover:scale-105 transition-transform">
                <Camera className="h-5 w-5" />
              </div>
              <Badge variant="secondary" className="text-[10px]">
                OCR + Vision
              </Badge>
            </div>

            <div>
              <h4 className="text-base font-bold text-text-main">
                Photo Grammar Checker
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Snap or upload handwritten English notes, assignments, or resumes. OCR extracts text, fixes mistakes, and generates spoken drills.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-border-subtle/80">
            <Link href="/practice">
              <Button variant="outline" size="sm" className="w-full rounded-full gap-2 text-xs font-semibold">
                <Camera className="h-3.5 w-3.5 text-primary" />
                <span>Upload Photo →</span>
              </Button>
            </Link>
          </div>
        </Card>

        {/* Free Conversation */}
        <Card className="p-6 relative overflow-hidden group hover:border-lavender-300 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lavender-100 text-primary group-hover:scale-105 transition-transform">
                <MessagesSquare className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px]">
                Simulated Chats
              </Badge>
            </div>

            <div>
              <h4 className="text-base font-bold text-text-main">
                Free Real-World Talk
              </h4>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Roleplay job interviews, casual campus talks, or technical presentations with context-aware AI conversational turns.
              </p>
            </div>
          </div>

          <div className="pt-4 mt-2 border-t border-border-subtle/80">
            <Link href="/conversation">
              <Button variant="outline" size="sm" className="w-full rounded-full gap-2 text-xs font-semibold">
                <ArrowRight className="h-3.5 w-3.5 text-primary" />
                <span>Select Scenario →</span>
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
