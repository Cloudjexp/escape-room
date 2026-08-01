/* Escape Room — app-wide bootstrap: sound effects, confetti, feedback
   banners, and the on-load wiring shared by every page (navbar, progress
   bar, and the index page's start button). */

window.EscapeRoom = window.EscapeRoom || {};

(function () {
  "use strict";

  /* ---------------------------------------------------------------- */
  /* Sound effects — synthesized with the Web Audio API, no audio      */
  /* files shipped.                                                    */
  /* ---------------------------------------------------------------- */
  let sharedContext = null;

  function getContext() {
    if (typeof window === "undefined") return null;
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    if (!sharedContext) sharedContext = new AudioCtor();
    if (sharedContext.state === "suspended") sharedContext.resume();
    return sharedContext;
  }

  function tone(ctx, frequency, startTime, duration, type, peakGain) {
    type = type || "sine";
    peakGain = peakGain === undefined ? 0.18 : peakGain;
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

  function playClick() {
    const ctx = getContext();
    if (!ctx) return;
    tone(ctx, 520, ctx.currentTime, 0.08, "triangle", 0.12);
  }

  function playSuccess() {
    const ctx = getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach(function (freq, i) {
      tone(ctx, freq, now + i * 0.11, 0.35, "sine", 0.16);
    });
  }

  function playError() {
    const ctx = getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    tone(ctx, 180, now, 0.28, "sawtooth", 0.14);
    tone(ctx, 140, now + 0.08, 0.28, "sawtooth", 0.14);
  }

  function playVictoryFanfare() {
    const ctx = getContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const melody = [523.25, 523.25, 523.25, 659.25, 783.99, 987.77, 1046.5];
    melody.forEach(function (freq, i) {
      tone(
        ctx,
        freq,
        now + i * 0.16,
        0.5,
        i === melody.length - 1 ? "triangle" : "square",
        0.15
      );
    });
  }

  window.EscapeRoom.sound = {
    playClick: playClick,
    playSuccess: playSuccess,
    playError: playError,
    playVictoryFanfare: playVictoryFanfare,
  };

  /* ---------------------------------------------------------------- */
  /* Confetti — lightweight full-screen canvas burst, no dependency.   */
  /* ---------------------------------------------------------------- */
  const CONFETTI_PALETTE = [
    "#ffd166",
    "#f4b93a",
    "#4fc3ff",
    "#2a9bf0",
    "#fdf6e3",
    "#8fd6ff",
  ];

  function launchConfetti(durationMs) {
    durationMs = durationMs || 3200;
    if (typeof document === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9999";
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      canvas.remove();
      return;
    }

    const dpr = window.devicePixelRatio || 1;
    function resize() {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    }
    resize();

    const count = 160;
    const particles = Array.from({ length: count }, function () {
      return {
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.5,
        vx: (Math.random() - 0.5) * 4,
        vy: 2 + Math.random() * 3,
        size: 6 + Math.random() * 6,
        color: CONFETTI_PALETTE[Math.floor(Math.random() * CONFETTI_PALETTE.length)],
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.3,
        shape: Math.random() > 0.5 ? "rect" : "circle",
      };
    });

    const start = performance.now();
    let rafId = 0;

    function frame(now) {
      const elapsed = now - start;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (elapsed < durationMs) {
        rafId = requestAnimationFrame(frame);
      } else {
        cancelAnimationFrame(rafId);
        canvas.remove();
      }
    }

    rafId = requestAnimationFrame(frame);

    window.addEventListener("resize", resize, { once: true });
  }

  window.EscapeRoom.confetti = { launchConfetti: launchConfetti };

  /* ---------------------------------------------------------------- */
  /* Feedback banners — shared success/error/info messages.            */
  /* ---------------------------------------------------------------- */
  const FEEDBACK_BASE_CLASSES = [
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

  const FEEDBACK_KIND_CLASSES = {
    success: ["border-gold-500/50", "bg-gold-500/10", "text-gold-300"],
    error: ["border-red-500/50", "bg-red-500/10", "text-red-300"],
    info: ["border-azure-500/40", "bg-azure-500/10", "text-azure-200"],
  };

  const FEEDBACK_ICONS = { success: "✨", error: "⚠️", info: "🕯️" };

  const FEEDBACK_ALL_KIND_CLASSES = Object.values(FEEDBACK_KIND_CLASSES).flat();

  function showFeedback(el, kind, message) {
    el.classList.remove("hidden", "animate-shake", ...FEEDBACK_ALL_KIND_CLASSES);
    el.classList.add(...FEEDBACK_BASE_CLASSES, ...FEEDBACK_KIND_CLASSES[kind]);

    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = FEEDBACK_ICONS[kind];
    const text = document.createElement("span");
    text.textContent = message;

    el.replaceChildren(icon, text);

    if (kind === "error") {
      el.classList.remove("animate-shake");
      requestAnimationFrame(function () {
        el.classList.add("animate-shake");
        setTimeout(function () {
          el.classList.remove("animate-shake");
        }, 650);
      });
    }
  }

  function clearFeedback(el) {
    el.classList.add("hidden");
    el.replaceChildren();
  }

  window.EscapeRoom.feedback = {
    showFeedback: showFeedback,
    clearFeedback: clearFeedback,
  };

  /* ---------------------------------------------------------------- */
  /* Page bootstrap — runs on every page.                              */
  /* ---------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    if (window.EscapeRoom.progress) {
      window.EscapeRoom.progress.paintNavbar();
      window.EscapeRoom.progress.paintProgressBar();
    }

    const startBtn = document.getElementById("start-btn");
    if (startBtn) {
      startBtn.addEventListener("click", function () {
        playClick();
      });
    }
  });
})();
