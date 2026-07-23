/* Home page behaviour: clock, career accordions, headshot carousel,
   and the scroll-reveal fallback for browsers without animation-timeline. */
(function () {
  'use strict';

  /* ---------- Live clock (America/Los_Angeles) ---------- */
  var timeEls = document.querySelectorAll('[data-clock-time]');
  var dateEls = document.querySelectorAll('[data-clock-date]');

  function tick() {
    var now = new Date();
    var time = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Los_Angeles' });
    var date = now.toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', timeZone: 'America/Los_Angeles'
    }).toUpperCase();

    timeEls.forEach(function (el) { el.textContent = time; });
    dateEls.forEach(function (el) { el.textContent = date; });
  }

  if (timeEls.length || dateEls.length) {
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Career accordions (all open by default) ---------- */
  document.querySelectorAll('.jobrow').forEach(function (row) {
    row.addEventListener('click', function () {
      var panel = document.getElementById(row.getAttribute('aria-controls'));
      var open = row.getAttribute('aria-expanded') === 'true';
      row.setAttribute('aria-expanded', String(!open));
      if (panel) panel.setAttribute('data-closed', String(open));
    });
  });

  /* ---------- Headshot carousel ---------- */
  var frame = document.querySelector('[data-shots]');
  if (frame) {
    var slides = Array.prototype.slice.call(frame.querySelectorAll('[data-shot]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-shot-dot]'));
    var index = 0;
    var paused = false;
    var mq = window.matchMedia('(max-width: 720px)');

    /* Mobile only: shape the frame to the active photo. Landscape photos
       keep their wide ratio; square/portrait clamp to a square so the frame
       never grows taller than it is wide. On desktop the CSS 1:1 stands. */
    function fitFrame() {
      if (!mq.matches) { frame.style.aspectRatio = ''; return; }
      var slide = slides[index];
      var img = slide.tagName === 'IMG' ? slide : slide.querySelector('img');
      if (!img) return;
      var apply = function () {
        if (slides[index] !== slide) return;   // a later slide is active now — ignore
        if (!img.naturalWidth) return;
        var ar = img.naturalWidth / img.naturalHeight;
        if (ar < 1) ar = 1;                     // never taller than square
        frame.style.aspectRatio = ar.toFixed(4);
      };
      if (img.complete && img.naturalWidth) apply();
      else img.addEventListener('load', apply, { once: true });
    }

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
      dots.forEach(function (d, n) { d.setAttribute('aria-selected', String(n === index)); });
      fitFrame();
    }

    if (mq.addEventListener) mq.addEventListener('change', fitFrame);
    else if (mq.addListener) mq.addListener(fitFrame);
    window.addEventListener('resize', fitFrame, { passive: true });

    frame.addEventListener('mouseenter', function () { paused = true; });
    frame.addEventListener('mouseleave', function () { paused = false; });

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () { show(n); });
    });

    /* Tap = next; swipe left = next, swipe right = previous. A mostly-
       vertical drag is left alone so the page can still scroll. Click
       advances on desktop (the post-tap synthetic click is ignored). */
    frame.style.cursor = 'pointer';
    var sx = null, sy = null, touchAt = 0;
    frame.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; paused = true;
    }, { passive: true });
    frame.addEventListener('touchend', function (e) {
      touchAt = Date.now();
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      var dy = e.changedTouches[0].clientY - sy;
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        show(index + (dx < 0 ? 1 : -1));       // horizontal swipe
      } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
        show(index + 1);                        // tap → next
      }
      sx = sy = null; paused = false;
    }, { passive: true });
    frame.addEventListener('click', function () {
      if (Date.now() - touchAt < 600) return;   // ignore click synthesized after a tap
      show(index + 1);
    });

    show(0);
    if (slides.length > 1) {
      setInterval(function () { if (!paused) show(index + 1); }, 3800);
    }
  }
})();
