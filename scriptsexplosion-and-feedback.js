/* explosion-and-feedback.js
   Global helper functions:
   - explodeAllThenShowStats(showStats, options)
   - glimpseCorrectThenContinue(correctSelectorOrElement, callback, options)
   Designed to be included with <script defer> so functions are available globally.
*/

(function () {
  // Expose functions on window
  function explodeAllThenShowStats(showStats, options = {}) {
    const {
      selector = '.color-block',
      duration = 600,      // ms, should match CSS
      distance = 300,      // px travel distance
      rotateRange = 360,   // degrees
      popBefore = false    // optional tiny pop
    } = options;

    const blocks = Array.from(document.querySelectorAll(selector));
    if (!blocks.length) {
      if (typeof showStats === 'function') showStats();
      return;
    }

    // assign random direction for each block but do not stagger
    blocks.forEach(el => {
      const angle = Math.random() * Math.PI * 2;
      const dist = distance * (0.6 + Math.random() * 0.4);
      const tx = Math.round(Math.cos(angle) * dist);
      const ty = Math.round(Math.sin(angle) * dist);
      const rot = Math.round((Math.random() - 0.5) * rotateRange);

      el.style.setProperty('--tx', `${tx}px`);
      el.style.setProperty('--ty', `${ty}px`);
      el.style.setProperty('--rot', `${rot}deg`);
    });

    // optional pop then explode simultaneously
    if (popBefore) {
      blocks.forEach(el => el.classList.add('pop'));
      setTimeout(() => {
        blocks.forEach(el => el.classList.remove('pop'));
        // force reflow to ensure transform picks up
        void document.body.offsetWidth;
        blocks.forEach(el => el.classList.add('explode'));
      }, 120);
    } else {
      // force reflow to ensure CSS variables applied
      void document.body.offsetWidth;
      blocks.forEach(el => el.classList.add('explode'));
    }

    // wait for animation to finish then hide blocks and show stats
    setTimeout(() => {
      blocks.forEach(el => el.style.visibility = 'hidden');
      if (typeof showStats === 'function') showStats();
    }, duration + 80);
  }

  function glimpseCorrectThenContinue(correctSelectorOrElement, callback, options = {}) {
    const {
      glimpseMs = 220,
      delayBefore = 80
    } = options;

    const correctEl = (typeof correctSelectorOrElement === 'string')
      ? document.querySelector(correctSelectorOrElement)
      : correctSelectorOrElement;

    if (!correctEl) {
      if (typeof callback === 'function') callback();
      return;
    }

    setTimeout(() => {
      correctEl.classList.add('correct-glimpse');
      setTimeout(() => {
        correctEl.classList.remove('correct-glimpse');
        if (typeof callback === 'function') callback();
      }, glimpseMs);
    }, delayBefore);
  }

  // Attach to window
  window.explodeAllThenShowStats = explodeAllThenShowStats;
  window.glimpseCorrectThenContinue = glimpseCorrectThenContinue;
})();
