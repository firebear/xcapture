#!/bin/bash

# XCapture Store Assets Validation Script
# This script checks if all required materials are present and have correct dimensions

echo "🔍 XCapture Store Assets Validation"
echo "=================================="
echo ""

# Check if sips is available (macOS only)
if ! command -v sips &> /dev/null; then
    echo "❌ Error: 'sips' command not found. This script only works on macOS."
    echo "   Please manually verify image dimensions."
    exit 1
fi

# Function to check image dimensions
check_dimensions() {
    local file=$1
    local expected_width=$2
    local expected_height=$3
    local name=$4
    
    if [ ! -f "$file" ]; then
        echo "❌ Missing: $name ($file)"
        return 1
    fi
    
    # Get actual dimensions
    actual=$(sips -g pixelWidth -g pixelHeight "$file" 2>/dev/null)
    width=$(echo "$actual" | grep pixelWidth | awk '{print $2}')
    height=$(echo "$actual" | grep pixelHeight | awk '{print $2}')
    
    # Check if dimensions match
    if [ "$width" = "$expected_width" ] && [ "$height" = "$expected_height" ]; then
        echo "✅ $name: ${width}x${height}"
        return 0
    else
        echo "⚠️  $name: Expected ${expected_width}x${expected_height}, got ${width}x${height}"
        return 1
    fi
}

# Track results
errors=0
total=0

echo "📸 Checking Screenshots..."
echo "------------------------"

# Check screenshots (allow 1280x800 or 640x400)
for screenshot in screenshots/screenshot-*.png; do
    if [ -f "$screenshot" ]; then
        actual=$(sips -g pixelWidth -g pixelHeight "$screenshot" 2>/dev/null)
        width=$(echo "$actual" | grep pixelWidth | awk '{print $2}')
        height=$(echo "$actual" | grep pixelHeight | awk '{print $2}')
        
        if [ "$width" = "1280" ] && [ "$height" = "800" ]; then
            echo "✅ $(basename $screenshot): ${width}x${height}"
        elif [ "$width" = "640" ] && [ "$height" = "400" ]; then
            echo "✅ $(basename $screenshot): ${width}x${height}"
        else
            echo "⚠️  $(basename $screenshot): ${width}x${height} (expected 1280x800 or 640x400)"
            ((errors++))
        fi
        ((total++))
    fi
done

if [ $total -eq 0 ]; then
    echo "⚠️  No screenshots found in screenshots/"
    echo "   Expected files:"
    echo "   - screenshot-1-main.png"
    echo "   - screenshot-2-modal.png"
    echo "   - screenshot-3-features.png"
fi

echo ""
echo "🎨 Checking Promotional Images..."
echo "---------------------------------"

# Check small promo
check_dimensions "promo/promo-small.png" "440" "280" "Small Promo (440x280)" || ((errors++))
((total++))

# Check large promo (optional)
if [ -f "promo/promo-large.png" ]; then
    check_dimensions "promo/promo-large.png" "920" "680" "Large Promo (920x680)" || ((errors++))
    ((total++))
    echo "ℹ️  Large promo is optional but recommended"
else
    echo "ℹ️  Large promo (920x680) not found - optional"
fi

echo ""
echo "📊 Summary"
echo "---------"
echo "Total checked: $total"
echo "Errors found: $errors"

if [ $errors -eq 0 ]; then
    echo ""
    echo "✅ All materials are valid and ready for submission!"
    echo "   You can proceed to the next phase."
else
    echo ""
    echo "❌ Some materials need attention."
    echo "   Please fix the issues above and run this script again."
    exit 1
fi
