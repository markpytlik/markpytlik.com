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

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle('is-active', n === index); });
      dots.forEach(function (d, n) { d.setAttribute('aria-selected', String(n === index)); });
    }

    frame.addEventListener('mouseenter', function () { paused = true; });
    frame.addEventListener('mouseleave', function () { paused = false; });

    dots.forEach(function (dot, n) {
      dot.addEventListener('click', function () { show(n); });
    });

    /* Swipe (mobile): left = next, right = previous */
    var startX = null;
    frame.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX; paused = true;
    }, { passive: true });
    frame.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) show(index + (dx < 0 ? 1 : -1));
      startX = null; paused = false;
    }, { passive: true });

    show(0);
    if (slides.length > 1) {
      setInterval(function () { if (!paused) show(index + 1); }, 3800);
    }
  }
})();
