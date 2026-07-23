/* Awards marquee — fill each half with enough repeats of the awards string
   to exceed the container, so the line is always full and the -50% loop stays
   seamless at any width. Recomputes on resize. */
(function () {
  'use strict';

  var host = document.querySelector('[data-awards]');
  if (!host) return;

  var G = '50+ Cannes Lions\u00A0\u00A0\u00B7\u00A0\u00A025+ D&AD Pencils\u00A0\u00A0\u00B7\u00A0\u00A025+ Webby Awards\u00A0\u00A0\u00B7\u00A0\u00A01\u00D7 Cannes Grand Prix\u00A0\u00A0\u00B7\u00A0\u00A0';

  function build() {
    // Measure one group.
    host.textContent = '';
    var probe = document.createElement('span');
    probe.textContent = G;
    host.appendChild(probe);
    var groupW = probe.getBoundingClientRect().width || 240;
    var containerW = (host.parentElement && host.parentElement.getBoundingClientRect().width) || window.innerWidth;

    // One half must be at least as wide as the container so it never gaps.
    var reps = Math.max(2, Math.ceil((containerW + 240) / groupW));
    var text = new Array(reps + 1).join(G);

    host.textContent = '';
    var a = document.createElement('span');
    a.textContent = text;
    var b = document.createElement('span');
    b.setAttribute('aria-hidden', 'true');
    b.textContent = text;
    host.appendChild(a);
    host.appendChild(b);
  }

  build();
  var rz;
  window.addEventListener('resize', function () {
    clearTimeout(rz);
    rz = setTimeout(build, 200);
  }, { passive: true });
})();
