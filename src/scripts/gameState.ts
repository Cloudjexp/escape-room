// Shared game-progress store, persisted to localStorage so players can
// reload or come back later and continue where they left off.

export interface Progress {
  completed: Record<number, boolean>;
  codes: Record<number, string>;
  startTime: number | null;
  finishTime: number | null;
}

export const TOTAL_CHALLENGES = 5;
const STORAGE_KEY = "escape-room-progress";

function defaults(): Progress {
  return { completed: {}, codes: {}, startTime: null, finishTime: null };
}

export function getProgress(): Progress {
  if (typeof localStorage === "undefined") return defaults();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults();
    const parsed = JSON.parse(raw);
    return { ...defaults(), ...parsed };
  } catch {
    return defaults();
  }
}

export function saveProgress(progress: Progress): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

/** Starts the timer on the very first call; no-op afterwards. */
export function ensureStarted(): Progress {
  const progress = getProgress();
  if (!progress.startTime) {
    progress.startTime = Date.now();
    saveProgress(progress);
  }
  return progress;
}

export function markChallengeComplete(id: number, code: string): Progress {
  const progress = getProgress();
  progress.completed[id] = true;
  progress.codes[id] = code;
  saveProgress(progress);
  return progress;
}

export function isChallengeComplete(id: number): boolean {
  return !!getProgress().completed[id];
}

export function completedCount(): number {
  const progress = getProgress();
  return Object.values(progress.completed).filter(Boolean).length;
}

export function markFinished(): Progress {
  const progress = getProgress();
  progress.finishTime = Date.now();
  saveProgress(progress);
  return progress;
}

export function resetProgress(): void {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function formatElapsed(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}
