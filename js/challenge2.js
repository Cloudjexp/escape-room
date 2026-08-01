/* Challenge 2 — The Wizard's Spellbook (grammar). */

(function () {
  "use strict";

  const CODE = "CROWN";
  EscapeRoom.progress.initChallengePage(2, CODE);

  const sound = EscapeRoom.sound;
  const feedback = EscapeRoom.feedback;

  const ANSWERS = [
    { id: "g1", answer: "lived" },
    { id: "g2", answer: "is walking" },
    { id: "g3", answer: "the" },
    { id: "g4", answer: "darker" },
    { id: "g5", answer: "mustn't" },
  ];

  const feedbackEl = document.getElementById("grammar-feedback");
  const lock = document.getElementById("grammar-lock");
  const status = document.getElementById("grammar-lock-status");

  document.getElementById("grammar-check-btn").addEventListener("click", function () {
    let allCorrect = true;
    for (const { id, answer } of ANSWERS) {
      const select = document.getElementById(id);
      const isCorrect = select.value === answer;
      select.classList.toggle("incorrect", !isCorrect && select.value !== "");
      select.classList.toggle("correct", isCorrect);
      if (!isCorrect) allCorrect = false;
    }

    if (allCorrect) {
      feedback.clearFeedback(feedbackEl);
      lock.classList.add("is-open");
      status.textContent = "Unsealed!";
      status.classList.add("text-gold-300");
      feedback.showFeedback(feedbackEl, "success", "The seal shimmers and breaks!");
      window.dispatchEvent(new Event("challenge:solved"));
    } else {
      feedback.showFeedback(feedbackEl, "error", "The spell fizzles... check your grammar and try again.");
      sound.playError();
    }
  });
})();
