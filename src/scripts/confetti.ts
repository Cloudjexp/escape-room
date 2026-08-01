// Lightweight vanilla-JS confetti burst rendered on a full-screen canvas.
// No external dependency — keeps the bundle tiny and dependency-free.

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  shape: "rect" | "circle";
}

const PALETTE = ["#ffd166", "#f4b93a", "#4fc3ff", "#2a9bf0", "#fdf6e3", "#8fd6ff"];

export function launchConfetti(durationMs = 3200): void {
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
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
  };
  resize();

  const count = 160;
  const particles: Particle[] = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: -20 - Math.random() * window.innerHeight * 0.5,
    vx: (Math.random() - 0.5) * 4,
    vy: 2 + Math.random() * 3,
    size: 6 + Math.random() * 6,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.3,
    shape: Math.random() > 0.5 ? "rect" : "circle",
  }));

  const start = performance.now();
  let rafId = 0;

  function frame(now: number) {
    const elapsed = now - start;
    ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.02;
      p.rotation += p.rotationSpeed;

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.rotation);
      ctx!.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx!.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx!.beginPath();
        ctx!.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();
    }

    if (elapsed < durationMs) {
      rafId = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(rafId);
      canvas.remove();
    }
  }

  rafId = requestAnimationFrame(frame);

  window.addEventListener(
    "resize",
    () => {
      resize();
    },
    { once: true }
  );
}
