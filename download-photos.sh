#!/usr/bin/env bash
# ---------------------------------------------------------------
# SoCal Tint — download every photo the site needs, into assets/img/
# Works on macOS and Linux out of the box (uses curl; falls back to wget).
# Run while socaltintchino.com is still online.
#
#   1. Unzip socaltint-redesign.zip
#   2. Open Terminal, type:  cd      (with a trailing space)
#      then drag the unzipped folder onto the Terminal window and press Enter
#   3. Run:  bash download-photos.sh
# ---------------------------------------------------------------
set -u
cd "$(dirname "$0")"
MAN="assets/img/IMAGE-MANIFEST.txt"
mkdir -p assets/img

if [ ! -f "$MAN" ]; then echo "Can't find $MAN — run this from inside the project folder."; exit 1; fi

ok=0; fail=0
while IFS= read -r url; do
  [ -z "$url" ] && continue
  rel="${url#https://socaltintchino.com/wp-content/uploads/}"
  dest="assets/img/$rel"
  mkdir -p "$(dirname "$dest")"
  if command -v curl >/dev/null 2>&1; then
    if curl -fsSL "$url" -o "$dest"; then ok=$((ok+1)); echo "  ok  $rel"; else fail=$((fail+1)); echo "  !!  FAILED: $url"; fi
  else
    if wget -q -O "$dest" "$url"; then ok=$((ok+1)); echo "  ok  $rel"; else fail=$((fail+1)); echo "  !!  FAILED: $url"; fi
  fi
done < "$MAN"

echo ""
echo "Downloaded: $ok   Failed: $fail"
echo "Photos are now in assets/img/ — open index.html to confirm, then deploy."
