#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { findMissingManifestAssets } = require('./release-manifest');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const distManifestPath = path.join(distDir, 'manifest.json');

if (!fs.existsSync(distManifestPath)) {
  throw new Error('dist/manifest.json does not exist. Run the build first.');
}

const manifest = JSON.parse(fs.readFileSync(distManifestPath, 'utf8'));
const missingAssets = findMissingManifestAssets(distDir, manifest);

if (missingAssets.length > 0) {
  console.error('Release validation failed. Missing manifest assets:');
  for (const assetPath of missingAssets) {
    console.error(`- ${assetPath}`);
  }
  process.exit(1);
}

console.log('Release validation passed.');
