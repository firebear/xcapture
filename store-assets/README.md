# 📦 Store Assets

This directory contains all materials needed for Chrome Web Store submission.

## 📂 Directory Structure

```
store-assets/
├── README.md                    # This file
├── MATERIALS_GUIDE.md          # Complete guide for creating materials
├── screenshots/                 # Store screenshots (1280x800)
│   ├── screenshot-1-main.png    # ⏳ TODO: Main interface
│   ├── screenshot-2-modal.png   # ⏳ TODO: Modal preview
│   └── screenshot-3-features.png # ⏳ TODO: Feature demo
├── promo/                        # Promotional images
│   ├── promo-small.png          # ⏳ TODO: 440x280
│   └── promo-large.png          # ⏳ TODO: 920x680
└── mock-pages/                   # HTML mockups for screenshots
    ├── mock-tweet.html           # ✅ READY: Tweet interface mockup
    ├── mock-modal.html           # ✅ READY: Modal preview mockup
    └── mock-features.html         # ✅ READY: Feature demo mockup
```

## 🚀 Quick Start

### Step 1: Create Screenshots (15 mins)

1. Open `mock-pages/mock-tweet.html` in Chrome
2. Take screenshot using ⌘+Shift+5
3. Save as `screenshots/screenshot-1-main.png`
4. Repeat for other mock pages

### Step 2: Create Promotional Images (30 mins)

1. Sign up for Canva (free): https://www.canva.com
2. Follow `MATERIALS_GUIDE.md` instructions
3. Create small promo (440x280)
4. Create large promo (920x680)

### Step 3: Verify

```bash
# Check screenshot dimensions
sips -g pixelWidth -g pixelHeight screenshots/*.png

# Check promo dimensions
sips -g pixelWidth -g pixelHeight promo/*.png
```

## 📋 Checklist

- [ ] Screenshot 1: Main interface (1280x800)
- [ ] Screenshot 2: Modal preview (1280x800)
- [ ] Screenshot 3: Feature demo (1280x800)
- [ ] Small promotional image (440x280)
- [ ] Large promotional image (920x680)

## 📚 Resources

- **Full Guide**: See `MATERIALS_GUIDE.md`
- **Canva**: https://www.canva.com
- **Chrome Web Store**: https://chrome.google.com/webstore/devconsole

## 🎨 Design Tips

- Keep it simple
- Use X.com brand colors (#1da1f2)
- Focus on functionality
- English primary, Chinese secondary

## ✅ When Done

After completing all materials, tell me "Materials completed" and we'll proceed to code preparation and submission.
