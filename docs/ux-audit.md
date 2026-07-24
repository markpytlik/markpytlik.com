# markpytlik.com/new — Production UX Audit (Mobile-First)

> Living document. Every issue is numbered (`M-###`) so we can work through
> them systematically and check them off. Evidence: full-page Playwright
> captures in [`ux-audit-assets/`](./ux-audit-assets/) across 10 viewports
> (320 → 1440), plus machine diagnostics in
> [`ux-audit-diagnostics.json`](./ux-audit-diagnostics.json).

**Audited build:** commit at time of capture (post "slide transition" commit).
**Method:** Chromium via Playwright, `deviceScaleFactor: 2`, motion frozen for
stable capture, full-page screenshots of `home`, `work-locked`,
`work-unlocked`, `case-casper`, `case-nike` at `320/360/375/390/414/430/768/1024/1280/1440`.
**Focus split:** ~70% mobile, ~30% desktop.

---

## Executive Summary

This is a **distinctive, well-crafted editorial site with a real point of
view** — a confident monochrome type system (Space Grotesk / Hanken Grotesk /
Space Mono), a genuine design-token layer, and a memorable "dark card floating
on white" concept. The bones are good and the desktop hero reads premium.

But it **would not pass a launch review at Apple / Linear / Stripe / Vercel /
Airbnb today**, and the reason is not taste — it's that the product ships
**visibly unfinished content and has real accessibility and ergonomics gaps**:

- **Every case study displays literal placeholder tiles reading "ADD A VIMEO URL
  IN JS/CASES.JS."** That single issue tanks perceived quality for the exact
  audience the private work is meant to impress. (`M-001`)
- **Case-study videos have no poster and render as black rectangles** until they
  lazy-load on scroll. (`M-002`)
- **The access gate is a dead end** — after removing "Email for access," a
  visitor without a code has no way to request one. (`M-003`)
- **Keyboard focus is essentially invisible** — exactly one `:focus` rule
  exists in the entire stylesheet. (`M-004`)
- On mobile the **career section is fully expanded by default**, producing a
  ~3,700px scroll with **no navigation of any kind** to escape it. (`M-005`, `M-008`)

None of these are subtle. They are the kind of thing a reviewer notices in the
first 20 seconds. The good news: most are **quick, high-leverage fixes** — the
design foundation doesn't need rework, the finishing does.

### Scores (1–10)

| Dimension | Score | One-line rationale |
|---|---|---|
| Visual Design | **7** | Strong monochrome type system; dragged down by placeholder tiles, black videos, oversized case heads |
| Mobile UX | **4** | Endless scroll, zero wayfinding, tiny targets, expanded career, placeholder content |
| Desktop UX | **6** | Handsome hero, but the card frame is invisible on the most common laptop widths |
| Accessibility | **3** | Only one focus style in the whole site; sub-24px targets; auto-rotating carousel; client-only "private" gate |
| Performance | **5** | Images optimized + lazy, but no image dimensions (CLS), no case posters, render-blocking fonts |
| Code Quality | **6** | Clean dependency-free vanilla, but marquee logic triplicated, dead CSS, client-only guard |
| Design System | **6** | Good tokens; no focus/button/target primitives; marquee reimplemented three ways |
| Product Polish | **4** | Placeholder tiles + black video boxes = reads as a prototype |
| Brand | **7** | Distinctive editorial identity; the card concept is memorable *when it's visible* |
| Conversion | **3** | Dead-end gate, muted single CTA, no path to the work from the home page |
| **Overall** | **5** | A promising, distinctive design undercut by unfinished content, a11y gaps, and mobile ergonomics |

**Would it pass at Apple/Linear/Stripe/Notion/Vercel/Airbnb?** No — not until
`M-001`–`M-005` are fixed. After the top-10 list below, it plausibly reaches a
7.5–8 overall; the ceiling is high because the foundation is strong.

---

## Top Issues

