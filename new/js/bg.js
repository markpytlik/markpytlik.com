/* Background-FX tester — four candidate effects for the white surround
   behind the card. Pick one with the pill switcher (bottom center) or via
   ?bg=spotlight|marginalia|drift|ledger. The choice persists in localStorage.

   TEMPORARY: once an effect is chosen, keep that one's CSS, delete the others
   and this switcher, and drop the <script>/<div data-bg-fx> from index.html. */
(function () {
  'use strict';

  var EFFECTS = ['none', 'spotlight', 'marginalia', 'drift', 'ledger'];
  var fx = document.querySelector('[data-bg-fx]');
  if (!fx) return;

  var active = 'none';
  var sw = null;

  function apply(name) {
    EFFECTS.forEach(function (e) { if (e !== 'none') fx.classList.remove('fx-' + e); });
    if (name && name !== 'none') fx.classList.add('fx-' + name);
    active = name;
    try { localStorage.setItem('mp_bg', name); } catch (e) {}
    if (sw) Array.prototype.forEach.call(sw.children, function (b) {
      b.setAttribute('aria-pressed', b.dataset.bg === name ? 'true' : 'false');
    });
  }

  // Resolve the initial effect: ?bg= wins, then the last saved choice.
  var want = new URLSearchParams(location.search).get('bg');
  if (!want) { try { want = localStorage.getItem('mp_bg'); } catch (e) {} }
  var initial = EFFECTS.indexOf(want) >= 0 ? want : 'none';

  // Build the switcher pill.
  sw = document.createElement('div');
  sw.className = 'bg-switch';
  EFFECTS.forEach(function (e) {
    var b = document.createElement('button');
    b.type = 'button';
    b.dataset.bg = e;
    b.textContent = e;
    b.addEventListener('click', function () { apply(e); });
    sw.appendChild(b);
  });
  document.body.appendChild(sw);

  apply(initial);

  // Spotlight — warm glow tracks the cursor.
  var raf = 0;
  window.addEventListener('pointermove', function (ev) {
    if (active !== 'spotlight') return;
    var mx = (ev.clientX / window.innerWidth) * 100;
    var my = (ev.clientY / window.innerHeight) * 100;
    if (!raf) raf = requestAnimationFrame(function () {
      raf = 0;
      fx.style.setProperty('--mx', mx.toFixed(1) + '%');
      fx.style.setProperty('--my', my.toFixed(1) + '%');
    });
  }, { passive: true });

  // Ledger — faint rules parallax against the scroll.
  var sraf = 0;
  window.addEventListener('scroll', function () {
    if (active !== 'ledger') return;
    if (!sraf) sraf = requestAnimationFrame(function () {
      sraf = 0;
      fx.style.setProperty('--ledger', (-window.scrollY * 0.3).toFixed(1));
    });
  }, { passive: true });
})();
