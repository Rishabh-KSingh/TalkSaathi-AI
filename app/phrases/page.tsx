"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/lib/storage/local-storage";
import { BookA, Volume2, Mic, Plus, BookmarkCheck, Sparkles } from "lucide-react";

export default function PhrasesPage() {
  const { state } = useAppState();
  const { phrases } = state;
  const [filter, setFilter] = React.useState("all");

  const playPhrase = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  const filtered =
    filter === "all"
      ? phrases
      : phrases.filter((p) => p.category.toLowerCase() === filter.toLowerCase());

  return (
    <AppShell
      title="Useful Phrases &amp; Vocabulary Vault"
      subtitle="Don't memorize isolated words. Learn natural sentence patterns used by fluent English speakers."
    >
      <div className="space-y-8 pb-12">
        {/* Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-2xl bg-surface-subtle p-1.5 border border-border-subtle">
            {["all", "conversational", "professional", "casual"].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-xl px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                  filter === cat
                    ? "bg-primary text-white shadow-xs"
                    : "text-text-muted hover:text-text-main"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button size="pillSm" className="gap-2 font-semibold">
            <Plus className="h-3.5 w-3.5" />
            <span>Save Custom Phrase</span>
          </Button>
        </div>

        {/* Phrases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((phrase) => (
            <Card key={phrase.id} className="hover:border-lavender-300 transition-all p-6">
              <CardContent className="p-0 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-100 text-primary">
                      <BookA className="h-4 w-4" />
                    </div>
                    <Badge variant="purple" className="text-[10px]">
                      {phrase.category}
                    </Badge>
                  </div>
                  {phrase.practiced ? (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <BookmarkCheck className="h-3.5 w-3.5" />
                      Practiced
                    </span>
                  ) : (
                    <span className="text-[11px] text-text-light">Unpracticed</span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-text-main">
                    &ldquo;{phrase.phrase}&rdquo;
                  </h3>
                  <p className="text-xs text-text-muted">
                    <strong className="text-text-main">Meaning:</strong> {phrase.meaning}
                  </p>
                </div>

                {phrase.example && (
                  <div className="rounded-2xl bg-surface-subtle p-3.5 border border-border-subtle/80 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-text-light">
                      Natural Context:
                    </span>
                    <p className="italic text-text-main">&ldquo;{phrase.example}&rdquo;</p>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between border-t border-border-subtle/80">
                  <button
                    type="button"
                    onClick={() => playPhrase(phrase.phrase)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Listen audio</span>
                  </button>
                  <Link href="/practice">
                    <Button size="sm" variant="outline" className="rounded-full gap-1.5 text-xs">
                      <Mic className="h-3 w-3 text-primary" />
                      <span>Practice Saying It</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Personalized Vocabulary Recommendation Card (PRD Sec 23) */}
        <div className="rounded-3xl border border-lavender-200 bg-lavender-100/60 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base font-bold text-text-main">
                Personalized Alternative Vocabulary Suggestions
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                We observed you frequently use words like &ldquo;very good&rdquo; or &ldquo;nice&rdquo;. Here are natural alternatives to elevate your conversation:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { word: "Exceptional", insteadOf: "very good", example: "The project demo was exceptional." },
                  { word: "Enjoyable", insteadOf: "nice", example: "We had an enjoyable conversation." },
                  { word: "Straightforward", insteadOf: "easy", example: "The setup was straightforward." },
                ].map((item) => (
                  <div key={item.word} className="rounded-2xl bg-surface p-3 border border-border-subtle text-xs">
                    <span className="font-bold text-primary">{item.word}</span>
                    <span className="text-[11px] text-text-muted block">instead of &ldquo;{item.insteadOf}&rdquo;</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
