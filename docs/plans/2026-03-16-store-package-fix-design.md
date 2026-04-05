# Store Package Fix Design

**Problem:** Chrome Web Store installation fails because the packaged extension points to `dist/content.js` from a `dist/manifest.json` root, which makes Chrome resolve the missing path `dist/dist/content.js`.

**Goal:** Make `dist/` the only supported release root, ensure the generated manifest uses paths relative to `dist/`, and produce a release zip that contains only the final extension root files.

**Approach:**
- Keep the source `manifest.json` as the authoring manifest for the repository root.
- Generate a transformed `dist/manifest.json` during the build that rewrites packaged asset paths to `content.js` and `styles.css`.
- Add automated validation that checks every manifest-declared JS, CSS, and icon path exists inside the release root before packaging.
- Replace the current store packaging flow with a single script that zips only the contents of `dist/`.

**Files to change:**
- `package.json`
- `manifest.json`
- `scripts/`
- `README.md`
- `README.zh-CN.md`
- `SUBMISSION_GUIDE.md`

**Validation:**
- Run a release-layout test that fails when `dist/manifest.json` references missing files.
- Run the build and release packaging flow.
- Inspect the release zip to confirm its root contains `manifest.json`, `content.js`, `styles.css`, and `assets/` directly.
