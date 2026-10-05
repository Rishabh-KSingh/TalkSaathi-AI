"use client";

import * as React from "react";
import { Sparkles, Globe, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { useAppState } from "@/lib/storage/local-storage";

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({
  title = "Good morning, Friend 👋",
  subtitle = "Ready to practice English speaking without hesitation today?",
}: HeaderProps) {
  const { state } = useAppState();
  const langLabel =
    state.profile.explanationLanguage === "hinglish"
      ? "Hinglish Bridge"
      : state.profile.explanationLanguage === "hindi"
      ? "Hindi Bridge"
      : "English Immersion";

  const speedLabel =
    state.profile.speechSpeed === "slow"
      ? "Slow Speed"
      : state.profile.speechSpeed === "fast"
      ? "Fast Speed"
      : "Normal Speed";

  return (
    <header className="sticky top-0 z-30 flex h-20 w-full items-center justify-between border-b border-border-subtle bg-background/85 px-8 backdrop-blur-md">
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-tight text-text-main">
          {title}
        </h1>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Language preference indicator */}
        <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-xs text-text-muted shadow-xs">
          <Globe className="h-3.5 w-3.5 text-primary" />
          <span className="font-medium text-text-main">{langLabel}</span>
        </div>

        {/* Voice indicator */}
        <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-3.5 py-1.5 text-xs text-text-muted shadow-xs">
          <Volume2 className="h-3.5 w-3.5 text-text-muted" />
          <span className="font-medium text-text-main">{speedLabel}</span>
        </div>

        {/* AI status badge */}
        <Badge variant="purple" className="py-1 px-3">
          <Sparkles className="h-3 w-3 text-primary mr-1" />
          Open-Weight Qwen3
        </Badge>
      </div>
    </header>
  );
}
