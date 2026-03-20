#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { rewriteManifestForDist } = require('./release-manifest');

const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const sourceManifestPath = path.join(rootDir, 'manifest.json');
const distManifestPath = path.join(distDir, 'manifest.json');
const sourceAssetsDir = path.join(rootDir, 'assets');
const distAssetsDir = path.join(distDir, 'assets');

if (!fs.existsSync(distDir)) {
  throw new Error('dist directory does not exist. Run vite build first.');
}

const sourceManifest = JSON.parse(fs.readFileSync(sourceManifestPath, 'utf8'));
const distManifest = rewriteManifestForDist(sourceManifest);

fs.writeFileSync(distManifestPath, JSON.stringify(distManifest, null, 2) + '\n');
fs.rmSync(distAssetsDir, { recursive: true, force: true });
fs.cpSync(sourceAssetsDir, distAssetsDir, { recursive: true });

console.log('Prepared dist release manifest and assets.');
