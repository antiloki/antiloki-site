#!/usr/bin/env bash
# PUBLISH antiloki.com.
#
#   scripts/publish.sh --dry-run   build the public tree in a temp dir, print what would go live, push NOTHING
#   scripts/publish.sh             print that same summary, run the safety checks, then force-push an orphan commit
#                                  (the live site is whatever origin/main holds; it has no history of its own)
#
# What is published: index.html, paper.html, blog/, demo.html (if present), CNAME, and only the img/ files that a
# copied page actually references. Never: marketing-kit.html, marketing/, scripts/, shoot-prints.mjs,
# NOTES-INTERNAL.md, _config.yml or anything else in the repository. HTML comments are stripped in the temp copy only.
set -euo pipefail

PAGES=(index.html paper.html demo.html privacy.html terms.html)
FORBIDDEN_RE='marketing-kit|marketing/|/home/danj|ghp_|(^|[^A-Za-z0-9_])sk-[A-Za-z0-9_-]{10,}|\[LEGAL NAME|CITY / TAX ID|YOUR FULL LEGAL NAME|Your Real Name Here'

repo_root() { cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd; }

# build_tree <repo> <dest>: copy the public files into <dest>, strip HTML comments, copy referenced images only
build_tree() {
  local repo="$1" dest="$2" f
  [ -d "$dest" ] || { echo "build_tree: $dest is not a directory" >&2; return 1; }
  for f in "${PAGES[@]}" CNAME; do
    if [ -f "$repo/$f" ]; then cp "$repo/$f" "$dest/$f"; elif [ "$f" = index.html ] || [ "$f" = CNAME ]; then
      echo "build_tree: $f is required and missing" >&2; return 1
    fi
  done
  if [ -d "$repo/blog" ]; then mkdir -p "$dest/blog" && cp -r "$repo/blog/." "$dest/blog/"; fi
  # strip HTML comments from the copies (never from the repository)
  python3 - "$dest" <<'PY'
import pathlib, re, sys
root = pathlib.Path(sys.argv[1])
for p in root.rglob("*.html"):
    s = p.read_text(encoding="utf-8")
    t = re.sub(r"<!--.*?-->\n?", "", s, flags=re.S)
    if t != s:
        p.write_text(t, encoding="utf-8")
PY
  # images: only those named by a copied page or stylesheet
  local refs
  refs="$( { grep -rhoE 'img/[A-Za-z0-9._/-]+' "$dest" --include='*.html' --include='*.css' || true; } | sort -u )"
  local r
  while IFS= read -r r; do
    [ -n "$r" ] || continue
    if [ -f "$repo/$r" ]; then mkdir -p "$dest/$(dirname "$r")" && cp "$repo/$r" "$dest/$r"; else
      echo "build_tree: a page references $r, which is not in the repository" >&2
    fi
  done <<< "$refs"
}

# safety_check <dest>: refuse when anything private looks to have come along
safety_check() {
  local dest="$1" bad=0
  if [ -e "$dest/marketing-kit.html" ] || [ -e "$dest/marketing" ] || [ -e "$dest/scripts" ] || [ -e "$dest/NOTES-INTERNAL.md" ] || [ -e "$dest/shoot-prints.mjs" ]; then
    echo "REFUSING: a private path is in the tree" >&2; bad=1
  fi
  if grep -rIlE "$FORBIDDEN_RE" "$dest" >&2; then
    echo "REFUSING: the files above contain a forbidden string (marketing-kit, marketing/, /home/danj, ghp_, sk-...)" >&2; bad=1
  fi
  if grep -rIl -- '<!--' "$dest" >&2; then echo "REFUSING: an HTML comment survived" >&2; bad=1; fi
  return "$bad"
}

# summary <repo> <dest>: file list, total size and a diff summary against origin/main (fetches first)
summary() {
  local repo="$1" dest="$2" old
  echo "== files that would be published =="
  ( cd "$dest" && find . -type f | sort | sed 's|^\./||' )
  echo "== total size: $(du -sk "$dest" | cut -f1) KiB in $(find "$dest" -type f | wc -l | tr -d ' ') files =="
  git -C "$repo" fetch -q origin main
  old="$(mktemp -d)"
  if git -C "$repo" rev-parse -q --verify origin/main >/dev/null; then
    git -C "$repo" archive origin/main | tar -x -C "$old"
  fi
  echo "== against origin/main (live) =="
  diff -rq "$old" "$dest" | sed "s|$old|live|; s|$dest|new|" || true
  local added removed
  added="$(diff -ruN "$old" "$dest" | grep -c '^+[^+]' || true)"
  removed="$(diff -ruN "$old" "$dest" | grep -c '^-[^-]' || true)"
  echo "== diff: +$added lines, -$removed lines =="
  rm -rf "$old"
}

main() {
  local dry=0 repo tmp
  case "${1:-}" in
    --dry-run) dry=1 ;;
    "") ;;
    *) echo "usage: scripts/publish.sh [--dry-run]" >&2; exit 2 ;;
  esac
  repo="$(repo_root)"
  tmp="$(mktemp -d)" || { echo "could not create a temp directory" >&2; exit 1; }
  # the EXIT trap runs after main() has returned, when a `local tmp` would already be gone: expand it NOW, into the trap's own text
  trap "rm -rf '$tmp'" EXIT
  build_tree "$repo" "$tmp"
  summary "$repo" "$tmp"
  safety_check "$tmp" || exit 1
  if [ "$dry" = 1 ]; then echo "dry run: nothing was pushed"; exit 0; fi

  local remote
  remote="$(git -C "$repo" remote get-url origin)"
  git -C "$tmp" init -q -b main
  git -C "$tmp" add -A
  git -C "$tmp" -c user.email="$(git -C "$repo" config user.email)" -c user.name="$(git -C "$repo" config user.name)" \
    commit -q -m "antiloki.com · $(date -u +%Y-%m-%dT%H:%MZ)"
  git -C "$tmp" push -q -f "$remote" HEAD:main
  echo "published -> https://antiloki.com (GitHub Pages builds in ~1 min)"
}

if [ "${BASH_SOURCE[0]}" = "$0" ]; then main "$@"; fi
