// Tiny sound-effects engine built on the Web Audio API.
// No binary audio assets are shipped — every effect is synthesized on the
// fly, which keeps the repo small and works offline.

let sharedContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!sharedContext) sharedContext = new AudioCtor();
  if (sharedContext.state === "suspended") sharedContext.resume();
  return sharedContext;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  type: OscillatorType = "sine",
  peakGain = 0.18
): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(peakGain, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playClick(): void {
  const ctx = getContext();
  if (!ctx) return;
  tone(ctx, 520, ctx.currentTime, 0.08, "triangle", 0.12);
}

export function playSuccess(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    tone(ctx, freq, now + i * 0.11, 0.35, "sine", 0.16);
  });
}

export function playError(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  tone(ctx, 180, now, 0.28, "sawtooth", 0.14);
  tone(ctx, 140, now + 0.08, 0.28, "sawtooth", 0.14);
}

export function playVictoryFanfare(): void {
  const ctx = getContext();
  if (!ctx) return;
  const now = ctx.currentTime;
  const melody = [523.25, 523.25, 523.25, 659.25, 783.99, 987.77, 1046.5];
  melody.forEach((freq, i) => {
    tone(ctx, freq, now + i * 0.16, 0.5, i === melody.length - 1 ? "triangle" : "square", 0.15);
  });
}
