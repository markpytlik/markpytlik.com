/* Cursor-lit spotlight in the white surround behind the card.
   A soft warm glow follows the pointer; the black card masks it, so it only
   reads in the margins (wide screens). Purely decorative — no-ops on touch. */
(function () {
  'use strict';

  var fx = document.querySelector('[data-bg-fx]');
  if (!fx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var raf = 0;
  window.addEventListener('pointermove', function (ev) {
    if (ev.pointerType === 'touch') return;
    var mx = (ev.clientX / window.innerWidth) * 100;
    var my = (ev.clientY / window.innerHeight) * 100;
    if (!raf) raf = requestAnimationFrame(function () {
      raf = 0;
      fx.style.setProperty('--mx', mx.toFixed(1) + '%');
      fx.style.setProperty('--my', my.toFixed(1) + '%');
    });
  }, { passive: true });
})();
