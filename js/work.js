/* ============================================================
   Work — access gate + case index.

   ⚠ THIS IS NOT SECURITY. The codes below and every case study's
   copy and imagery are in the public source of this site. Anyone who
   views source, or guesses a case URL, can read everything. It gates
   casual discovery only.

   For genuinely private case studies, enforce access on the server:
   host-level Basic Auth, signed expiring links, or an edge function
   that checks a cookie before serving /work and the case pages.
   ============================================================ */
(function () {
  'use strict';

  // ── Access codes ────────────────────────────────────────────
  //  One code per person. Each lists the case studies they can see.
  //  Case keys: casper, nike, sja, stink, hinge. Matched case-insensitively.
  //  `name` shows after "Welcome, ". `note` is the personalized one-line
  //  message under the heading — customise it per invite.
  // Access codes removed from the public source pending a real server-side
  // gate (Cloudflare). Previous codes are in git history. Empty = no code
  // unlocks anything for now.
  var CODES = {};

  // ── Visit tracking ──────────────────────────────────────────
  //  Set to a webhook URL (Google Apps Script Web App, serverless
  //  function, …) to record visits. Empty = local record only,
  //  in localStorage under mp_work_visits.
  var LOG_ENDPOINT = '';

  var CASES = window.MP_CASES || {};

  var lockView = document.getElementById('locked');
  var unlockView = document.getElementById('unlocked');
  var form = document.getElementById('lock-form');
  var input = document.getElementById('lock-input');
  var field = document.getElementById('lock-field');
  var errorEl = document.getElementById('lock-error');
  var visitorEl = document.getElementById('visitor');
  var noteEl = document.getElementById('work-note');
  var listEl = document.getElementById('caselist');
  var lockBtn = document.getElementById('lock-again');

  function logVisit(code, entry) {
    var payload = {
      code: code,
      visitor: entry.name,
      cases: entry.cases,
      time: new Date().toISOString(),
      ua: navigator.userAgent || '',
      ref: document.referrer || ''
    };

    try {
      var log = JSON.parse(localStorage.getItem('mp_work_visits') || '[]');
      log.push(payload);
      localStorage.setItem('mp_work_visits', JSON.stringify(log.slice(-500)));
    } catch (e) {}

    if (!LOG_ENDPOINT) return;
    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        navigator.sendBeacon(LOG_ENDPOINT, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
      } else {
        fetch(LOG_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
          body: body
        });
      }
    } catch (e) {}
  }

  function render(entry) {
    visitorEl.textContent = entry.name;
    if (noteEl) noteEl.textContent = entry.note || '';
    listEl.innerHTML = '';

    entry.cases.filter(function (k) { return CASES[k]; }).forEach(function (key, i) {
      var c = CASES[key];
      var row = document.createElement('a');
      row.className = 'caserow';
      row.href = c.href;

      var n = document.createElement('span');
      n.className = 'n';
      n.textContent = String(i + 1).padStart(2, '0');

      var img = document.createElement('img');
      img.src = c.thumb;
      img.alt = c.listTitle;
      img.loading = 'lazy';

      var text = document.createElement('div');
      text.className = 'case-text';
      var title = document.createElement('span');
      title.className = 'title';
      title.textContent = c.listTitle;
      var blurb = document.createElement('span');
      blurb.className = 'blurb';
      blurb.textContent = c.listBlurb;
      text.appendChild(title);
      text.appendChild(blurb);

      var meta = document.createElement('span');
      meta.className = 'case-meta';
      meta.textContent = c.listMeta;

      var arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';

      [n, img, text, meta, arrow].forEach(function (el) { row.appendChild(el); });
      listEl.appendChild(row);
    });

    var rule = document.createElement('div');
    rule.className = 'rule';
    listEl.appendChild(rule);
  }

  function unlock(code, entry) {
    try {
      sessionStorage.setItem('mp_work_code', code);
      sessionStorage.setItem('mp_work_cases', JSON.stringify(entry.cases));
    } catch (e) {}
    render(entry);
    lockView.hidden = true;
    unlockView.hidden = false;
  }

  function lock() {
    try {
      sessionStorage.removeItem('mp_work_code');
      sessionStorage.removeItem('mp_work_cases');
    } catch (e) {}
    input.value = '';
    errorEl.hidden = true;
    unlockView.hidden = true;
    lockView.hidden = false;
    input.focus();
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var code = input.value.trim().toLowerCase();
    var entry = CODES[code];

    if (entry) {
      errorEl.hidden = true;
      logVisit(code, entry);
      unlock(code, entry);
    } else {
      errorEl.hidden = false;
      field.classList.remove('is-error');
      void field.offsetWidth; // restart the shake
      field.classList.add('is-error');
    }
  });

  input.addEventListener('input', function () {
    errorEl.hidden = true;
    field.classList.remove('is-error');
  });

  lockBtn.addEventListener('click', lock);

  // Restore an existing session
  try {
    var saved = sessionStorage.getItem('mp_work_code');
    if (saved && CODES[saved]) unlock(saved, CODES[saved]);
  } catch (e) {}
})();
