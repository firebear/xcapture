# Store Package Fix Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix Chrome Web Store installation by generating a valid `dist/manifest.json` and packaging only the `dist/` release root for version `1.0.2`.

**Architecture:** Keep the repository-level manifest as the source manifest, then transform and validate the built release manifest inside `dist/`. The release zip must contain only the final extension root files so Chrome resolves all script and style paths correctly.

**Tech Stack:** Node.js scripts, Vite, Chrome Extension Manifest V3, npm

---

### Task 1: Write the failing release-layout test

**Files:**
- Create: `tests/release-manifest.test.js`

**Step 1: Write the failing test**

Create a test that reads `dist/manifest.json`, resolves every `content_scripts.js`, `content_scripts.css`, and `icons` path relative to `dist/`, and asserts they all exist.

**Step 2: Run test to verify it fails**

Run: `node --test tests/release-manifest.test.js`
Expected: FAIL because `dist/manifest.json` currently points at `dist/content.js` and `dist/styles.css`.

### Task 2: Implement manifest transformation and validation

**Files:**
- Create: `scripts/prepare-release.js`
- Create: `scripts/validate-release.js`
- Modify: `package.json`

**Step 1: Write minimal implementation**

Create a prepare script that copies `manifest.json` and rewrites packaged paths for `dist/manifest.json`. Create a validation script that checks the generated release root for missing manifest assets.

**Step 2: Run build and validation**

Run: `npm run build && node scripts/validate-release.js`
Expected: PASS with no missing manifest assets.

### Task 3: Replace store packaging flow

**Files:**
- Modify: `package.json`
- Modify: `scripts/build-for-store.sh`
- Modify: `scripts/build-store.sh`

**Step 1: Package only the release root**

Update the packaging flow so the zip contains the contents of `dist/` as the extension root, not an extra wrapper directory containing both source and built files.

**Step 2: Verify package contents**

Run: `zipinfo -1 xcapture-v1.0.2.zip`
Expected: `manifest.json`, `content.js`, `styles.css`, and `assets/...` appear at zip root.

### Task 4: Update docs and version

**Files:**
- Modify: `manifest.json`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Modify: `SUBMISSION_GUIDE.md`

**Step 1: Bump version references to `1.0.2`**

Update release-facing version references where needed.

**Step 2: Align release instructions**

Document that unpacked loading and release packaging should use `dist/` or the generated store zip only.

### Task 5: Verify the fix end-to-end

**Files:**
- No code changes required

**Step 1: Run verification commands**

Run: `node --test tests/release-manifest.test.js && npm run build && node scripts/validate-release.js && zipinfo -1 xcapture-v1.0.2.zip`

**Step 2: Record completion time**

Run: `date '+%Y-%m-%d %H:%M:%S'`
