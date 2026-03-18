#!/usr/bin/env bash
# Convert all jpg/jpeg/png images under public/images/ to optimized WebP,
# update all references in source files, and remove originals.
#
# Requirements: cwebp (brew install webp)
# Usage: ./scripts/optimize-images.sh [quality]
#   quality: WebP quality 0-100 (default: 80)

set -euo pipefail

QUALITY="${1:-80}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
IMG_DIR="$ROOT/public/images"
SRC_DIR="$ROOT/src"
PUBLIC_DIR="$ROOT/public"

# Files to skip (favicons, OG images must stay in original format)
SKIP_PATTERNS=("apple-touch-icon" "favicon" "og-image")

should_skip() {
  local file="$1"
  for pattern in "${SKIP_PATTERNS[@]}"; do
    [[ "$file" == *"$pattern"* ]] && return 0
  done
  return 1
}

if ! command -v cwebp &>/dev/null; then
  echo "Error: cwebp not found. Install with: brew install webp"
  exit 1
fi

echo "Image optimization (quality: $QUALITY)"
echo "Scanning $IMG_DIR for PNG/JPG files..."
echo ""

converted=0
skipped=0
total_before=0
total_after=0

while IFS= read -r -d '' file; do
  if should_skip "$file"; then
    echo "  skip: $(basename "$file")"
    ((skipped++))
    continue
  fi

  dir=$(dirname "$file")
  name="${file%.*}"
  webp_file="$name.webp"

  # Skip if webp already exists (already converted)
  if [ -f "$webp_file" ]; then
    echo "  skip (webp exists): $(basename "$file")"
    rm "$file"
    ((skipped++))
    continue
  fi

  orig_size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
  total_before=$((total_before + orig_size))

  if cwebp -q "$QUALITY" "$file" -o "$webp_file" -quiet; then
    new_size=$(stat -f%z "$webp_file" 2>/dev/null || stat -c%s "$webp_file" 2>/dev/null)
    total_after=$((total_after + new_size))
    savings=$(( (orig_size - new_size) * 100 / orig_size ))

    printf "  ok: %-45s %7d → %7d B  (-%d%%)\n" "$(basename "$file")" "$orig_size" "$new_size" "$savings"

    # Update references in source files
    rel_path="${file#$PUBLIC_DIR}"
    rel_path_webp="${rel_path%.*}.webp"

    grep -rl "$rel_path" "$SRC_DIR" \
      --include="*.yaml" --include="*.astro" --include="*.svelte" \
      --include="*.ts" --include="*.tsx" --include="*.js" --include="*.mdx" \
      2>/dev/null | while read -r ref_file; do
        sed -i '' "s|$rel_path|$rel_path_webp|g" "$ref_file"
        echo "      ref: $(basename "$ref_file")"
      done

    rm "$file"
    ((converted++))
  else
    echo "  FAIL: $(basename "$file")"
  fi
done < <(find "$IMG_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -print0)

echo ""
echo "---"
echo "Converted: $converted  |  Skipped: $skipped"
if [ "$converted" -gt 0 ]; then
  total_savings=$(( (total_before - total_after) * 100 / total_before ))
  echo "Before: $((total_before / 1024)) KB  |  After: $((total_after / 1024)) KB  |  Saved: $(( (total_before - total_after) / 1024 )) KB (-${total_savings}%)"
fi
