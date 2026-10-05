"use client";

import * as React from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Coffee,
  Plane,
  Code2,
  Mic,
  Send,
  Bot,
  User,
  Sparkles,
} from "lucide-react";
import { AudioPlayer } from "@/components/voice/audio-player";

export default function ConversationPage() {
  const [selectedTopic, setSelectedTopic] = React.useState("Job Interview");
  const [inConversation, setInConversation] = React.useState(false);

  const topics = [
    {
      id: "interview",
      title: "Job Interview",
      category: "Professional",
      icon: Briefcase,
      desc: "Practice answering 'Tell me about yourself', past projects, and behavioral questions.",
      suggestedQuestions: ["Can you tell me about a challenging bug you fixed recently?"],
    },
    {
      id: "daily",
      title: "College & Daily Life",
      category: "Casual",
      icon: Coffee,
      desc: "Discuss your campus routines, assignments, friends, and upcoming weekend plans.",
      suggestedQuestions: ["What classes did you attend today?"],
    },
    {
      id: "travel",
      title: "Travel & Ordering",
      category: "Social",
      icon: Plane,
      desc: "Practice asking for directions, ordering at a café, or booking tickets abroad.",
      suggestedQuestions: ["Could I get a table for two near the window please?"],
    },
    {
      id: "tech",
      title: "AI & Programming",
      category: "Technical",
      icon: Code2,
      desc: "Explain your hackathon project, software architecture, and favorite tech stack.",
      suggestedQuestions: ["Why did you choose Next.js for this project?"],
    },
  ];

  return (
    <AppShell
      title="Free Conversation Practice"
      subtitle="Speak with your AI Saathi naturally. Mistakes are corrected gently without interrupting your flow."
    >
      <div className="space-y-8 pb-12">
        {!inConversation ? (
          /* Topic Selection Screen */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-text-main">
                  Choose a Conversation Scenario
                </h2>
                <p className="text-xs text-text-muted">
                  Select a topic to start speaking with TalkSaathi. Responses adapt to your intermediate level.
                </p>
              </div>
              <Badge variant="purple" className="px-3 py-1">
                4 Scenarios Available
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {topics.map((t) => {
                const Icon = t.icon;
                const isSelected = selectedTopic === t.title;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTopic(t.title)}
                    className={`cursor-pointer rounded-3xl p-6 transition-all border ${
                      isSelected
                        ? "bg-surface border-primary ring-2 ring-lavender-200 shadow-md"
                        : "bg-surface border-border-subtle hover:border-lavender-300 hover:shadow-xs"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-100 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="secondary" className="text-[10px]">
                        {t.category}
                      </Badge>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <h3 className="text-base font-bold text-text-main">
                        {t.title}
                      </h3>
                      <p className="text-xs text-text-muted leading-relaxed">
                        {t.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border-subtle/80 flex items-center justify-between">
                      <span className="text-[11px] text-text-light font-medium">
                        Sample prompt ready
                      </span>
                      <Button
                        size="sm"
                        variant={isSelected ? "default" : "outline"}
                        className="rounded-full text-xs font-semibold"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTopic(t.title);
                          setInConversation(true);
                        }}
                      >
                        Start Speaking →
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat/Conversation Flow */
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-surface px-6 py-3 border border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lavender-200 text-primary">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-main">
                    Topic: {selectedTopic}
                  </h3>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    AI Saathi is ready to converse
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full text-xs"
                  onClick={() => setInConversation(false)}
                >
                  End Conversation &amp; Review
                </Button>
              </div>
            </div>

            {/* Conversation Messages */}
            <Card className="p-6 min-h-[420px] flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* AI greeting message */}
                <div className="flex items-start gap-3 max-w-xl">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-lavender-200 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="rounded-2xl rounded-tl-sm bg-lavender-100/70 p-4 border border-lavender-200/80 text-text-main text-sm">
                      <p>
                        Welcome! Let&apos;s run a practice mock interview. To start off: could you introduce yourself and tell me about a project you recently worked on?
                      </p>
                    </div>
                    <div className="pt-0.5 px-1">
                      <AudioPlayer
                        text="Welcome! Let's run a practice mock interview. To start off: could you introduce yourself and tell me about a project you recently worked on?"
                        variant="inline"
                      />
                    </div>
                  </div>
                </div>

                {/* Simulated User Response */}
                <div className="flex items-start gap-3 max-w-xl ml-auto flex-row-reverse">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="space-y-1.5 text-right">
                    <div className="rounded-2xl rounded-tr-sm bg-primary text-white p-4 text-sm shadow-xs text-left">
                      <p>
                        Hi! I am building TalkSaathi AI for the hackathon. It is a tool for people who understand English but has trouble speaking without hesitation.
                      </p>
                    </div>
                    <span className="text-[11px] text-text-light px-1">
                      Spoken via microphone • 9:34 AM
                    </span>
                  </div>
                </div>

                {/* In-Flight Gentle Correction Bubble */}
                <div className="mx-auto max-w-lg rounded-2xl bg-amber-50/80 border border-amber-200/70 p-3 text-xs text-amber-900 flex items-start gap-2.5">
                  <Sparkles className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <span className="font-bold">Gentle note:</span> Notice &ldquo;people who ... <span className="underline decoration-amber-500 font-medium">have</span> trouble&rdquo; (use plural &lsquo;have&rsquo; with &lsquo;people&rsquo; instead of &lsquo;has&rsquo;). Great clarity overall!
                  </div>
                </div>
              </div>

              {/* Input Area */}
              <div className="border-t border-border-subtle pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <button className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary-hover transition-all">
                    <Mic className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Speak using the microphone, or type your response here..."
                    className="flex-1 h-12 rounded-full border border-border-subtle bg-surface-subtle px-5 text-sm text-text-main placeholder:text-text-light focus:outline-none focus:border-primary focus:bg-surface"
                  />
                  <Button size="icon" className="h-12 w-12 rounded-full shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between text-[11px] text-text-muted px-2">
                  <span>Press microphone to speak • Tap again when finished</span>
                  <span>Audio processed securely via ElevenLabs STT</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AppShell>
  );
}
