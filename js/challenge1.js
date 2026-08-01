/* Challenge 1 — The Library of Whispers (vocabulary matching). */

(function () {
  "use strict";

  const CODE = "RAVEN";
  EscapeRoom.progress.initChallengePage(1, CODE);

  const sound = EscapeRoom.sound;
  const feedback = EscapeRoom.feedback;

  const PAIRS = [
    { id: 1, word: "GLOOMY", meaning: "dark and a little frightening" },
    { id: 2, word: "ANCIENT", meaning: "extremely old, from long ago" },
    { id: 3, word: "ABANDONED", meaning: "empty, because everyone has left it" },
    { id: 4, word: "MYSTERIOUS", meaning: "strange and difficult to explain" },
    { id: 5, word: "EERIE", meaning: "strange in a way that feels frightening" },
    { id: 6, word: "SILENT", meaning: "completely quiet, without any sound" },
  ];

  const wordsEl = document.getElementById("vocab-words");
  const meaningsEl = document.getElementById("vocab-meanings");
  const statusEl = document.getElementById("vocab-status");
  const feedbackEl = document.getElementById("vocab-feedback");

  function shuffled(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
    }
    return copy;
  }

  function renderColumn(container, items, key) {
    for (const item of items) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.pairId = String(item.id);
      btn.textContent = item[key];
      btn.className =
        key === "word"
          ? "option-card rounded-lg px-4 py-3 text-left font-display text-base font-bold tracking-wide text-gold-200"
          : "option-card rounded-lg px-4 py-3 text-left text-sm text-slate-300 sm:text-base";
      container.appendChild(btn);
    }
  }

  renderColumn(wordsEl, shuffled(PAIRS), "word");
  renderColumn(meaningsEl, shuffled(PAIRS), "meaning");

  let selectedWord = null;
  let selectedMeaning = null;
  let matchedCount = 0;

  function evaluate() {
    if (!selectedWord || !selectedMeaning) return;
    const isMatch = selectedWord.dataset.pairId === selectedMeaning.dataset.pairId;

    if (isMatch) {
      selectedWord.classList.remove("selected");
      selectedMeaning.classList.remove("selected");
      selectedWord.classList.add("matched");
      selectedMeaning.classList.add("matched");
      selectedWord.disabled = true;
      selectedMeaning.disabled = true;
      matchedCount++;
      statusEl.textContent = matchedCount + " / " + PAIRS.length + " pairs matched";
      sound.playClick();

      if (matchedCount === PAIRS.length) {
        feedback.showFeedback(feedbackEl, "success", "All pairs matched! The raven awakens...");
        window.dispatchEvent(new Event("challenge:solved"));
      } else {
        feedback.clearFeedback(feedbackEl);
      }

      selectedWord = null;
      selectedMeaning = null;
    } else {
      const badWord = selectedWord;
      const badMeaning = selectedMeaning;
      badWord.classList.add("incorrect");
      badMeaning.classList.add("incorrect");
      feedback.showFeedback(feedbackEl, "error", "That's not a match. Try again.");
      sound.playError();

      setTimeout(function () {
        badWord.classList.remove("selected", "incorrect");
        badMeaning.classList.remove("selected", "incorrect");
      }, 500);

      selectedWord = null;
      selectedMeaning = null;
    }
  }

  wordsEl.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn || btn.disabled) return;
    if (selectedWord) selectedWord.classList.remove("selected");
    selectedWord = btn;
    btn.classList.add("selected");
    evaluate();
  });

  meaningsEl.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn || btn.disabled) return;
    if (selectedMeaning) selectedMeaning.classList.remove("selected");
    selectedMeaning = btn;
    btn.classList.add("selected");
    evaluate();
  });
})();
