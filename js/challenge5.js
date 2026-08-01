/* Challenge 5 — The Ghost's Final Riddle. */

(function () {
  "use strict";

  const CODE = "GHOST";
  EscapeRoom.progress.initChallengePage(5, CODE);

  const sound = EscapeRoom.sound;
  const feedback = EscapeRoom.feedback;

  const ACCEPTABLE_ANSWERS = ["GHOST", "PHANTOM", "SPIRIT"];

  const input = document.getElementById("riddle-answer");
  const feedbackEl = document.getElementById("riddle-feedback");

  function normalize(value) {
    return value.trim().toUpperCase().replace(/^(A|AN|THE)\s+/, "");
  }

  function checkAnswer() {
    const guess = normalize(input.value);
    if (ACCEPTABLE_ANSWERS.includes(guess)) {
      feedback.clearFeedback(feedbackEl);
      input.classList.remove("incorrect");
      input.classList.add("correct");
      feedback.showFeedback(feedbackEl, "success", "The ghost fades into the moonlight, leaving its secret behind...");
      window.dispatchEvent(new Event("challenge:solved"));
    } else {
      input.classList.remove("correct");
      input.classList.add("incorrect");
      feedback.showFeedback(feedbackEl, "error", "Not quite. Read the riddle again carefully.");
      sound.playError();
    }
  }

  document.getElementById("riddle-check-btn").addEventListener("click", checkAnswer);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") checkAnswer();
  });
})();
