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
        var ar = img.naturalWidth / img.naturalHeight;
        if (ar < 1) ar = 1;                     // never taller than square
        if (mq.matches) {
          // mobile: fixed height, width follows the photo (capped to column)
          frame.style.height = '';
          var host = frame.parentElement;       // .shots column
          var maxW = (host ? host.clientWidth : frame.clientWidth) || 0;
          var w = Math.round(FRAME_H * ar);
          if (maxW) w = Math.min(w, maxW);
          frame.style.width = w + 'px';
        } else {
          // desktop: fixed column width, height follows the photo
          frame.style.width = '';
          var cw = Math.round(frame.getBoundingClientRect().width) || 230;
          frame.style.height = Math.round(cw / ar) + 'px';
        }
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

    /* Tap = next; swipe left = next, right = previous. The active photo
       tracks the finger during a horizontal drag (damped) and springs back
       on release, so the swipe feels connected rather than a blind jump. A
       mostly-vertical drag is left alone so the page can still scroll. Click
       advances on desktop (the post-tap synthetic click is ignored). */
    frame.style.cursor = 'pointer';
    var sx = null, sy = null, touchAt = 0, dragging = false, dragImg = null;
    var SETTLE = 'transform .28s cubic-bezier(.45,0,.15,1), opacity .34s ease';

    function activeImg() {
      var s = slides[index];
      return s.tagName === 'IMG' ? s : s.querySelector('img');
    }
    function releaseDrag() {
      if (!dragImg) return;
      var el = dragImg; dragImg = null;
      el.style.transition = SETTLE;
      el.style.transform = 'translateX(0)';
      setTimeout(function () { el.style.transition = ''; el.style.transform = ''; }, 340);
    }

    frame.addEventListener('touchstart', function (e) {
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; paused = true;
      dragging = false; dragImg = activeImg();
    }, { passive: true });
    frame.addEventListener('touchmove', function (e) {
      if (sx === null || !dragImg) return;
      var dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
      if (!dragging && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) dragging = true;
      if (dragging) {
        var t = Math.max(-70, Math.min(70, dx * 0.35));
        dragImg.style.transition = 'none';
        dragImg.style.transform = 'translateX(' + t.toFixed(1) + 'px)';
      }
    }, { passive: true });
    frame.addEventListener('touchend', function (e) {
      touchAt = Date.now();
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
      releaseDrag();
      if (Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy)) {
        show(index + (dx < 0 ? 1 : -1));        // horizontal swipe
      } else if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
        show(index + 1);                         // tap → next
      }
      sx = sy = null; paused = false; dragging = false;
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
