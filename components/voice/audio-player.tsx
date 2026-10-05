"use client";

import * as React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Loader2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TtsSpeed } from "@/lib/elevenlabs/client";

interface AudioPlayerProps {
  text: string;
  title?: string;
  voiceId?: string;
  defaultSpeed?: TtsSpeed;
  variant?: "full" | "compact" | "inline";
  className?: string;
}

export function AudioPlayer({
  text,
  title,
  voiceId,
  defaultSpeed = "normal",
  variant = "full",
  className = "",
}: AudioPlayerProps) {
  const [status, setStatus] = React.useState<"idle" | "loading" | "playing" | "paused" | "error">("idle");
  const [speed, setSpeed] = React.useState<TtsSpeed>(defaultSpeed);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [provider, setProvider] = React.useState<"elevenlabs" | "browser-synthesis" | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = React.useRef<string | null>(null);
  const utteranceRef = React.useRef<SpeechSynthesisUtterance | null>(null);

  // Speed rate multiplier mapping
  const getRateMultiplier = (s: TtsSpeed): number => {
    switch (s) {
      case "slow":
        return 0.8;
      case "fast":
        return 1.25;
      case "normal":
      default:
        return 1.0;
    }
  };

  // Clean up audio & speech on unmount or text change
  React.useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [text]);

  const fetchAndPlayAudio = async (targetSpeed: TtsSpeed) => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/voice/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          voiceId,
          speed: targetSpeed,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS server error (${response.status})`);
      }

      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("audio")) {
        // ElevenLabs Audio Stream Received
        const blob = await response.blob();
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        const blobUrl = URL.createObjectURL(blob);
        audioUrlRef.current = blobUrl;

        const audio = new Audio(blobUrl);
        audioRef.current = audio;
        audio.playbackRate = getRateMultiplier(targetSpeed);

        audio.onloadedmetadata = () => {
          setDuration(audio.duration || 0);
        };

        audio.ontimeupdate = () => {
          setCurrentTime(audio.currentTime);
        };

        audio.onplay = () => {
          setStatus("playing");
          setProvider("elevenlabs");
        };

        audio.onpause = () => {
          if (audio.currentTime < audio.duration) {
            setStatus("paused");
          }
        };

        audio.onended = () => {
          setStatus("idle");
          setCurrentTime(0);
        };

        audio.onerror = () => {
          console.error("Audio playback error");
          fallbackToSpeechSynthesis(targetSpeed);
        };

        await audio.play();
      } else {
        // Mock fallback mode or no ElevenLabs key configured
        fallbackToSpeechSynthesis(targetSpeed);
      }
    } catch (err) {
      console.warn("Server TTS failed, falling back to client synthesis:", err);
      fallbackToSpeechSynthesis(targetSpeed);
    }
  };

  const fallbackToSpeechSynthesis = (targetSpeed: TtsSpeed) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setStatus("error");
      setErrorMessage("Audio speech is not supported in this browser environment.");
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      utterance.rate = getRateMultiplier(targetSpeed);
      utterance.pitch = 1.0;
      utterance.lang = "en-US";

      // Approximate duration based on word count (~140 words per min)
      const words = text.trim().split(/\s+/).length;
      const approxDuration = Math.max(3, Math.round((words / 140) * 60 / getRateMultiplier(targetSpeed)));
      setDuration(approxDuration);
      setCurrentTime(0);

      utterance.onstart = () => {
        setStatus("playing");
        setProvider("browser-synthesis");
      };

      utterance.onend = () => {
        setStatus("idle");
        setCurrentTime(0);
      };

      utterance.onerror = (e) => {
        if (e.error !== "canceled") {
          setStatus("error");
          setErrorMessage("Failed to play voice audio.");
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("SpeechSynthesis error:", err);
      setStatus("error");
      setErrorMessage("Could not synthesize speech.");
    }
  };

  const handleTogglePlay = () => {
    if (status === "loading") return;

    if (status === "playing") {
      if (audioRef.current) {
        audioRef.current.pause();
      } else if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        setStatus("paused");
      }
      return;
    }

    if (status === "paused") {
      if (audioRef.current) {
        audioRef.current.play();
      } else {
        fallbackToSpeechSynthesis(speed);
      }
      return;
    }

    // Status is idle or error: initiate fetch & play
    fetchAndPlayAudio(speed);
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setStatus("playing");
    } else {
      fallbackToSpeechSynthesis(speed);
    }
  };

  const handleChangeSpeed = (newSpeed: TtsSpeed) => {
    setSpeed(newSpeed);
    const multiplier = getRateMultiplier(newSpeed);

    if (audioRef.current) {
      audioRef.current.playbackRate = multiplier;
    } else if (status === "playing" && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      fallbackToSpeechSynthesis(newSpeed);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  // -------------------------------------------------------------
  // INLINE VARIANT (Used inside correction cards & message bubbles)
  // -------------------------------------------------------------
  if (variant === "inline") {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <button
          type="button"
          onClick={handleTogglePlay}
          disabled={status === "loading"}
          className="inline-flex items-center gap-1.5 rounded-full bg-lavender-100 px-3 py-1 text-xs font-semibold text-primary hover:bg-lavender-200 transition-all cursor-pointer active:scale-95 disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Preparing voice...</span>
            </>
          ) : status === "playing" ? (
            <>
              <Pause className="h-3 w-3 fill-primary" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Volume2 className="h-3 w-3" />
              <span>Listen</span>
            </>
          )}
        </button>

        {status === "playing" && (
          <span className="text-[10px] text-text-muted animate-pulse">
            Playing...
          </span>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // COMPACT VARIANT (Used in repeat challenge card & quick actions)
  // -------------------------------------------------------------
  if (variant === "compact") {
    return (
      <div className={`flex items-center justify-between gap-3 rounded-2xl bg-lavender-50 border border-lavender-200 p-3 ${className}`}>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleTogglePlay}
            disabled={status === "loading"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white hover:bg-primary-hover shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-60"
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : status === "playing" ? (
              <Pause className="h-4 w-4 fill-white" />
            ) : (
              <Play className="h-4 w-4 fill-white ml-0.5" />
            )}
          </button>

          <div>
            <span className="text-xs font-bold text-text-main block">
              {status === "loading"
                ? "Preparing voice..."
                : status === "playing"
                ? "Playing sentence aloud"
                : title || "Listen to Pronunciation"}
            </span>
            <span className="text-[11px] text-text-muted">
              {status === "playing" ? `${formatTime(currentTime)} / ${formatTime(duration)}` : "Hear natural cadence & stress"}
            </span>
          </div>
        </div>

        {/* Speed Controls */}
        <div className="flex items-center gap-1 bg-surface rounded-xl p-1 border border-border-subtle">
          {(["slow", "normal", "fast"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleChangeSpeed(s)}
              className={`rounded-lg px-2 py-0.5 text-[10px] font-bold transition-all cursor-pointer ${
                speed === s
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {s === "slow" ? "0.8x" : s === "normal" ? "1.0x" : "1.25x"}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL VARIANT (Used for Stage 1 Listening practice)
  // -------------------------------------------------------------
  return (
    <div className={`rounded-3xl border border-lavender-200 bg-lavender-50 p-6 sm:p-8 space-y-6 ${className}`}>
      {/* Top Header & Provider Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleTogglePlay}
            disabled={status === "loading"}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md hover:bg-primary-hover active:scale-95 transition-all cursor-pointer disabled:opacity-75"
          >
            {status === "loading" ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : status === "playing" ? (
              <Pause className="h-6 w-6 fill-white" />
            ) : (
              <Play className="h-6 w-6 fill-white ml-0.5" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-text-main">
                {title || "Natural English Speech"}
              </h3>
              {provider && (
                <Badge variant={provider === "elevenlabs" ? "purple" : "secondary"} className="text-[10px]">
                  <Sparkles className="h-3 w-3 mr-1" />
                  {provider === "elevenlabs" ? "ElevenLabs Neural" : "Browser Voice"}
                </Badge>
              )}
            </div>

            <p className="text-xs text-text-muted mt-0.5">
              {status === "loading"
                ? "Preparing voice..."
                : status === "playing"
                ? "Playing passage • Listen for sentence rhythm"
                : status === "paused"
                ? "Paused • Click play to resume"
                : "Press play to listen. Listen without translating word-by-word."}
            </p>
          </div>
        </div>

        {/* Speed Controls: Slow / Normal / Fast */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-surface rounded-2xl p-1.5 border border-border-subtle shadow-xs">
          <span className="text-[11px] font-bold text-text-muted px-2">Speed:</span>
          {(["slow", "normal", "fast"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => handleChangeSpeed(s)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                speed === s
                  ? "bg-primary text-white shadow-xs"
                  : "text-text-muted hover:text-text-main hover:bg-surface-subtle"
              }`}
            >
              {s === "slow" ? "Slow (0.8x)" : s === "normal" ? "Normal (1.0x)" : "Fast (1.25x)"}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline scrubber bar & Time display */}
      <div className="space-y-2">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-lavender-200/70">
          <div
            className="h-full bg-primary rounded-full transition-all duration-150"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-text-muted font-medium">
          <span>{formatTime(currentTime)}</span>
          <div className="flex items-center gap-3">
            {(status === "playing" || status === "paused" || currentTime > 0) && (
              <button
                type="button"
                onClick={handleReplay}
                className="flex items-center gap-1 text-primary hover:underline font-semibold cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Replay</span>
              </button>
            )}
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {status === "error" && errorMessage && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-900 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold block">Playback Notice</span>
            <p>{errorMessage}</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => fetchAndPlayAudio(speed)}
              className="mt-2 text-xs rounded-full"
            >
              Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
