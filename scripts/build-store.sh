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
echo "📋 Copying files to build directory..."

# Copy manifest
cp manifest.json "$BUILD_DIR/"
echo "  ✓ manifest.json"

# Copy dist directory
cp -r dist "$BUILD_DIR/"
echo "  ✓ dist/"

# Copy assets directory
cp -r assets "$BUILD_DIR/"
echo "  ✓ assets/"

echo "✅ All files copied"
echo ""

# Step 5: Verify build
echo "🔍 Verifying build..."
if [ ! -f "$BUILD_DIR/manifest.json" ]; then
    echo "❌ Error: manifest.json not found in build"
    exit 1
fi

if [ ! -d "$BUILD_DIR/dist" ]; then
    echo "❌ Error: dist directory not found in build"
    exit 1
fi

if [ ! -d "$BUILD_DIR/assets" ]; then
    echo "❌ Error: assets directory not found in build"
    exit 1
fi

echo "✅ Build verification passed"
echo ""

# Step 6: Create ZIP file
echo "🗜️  Creating ZIP file..."
cd "$BUILD_DIR"
zip -r "../$ZIP_FILE" . -x "*.DS_Store" -x "*__MACOSX*"
cd ..
echo "✅ ZIP file created: $ZIP_FILE"
echo ""

# Step 7: Display file info
echo "📊 Build Information:"
echo "-------------------"
echo "Extension version: $VERSION"
echo "Build directory: $BUILD_DIR/"
echo "ZIP file: $ZIP_FILE"
echo "ZIP size: $(du -h "$ZIP_FILE" | cut -f1)"
echo ""

# Step 8: List contents
echo "📦 Build contents:"
ls -lh "$BUILD_DIR"
echo ""

echo "✅ Build complete!"
echo ""
echo "📝 Next steps:"
echo "1. Review the build/ directory"
echo "2. Test by loading build/ as unpacked extension"
echo "3. Submit $ZIP_FILE to Chrome Web Store"
