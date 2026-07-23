/* Reduced-motion affordance. When the visitor has "Reduce Motion" on, the
   marquees don't auto-scroll — so wrap each one, make it hand-swipeable, and
   flag that with white arrows on either side (→ … ←). No-op otherwise. */
(function () {
  'use strict';
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var marquees = document.querySelectorAll('.marquee');
  Array.prototype.forEach.call(marquees, function (m) {
    if (m.parentNode && m.parentNode.classList.contains('marquee-swipe')) return;

    var wrap = document.createElement('div');
    wrap.className = 'marquee-swipe';
    m.parentNode.insertBefore(wrap, m);
    wrap.appendChild(m);

    var left = document.createElement('span');
    left.className = 'marquee-arrow is-left';
    left.setAttribute('aria-hidden', 'true');
    left.textContent = '→';   // →

    var right = document.createElement('span');
    right.className = 'marquee-arrow is-right';
    right.setAttribute('aria-hidden', 'true');
    right.textContent = '←';  // ←

    wrap.appendChild(left);
    wrap.appendChild(right);
  });
})();
