#!/bin/bash
# Convert all jpg/jpeg/png images under public/images/ to optimized WebP
# Uses ffmpeg with libwebp encoder
# - Quality 80 (good balance size/quality)
# - Max width 1920px (preserves aspect ratio)
# - Removes original files after successful conversion

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG_DIR="$ROOT/public/images"
COUNT=0
SAVED=0

echo "🔄 Converting images to WebP..."

find "$IMG_DIR" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r src; do
  dst="${src%.*}.webp"

  # Get original size
  orig_size=$(stat -f%z "$src" 2>/dev/null || stat -c%s "$src" 2>/dev/null)

  # Convert: scale down to max 1920px wide, quality 80
  ffmpeg -y -i "$src" \
    -vf "scale='min(1920,iw)':'min(1920,ih)':force_original_aspect_ratio=decrease" \
    -quality 80 \
    -lossless 0 \
    "$dst" 2>/dev/null

  if [ -f "$dst" ]; then
    new_size=$(stat -f%z "$dst" 2>/dev/null || stat -c%s "$dst" 2>/dev/null)
    saving=$(( orig_size - new_size ))
    pct=$(( saving * 100 / orig_size ))
    printf "  ✅ %-50s %6s → %6s (%d%% smaller)\n" \
      "$(basename "$src")" \
      "$(numfmt --to=iec "$orig_size" 2>/dev/null || echo "${orig_size}B")" \
      "$(numfmt --to=iec "$new_size" 2>/dev/null || echo "${new_size}B")" \
      "$pct"

    # Remove original
    rm "$src"
  else
    echo "  ❌ Failed: $(basename "$src")"
  fi
done

echo ""
echo "✅ Done! All images converted to WebP."
echo "⚠️  Remember to update all image references in source files (.astro, .svelte, .ts, .yaml, .mdx)"
