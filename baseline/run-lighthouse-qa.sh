#!/bin/bash
set -e
export CHROME_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe"
OUT="$(dirname "$0")/lighthouse-qa-milestone8"
mkdir -p "$OUT"

pages=(
  "home|http://localhost:3000/"
  "about|http://localhost:3000/about"
  "location-abdali|http://localhost:3000/buy-used-furniture-abdali"
  "contact|http://localhost:3000/contact"
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
