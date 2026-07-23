/* ======================================================================
   "LATELY" — the rolling marquee of things I'm into.

   ▶ EDIT THIS LIST any time: add, remove, or reorder entries. Order here
     doesn't matter — the list is shuffled fresh on every page load.

     Each entry:  { kind, title, url }
       kind  — the label: Album, Book, Podcast Episode, Website, Film, …
       title — what it is
       url   — where it links (full https:// link; opens in a new tab)

   That's the whole "CMS": edit the array, commit, done.
   ====================================================================== */
window.MP_LATELY = [
  { kind: 'Podcast Episode', title: 'Ezra Klein × Brian Eno',                           url: '#' },
  { kind: 'Album',           title: 'Boards of Canada — Inferno',                       url: '#' },
  { kind: 'Book',            title: 'London Falling, Patrick Radden Keefe',             url: '#' },
  { kind: 'Book',            title: 'Perfection, Vincenzo Latronico',                   url: '#' },
  { kind: 'Album',           title: "Hayden Pedigo — I'll Be Waving As You Drive Away", url: '#' },
  { kind: 'Website',         title: 'Clipart.Studio',                                   url: 'https://clipart.studio' }
];

/* ─── Renderer — no need to edit below ───────────────────────────────── */
(function () {
  'use strict';

  var host = document.querySelector('[data-lately]');
  var items = (window.MP_LATELY || []).slice();
  if (!host || !items.length) return;

  // Fisher–Yates shuffle — random order on every visit.
  for (var i = items.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = items[i]; items[i] = items[j]; items[j] = tmp;
  }

  function buildSet(hidden) {
    var set = document.createElement('span');
    set.className = 'lately-set';
    if (hidden) set.setAttribute('aria-hidden', 'true');

    items.forEach(function (it) {
      var a = document.createElement('a');
      a.className = 'lately-item';
      a.href = it.url || '#';
      if (/^https?:/i.test(it.url || '')) { a.target = '_blank'; a.rel = 'noopener'; }
      if (hidden) a.tabIndex = -1;

      var k = document.createElement('span');
      k.className = 'k';
      k.textContent = it.kind + ': ';
      a.appendChild(k);
      a.appendChild(document.createTextNode(it.title));
      set.appendChild(a);

      var sep = document.createElement('span');
      sep.className = 'sep';
      sep.setAttribute('aria-hidden', 'true');
      sep.textContent = '·';
      set.appendChild(sep);
    });
    return set;
  }

  host.textContent = '';
  var first = buildSet(false);
  host.appendChild(first);
  host.appendChild(buildSet(true)); // identical duplicate → seamless loop

  // Constant, slow scroll (~34px/s) no matter how long the list gets.
  // Retry until the set has laid out (width > 0), and recompute on resize.
  var tries = 0;
  function setSpeed() {
    var w = first.getBoundingClientRect().width;
    if (w > 0) {
      host.style.animationDuration = Math.max(30, Math.round(w / 34)) + 's';
    } else if (tries++ < 60) {
      requestAnimationFrame(setSpeed);
    }
  }
  setSpeed();
  window.addEventListener('load', function () { tries = 0; setSpeed(); });
  var rz;
  window.addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(function () { tries = 0; setSpeed(); }, 200);
  }, { passive: true });
})();
