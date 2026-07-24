/* ======================================================================
   HOMEPAGE REEL — the two scrolling rows of work loops.

   ▶ EDIT THIS LIST any time: change a title/meta, add or remove a clip,
     reorder freely. Order doesn't matter — the reel is shuffled fresh on
     every page load and split across the two rows (desktop and mobile).

     Each entry:  { src, title, meta }
       src   — file name (no extension) in assets/work/loops/
               A matching poster must exist at
               assets/work/loops/posters/<src>.webp
       title — the label shown on the clip
       meta  — the small line under it (e.g. "Film · 2021", "Loop")

   To add a NEW clip: drop the source into tools/_loop-inbox/, run
   ./tools/encode-loops.sh, make a poster, then add a line here.
   ====================================================================== */
window.MP_REEL = [
  { src: 'nike-006',                        title: 'Nike — Air Max Day',     meta: 'Loop' },
  { src: 'hinge-006',                       title: 'Hinge — NFAQ',       meta: 'Loop' },
  { src: 'sja-004',                         title: 'SJA - Inside the Fellowship', meta: 'Loop' },
  { src: 'cardi_cut',                       title: 'Spotify - Music School',            meta: 'Loop' },
  { src: 'spotify_cut',                     title: 'Spotify - Year in Music',            meta: 'Loop' },
  { src: 'carousel_cut',                    title: 'Philips - Carousel',           meta: 'Loop' },
  { src: 'casper_cut',                      title: 'Casper - 40000',             meta: 'Loop' },
  { src: 'googleparks',                     title: 'Google - National Parks',       meta: 'Loop' },
  { src: 'joji_cut',                        title: 'Spotify - RISE x Joji',               meta: 'Loop' },
  { src: 'letters_illustrators_composite',  title: 'SJA - Letters to a Young Creator',       meta: 'Loop' },
  { src: 'twenty_one_cut',                  title: 'Spotify - The Bandito Experience',         meta: 'Loop' },
  { src: 'wrangler_cut',                    title: 'Wrangler - Get Your Edge Back',           meta: 'Loop' }
];

/* ─── Builder — no need to edit below ───────────────────────────────── */
(function () {
  'use strict';

  var reel = document.querySelector('[data-reel]');
  var items = (window.MP_REEL || []).slice();
  if (!reel || !items.length) return;

  var trackA = reel.querySelector('.marquee-track');
  var trackB = reel.querySelector('.marquee-track-rev');
  if (!trackA || !trackB) return;

  // Fisher–Yates shuffle — fresh order on every visit.
  for (var i = items.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
  }

  var half = Math.ceil(items.length / 2);
  var PER_CLIP = 32;   // seconds per clip → consistent scroll speed at any count

  function makeClip(it, hidden) {
    var clip = document.createElement('div');
    clip.className = 'clip';
    if (hidden) clip.setAttribute('aria-hidden', 'true');

    var v = document.createElement('video');
    v.setAttribute('data-src', 'assets/work/loops/' + it.src + '.mp4');
    v.setAttribute('poster', 'assets/work/loops/posters/' + it.src + '.webp');
    v.muted = true; v.loop = true; v.playsInline = true;
    v.setAttribute('muted', ''); v.setAttribute('loop', '');
    v.setAttribute('playsinline', ''); v.setAttribute('preload', 'none');
    if (!hidden) v.setAttribute('aria-label', it.title);
    clip.appendChild(v);

    var meta = document.createElement('div');
    meta.className = 'clip-meta';
    var l = document.createElement('span'); l.className = 'label'; l.textContent = it.title;
    var m = document.createElement('span'); m.className = 'meta'; m.textContent = it.meta || '';
    meta.appendChild(l); meta.appendChild(m);
    clip.appendChild(meta);
    return clip;
  }

  function build(track, rowItems) {
    track.textContent = '';
    var frag = document.createDocumentFragment();
    // real copies, then an identical aria-hidden copy for the seamless -50% loop
    rowItems.forEach(function (it) { frag.appendChild(makeClip(it, false)); });
    rowItems.forEach(function (it) { frag.appendChild(makeClip(it, true)); });
    track.appendChild(frag);
    track.style.animationDuration = (rowItems.length * PER_CLIP) + 's';
  }

  build(trackA, items.slice(0, half));
  build(trackB, items.slice(half));

  // Register the freshly-built videos for lazy load/play (js/media.js).
  if (window.MP && window.MP.observeVideos) window.MP.observeVideos(reel);
})();