Severity: **P0** = ship-blocker · **P1** = high · **P2** = medium · **P3** = polish.
Effort: **S** ≤30min · **M** 1–4h · **L** >4h / architectural.

### P0 — Ship-blockers

#### M-001 · Placeholder "ADD A VIMEO URL" tiles are shown to visitors in every case study
- **Category:** Product Polish / Content · **Severity:** P0 · **Effort:** M · **Impact:** Very high
- **Evidence:** [`case-casper-375.webp`](./ux-audit-assets/case-casper-375.webp) (two dashed tiles: "ADD A VIMEO URL IN JS/CASES.JS" / "CAMPAIGN FILM — ADD YOUR VIMEO LINK"). `grep VIMEO_ID js/cases.js` → **6 occurrences** across the cases.
- **User impact:** The private case studies are the highest-stakes content — shown to hiring managers and clients — and they display author-facing TODO text. It reads as broken/unfinished and undercuts every claim of craft on the home page.
- **Why it matters:** Perceived quality collapses the instant a viewer sees build instructions in the UI.
- **Fix:** Populate the real Vimeo/YouTube URLs in `js/cases.js`. **Interim:** in `js/case.js` `embed()`, if the URL is the `VIMEO_ID` placeholder, render *nothing* (skip the block) instead of the dashed "Add a Vimeo URL" tile.
- **Files:** `js/cases.js` (6 `VIMEO_ID`), `js/case.js` (`embed()`, `.embed-placeholder`), `css/site.css` (`.embed-placeholder`).

#### M-002 · Case-study videos have no poster → black rectangles until they lazy-load
- **Category:** Performance / Polish · **Severity:** P0 · **Effort:** M · **Impact:** High
- **Evidence:** [`case-casper-375.webp`](./ux-audit-assets/case-casper-375.webp) (large empty dark blocks where `casper-film1.mp4`, `casper-film2.mp4` sit). `js/case.js` `video()` sets `preload='none'`, no `poster`.
- **User impact:** As you scroll a case, video slots are black voids with only a caption, then pop to content — jarring, and looks broken on a slow connection or if autoplay is blocked.
- **Why it matters:** The home-page reel got poster stills; the case pages (the more important surface) didn't. Inconsistent and worse where it counts.
- **Fix:** Generate poster frames for every case video (reuse the `ffmpeg` first-frame approach already used for the reel), and set `video.poster` in `js/case.js`. Also give videos an aspect-ratio box so they reserve space (see `M-011`).
- **Files:** `js/case.js` (`video()`), `assets/work/**`, `tools/` (a poster script mirroring the reel one).

#### M-003 · The access gate is a dead end — no way to request a code
- **Category:** Conversion / UX · **Severity:** P0 · **Effort:** S · **Impact:** High
- **Evidence:** [`work-locked-375.webp`](./ux-audit-assets/work-locked-375.webp). `grep -c "mailto|access|request" work.html` → **0**. "Email for access" was removed earlier.
- **User impact:** A recruiter who lands on `/work` without a code sees a password box and… nothing else. No email, no "request access," no context. They leave.
- **Why it matters:** This is the single most important conversion surface (gate to the actual portfolio) and it currently converts to zero.
- **Fix:** Add a low-key "Don't have a code? Email me →" `mailto:` link under the form (the same muted style used elsewhere).
- **Files:** `work.html` (locked view).

#### M-004 · Keyboard focus is essentially invisible sitewide
- **Category:** Accessibility (WCAG 2.4.7) · **Severity:** P0 · **Effort:** S · **Impact:** High
- **Evidence:** `grep ':focus' css/site.css` → **1 rule** (`.lockinput:focus`). Every link/button/dot/toggle relies on default UA outlines, which the bespoke styling largely suppresses (`a { color: inherit }`, custom buttons).
- **User impact:** Keyboard and switch users cannot see where they are. Fails WCAG 2.2 AA.
- **Fix:** Add a global `:focus-visible` token — e.g. `:where(a, button, input, [tabindex]):focus-visible { outline: 2px solid var(--text); outline-offset: 3px; border-radius: 4px; }`. One block, whole-site coverage.
- **Files:** `css/site.css`.

