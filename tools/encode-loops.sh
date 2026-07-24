#!/usr/bin/env bash
# encode-loops.sh — re-encode raw homepage reel clips to spec.
#
# Drop full-res source clips (any format ffmpeg reads: .mov .mp4 .m4v .webm …)
# into tools/_loop-inbox/, then run this. Each is scaled to 960px on the long
# edge (16:9 tile, crisp at up to 3× on the 300px reel), 30fps, audio stripped
# (every clip plays muted), H.264 crf 28, faststart. Output lands in
# assets/work/loops/<name>.mp4. Typical 10s loop → well under 1MB.
#
# The reel crops to 16:9 (object-fit: cover), so frame the action centered;
# a non-16:9 source loses its edges.
#
#   mkdir -p tools/_loop-inbox && cp ~/Desktop/*.mov tools/_loop-inbox/
#   ./tools/encode-loops.sh
#
# Requires: ffmpeg.

set -euo pipefail
cd "$(dirname "$0")/.."

INBOX="tools/_loop-inbox"
OUTDIR="assets/work/loops"
LONGEDGE=960
FPS=30
CRF=28

command -v ffmpeg >/dev/null || { echo "error: ffmpeg not found"; exit 1; }
mkdir -p "$INBOX" "$OUTDIR"

shopt -s nullglob nocaseglob
sources=("$INBOX"/*.{mov,mp4,m4v,webm,avi,mkv})
shopt -u nullglob nocaseglob

if [[ ${#sources[@]} -eq 0 ]]; then
  echo "no source clips in $INBOX/ — drop some in and re-run."
  exit 0
fi

for src in "${sources[@]}"; do
  base="$(basename "${src%.*}")"
  # sanitize: lowercase, spaces/underscores -> hyphens
  slug="$(echo "$base" | tr 'A-Z ' 'a-z-' | tr -s '-' | sed 's/^-//;s/-$//')"
  out="$OUTDIR/$slug.mp4"

  ffmpeg -y -i "$src" \
    -vf "scale='min($LONGEDGE,iw)':-2:flags=lanczos,fps=$FPS" \
    -c:v libx264 -crf $CRF -preset slow -pix_fmt yuv420p \
    -an -movflags +faststart \
    "$out" </dev/null 2>/dev/null

  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out" 2>/dev/null | cut -d. -f1)
  dim=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$out" 2>/dev/null)
  printf "%-28s -> %-28s %sx  %ss  %s KB\n" \
    "$(basename "$src")" "$slug.mp4" "$dim" "${dur:-?}" "$(( $(stat -f%z "$out") / 1024 ))"
done

echo
echo "done. Encoded clips are in $OUTDIR/."
echo "Add them to the reel by referencing assets/work/loops/<name>.mp4 in index.html."
