#!/bin/bash
#
# Bundle Spec Viewer to Single HTML
#
# Extracted from Anthropic's web-artifacts-builder skill.
# Bundles React project into single self-contained HTML file.
#
# Usage: bash bundle-spec.sh <project-dir> <output-file>
#

set -e

PROJECT_DIR="${1:-.spec-viewer-temp}"
OUTPUT_FILE="${2:-spec.html}"

echo "Bundling spec viewer from $PROJECT_DIR..."

cd "$PROJECT_DIR"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install --silent
fi

# Build with Parcel (no source maps for smaller file)
echo "Building with Parcel..."
npx parcel build index.html --no-source-maps --dist-dir dist 2>/dev/null || {
  echo "Parcel build failed, trying alternative..."
  npm run build
}

# Inline all assets into single HTML
echo "Inlining assets..."
if [ -f "dist/index.html" ]; then
  npx html-inline -i dist/index.html -o bundle.html
elif [ -f "dist/index.html" ]; then
  npx html-inline -i dist/index.html -o bundle.html
fi

# Copy to output location
if [ -f "bundle.html" ]; then
  cp bundle.html "$OUTPUT_FILE"
  echo "✓ Created: $OUTPUT_FILE"

  # Show file size
  SIZE=$(wc -c < "$OUTPUT_FILE" | tr -d ' ')
  SIZE_KB=$((SIZE / 1024))
  echo "  Size: ${SIZE_KB}KB"
else
  echo "✗ Failed to create bundle"
  exit 1
fi
