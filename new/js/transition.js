/* Page-transition tester. Sets :root[data-transition] from localStorage
   (so the choice carries across page loads) and shows a pill to switch modes.
   Navigate (Home / prev / next / a case) to feel each one.

   TEMPORARY: once you pick a favourite, hard-code that data-transition
   (or bake its keyframes into the default) and delete this file + the pill. */
(function () {
  'use strict';

  var MODES = ['fade', 'slide', 'up', 'zoom', 'flip', 'none'];
  var root = document.documentElement;

  var saved;
  try { saved = localStorage.getItem('mp_transition'); } catch (e) {}
  var active = MODES.indexOf(saved) >= 0 ? saved : 'fade';
  root.setAttribute('data-transition', active);   // set ASAP for the incoming transition

  var sw = null;
  function apply(m) {
    active = m;
    root.setAttribute('data-transition', m);
    try { localStorage.setItem('mp_transition', m); } catch (e) {}
    if (sw) Array.prototype.forEach.call(sw.children, function (b) {
      b.setAttribute('aria-pressed', b.dataset.tx === m ? 'true' : 'false');
    });
  }

  function build() {
    sw = document.createElement('div');
    sw.className = 'tx-switch';
    MODES.forEach(function (m) {
      var b = document.createElement('button');
      b.type = 'button';
      b.dataset.tx = m;
      b.textContent = m;
      b.addEventListener('click', function () { apply(m); });
      sw.appendChild(b);
    });
    document.body.appendChild(sw);
    apply(active);
  }

  if (document.body) build();
  else document.addEventListener('DOMContentLoaded', build);
})();
