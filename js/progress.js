/* Escape Room — game progress rules, timer, progress bar and navbar UI.
   Builds on top of js/storage.js. */

window.EscapeRoom = window.EscapeRoom || {};

(function () {
  "use strict";

  const storage = window.EscapeRoom.storage;
  const TOTAL_CHALLENGES = 5;

  /** Starts the timer on the very first call; no-op afterwards. */
  function ensureStarted() {
    const progress = storage.getProgress();
    if (!progress.startTime) {
      progress.startTime = Date.now();
      storage.saveProgress(progress);
    }
    return progress;
  }

  function markChallengeComplete(id, code) {
    const progress = storage.getProgress();
    progress.completed[id] = true;
    progress.codes[id] = code;
    storage.saveProgress(progress);
    return progress;
  }

  function isChallengeComplete(id) {
    return !!storage.getProgress().completed[id];
  }

  function completedCount() {
    const progress = storage.getProgress();
    return Object.values(progress.completed).filter(Boolean).length;
  }

  function markFinished() {
    const progress = storage.getProgress();
    progress.finishTime = Date.now();
    storage.saveProgress(progress);
    return progress;
  }

  function formatElapsed(ms) {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return (
      String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
    );
  }

  /** Paints the ✓ dots and elapsed-time clock in the sticky navbar. */
  function paintNavbar() {
    const progress = storage.getProgress();

    document.querySelectorAll(".nav-dot").forEach(function (dot) {
      const id = Number(dot.dataset.challengeId);
      if (progress.completed[id]) {
        dot.classList.add("border-gold-500", "bg-gold-500/20", "text-gold-300");
        dot.classList.remove("text-slate-400");
        dot.textContent = "✓";
      }
    });

    const timerEl = document.getElementById("nav-timer");
    const timerValue = document.getElementById("nav-timer-value");
    if (!timerEl || !timerValue) return;

    if (progress.startTime) {
      timerEl.classList.remove("hidden");
      timerEl.classList.add("flex");
      const tick = function () {
        const end = progress.finishTime || Date.now();
        timerValue.textContent = formatElapsed(end - progress.startTime);
      };
      tick();
      if (!progress.finishTime) {
        setInterval(tick, 1000);
      }
    }
  }

  /** Fills in the "Progress" bar shown at the top of most pages. */
  function paintProgressBar() {
    const fill = document.getElementById("progress-fill");
    const label = document.getElementById("progress-label");
    if (!fill && !label) return;

    const done = completedCount();
    const percent = Math.round((done / TOTAL_CHALLENGES) * 100);

    if (fill) fill.style.width = percent + "%";
    if (label) label.textContent = done + " / " + TOTAL_CHALLENGES + " challenges";
  }

  /**
   * Shared behaviour for every challengeN.html page: starts the timer,
   * reveals the success panel immediately on reload if already solved, and
   * listens for the "challenge:solved" event dispatched by the puzzle script.
   */
  function initChallengePage(id, code) {
    ensureStarted();

    function showSuccessPanel() {
      const panel = document.getElementById("success-panel");
      if (panel) panel.classList.remove("hidden");
    }

    if (isChallengeComplete(id)) {
      showSuccessPanel();
    }

    window.addEventListener("challenge:solved", function () {
      markChallengeComplete(id, code);
      if (window.EscapeRoom.sound) window.EscapeRoom.sound.playSuccess();
      showSuccessPanel();
      const panel = document.getElementById("success-panel");
      if (panel) panel.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  window.EscapeRoom.progress = {
    TOTAL_CHALLENGES: TOTAL_CHALLENGES,
    ensureStarted: ensureStarted,
    markChallengeComplete: markChallengeComplete,
    isChallengeComplete: isChallengeComplete,
    completedCount: completedCount,
    markFinished: markFinished,
    formatElapsed: formatElapsed,
    paintNavbar: paintNavbar,
    paintProgressBar: paintProgressBar,
    initChallengePage: initChallengePage,
  };
})();
