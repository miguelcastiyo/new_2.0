#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/md-to-article.sh <markdown-file> [slug]

Converts a Markdown file into articles/<slug>/index.html using Pandoc and templates/article.html.
If slug is omitted it is derived from the filename (lowercase, dash-separated).
Requires pandoc (https://pandoc.org).
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

md_path="$1"
if [[ ! -f "$md_path" ]]; then
  echo "Markdown file not found: $md_path" >&2
  exit 1
fi

slugify() {
  echo "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed 's/[^a-z0-9]/-/g; s/--*/-/g; s/^-//; s/-$//'
}

md_filename="$(basename "$md_path")"
slug="${2:-$(slugify "${md_filename%.*}")}"

if [[ -z "$slug" ]]; then
  echo "Could not derive a slug. Provide one explicitly." >&2
  exit 1
fi

if ! command -v pandoc >/dev/null 2>&1; then
  echo "Pandoc is required but was not found. Install it first (e.g. brew install pandoc)." >&2
  exit 1
fi

template_path="templates/article.html"
if [[ ! -f "$template_path" ]]; then
  echo "Template not found at $template_path" >&2
  exit 1
fi

lua_filter="scripts/pandoc-filters/strip-first-heading.lua"
if [[ ! -f "$lua_filter" ]]; then
  echo "Lua filter not found at $lua_filter" >&2
  exit 1
fi

date_filter="scripts/pandoc-filters/format-date.lua"
if [[ ! -f "$date_filter" ]]; then
  echo "Lua filter not found at $date_filter" >&2
  exit 1
fi

title_raw="$(grep -m1 -E '^[[:space:]]*#' "$md_path" | sed 's/[[:space:]]*$//' || true)"
title="$(echo "$title_raw" | sed -E 's/^[[:space:]]*#+[[:space:]]*//')"
if [[ -z "$title" ]]; then
  title="$slug"
fi

out_dir="articles/$slug"
mkdir -p "$out_dir"
out_file="$out_dir/index.html"

pandoc_args=(
  "$md_path"
  --from=gfm
  --to=html5
  --standalone
  --section-divs
  --template="$template_path"
  --lua-filter="$lua_filter"
  --lua-filter="$date_filter"
  --toc
  --toc-depth=3
  --syntax-highlighting=espresso
  --metadata
  "title=$title"
  --variable
  "toc-title=On this page"
  --output="$out_file"
)

if [[ -n "${ARTICLE_DATE:-}" ]]; then
  pandoc_args+=(--metadata "date=${ARTICLE_DATE}")
fi

pandoc "${pandoc_args[@]}"

echo "Created $out_file"
