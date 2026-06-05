/* explosion-and-feedback.js
   Global helper functions:
   - explodeAllThenShowStats(showStats, options)
   - glimpseCorrectThenContinue(correctSelectorOrElement, callback, options)

   Designed to be included with:
   <script defer src="scripts/explosion-and-feedback.js"></script>
*/

(function () {
  function explodeAllThenShowStats(showStats, options = {}) {
    const {
      selector = ".tile",
      duration = 600,
      distance = 300,
      rotateRange = 360,
      popBefore = false
    } = options;

    const tiles = Array.from(document.querySelectorAll(selector));

    if (!tiles.length) {
      if (typeof showStats === "function") showStats();
      return;
    }

    tiles.forEach(tile => {
      tile.classList.remove("explode", "pop");
      tile.style.visibility = "visible";
      tile.style.opacity = "";
      tile.style.transform = "";

      const angle = Math.random() * Math.PI * 2;
      const dist = distance * (0.6 + Math.random() * 0.4);
      const tx = Math.round(Math.cos(angle) * dist);
      const ty = Math.round(Math.sin(angle) * dist);
      const rot = Math.round((Math.random() - 0.5) * rotateRange);

      tile.style.setProperty("--tx", `${tx}px`);
      tile.style.setProperty("--ty", `${ty}px`);
      tile.style.setProperty("--rot", `${rot}deg`);
    });

    const startExplosion = () => {
      // Force the browser to apply the CSS variables before adding .explode.
      void document.body.offsetWidth;

      tiles.forEach(tile => {
        tile.classList.remove("pop");
        tile.classList.add("explode");
      });
    };

    if (popBefore) {
      tiles.forEach(tile => tile.classList.add("pop"));
      setTimeout(startExplosion, 120);
    } else {
      startExplosion();
    }

    setTimeout(() => {
      tiles.forEach(tile => {
        tile.style.visibility = "hidden";
      });

      if (typeof showStats === "function") {
        showStats();
      }
    }, duration + 80);
  }

  function glimpseCorrectThenContinue(correctSelectorOrElement, callback, options = {}) {
    const {
      glimpseMs = 500,
      delayBefore = 80
    } = options;

    const correctTile = typeof correctSelectorOrElement === "string"
      ? document.querySelector(correctSelectorOrElement)
      : correctSelectorOrElement;

    if (!correctTile) {
      if (typeof callback === "function") callback();
      return;
    }

    setTimeout(() => {
      correctTile.classList.add("correct-glimpse");

      setTimeout(() => {
        correctTile.classList.remove("correct-glimpse");

        if (typeof callback === "function") {
          callback();
        }
      }, glimpseMs);
    }, delayBefore);
  }

  window.explodeAllThenShowStats = explodeAllThenShowStats;
  window.glimpseCorrectThenContinue = glimpseCorrectThenContinue;
})();
