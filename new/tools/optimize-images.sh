#!/usr/bin/env bash
# optimize-images.sh — convert the case-study imagery to web-sized WebP.
#
# Photographic work images are gathered at full resolution (2800–3800px PNGs,
# up to 7MB) but never display wider than the 1200px content column. This caps
# the long edge at 2400px (crisp at 2× on the widest full-bleed image) and
# re-encodes to WebP q80 — visually indistinguishable at display size, ~90%
# smaller. Re-run after adding any new case image, then point cases.js at the
# .webp.
#
# Idempotent: skips a .webp that is newer than its source. Pass --force to redo.
#
#   ./tools/optimize-images.sh            # convert assets/work/**
#   ./tools/optimize-images.sh --force
#
# Requires: ImageMagick (magick).

set -euo pipefail
cd "$(dirname "$0")/.."

MAXDIM=2400
QUALITY=80
FORCE=0
[[ "${1:-}" == "--force" ]] && FORCE=1

command -v magick >/dev/null || { echo "error: ImageMagick (magick) not found"; exit 1; }

total_before=0
total_after=0

while IFS= read -r -d '' src; do
  webp="${src%.*}.webp"

  if [[ $FORCE -eq 0 && -f "$webp" && "$webp" -nt "$src" ]]; then
    continue
  fi

  magick "$src" -auto-orient \
    -resize "${MAXDIM}x${MAXDIM}>" \
    -strip -quality "$QUALITY" \
    "$webp"

  b=$(stat -f%z "$src"); a=$(stat -f%z "$webp")
  total_before=$((total_before + b))
  total_after=$((total_after + a))
  printf "%-40s %6s KB -> %6s KB\n" "$(basename "$src")" "$((b/1024))" "$((a/1024))"
done < <(find assets/work -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -print0)

if [[ $total_before -gt 0 ]]; then
  printf "\ntotal: %s MB -> %s MB\n" \
    "$(echo "scale=1; $total_before/1048576" | bc)" \
    "$(echo "scale=1; $total_after/1048576" | bc)"
else
  echo "nothing to convert (all .webp up to date; use --force to redo)"
fi
