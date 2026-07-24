/* Scroll-reveal fallback.

   Where CSS scroll-driven animations are supported (animation-timeline: view())
   the stylesheet handles reveals and this does nothing. Elsewhere we add
   .is-visible as each element nears the viewport.

   Uses scroll + rect math rather than IntersectionObserver so that a browser
   which never delivers observer callbacks can't leave sections stuck at
   opacity 0 — the failure mode here has to be "no animation", never "no page". */
(function () {
  'use strict';

  var supported = window.CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (supported || reduced) return;

  var els = [].slice.call(document.querySelectorAll('[data-reveal]'));
  if (!els.length) return;

  var queued = false;

  function check() {
    queued = false;
    els = els.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < (window.innerHeight || 0) * 0.92 && r.bottom > 0) {
        el.classList.add('is-visible');
        return false;
      }
      return true;
    });
    if (!els.length) {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    }
  }

  function schedule() {
    if (queued) return;
    queued = true;
    (window.requestAnimationFrame || setTimeout)(check, 16);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  schedule();
})();
