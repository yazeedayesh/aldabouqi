#!/bin/bash
set -e
export CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe"
OUT="$(dirname "$0")/lighthouse"
mkdir -p "$OUT"

pages=(
  "home|https://www.aldabouqi.com/"
  "about|https://www.aldabouqi.com/about.html"
  "location-abdali|https://www.aldabouqi.com/buy-used-furniture-abdali.html"
  "contact|https://www.aldabouqi.com/contact.html"
)

for entry in "${pages[@]}"; do
  name="${entry%%|*}"
  url="${entry##*|}"

  echo "=== $name (mobile) ==="
  npx --yes lighthouse "$url" \
    --output=json --output=html \
    --output-path="$OUT/${name}-mobile" \
    --chrome-flags="--headless=new --no-sandbox" \
    --only-categories=performance,accessibility,best-practices,seo \
    --quiet 2>>"$OUT/lighthouse.log" || echo "FAILED: $name mobile"

  echo "=== $name (desktop) ==="
  npx --yes lighthouse "$url" \
    --output=json --output=html \
    --output-path="$OUT/${name}-desktop" \
    --preset=desktop \
    --chrome-flags="--headless=new --no-sandbox" \
    --only-categories=performance,accessibility,best-practices,seo \
    --quiet 2>>"$OUT/lighthouse.log" || echo "FAILED: $name desktop"
done

echo "DONE"
