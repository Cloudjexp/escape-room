/* Challenge 4 — The Guardians' Torches (logic puzzle). */

(function () {
  "use strict";

  const CODE = "SHIELD";
  EscapeRoom.progress.initChallengePage(4, CODE);

  const sound = EscapeRoom.sound;
  const feedback = EscapeRoom.feedback;

  // Blue is first (clue 1). Gold comes before Silver (clue 2), and Red comes
  // immediately after Silver (clue 3) — the only order that fits all three
  // clues is Blue, Gold, Silver, Red.
  const SOLUTION = [1, 2, 3, 4];

  const row = document.getElementById("torch-row");
  const feedbackEl = document.getElementById("logic-feedback");
  let selectedOrder = [];

  // Shuffle the displayed torch order so the visual left-to-right position
  // never matches the solution order the clues describe.
  const torchEls = Array.from(row.children);
  for (let i = torchEls.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = torchEls[i];
    torchEls[i] = torchEls[j];
    torchEls[j] = tmp;
  }
  torchEls.forEach(function (el) {
    row.appendChild(el);
  });

  function render() {
    row.querySelectorAll(".torch").forEach(function (el) {
      const id = Number(el.dataset.torchId);
      const position = selectedOrder.indexOf(id);
      const badge = el.querySelector(".order-badge");
      if (position === -1) {
        el.classList.remove("lit");
        badge.textContent = "";
      } else {
        el.classList.add("lit");
        badge.textContent = String(position + 1);
      }
    });
  }

  function resetSelection() {
    selectedOrder = [];
    render();
    feedback.clearFeedback(feedbackEl);
  }

  row.addEventListener("click", function (e) {
    const btn = e.target.closest(".torch");
    if (!btn) return;
    const id = Number(btn.dataset.torchId);

    if (selectedOrder[selectedOrder.length - 1] === id) {
      selectedOrder.pop();
      sound.playClick();
      render();
      return;
    }
    if (selectedOrder.includes(id) || selectedOrder.length >= 4) return;

    selectedOrder.push(id);
    sound.playClick();
    render();

    if (selectedOrder.length === 4) {
      const isCorrect = selectedOrder.every(function (val, i) {
        return val === SOLUTION[i];
      });
      setTimeout(function () {
        if (isCorrect) {
          row.querySelectorAll(".torch").forEach(function (el) {
            el.classList.add("animate-flare");
          });
          feedback.showFeedback(feedbackEl, "success", "The torches blaze bright! The shield guardian yields its code.");
          window.dispatchEvent(new Event("challenge:solved"));
        } else {
          row.querySelectorAll(".torch").forEach(function (el) {
            el.classList.add("animate-shake");
          });
          feedback.showFeedback(feedbackEl, "error", "The torches flicker and go dark... study the clues and try again.");
          sound.playError();
          setTimeout(function () {
            row.querySelectorAll(".torch").forEach(function (el) {
              el.classList.remove("animate-shake");
            });
            resetSelection();
          }, 700);
        }
      }, 250);
    }
  });

  document.getElementById("torch-reset-btn").addEventListener("click", resetSelection);
})();
