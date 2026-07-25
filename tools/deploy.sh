#!/usr/bin/env bash
# deploy.sh — stamp a fresh cache-bust version on the CSS/JS, then commit + push.
#
# Why: Cloudflare edge-caches css/site.css and js/*.js for 30 days, and browsers
# cache them too. The HTML is served fresh, so bumping the ?v=... query on every
# deploy makes a *plain refresh* pull the new CSS/JS (the fresh HTML points at the
# new URLs). This script does that bump automatically so you never forget.
#
# It does NOT touch image ?v= markers (e.g. 2.webp?v=2) — bump those by hand only
# when you actually replace an image in place, so unchanged images stay cached.
#
#   ./tools/deploy.sh "your commit message"
#
# After it pushes, the GitHub Action (.github/workflows/purge-cloudflare.yml)
# purges the Cloudflare cache automatically.

set -euo pipefail
cd "$(dirname "$0")/.."          # -> repo root
shopt -s nullglob               # unmatched globs (e.g. work/*.html once work/ is gone) expand to nothing

# Guard: never deploy JS with a syntax error — a single broken .js can blank a
# whole section (e.g. an unescaped apostrophe or a missing comma in a list).
if command -v node >/dev/null 2>&1; then
  for f in js/*.js; do
    node -c "$f" 2>/dev/null || { echo "✗ syntax error in $f — aborting, nothing committed or pushed."; exit 1; }
  done
  echo "✓ js syntax OK"
fi

msg="${1:-Update site}"
ver="$(date +%s)"                # unique + monotonic (seconds since epoch)

# Bump ?v= only on .css / .js references, across the site's HTML (root + work/).
perl -0777 -i -pe "s/\.(css|js)\?v=[0-9a-z]+/.\$1?v=$ver/g" *.html work/*.html

count="$(grep -roh "?v=$ver" *.html work/*.html | wc -l | tr -d ' ')"
echo "stamped $count css/js references with ?v=$ver"

git add -A
git commit -m "$msg"
git push origin main
echo "pushed. Cloudflare will auto-purge; a plain refresh will load the new build."
