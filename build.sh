#!/usr/bin/env bash
set -euo pipefail

# Build portfolio → docs/ cho GitHub Pages (master /docs).
cd "$(dirname "$0")"

npm ci
npm run build            # vite build -> docs/ (outDir trong vite.config.ts)

# Bảo đảm file điều khiển Pages tồn tại kể cả khi bundler bỏ qua dotfile.
echo "sre.quachuoitrenmay.com" > docs/CNAME
touch docs/.nojekyll

echo "Done -> docs/. Commit docs/ rồi push; Pages serve master /docs."