### P1 — High

#### M-005 · Mobile career section is fully expanded by default → ~3,700px page
- **Category:** Mobile UX · **Severity:** P1 · **Effort:** M · **Impact:** High
- **Evidence:** [`home-375.webp`](./ux-audit-assets/home-375.webp) is `7386px @2x` (~3,700 CSS px). All three job panels render open (`data-closed="false"`). Chevrons imply collapsibility, but nothing is collapsed.
- **User impact:** Career alone is ~3 screens; the whole page is ~10 screens with no way to jump. Most visitors never reach Writing/Contact.
- **Fix:** On mobile, collapse job panels by default (`data-closed="true"`) so each role is a tappable summary; keep them open on desktop. Consider showing the current role open, the rest collapsed.
- **Files:** `index.html` (`data-closed`), `js/home.js` (accordion), `css/site.css` (`@media`).

#### M-006 · Reel clip labels are clipped by the marquee edge-mask
- **Category:** Visual Polish · **Severity:** P1 · **Effort:** S · **Impact:** Medium
- **Evidence:** [`home-375.webp`](./ux-audit-assets/home-375.webp) — the first reel label reads "**ike** — Air Max" (the "N" is faded out by the `.marquee` gradient mask). Diagnostics show `.clip-meta`/`.label` bleeding past the fade edge.
- **Why it matters:** Truncated words look like a rendering bug, not a design choice.
- **Fix:** Either drop the labels from the auto-scrolling reel, move labels outside the masked track, or reduce the mask so text isn't caught mid-fade. Simplest: the reel is decorative — remove per-clip labels on mobile.
- **Files:** `css/site.css` (`.marquee` mask, `.clip-meta`), `index.html` (reel).

#### M-007 · Sub-target tap sizes: 6×6px carousel dots, 30×16px "Home", ~17px links
- **Category:** Accessibility (WCAG 2.5.8) · **Severity:** P1 · **Effort:** S · **Impact:** Medium-High
- **Evidence:** Diagnostics `home@375`: `BUTTON 6x6` (headshot dots), plus many 17–18px-tall links. `case-*@375`: `Home 30x16`, foot links 16px tall.
- **User impact:** Misfires, especially the 6px carousel dots (below even the 24px WCAG 2.2 minimum) and the tiny "Home" in the case foot.
- **Fix:** Give dots a ≥24px (ideally 44px) invisible hit area (`padding` + transparent box, keep the 6px visual). Give footer/foot links `padding` to reach ≥24px height and space them.
- **Files:** `css/site.css` (`.shot-dots button`, `.case-foot a`, `.footer-row .social a`, `.lately`).

#### M-008 · No navigation anywhere — no wayfinding on a 10-screen page
- **Category:** Mobile UX / IA · **Severity:** P1 · **Effort:** M · **Impact:** High
- **Evidence:** Nav was removed from all pages; the home page is one long scroll with no jump links, no "back to top," no path to `/work` or Contact.
- **User impact:** On mobile especially, users can't skip to what they want or get back. High friction, feels endless.
- **Why it matters:** Removing the nav was a deliberate aesthetic call, but it left zero wayfinding. Even minimalist portfolios keep *some* affordance.
- **Fix (in keeping with the aesthetic):** A minimal, appearing-on-scroll-up floating control — e.g. a small "index" chip that opens About/Career/Work/Writing/Contact anchors, or at least a "Selected work ↗" + "Back to top ↑". Keep it mono, low-contrast, out of the way.
- **Files:** `index.html`, new small JS/CSS.

