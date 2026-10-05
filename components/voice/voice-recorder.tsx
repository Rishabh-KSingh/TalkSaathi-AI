"use client";

import * as React from "react";
import { Mic, Square, RotateCcw, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type RecordingState = "idle" | "listening" | "processing" | "success" | "error";

interface VoiceRecorderProps {
  onTranscript: (transcript: string, provider: "elevenlabs" | "mock-mode") => void;
  promptLabel?: string;
  initialTranscript?: string;
  className?: string;
}

export function VoiceRecorder({
  onTranscript,
  promptLabel = "Click microphone to start speaking",
  initialTranscript = "",
  className = "",
}: VoiceRecorderProps) {
  const [state, setState] = React.useState<RecordingState>("idle");
  const [duration, setDuration] = React.useState(0);
  const [transcript, setTranscript] = React.useState(initialTranscript);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [providerUsed, setProviderUsed] = React.useState<"elevenlabs" | "mock-mode" | null>(null);

  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  // Clean up streams on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    setErrorMessage(null);
    setTranscript("");

    // Check browser support
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setState("error");
      setErrorMessage("Microphone recording is not supported in this browser environment.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Choose supported mimeType
      let mimeType = "audio/webm;codecs=opus";
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = MediaRecorder.isTypeSupported("audio/mp4")
          ? "audio/mp4"
          : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "";
      }

      const options = mimeType ? { mimeType } : undefined;
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop audio tracks
        stream.getTracks().forEach((t) => t.stop());
        const audioBlob = new Blob(audioChunksRef.current, {
          type: mimeType || "audio/webm",
        });

        // Submit audio to server STT endpoint
        await uploadAudioToSTT(audioBlob);
      };

      mediaRecorder.start(250); // collect 250ms chunks
      setState("listening");
      setDuration(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.error("Microphone access error:", err);
      setState("error");
      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setErrorMessage("Microphone permission was denied. Please allow microphone access in your browser settings to speak.");
      } else {
        setErrorMessage("Could not connect to microphone. Please check your audio device settings.");
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      setState("processing");
      mediaRecorderRef.current.stop();
    }
  };

  const uploadAudioToSTT = async (audioBlob: Blob) => {
    setState("processing");
    try {
      const formData = new FormData();
      formData.append("file", audioBlob, "recording.webm");

      const response = await fetch("/api/voice/stt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      const recognizedText = data.text || "";
      const provider = data.provider || "mock-mode";

      setTranscript(recognizedText);
      setProviderUsed(provider);
      setState("success");
      onTranscript(recognizedText, provider);
    } catch (err) {
      console.error("STT transcription upload error:", err);
      setState("error");
      setErrorMessage("Something went wrong while processing your voice audio. Please try again.");
    }
  };

  const resetRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }
    setState("idle");
    setDuration(0);
    setErrorMessage(null);
  };

  // Helper format seconds mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${rem < 10 ? "0" : ""}${rem}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="rounded-3xl border border-border-subtle bg-surface-subtle p-6 flex flex-col items-center justify-center text-center space-y-4">
        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {state === "idle" && (
            <Badge variant="purple" className="text-[10px]">Ready to Listen</Badge>
          )}
          {state === "listening" && (
            <Badge variant="warning" className="text-[10px] animate-pulse">
              Listening • {formatTime(duration)}
            </Badge>
          )}
          {state === "processing" && (
            <Badge variant="secondary" className="text-[10px]">
              <Loader2 className="h-3 w-3 mr-1 animate-spin text-primary" />
              Transcribing via ElevenLabs STT...
            </Badge>
          )}
          {state === "success" && (
            <Badge variant="success" className="text-[10px]">
              <CheckCircle2 className="h-3 w-3 mr-1 text-emerald-600" />
              Speech Captured ({providerUsed === "elevenlabs" ? "ElevenLabs Scribe" : "Development Mode"})
            </Badge>
          )}
          {state === "error" && (
            <Badge variant="warning" className="text-[10px] bg-red-50 text-red-700 border-red-200">
              Audio Error
            </Badge>
          )}
        </div>

        {/* Central Action Button */}
        {state === "idle" && (
          <button
            type="button"
            onClick={startRecording}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white hover:bg-primary-hover ring-8 ring-lavender-100 shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Mic className="h-9 w-9" />
          </button>
        )}

        {state === "listening" && (
          <button
            type="button"
            onClick={stopRecording}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-red-600 text-white hover:bg-red-700 ring-8 ring-red-100 animate-pulse shadow-md transition-all cursor-pointer"
          >
            <Square className="h-7 w-7 fill-white" />
          </button>
        )}

        {state === "processing" && (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lavender-200 text-primary ring-8 ring-lavender-100">
            <Loader2 className="h-9 w-9 animate-spin" />
          </div>
        )}

        {(state === "success" || state === "error") && (
          <button
            type="button"
            onClick={resetRecording}
            className="flex h-16 w-16 items-center justify-center rounded-full bg-surface border-2 border-primary text-primary hover:bg-lavender-100 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <RotateCcw className="h-7 w-7" />
          </button>
        )}

        {/* Instruction or status text */}
        <div>
          <h4 className="text-base font-bold text-text-main">
            {state === "idle" && promptLabel}
            {state === "listening" && `Speaking... (${formatTime(duration)})`}
            {state === "processing" && "Processing your speech with ElevenLabs..."}
            {state === "success" && "Transcript ready below"}
            {state === "error" && "Recording could not complete"}
          </h4>

          <p className="text-xs text-text-muted mt-1 max-w-md">
            {state === "idle" && "Speak clearly into your microphone in English. Click when ready."}
            {state === "listening" && "Press the red square button when you are done speaking."}
            {state === "processing" && "Converting your audio into text securely."}
            {state === "success" && "Click the replay icon if you'd like to record again."}
            {state === "error" && errorMessage}
          </p>
        </div>

        {/* Error handling alert */}
        {state === "error" && errorMessage && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs text-red-900 flex items-start gap-2.5 text-left max-w-md">
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Permission or Connection Notice:</span>
              <p>{errorMessage}</p>
              <Button size="sm" variant="outline" onClick={resetRecording} className="mt-2 text-xs rounded-full">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Transcript Display Box */}
      {transcript && (
        <div className="space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-text-main">
              Transcribed Speech Output:
            </span>
            {providerUsed && (
              <span className="text-[10px] font-semibold text-text-light">
                {providerUsed === "elevenlabs" ? "ElevenLabs Scribe STT" : "Development Fallback"}
              </span>
            )}
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-4 text-sm text-text-main italic border-l-4 border-l-primary">
            &ldquo;{transcript}&rdquo;
          </div>
        </div>
      )}
    </div>
  );
}
