/* Reduced-motion affordance. When the visitor has "Reduce Motion" on, the
   marquees don't auto-scroll — so wrap each one, make it hand-swipeable, and
   flag that with white arrows pointing outward (← … →). No-op otherwise.
   The "Lately" marquee keeps its pinned label as the left anchor, so it
   only gets the right arrow. */
(function () {
  'use strict';
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function arrow(side, glyph) {
    var s = document.createElement('span');
    s.className = 'marquee-arrow is-' + side;
    s.setAttribute('aria-hidden', 'true');
    s.textContent = glyph;
    return s;
  }

  var marquees = document.querySelectorAll('.marquee');
  Array.prototype.forEach.call(marquees, function (m) {
    if (m.parentNode && m.parentNode.classList.contains('marquee-swipe')) return;

    var wrap = document.createElement('div');
    wrap.className = 'marquee-swipe';
    m.parentNode.insertBefore(wrap, m);
    wrap.appendChild(m);

    // Lately's left edge is held by the pinned "Lately" label — no left arrow.
    if (!m.classList.contains('lately')) wrap.appendChild(arrow('left', '←'));
    wrap.appendChild(arrow('right', '→'));
  });
})();
