/* ======================================================================
   HOMEPAGE REEL — the two scrolling rows of work loops.

   ▶ EDIT THIS LIST any time: change a title/meta/era, add or remove a clip,
     reorder freely. Order doesn't matter — the reel is re-mixed fresh on
     every page load and split across the two rows (desktop and mobile).

     Each entry:  { src, title, meta, era }
       src   — file name (no extension) in assets/work/loops/
               A matching poster must exist at
               assets/work/loops/posters/<src>.webp
       title — the label shown on the clip
       meta  — the small line under it (e.g. "Campaign", "Content")
       era   — 'recent' or 'old'. The reel deals recent and old clips evenly
               across the two rows and interleaves them, so every load shows a
               balanced, mixed spread instead of clustering by chance.

   To add a NEW clip: drop the source into tools/_loop-inbox/, run
   ./tools/encode-loops.sh, make a poster, then add a line here.
   ====================================================================== */
window.MP_REEL = [
  { src: 'nike-006',        title: 'Nike — Air Max Day',                meta: 'Campaign',              era:  'recent' },
  { src: 'hinge-006',       title: 'Hinge — NFAQ',                      meta: 'Campaign',              era: 'recent' },
  { src: 'carousel_cut',    title: 'Philips - Carousel',                meta: 'Interactive, Content',  era: 'old' },
  { src: 'casper_cut',      title: 'Casper - 40,000 Reviews',           meta: 'TVC',                   era: 'recent' },
  { src: 'googleparks',     title: 'Google - National Parks',           meta: 'Interactive, Content',  era: 'old' },
  { src: 'wrangler_cut',    title: 'Wrangler - GYEB',                   meta: 'Interactive, Content',  era: 'old' },
  { src: 'fellowship_cut',  title: 'SJA - Inside the Fellowship',       meta: 'Content',               era: 'recent' },
  { src: 'letters_cut',     title: 'SJA - Letters to a Young Creator',  meta: 'Campaign',              era: 'recent' },
  { src: 'spotify_cut',     title: 'Spotify - Year in Music',           meta: 'Campaign',              era: 'old' },
  { src: 'cardi_cut',       title: 'Spotify - Music School',            meta: 'TVC',                   era: 'recent' },
  { src: 'joji_cut',        title: 'Spotify - RISE x Joji',             meta: 'Content',               era: 'recent' },
  { src: 'twenty_one_cut',  title: 'Spotify - The Bandito Experience',  meta: 'Interactive',           era: 'recent' }
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

  var PER_CLIP = 7.5; // seconds per clip → LOWER = faster (~300px tile ÷ 7.5s ≈ 40px/s)
  var ASSET_V = '?v=2'; // bump when any loop .mp4 / poster is re-encoded in place

  // Fisher–Yates shuffle (in place).
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Alternate two lists (start with the larger) so their members stay spread.
  function interleave(a, b) {
    var big = a.length >= b.length ? a : b;
    var small = a.length >= b.length ? b : a;
    var out = [];
    for (var i = 0; i < big.length || i < small.length; i++) {
      if (i < big.length) out.push(big[i]);
      if (i < small.length) out.push(small[i]);
    }
    return out;
  }

  // Split into eras, shuffle each, then give each row half of the recents and
  // half of the olds (interleaved) — so both rows always carry an even, mixed
  // spread and the content still varies every load.
  var recent = shuffle(items.filter(function (it) { return it.era === 'recent'; }));
  var old    = shuffle(items.filter(function (it) { return it.era !== 'recent'; }));
  var rc = Math.ceil(recent.length / 2), oc = Math.ceil(old.length / 2);
  var rowA = interleave(recent.slice(0, rc), old.slice(0, oc));
  var rowB = interleave(recent.slice(rc),    old.slice(oc));

  function makeClip(it, hidden) {
    var clip = document.createElement('div');
    clip.className = 'clip';
    if (hidden) clip.setAttribute('aria-hidden', 'true');

    var v = document.createElement('video');
    v.setAttribute('data-src', 'assets/work/loops/' + it.src + '.mp4' + ASSET_V);
    v.setAttribute('poster', 'assets/work/loops/posters/' + it.src + '.webp' + ASSET_V);
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

  build(trackA, rowA);
  build(trackB, rowB);

  // Register the freshly-built videos for lazy load/play (js/media.js).
  if (window.MP && window.MP.observeVideos) window.MP.observeVideos(reel);
})();