#### M-009 · Case images reserve no space (no width/height/aspect) → CLS
- **Category:** Performance (CLS) · **Severity:** P1 · **Effort:** S · **Impact:** Medium
- **Evidence:** `js/case.js` `image()` sets neither `width`/`height` nor an aspect box; case bodies are image-heavy.
- **User impact:** Content jumps as each image loads — measurable CLS, feels unstable while scrolling a case.
- **Fix:** Store intrinsic dimensions per block in `cases.js` (the builder can emit them) and set `img.width/height`, or wrap figures in an `aspect-ratio` container. Same for videos (`M-002`).
- **Files:** `js/case.js`, `js/cases.js`, `css/site.css` (`.case-blocks figure`).

#### M-010 · The card frame — the site's signature concept — is invisible on common laptops
- **Category:** Desktop UX / Brand · **Severity:** P1 · **Effort:** S · **Impact:** Medium-High
- **Evidence:** `.page-card`/`.ink` `max-width: calc(var(--maxw) + 96px)` = **1296px**. Below ~1360px viewport the card fills the width and the white surround disappears. That means every **1024–1300px laptop** (a huge share of traffic) never sees the "floating card" — the whole brand device is desktop-ultrawide-only.
- **User impact:** The concept that ties the site together is absent for most desktop users; the site just looks like a dark page to them.
- **Fix:** Give the card a visible surround at all widths ≥ ~700px — e.g. cap it below viewport (`min(1296px, 100vw - 64px)`) with a consistent margin, so the frame always shows.
- **Files:** `css/site.css` (`.page-card`, `.ink`, `.case-page` padding).

