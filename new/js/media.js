/* Viewport watcher + deferred video loading.

   The reel and case clips total ~29MB. Marking them autoplay in the markup
   makes the browser fetch every one immediately, before anything below the
   fold is on screen. Instead each <video> carries data-src and we attach the
   real src (and play) only once it nears the viewport, pausing it again when
   it leaves so off-screen clips stop decoding.

   This uses plain scroll + rect math rather than IntersectionObserver: it is
   deterministic, works identically everywhere, and can't leave the reel as a
   row of empty boxes if observer callbacks don't arrive. Reads are batched in
   a rAF tick, so the scroll handler stays cheap.

   Call MP.observeVideos() after inserting videos dynamically. */
window.MP = window.MP || {};

(function () {
  'use strict';

  var MARGIN = 300;      // px beyond the viewport that still counts as "near"
  var watched = [];
  var queued = false;

  // vertical-only visibility (used to decide whether a row is on screen at all)
  function verticalNear(el) {
    var r = el.getBoundingClientRect();
    if (!r.width && !r.height) return false;          // not laid out yet
    return r.bottom > -MARGIN && r.top < (window.innerHeight || 0) + MARGIN;
  }

  // full visibility — both axes. The reel is a horizontal marquee, so a clip
  // scrolled off to the side is NOT on screen and shouldn't be decoding. The
  // sideways drift is slow, so a tight horizontal margin still gives plenty of
  // lead time to buffer + start before a clip is actually visible.
  var XMARGIN = 100;
  function near(el) {
    if (!verticalNear(el)) return false;
    var r = el.getBoundingClientRect();
    return r.right > -XMARGIN && r.left < (window.innerWidth || 0) + XMARGIN;
  }

  function anyVerticalNear() {
    for (var i = 0; i < watched.length; i++) if (verticalNear(watched[i])) return true;
    return false;
  }

  function activate(video) {
    // Reduced motion: don't autoplay — the poster frame stays.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!video.src && video.dataset.src) video.src = video.dataset.src;
    var p = video.play();
    if (p && p.catch) p.catch(function () { /* autoplay blocked — leave it */ });
  }

  // While a row is vertically on screen its clips slide sideways under a CSS
  // animation that fires no scroll events — so poll to pause the ones that
  // drift out of view (and resume those that drift in). Only runs while the
  // reel is actually on screen; otherwise scroll events drive the checks.
  var pollTimer = null;
  function managePoll() {
    var need = anyVerticalNear();
    if (need && !pollTimer) pollTimer = setInterval(check, 250);
    else if (!need && pollTimer) { clearInterval(pollTimer); pollTimer = null; }
  }

  function check() {
    queued = false;
    for (var i = 0; i < watched.length; i++) {
      var el = watched[i];
      var isNear = near(el);
      if (isNear && !el.__mpOn) { el.__mpOn = true; activate(el); }
      else if (!isNear && el.__mpOn) { el.__mpOn = false; if (el.src) el.pause(); }
    }
    managePoll();
  }

  function schedule() {
    if (queued) return;
    queued = true;
    (window.requestAnimationFrame || setTimeout)(check, 16);
  }

  window.MP.observeVideos = function (root) {
    var found = (root || document).querySelectorAll('video[data-src]');
    for (var i = 0; i < found.length; i++) {
      if (watched.indexOf(found[i]) === -1) watched.push(found[i]);
    }
    schedule();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  document.addEventListener('DOMContentLoaded', function () { window.MP.observeVideos(); });
  if (document.readyState !== 'loading') window.MP.observeVideos();
})();
