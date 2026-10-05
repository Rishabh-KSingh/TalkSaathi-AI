"use client";

import { useSyncExternalStore, useCallback } from "react";
import { AppState } from "@/types";
import { DEFAULT_APP_STATE } from "./defaults";

export const STORAGE_KEY = "talksaathi:v1";
const EVENT_NAME = "talksaathi:state_updated";

let cachedState: AppState | null = null;
let cachedRaw: string | null = null;

function readStateFromStorage(): AppState {
  if (typeof window === "undefined") {
    return DEFAULT_APP_STATE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APP_STATE));
      cachedRaw = JSON.stringify(DEFAULT_APP_STATE);
      cachedState = DEFAULT_APP_STATE;
      return DEFAULT_APP_STATE;
    }

    if (raw === cachedRaw && cachedState) {
      return cachedState;
    }

    const parsed = JSON.parse(raw);
    const merged: AppState = {
      ...DEFAULT_APP_STATE,
      ...parsed,
      profile: {
        ...DEFAULT_APP_STATE.profile,
        ...(parsed.profile || {}),
      },
      progress: {
        ...DEFAULT_APP_STATE.progress,
        ...(parsed.progress || {}),
      },
      todayGoal: {
        ...DEFAULT_APP_STATE.todayGoal,
        ...(parsed.todayGoal || {}),
      },
    };

    cachedRaw = raw;
    cachedState = merged;
    return merged;
  } catch (error) {
    console.error("TalkSaathi LocalStorage parse error, resetting to defaults:", error);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APP_STATE));
    cachedRaw = JSON.stringify(DEFAULT_APP_STATE);
    cachedState = DEFAULT_APP_STATE;
    return DEFAULT_APP_STATE;
  }
}

export function loadAppState(): AppState {
  return readStateFromStorage();
}

export function saveAppState(updates: Partial<AppState>): AppState {
  if (typeof window === "undefined") {
    return DEFAULT_APP_STATE;
  }

  try {
    const current = readStateFromStorage();
    const updated: AppState = {
      ...current,
      ...updates,
      profile: updates.profile ? { ...current.profile, ...updates.profile } : current.profile,
      progress: updates.progress ? { ...current.progress, ...updates.progress } : current.progress,
      todayGoal: updates.todayGoal ? { ...current.todayGoal, ...updates.todayGoal } : current.todayGoal,
    };

    const serialized = JSON.stringify(updated);
    cachedRaw = serialized;
    cachedState = updated;
    localStorage.setItem(STORAGE_KEY, serialized);
    window.dispatchEvent(new Event(EVENT_NAME));
    return updated;
  } catch (error) {
    console.error("Failed to save TalkSaathi state:", error);
    return DEFAULT_APP_STATE;
  }
}

export function resetAppState(): AppState {
  if (typeof window === "undefined") {
    return DEFAULT_APP_STATE;
  }
  const serialized = JSON.stringify(DEFAULT_APP_STATE);
  cachedRaw = serialized;
  cachedState = DEFAULT_APP_STATE;
  localStorage.setItem(STORAGE_KEY, serialized);
  window.dispatchEvent(new Event(EVENT_NAME));
  return DEFAULT_APP_STATE;
}

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): AppState {
  return readStateFromStorage();
}

function getServerSnapshot(): AppState {
  return DEFAULT_APP_STATE;
}

/**
 * Idiomatic React 18/19 hook using useSyncExternalStore for optimal reactivity.
 */
export function useAppState() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const updateState = useCallback((updates: Partial<AppState>) => {
    saveAppState(updates);
  }, []);

  const reset = useCallback(() => {
    resetAppState();
  }, []);

  return {
    state,
    updateState,
    reset,
  };
}
