/* Challenge 3 — The Ghost's Diary (reading comprehension). */

(function () {
  "use strict";

  const CODE = "TOWER";
  EscapeRoom.progress.initChallengePage(3, CODE);

  const sound = EscapeRoom.sound;
  const feedback = EscapeRoom.feedback;

  const ANSWERS = [
    { id: "q1", answer: "The North Tower" },
    { id: "q2", answer: "The castle's guard" },
    { id: "q3", answer: "A fire started and she didn't make it out" },
  ];

  const feedbackEl = document.getElementById("reading-feedback");

  document.querySelectorAll("[data-question-id]").forEach(function (group) {
    group.addEventListener("click", function (e) {
      const btn = e.target.closest("button");
      if (!btn) return;
      group.querySelectorAll("button").forEach(function (b) {
        b.classList.remove("selected", "correct", "incorrect");
      });
      btn.classList.add("selected");
    });
  });

  document.getElementById("reading-check-btn").addEventListener("click", function () {
    let allCorrect = true;

    for (const { id, answer } of ANSWERS) {
      const group = document.querySelector('[data-question-id="' + id + '"]');
      const selected = group.querySelector(".selected");
      const isCorrect = !!selected && selected.dataset.value === answer;

      group.querySelectorAll("button").forEach(function (b) {
        b.classList.remove("correct", "incorrect");
      });
      if (selected) {
        selected.classList.remove("selected");
        selected.classList.add(isCorrect ? "correct" : "incorrect");
      }
      if (!isCorrect) allCorrect = false;
    }

    if (allCorrect) {
      feedback.clearFeedback(feedbackEl);
      feedback.showFeedback(feedbackEl, "success", "You remember the diary perfectly. The tower reveals its code!");
      window.dispatchEvent(new Event("challenge:solved"));
    } else {
      feedback.showFeedback(feedbackEl, "error", "Some answers are wrong. Re-read the diary and try again.");
      sound.playError();
    }
  });
})();
