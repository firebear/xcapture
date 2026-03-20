#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const manifestPath = path.join(distDir, 'manifest.json');

if (!fs.existsSync(manifestPath)) {
  throw new Error('dist/manifest.json does not exist. Run the build first.');
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const zipFileName = `xcapture-v${manifest.version}.zip`;
const zipFilePath = path.join(rootDir, zipFileName);

fs.rmSync(zipFilePath, { force: true });

execFileSync('zip', ['-r', zipFilePath, '.', '-x', '*.DS_Store', '-x', '*__MACOSX*'], {
  cwd: distDir,
  stdio: 'inherit',
});

console.log(`Created ${zipFileName}`);
