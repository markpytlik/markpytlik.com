/* ============================================================
   Case study renderer. Each case page sets data-case="<key>" on
   <body> and this builds the page from window.MP_CASES.

   The deep-link guard below is a prototype convenience, not
   security — see the note at the top of work.js.
   ============================================================ */
(function () {
  'use strict';

  var key = document.body.getAttribute('data-case');
  var c = (window.MP_CASES || {})[key];
  if (!c) return;

  /* ---------- Deep-link guard ---------- */
  try {
    var code = sessionStorage.getItem('mp_work_code');
    var allowed = JSON.parse(sessionStorage.getItem('mp_work_cases') || '[]');
    if (!code || allowed.indexOf(key) === -1) {
      location.replace('work.html');
      return;
    }
  } catch (e) {
    location.replace('work.html');
    return;
  }

  /* ---------- Header ---------- */
  var idxEl = document.getElementById('case-index'); if (idxEl) idxEl.textContent = c.index;
  // Eyebrow keeps just "Category · Year"; client + project go in the headline.
  document.getElementById('case-eyebrow').textContent = c.eyebrow.split(' · ').slice(0, 2).join(' · ');
  document.getElementById('case-title').textContent = c.client ? c.client + ' — ' + c.title : c.title;
  document.getElementById('case-intro').textContent = c.intro;

  var hero = document.getElementById('case-hero');
  hero.src = c.hero.src;
  hero.alt = c.hero.alt;

  /* ---------- Blocks ---------- */
  function el(tag, className) {
    var n = document.createElement(tag);
    if (className) n.className = className;
    return n;
  }

  function figure(child, caption) {
    var fig = el('figure');
    fig.appendChild(child);
    var cap = el('figcaption');
    cap.textContent = caption;
    fig.appendChild(cap);
    return fig;
  }

  function image(src, alt, lazy) {
    var img = el('img');
    img.src = src;
    img.alt = alt || '';
    if (lazy) img.loading = 'lazy';
    return img;
  }

  /* data-src, not src — media.js loads and plays it once it scrolls in. */
  function video(src) {
    var v = el('video');
    v.dataset.src = src;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.preload = 'none';
    return v;
  }

  /* Accepts a full Vimeo/YouTube URL or a bare Vimeo id.
     Returns null for the unfilled 'VIMEO_ID' placeholder. */
  function embedSrc(u) {
    if (!u || u === 'VIMEO_ID') return null;
    var s = String(u), m;
    if ((m = s.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return 'https://player.vimeo.com/video/' + m[1];
    if (/^\d+$/.test(s)) return 'https://player.vimeo.com/video/' + s;
    if ((m = s.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]+)/))) {
      return 'https://www.youtube.com/embed/' + m[1];
    }
    return s;
  }

  function embed(url) {
    var src = embedSrc(url);

    if (!src) {
      var ph = el('div', 'embed-placeholder');
      var label = el('span');
      label.textContent = 'Add a Vimeo URL in js/cases.js';
      ph.appendChild(label);
      return ph;
    }

    var wrap = el('div', 'embed');
    var frame = el('iframe');
    frame.src = src;
    frame.allow = 'autoplay; fullscreen; picture-in-picture';
    frame.allowFullscreen = true;
    frame.loading = 'lazy';
    frame.title = 'Case study video';
    wrap.appendChild(frame);
    return wrap;
  }

  function build(b) {
    if (b.kind === 'image') return figure(image(b.src, b.caption, true), b.caption);
    if (b.kind === 'video') return figure(video(b.src), b.caption);
    if (b.kind === 'embed') return figure(embed(b.url), b.caption);

    if (b.kind === 'text') {
      var p = el('p', 'case-text-block' + (b.lead ? ' is-lead' : ''));
      p.textContent = b.text;
      return p;
    }

    if (b.kind === 'pair') {
      var pair = el('div', 'case-pair');
      pair.style.gridTemplateColumns = b.cols || '1fr 1fr';
      pair.appendChild(figure(image(b.left.src, b.left.caption, true), b.left.caption));
      pair.appendChild(figure(image(b.right.src, b.right.caption, true), b.right.caption));
      return pair;
    }

    return null;
  }

  var blocks = document.getElementById('case-blocks');
  c.blocks.forEach(function (b) {
    var node = build(b);
    if (node) blocks.appendChild(node);
  });

  if (window.MP && window.MP.observeVideos) window.MP.observeVideos(blocks);

  /* ---------- Prev · Home · Next ---------- */
  var foot = document.getElementById('case-foot');
  if (foot) {
    var keys = Object.keys(window.MP_CASES);
    var i = keys.indexOf(key);
    var prev = window.MP_CASES[keys[(i - 1 + keys.length) % keys.length]];
    var next = window.MP_CASES[keys[(i + 1) % keys.length]];
    function footLink(href, label, cls) {
      var a = el('a', cls);
      a.href = href;
      a.textContent = label;
      return a;
    }
    foot.textContent = '';
    foot.appendChild(footLink(prev.href, '← ' + prev.listTitle, 'foot-prev'));
    foot.appendChild(footLink('index.html', 'Home', 'foot-home'));
    foot.appendChild(footLink(next.href, next.listTitle + ' →', 'foot-next'));
  }

  document.title = (c.client ? c.client + ' — ' + c.title : c.title) + ' — Mark Pytlik';
})();
