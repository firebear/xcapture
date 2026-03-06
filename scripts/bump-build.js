#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, '..', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const versionParts = manifest.version.split('.');
if (versionParts.length === 3) {
  versionParts.push('1');
} else if (versionParts.length === 4) {
  versionParts[3] = String(parseInt(versionParts[3], 10) + 1);
}

manifest.version = versionParts.join('.');

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

console.log(`Build number bumped to ${manifest.version}`);
