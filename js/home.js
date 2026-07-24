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

    /* Shape the frame to each photo so landscape shots stay landscape and
       aren't cropped into a square. The clamp keeps it from ever going taller
       than a square. Mobile fixes the height (210px) and varies the width;
       desktop fixes the column width and varies the height. Either way just
       one dimension changes between slides and it's CSS-transitioned, so
       tapping through morphs smoothly. */
    var FRAME_H = 210;
    function fitFrame() {
      var slide = slides[index];
      var img = slide.tagName === 'IMG' ? slide : slide.querySelector('img');
      if (!img) return;
      var apply = function () {
        if (slides[index] !== slide) return;   // a later slide is active now — ignore
        if (!img.naturalWidth) return;
        if (!mq.matches) {
          // Desktop: fixed square frame (from CSS). No per-photo sizing — a
          // constant frame means the photos simply cross-fade, no resize.
          frame.style.width = ''; frame.style.height = '';
          return;
        }
        // Mobile: fixed height (from CSS), width follows the photo (landscape
        // wide, square/portrait clamped to square), capped to the column.
        var ar = img.naturalWidth / img.naturalHeight;
        if (ar < 1) ar = 1;                     // never taller than square
        frame.style.height = '';
        var host = frame.parentElement;
        var maxW = (host ? host.clientWidth : frame.clientWidth) || 0;
        var w = Math.round(210 * ar);
        if (maxW) w = Math.min(w, maxW);
        frame.style.width = w + 'px';
      };
      if (img.complete && img.naturalWidth) apply();
      else img.addEventListener('load', apply, { once: true });
    }

    /* Photo 1 has a dedicated landscape crop for mobile. Driving the swap in
       JS (instead of <picture>) means it also switches back to the square
       crop when the viewport grows to desktop — a <picture> source won't,
       once the mobile image has been fetched. */
    var artImg = frame.querySelector('img[data-shot-mobile]');
    function syncArt() {
      if (!artImg) return;
      var want = artImg.getAttribute(mq.matches ? 'data-shot-mobile' : 'data-shot-desktop');
      if (want && artImg.getAttribute('src') !== want) {
        artImg.addEventListener('load', fitFrame, { once: true });
        artImg.setAttribute('src', want);
      }
    }
    syncArt();

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
      dots.forEach(function (d, n) { d.setAttribute('aria-selected', String(n === index)); });
      fitFrame();
      scheduleNext();   // any change (tap, dot, or auto) restarts the countdown
    }

    function onBreakpoint() { syncArt(); fitFrame(); }
    if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
    else if (mq.addListener) mq.addListener(onBreakpoint);
    window.addEventListener('resize', fitFrame, { passive: true });

    frame.addEventListener('mouseenter', function () { paused = true; });
    frame.addEventListener('mouseleave', function () { paused = false; });

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () { show(n); });
    });

    /* A tap (or desktop click) advances to the next photo — no swipe. A touch
       that moves much is treated as a page scroll and ignored, so scrolling
       past the photo doesn't flip it. */
    frame.style.cursor = 'pointer';
    var sx = null, sy = null, touchAt = 0;
    frame.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; paused = true;
    }, { passive: true });
    frame.addEventListener('touchend', function (e) {
      touchAt = Date.now();
      if (sx === null) return;
      var dx = Math.abs(e.changedTouches[0].clientX - sx);
      var dy = Math.abs(e.changedTouches[0].clientY - sy);
      if (dx < 16 && dy < 16) show(index + 1);   // a tap → next (ignore scrolls)
      sx = sy = null; paused = false;
    }, { passive: true });
    frame.addEventListener('click', function () {
      if (Date.now() - touchAt < 600) return;    // ignore the click synthesized after a tap
      show(index + 1);
    });

    /* Auto-advance on a resettable timer: every show() (tap, dot, or the auto
       tick itself) restarts it, so switching by finger gives you a full
       interval on the new photo instead of an about-to-fire leftover. */
    var AUTO_MS = 3800, autoTimer = null;
    function scheduleNext() {
      if (slides.length <= 1) return;
      clearTimeout(autoTimer);
      autoTimer = setTimeout(function () {
        if (paused) scheduleNext();     // hover-paused — check again shortly
        else show(index + 1);           // advance (show() reschedules)
      }, AUTO_MS);
    }

    show(0);
  }
})();
