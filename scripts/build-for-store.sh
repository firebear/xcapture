#!/bin/bash

# XCapture Chrome Extension Build Script
# This script prepares the extension for Chrome Web Store submission

set -e  # Exit on error

echo "🚀 XCapture Build Script"
echo "======================"
echo ""

# Configuration
VERSION=$(grep '"version"' manifest.json | head -1 | sed 's/.*: *"\([^"]*\)".*/\1/')
EXTENSION_NAME="xcapture-v${VERSION}"
BUILD_DIR="build"
ZIP_FILE="${EXTENSION_NAME}.zip"

echo "📦 Version: $VERSION"
echo "📁 Build directory: $BUILD_DIR"
echo "🗜️  Output file: $ZIP_FILE"
echo ""

# Step 1: Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf "$BUILD_DIR"
rm -f "$ZIP_FILE"
echo "✅ Clean complete"
echo ""

# Step 2: Build the extension
echo "🔨 Building extension..."
npm run build
echo "✅ Build complete"
echo ""

# Step 3: Create build directory structure
echo "📂 Creating build directory..."
mkdir -p "$BUILD_DIR"
echo "✅ Directory created"
echo ""

# Step 4: Copy necessary files
echo "📋 Copying files..."

# Copy manifest
cp manifest.json "$BUILD_DIR/"
echo "  ✓ manifest.json"

# Copy dist directory
cp -r dist "$BUILD_DIR/"
echo "  ✓ dist/"

# Copy assets directory
cp -r assets "$BUILD_DIR/"
echo "  ✓ assets/"

echo "✅ Files copied"
echo ""

# Step 5: Verify build contents
echo "🔍 Verifying build contents..."
echo ""

# Check required files
REQUIRED_FILES=(
  "manifest.json"
  "dist/content.js"
  "dist/styles.css"
  "assets/icon16.png"
  "assets/icon48.png"
  "assets/icon128.png"
)

ALL_PRESENT=true
for file in "${REQUIRED_FILES[@]}"; do
  if [ -f "$BUILD_DIR/$file" ]; then
    SIZE=$(du -h "$BUILD_DIR/$file" | cut -f1)
    echo "  ✓ $file ($SIZE)"
  else
    echo "  ❌ $file (MISSING)"
    ALL_PRESENT=false
  fi
done

if [ "$ALL_PRESENT" = false ]; then
  echo ""
  echo "❌ Error: Some required files are missing!"
  exit 1
fi

echo ""
echo "✅ All required files present"
echo ""

# Step 6: Create ZIP file
echo "🗜️  Creating ZIP archive..."
cd "$BUILD_DIR"
zip -r "../$ZIP_FILE" . > /dev/null 2>&1
cd ..
echo "✅ ZIP created: $ZIP_FILE"
echo ""

# Step 7: Display build info
echo "📊 Build Information"
echo "=================="
echo "Version: $VERSION"
echo "Files included:"
find "$BUILD_DIR" -type f | sed 's/^/  /'
echo ""
echo "Archive size: $(du -h "$ZIP_FILE" | cut -f1)"
echo ""

# Step 8: Cleanup option
read -p "Remove build directory? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  rm -rf "$BUILD_DIR"
  echo "✅ Build directory removed"
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo "1. Test the extension: Load unpacked from '$BUILD_DIR' (if not removed)"
echo "2. Submit to Chrome Web Store: Upload '$ZIP_FILE'"
echo "3. Store listing content is in STORE_LISTING.md"
echo ""
