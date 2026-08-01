/* Escape Room — localStorage persistence layer.
   Reads and writes the player's raw progress object. No game rules live
   here — see progress.js for that. */

window.EscapeRoom = window.EscapeRoom || {};

(function () {
  "use strict";

  const STORAGE_KEY = "escape-room-progress";

  function defaults() {
    return { completed: {}, codes: {}, startTime: null, finishTime: null };
  }

  function getProgress() {
    if (typeof localStorage === "undefined") return defaults();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaults();
      const parsed = JSON.parse(raw);
      return Object.assign(defaults(), parsed);
    } catch (err) {
      return defaults();
    }
  }

  function saveProgress(progress) {
    if (typeof localStorage === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }

  function resetProgress() {
    if (typeof localStorage === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  }

  window.EscapeRoom.storage = {
    getProgress: getProgress,
    saveProgress: saveProgress,
    resetProgress: resetProgress,
  };
})();
