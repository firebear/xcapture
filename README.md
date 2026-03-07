# XCapture - X.com Tweet Screenshot Tool

A Chrome browser extension that converts X.com (Twitter) tweets into images.

[中文文档](./README.zh-CN.md)

## Features

- 📸 One-click tweet screenshot
- 🎨 Preserves original styling and layout
- 🖼️ Supports multi-image grid layouts
- 📋 Copy to clipboard
- 💾 Download to local storage
- 🎯 Auto-injects into tweet action bar

## Installation

### Development Mode

1. Clone the repository
```bash
git clone https://github.com/firebear/xcapture.git
cd xcapture
```

2. Install dependencies
```bash
npm install
```

3. Build the extension
```bash
npm run build
```

4. Load the extension in Chrome
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the project root directory (containing manifest.json)

### Production Mode

1. Build for production
```bash
npm run build
```

2. Pack the extension
   - On `chrome://extensions/` page, click "Pack extension"
   - Select the project root directory

## Usage

1. Visit [x.com](https://x.com)
2. Find the screenshot button (camera icon) in any tweet's action bar
3. Click the button to generate a screenshot
4. In the preview modal, choose:
   - Copy to clipboard
   - Download to local storage

## Tech Stack

- TypeScript
- Chrome Extension Manifest V3
- html-to-image
- Vite

## Development

```bash
# Development mode (watch for file changes)
npm run dev

# Build
npm run build

# Clean
npm run clean
```

## How It Works

1. **Tweet Detection**: Uses MutationObserver to detect tweets as they load
2. **Button Injection**: Injects a screenshot button into each tweet's action bar
3. **Screenshot Capture**: Captures the tweet DOM element using html-to-image library
4. **Image Export**: Provides options to copy or download the generated image

## Features in Detail

### Multi-Image Support
When a tweet contains multiple images, the extension preserves Twitter's native grid layout:
- 2 images: Side-by-side layout
- 3 images: 1 large + 2 small layout
- 4 images: 2x2 grid

### Styling Preservation
- Maintains original fonts, colors, and spacing
- Preserves author information and timestamps
- Removes interactive elements (buttons, links) from the screenshot

## Troubleshooting

**Button not appearing?**
- Refresh the x.com page
- Make sure the extension is enabled in `chrome://extensions/`

**Screenshot looks different from expected?**
- Twitter may have updated their DOM structure
- Try refreshing the page and taking a new screenshot

**Copy to clipboard not working?**
- Make sure you've granted clipboard permissions
- Try the download option instead

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Author

Created by [firebear](https://github.com/firebear)
