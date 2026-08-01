// Shared, animated success/error/info banners used across every challenge
// page so feedback feels consistent and game-like everywhere.

export type FeedbackKind = "success" | "error" | "info";

const BASE_CLASSES = [
  "mt-4",
  "flex",
  "items-center",
  "justify-center",
  "gap-2",
  "rounded-xl",
  "border",
  "px-4",
  "py-3",
  "text-sm",
  "font-semibold",
  "animate-pop-in",
];

const KIND_CLASSES: Record<FeedbackKind, string[]> = {
  success: ["border-gold-500/50", "bg-gold-500/10", "text-gold-300"],
  error: ["border-red-500/50", "bg-red-500/10", "text-red-300"],
  info: ["border-azure-500/40", "bg-azure-500/10", "text-azure-200"],
};

const ICONS: Record<FeedbackKind, string> = {
  success: "✨",
  error: "⚠️",
  info: "🕯️",
};

const ALL_KIND_CLASSES = Object.values(KIND_CLASSES).flat();

export function showFeedback(el: HTMLElement, kind: FeedbackKind, message: string): void {
  el.classList.remove("hidden", "animate-shake", ...ALL_KIND_CLASSES);
  el.classList.add(...BASE_CLASSES, ...KIND_CLASSES[kind]);

  const icon = document.createElement("span");
  icon.setAttribute("aria-hidden", "true");
  icon.textContent = ICONS[kind];
  const text = document.createElement("span");
  text.textContent = message;

  el.replaceChildren(icon, text);

  if (kind === "error") {
    el.classList.remove("animate-shake");
    // restart the shake animation even if it's already mid-flight
    requestAnimationFrame(() => {
      el.classList.add("animate-shake");
      setTimeout(() => el.classList.remove("animate-shake"), 650);
    });
  }
}

export function clearFeedback(el: HTMLElement): void {
  el.classList.add("hidden");
  el.replaceChildren();
}
