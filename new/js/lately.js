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
  { kind: 'Podcast episode', title: 'Ezra Klein × Brian Eno',                           url: 'https://www.nytimes.com/2025/10/03/opinion/ezra-klein-podcast-brian-eno.html' },
  { kind: 'Album',           title: 'Boards of Canada, Inferno',                       url: 'https://boardsofcanada.bandcamp.com/album/inferno' },
  { kind: 'Book',            title: 'Patrick Radden Keefe, London Falling',             url: 'https://bookshop.org/p/books/london-falling-a-mysterious-death-in-a-gilded-city-and-a-family-s-search-for-truth-patrick-radden-keefe/3ae558d23df98afa' },
  { kind: 'Book',            title: 'Vincenzo Latronico, Perfection',                   url: 'https://fitzcarraldoeditions.com/books/perfection/' },
  { kind: 'Album',           title: 'Hayden Pedigo, I'll Be Waving As You Drive Away', url: 'https://haydenpedigo.bandcamp.com/album/ill-be-waving-as-you-drive-away' },
  { kind: 'Fun',         title: 'Clipart.Studio',                                   url: 'https://clipart.studio' }
  { kind: 'Software',         title: 'Flora.AI',                                   url: 'https://flora.ai' }
  { kind: 'Fun',         title: 'The Password Game',                                   url: 'https://neal.fun/password-game/' }  
  { kind: 'Album',         title: 'Aldous Harding, Train on the Island',                                   url: 'https://aldousharding.bandcamp.com/album/train-on-the-island' }
  { kind: 'Browser extension',         title: 'Knockoff',                                   url: 'https://chromewebstore.google.com/detail/knockoff-amazon-brand-fil/pjgickchbiikhdfpmecaabkphmofpdce' }
 { kind: 'Book',            title: 'Emily Witt, Health & Safety',             url: 'https://www.penguinrandomhouse.com/books/718547/health-and-safety-by-emily-witt/' },
 
    

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

  // Reduced motion: keep a single static copy, no scroll.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
