/* Theme toggle. The initial theme is applied by an inline snippet in each
   page's <head> so there's no flash before this file loads. */
(function () {
  'use strict';

  var KEY = 'mp_theme';

  function current() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    sync();
  }

  function sync() {
    var theme = current();

    // Pill toggle (home / work)
    var pill = document.querySelector('[data-theme-toggle]');
    if (pill) pill.textContent = theme === 'dark' ? 'Light ☀' : 'Dark ☾';

    // Segmented control (case pages)
    document.querySelectorAll('[data-theme-set]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-theme-set') === theme));
    });
  }

  document.addEventListener('click', function (e) {
    var pill = e.target.closest('[data-theme-toggle]');
    if (pill) { apply(current() === 'dark' ? 'light' : 'dark'); return; }

    var set = e.target.closest('[data-theme-set]');
    if (set) apply(set.getAttribute('data-theme-set'));
  });

  sync();
})();
