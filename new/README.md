# markpytlik.com

Static portfolio site — no build step, no dependencies. Every page is plain
HTML/CSS/JS and every path is **relative**, so the site works unchanged at the
domain root or at a subpath like `/new`.

```bash
python3 serve.py     # http://127.0.0.1:4173
```

## Pages

| File | What it is |
|---|---|
| `index.html` | Public single-page scroll: hero → about → career → reel → writing → contact |
| `work.html` | Access-code gate + private case index |
| `casper.html`, `nike.html`, `steve-jobs-archive.html`, `stink-studios-rebrand.html`, `hinge.html` | The five case studies |

## Structure

```
css/site.css    all styling — tokens, components, responsive
js/cases.js     ← all case-study content lives here
js/case.js      renders a case page from cases.js
js/work.js      ← access codes live here; gate + case index
js/home.js      clock, career accordions, headshot carousel
js/media.js     deferred video loading
js/reveal.js    scroll-reveal fallback
js/theme.js     light/dark toggle
assets/work/    imagery and video
```

Case pages are thin shells: `<body data-case="nike">` plus the shared renderer.
To change case copy, media or captions, edit **`js/cases.js`** only.

## Design system

Monochrome; all colour comes from the work. Dark is the default theme and the
choice persists in `localStorage`.

|  | `--bg` | `--text` | `--muted` | `--body` | `--line` | `--surface` |
|---|---|---|---|---|---|---|
| Light | `#FFFFFF` | `#141310` | `#8A8A85` | `#4A4844` | `#E8E8E6` | `#F5F5F4` |
| Dark | `#0B0B0A` | `#F1EFEA` | `#7C7A73` | `#C9C7C0` | `#26251F` | `#161512` |

Type — **Space Grotesk** (display), **Hanken Grotesk** (body), **Space Mono**
(labels/metadata). Content max-width 1200px, 32px gutter, 16px radius.

Motion is gated behind `prefers-reduced-motion`. Scroll reveals use CSS
`animation-timeline: view()` where supported, with a JS fallback elsewhere.

## ⚠ The `/work` gate is not security

The access codes in `js/work.js` and every case study's copy and imagery are in
the **public source of this site**. Anyone who views source, or guesses a case
URL, can read everything. The gate and the per-page deep-link guard stop casual
discovery — nothing more. This matches the prototype's behaviour and its own
warning.

For genuinely private case studies, enforce access on the server: host-level
Basic Auth, signed expiring links, or an edge function that checks a cookie
before serving `work.html` and the case pages.

Four codes are seeded, each mapped to a visitor name and a subset of cases. They
live in the `CODES` map at the top of `js/work.js` — deliberately not repeated
here, since this file is itself served publicly at `/new/README.md`.

Unlocks are recorded to `localStorage.mp_work_visits`. Set `LOG_ENDPOINT` in
`js/work.js` to also POST them to a webhook.

## Before this goes public

- [ ] **Replace the five `VIMEO_ID` placeholders** in `js/cases.js` — one per
      case study. Until then each renders a dashed "add a Vimeo URL" tile.
      Accepts a full Vimeo/YouTube URL or a bare Vimeo id.
- [ ] **Supply headshots** — four slots in `index.html`, currently grey
      placeholders. Replace each `<div class="shot-placeholder" data-shot>`
      with `<img src="…" alt="Mark Pytlik" data-shot>`.
- [ ] **Supply career logos** — three 44×44 slots in `index.html`, same pattern.
- [ ] **Fill in the "Lately" links** in the `index.html` footer marquee — four
      entries, currently `—` pointing at `#`.
- [ ] Decide on real auth for `/work` (see above).
- [ ] Optional: the remaining weight is imagery — `assets/work/hinge/b.png`
      (7.1MB) and `assets/work/sja/c.png` (5.9MB) are photographic content
      stored as PNG. Converting those to JPEG/WebP would cut the site roughly
      in half again.

Video was re-encoded on 2026-07-22 (H.264, `-crf 28` at 640px for the reel
loops, `-crf 26` at 1280px for the case films, audio stripped since every clip
plays muted): **37MB → 4.8MB**, visually indistinguishable at display size.
Re-run that before adding any new clip.

## Notes on the rebuild

Rebuilt from the `design_handoff_markpytlik_portfolio` bundle. Those `.dc.html`
files were design references that rendered through a proprietary runtime
(`support.js`) interpreting custom `<x-dc>` / `<sc-for>` / `{{ }}` syntax; the
handoff explicitly said not to ship that runtime. Copy, tokens, spacing and
interactions here follow the handoff; the runtime is gone.

Two deliberate departures:

- **Theme now persists** across pages via `localStorage` (the prototype reset
  to dark on every navigation).
- **Reel video is deferred** until it nears the viewport, rather than
  autoplaying all 29MB on load.