#### M-011 · Auto-advancing headshot carousel (3.8s) with 6px dots and no pause
- **Category:** Accessibility (WCAG 2.2.2) / UX · **Severity:** P1 · **Effort:** S · **Impact:** Medium
- **Evidence:** `js/home.js` `setInterval(... show(index+1) ..., 3800)`. Dots are 6px (`M-007`). Motion auto-starts.
- **User impact:** Auto-rotating content is a known a11y/UX anti-pattern (moving content that can't be paused), and the controls to stop it are 6px.
- **Fix:** Pause on `prefers-reduced-motion`; ensure it pauses on focus/hover/touch; enlarge the dot hit areas; consider advancing only on interaction.
- **Files:** `js/home.js`, `css/site.css`.

### P2 — Medium

#### M-012 · Case-foot "previous" wraps to the *last* case on the first case
- **Category:** UX · **Severity:** P2 · **Effort:** S. On Casper (case 01) the foot shows "← Hinge — NFAQ" (cyclic). Users read "←" as "the case before this," not "loop to the end." Either disable prev on the first / next on the last, or label it "Start over ↺".
- **Files:** `js/case.js` (foot logic).

#### M-013 · Three auto-scrolling marquees, no touch pause
- **Category:** Mobile UX / A11y · **Severity:** P2 · **Effort:** M. Reel, awards, and Lately all auto-scroll; `:hover` pause doesn't exist on touch. Add a tap-to-pause or reduce reliance on marquees on mobile. `prefers-reduced-motion` is respected (good), but that's opt-in. **Files:** `css/site.css`, `js/lately.js`, `js/awards.js`.

#### M-014 · Weak, single, low-emphasis CTA
- **Category:** Conversion · **Severity:** P2 · **Effort:** S. The only home CTA is "Please email for selected case studies" in muted 13px — easy to miss. Contact's email block was removed. Give the primary action real emphasis (a proper button or a larger mono link) and make Contact reachable. **Files:** `index.html`.

#### M-015 · Contact section lost its heading — reads as a stray footer
- **Category:** IA / Hierarchy · **Severity:** P2 · **Effort:** S. Removing "CONTACT" left the footer + Lately with no anchor label, breaking the consistent ABOUT/CAREER/SELECTED WORK/WRITING rhythm. Consider restoring a minimal "CONTACT" or "GET IN TOUCH" label for section parity. **Files:** `index.html`.

#### M-016 · Reel clips are unlabeled links to nowhere / decorative only
- **Category:** UX value · **Severity:** P2 · **Effort:** M. The reel auto-scrolls decorative loops that aren't clickable and (on mobile) clip their labels. High motion, low information. Consider making clips tappable to the relevant case, or cutting the reel on mobile. **Files:** `index.html`, `css/site.css`.

#### M-017 · Spotlight background effect: desktop-only, visible only in >1300px margins
- **Category:** Effort/payoff · **Severity:** P2 · **Effort:** S. The cursor spotlight (`js/bg.js`) only shows in the white surround, which itself only exists >1300px (`M-010`). Most users never see it. Fix the frame (`M-010`) and it pays off; otherwise it's dead weight. **Files:** `js/bg.js`, `css/site.css`.

#### M-018 · Render-blocking Google Fonts; 3 families, many weights
- **Category:** Performance (LCP/FOIT) · **Severity:** P2 · **Effort:** S. `<link>` to Google Fonts in `<head>` blocks render; `display=swap` mitigates FOIT but invites FOUT/reflow. Self-host `woff2` subsets or `preload` the two above-the-fold faces. **Files:** all `*.html` `<head>`.

#### M-019 · "Private" case studies are fully readable in public source
- **Category:** Security/Privacy expectation · **Severity:** P2 (by design, but mislabeled) · **Effort:** L. The gate is client-side; all copy, images, codes, and case URLs are in the public `/new` source (documented in `work.js`/README). Calling them "private / confidential" sets an expectation the implementation doesn't meet. Either soften the language or move to real edge auth (the Cloudflare Worker plan). **Files:** `js/work.js`, `work.html`, case pages.

#### M-020 · Generic/repeated alt text
- **Category:** A11y · **Severity:** P2 · **Effort:** S. Four headshots share `alt="Mark Pytlik"`; screen readers announce the same string repeatedly. Differentiate or mark decorative ones `alt=""`. **Files:** `index.html`.

### P3 — Polish / Debt

- **M-021** · Dead CSS: `.seg` theme-toggle styles remain though the toggle HTML was removed. `css/site.css`.
- **M-022** · Marquee "fill" logic is reimplemented in `js/awards.js` and `js/lately.js` and again for the reel — extract one `marquee(el, opts)` primitive. 
- **M-023** · Case eyebrow is derived by splitting a `" · "` string in `js/case.js` — fragile; store `category`/`year` as fields.
- **M-024** · Desktop case headline `clamp(52px, 9vw, 140px)` reaches ~140px at 1440 — can feel shouty; cap lower (~96px).
- **M-025** · `.wrap` bottom padding `120px` leaves a large dead gap at the end of the home page on mobile.
- **M-026** · The grain overlay (`position:fixed; mix-blend-mode:overlay; z-index:90`) repaints across the viewport; negligible but worth measuring on low-end devices.
- **M-027** · Career expand/collapse chevron floats orphaned in its own column on mobile (odd alignment). `css/site.css` mobile `.jobrow`.
- **M-028** · No `<h2>`/landmark structure audit done here — headings are visually styled `.section-title` spans, not semantic `<h2>`; screen-reader document outline is flat. Promote section labels to real headings. `index.html`.
- **M-029** · Skip-to-content link absent (keyboard users can't bypass). Add one. All pages.
- **M-030** · The slide page-transition (`view-transition`) has no fallback affordance if it half-fires on a slow load; verify it doesn't leave a frozen frame on flaky connections.

---

## Quick Wins (<30 min each)
1. `M-004` global `:focus-visible` rule.
2. `M-001` (interim) skip placeholder embeds instead of showing the "Add a Vimeo URL" tile.
3. `M-003` add "Email for a code" link to the gate.
4. `M-007` enlarge dot / foot-link hit areas.
5. `M-015` restore a CONTACT label.
6. `M-021` delete dead `.seg` CSS.
7. `M-020` fix duplicate alt text.
8. `M-024`/`M-025` cap case headline; trim trailing padding.

## Medium Improvements (1–4h)
- `M-005` collapse mobile career accordion.
- `M-002`+`M-009` case posters + reserved media dimensions (kill CLS + black boxes).
- `M-008` minimal mobile wayfinding affordance.
- `M-010` make the card frame visible at all desktop widths.
- `M-011` carousel: reduced-motion + real controls.
- `M-018` self-host / preload fonts.

## Major Refactors (high impact)
- `M-001` (real) — fill all case media (the builder now exists — `tools/case-builder.html`).
- `M-019` — real access control (Cloudflare Worker + signed links) if "private" is to mean private.
- `M-022` — one marquee primitive; one media primitive.
- `M-028` — semantic heading/landmark pass for screen readers.

---

## Design-System Recommendations
The token layer (`:root` / `[data-theme="dark"]`) is genuinely good. What's
missing is a **primitive layer**:
- **Focus primitive** (`:focus-visible`) — currently absent (`M-004`).
- **Target-size primitive** — a `.hit` utility guaranteeing ≥44px touch areas around small visuals (dots, icon links) (`M-007`).
- **Button primitive** — `.btn` exists but nav/foot/link "buttons" are bespoke; unify states (hover/active/focus/disabled).
- **Marquee primitive** — replace the three ad-hoc implementations with one component (`M-022`).
- **Media primitive** — one `figure` component that reserves aspect-ratio, sets poster, and lazy-loads, used by both reel and case bodies (`M-002`, `M-009`).
- **Motion tokens** — standardize durations/easings; several are one-offs.

## Engineering Recommendations
- Adopt a tiny **poster/dimension build step** (extend the existing `tools/` scripts) so no video ever ships without a poster and no image without intrinsic size.
- Promote visual section labels to **semantic headings** and add **skip-link + landmarks** for the screen-reader outline.
- Consider a **lint/CI check** that fails the build if `VIMEO_ID` (or any placeholder token) appears in `cases.js` — this class of bug should never reach production.
- Keep the client gate but **stop calling it private** until the edge-auth plan lands.

---

## Final Verdict

**What makes it feel unfinished:** literal "ADD A VIMEO URL" tiles and black
video boxes inside the flagship case studies (`M-001`, `M-002`).

**What feels cheap:** truncated reel labels ("ike — Air Max"), 6px tap targets,
and content that jumps as it loads (`M-006`, `M-007`, `M-009`).

**What feels inconsistent:** the signature card frame appears on ultrawide but
not on common laptops (`M-010`); Contact lost its heading while every other
section kept one (`M-015`).

**What feels confusing:** a private gate with no way to get in (`M-003`); a
10-screen mobile page with no navigation (`M-008`); a "previous" link that loops
to the end (`M-012`).

**What experienced designers would flag immediately:** no focus states
(`M-004`), auto-rotating carousel with 6px dots (`M-011`), non-semantic headings
(`M-028`), and placeholder content in production (`M-001`).

**What users feel subconsciously:** instability (CLS), endless scrolling with no
control, and "this is a nice draft" rather than "this is finished."

### If you fix only ten things before launch
1. `M-001` — remove/fill the Vimeo placeholder tiles.
2. `M-002` — posters + reserved space for case videos.
3. `M-004` — global focus-visible.
4. `M-003` — give the gate a way in.
5. `M-005` — collapse mobile career.
6. `M-008` — add minimal mobile wayfinding.
7. `M-010` — make the card frame visible on laptops.
8. `M-007` — fix tap-target sizes.
9. `M-006` — stop clipping reel labels.
10. `M-009` — reserve image dimensions (CLS).

Do those ten and this moves from "promising draft" to "genuinely good, shippable
portfolio" — the design language is already strong enough to carry it.

---

### Appendix — Screenshot index
Full-page captures per page × viewport in [`ux-audit-assets/`](./ux-audit-assets/):
`home-{320…1440}.webp`, `work-locked-*`, `work-unlocked-*`, `case-casper-*`,
`case-nike-*`. Machine diagnostics (overflow, tap targets, alt, console) in
[`ux-audit-diagnostics.json`](./ux-audit-diagnostics.json). No horizontal
overflow was detected at any viewport (a genuine strength).
