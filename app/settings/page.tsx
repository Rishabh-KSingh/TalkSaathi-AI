"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppState } from "@/lib/storage/local-storage";
import { ExplanationLanguage, SpeechSpeed, EnglishLevel, UserProfile } from "@/types";
import {
  Globe,
  Volume2,
  Trash2,
  Download,
  ShieldCheck,
  Check,
  RotateCcw,
} from "lucide-react";

interface SettingsFormProps {
  initialProfile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
}

function SettingsForm({ initialProfile, onSave }: SettingsFormProps) {
  const [name, setName] = React.useState(initialProfile.name);
  const [level, setLevel] = React.useState<EnglishLevel>(initialProfile.level);
  const [language, setLanguage] = React.useState<ExplanationLanguage>(initialProfile.explanationLanguage);
  const [speed, setSpeed] = React.useState<SpeechSpeed>(initialProfile.speechSpeed);
  const [saved, setSaved] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      level,
      explanationLanguage: language,
      speechSpeed: speed,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Profile Details */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <h3 className="text-base font-bold text-text-main">
            Learner Profile
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted">
                Your Name / Nickname
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-text-muted">
                Proficiency Level
              </label>
              <div className="flex gap-2">
                {(["beginner", "intermediate"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`flex-1 rounded-2xl py-2.5 text-xs font-bold capitalize transition-all border ${
                      level === lvl
                        ? "bg-primary text-white border-primary shadow-xs"
                        : "bg-surface text-text-muted border-border-subtle hover:border-lavender-300"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explanation Language */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <div className="flex items-center gap-2.5">
            <Globe className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-text-main">
                Explanation &amp; Correction Language
              </h3>
              <p className="text-xs text-text-muted">
                Choose how TalkSaathi explains grammar mistakes and speaking tips to you.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {[
              { id: "hinglish", title: "Hinglish (Recommended)", desc: "Friendly mix of Hindi & English for fast intuition" },
              { id: "english", title: "English Only", desc: "Immersion method with simple English explanations" },
              { id: "hindi", title: "Pure Hindi", desc: "Grammar rules explained in clear Hindi" },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setLanguage(opt.id as ExplanationLanguage)}
                className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                  language === opt.id
                    ? "bg-lavender-50 border-primary ring-2 ring-lavender-200 shadow-xs"
                    : "bg-surface border-border-subtle hover:border-lavender-300"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text-main">{opt.title}</span>
                  {language === opt.id && <Check className="h-4 w-4 text-primary" />}
                </div>
                <p className="text-[11px] text-text-muted">{opt.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Voice & Speed */}
      <Card className="p-6">
        <CardContent className="p-0 space-y-4">
          <div className="flex items-center gap-2.5">
            <Volume2 className="h-5 w-5 text-primary" />
            <div>
              <h3 className="text-base font-bold text-text-main">
                AI Voice &amp; Speed
              </h3>
              <p className="text-xs text-text-muted">
                Powered by ElevenLabs realistic conversational voices.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-text-muted">
              Speech Playback Speed
            </label>
            <div className="flex gap-3 max-w-sm">
              {(["slow", "normal", "fast"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  className={`flex-1 rounded-2xl py-2.5 text-xs font-bold capitalize transition-all border ${
                    speed === s
                      ? "bg-primary text-white border-primary shadow-xs"
                      : "bg-surface text-text-muted border-border-subtle hover:border-lavender-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save CTA */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-text-muted">
          {saved ? "✓ Preferences saved to LocalStorage!" : "Changes immediately reflect across your dashboard."}
        </span>
        <Button type="submit" size="pill" className="font-bold px-8 shadow-sm">
          Save Preferences
        </Button>
      </div>
    </form>
  );
}

export default function SettingsPage() {
  const { state, updateState, reset } = useAppState();

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `talksaathi-learning-backup-${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to reset all your local TalkSaathi learning progress, streak, and mistake history?")) {
      reset();
      alert("Local learning data has been reset to defaults.");
    }
  };

  return (
    <AppShell
      title="Settings &amp; Learning Preferences"
      subtitle="Customize your speaking coach, explanation language, and control your local learning data."
    >
      <div className="space-y-8 pb-12 max-w-4xl">
        <SettingsForm
          key={state.profile.name + state.profile.level + state.profile.explanationLanguage + state.profile.speechSpeed}
          initialProfile={state.profile}
          onSave={(updated) => updateState({ profile: { ...state.profile, ...updated } })}
        />

        {/* Data & Privacy Controls */}
        <Card className="p-6 border-red-100 bg-surface">
          <CardContent className="p-0 space-y-4">
            <div className="flex items-center gap-2.5 text-text-main">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <div>
                <h3 className="text-base font-bold text-text-main">
                  Privacy &amp; Local Storage Controls
                </h3>
                <p className="text-xs text-text-muted">
                  TalkSaathi stores your learning progress directly on your device via LocalStorage. No account required.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/onboarding">
                <Button variant="outline" size="sm" className="rounded-full gap-2 text-xs">
                  <RotateCcw className="h-3.5 w-3.5 text-primary" />
                  <span>Retake Level Assessment</span>
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full gap-2 text-xs"
                onClick={handleExport}
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export Learning JSON</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-full gap-2 text-xs"
                onClick={handleDelete}
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete All Local Data</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
