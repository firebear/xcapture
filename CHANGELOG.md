# Changelog

All notable changes to XCapture will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0/).

## [1.0.3] - 2026-04-05

### Added
- Long image splitting: automatically split long screenshots into pages at 16:9 ratio (optimized for screen viewing)
- Watermark: each split image gets a "captured by XCapture Chrome extension" watermark in the bottom-right corner
- Download all: one-click download of all split images
- Internationalization (i18n): auto-detect browser language (Chinese for zh, English for others), with manual language toggle in the preview modal
- Split image copy buttons now show page numbers (e.g., "Copy 1/3")

### Changed
- Split ratio changed from A4 (1.414) to 16:9 (1.778) for better on-screen readability

## [1.0.0] - 2026-03-08

### Added
- Initial release of- Core functionality
  - One-click screenshot from tweet action bar
  - Camera button injection for all tweets
  - Tweet detection using MutationObserver
  - Screenshot capture using html-to-image library
  - Preview modal with copy/download options
- UI features
  - Loading indicator when capturing
  - Toast notifications for user feedback
  - ESC key support to close modal
  - Hover effects on action buttons
- Design
  - Camera icon from iconfont.cn
  - X.com dark theme styling
  - Responsive modal design
- Documentation
  - README in English and Chinese
  - Privacy policy
  - Store listing content
- Technical
  - Manifest V3 support
  - TypeScript implementation
  - Vite build system
  - No external dependencies on runtime

### Features
- **Screenshot capture**: Capture tweets as images
- **Style preservation**: Maintains original tweet appearance
- **Export options**: Copy to clipboard or download as PNG
- **Multi-image support**: Works with tweets containing multiple images
- **Privacy focused**: All processing happens locally

### Technical Details
- Built with TypeScript
- Uses html-to-image library
- Manifest V3 compliance
- No data collection
- No external servers

### Known Limitations
- Only works on x.com and twitter.com
- Requires Chrome 88 or higher
- May not work with custom X.com themes

### Future Plans
- [ ] Custom screenshot templates
- [ ] Batch screenshot mode
- [ ] Screenshot history
- [ ] Custom watermarks
- [ ] Image editing features

---

## Version History

### Build Numbers (Pre-release)
- 1.0.0.1-20: Development builds
- 1.0.0: First stable release

---

## Upgrade Guide

From development builds to 1.0.0:
1. Uninstall any development version
2. Install from Chrome Web Store
3. All settings and data will be reset (no data is stored anyway)

---

## Support

For issues, questions, or feature requests:
- GitHub Issues: https://github.com/firebear/xcapture/issues
- Email: [your-email]

---

## License

MIT License - See LICENSE file for details
