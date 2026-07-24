/* Reduced-motion affordance. When "Reduce Motion" is on, the marquees don't
   auto-scroll — CSS makes them hand-swipeable, and we flag that with a single
   "→" after the relevant section label (Selected work / Lately). No-op
   otherwise. */
(function () {
  'use strict';
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function hint(el) {
    if (!el) return;
    var s = document.createElement('span');
    s.className = 'swipe-hint';
    s.setAttribute('aria-hidden', 'true');
    s.textContent = ' →';
    el.appendChild(s);
  }

  hint(document.querySelector('#projects .section-title')); // Selected work →
  hint(document.querySelector('.lately-label'));            // Lately →
})();
