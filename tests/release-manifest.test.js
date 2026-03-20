const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  findMissingManifestAssets,
  rewriteManifestForDist,
} = require('../scripts/release-manifest');

test('release manifest rewrite strips dist prefixes for packaged content files', () => {
  const sourceManifestPath = path.join(__dirname, '..', 'manifest.json');
  const sourceManifest = JSON.parse(fs.readFileSync(sourceManifestPath, 'utf8'));
  const rewrittenManifest = rewriteManifestForDist(sourceManifest);

  assert.deepEqual(rewrittenManifest.content_scripts[0].js, ['content.js']);
  assert.deepEqual(rewrittenManifest.content_scripts[0].css, ['styles.css']);
});

test('dist manifest only references files that exist in dist root', () => {
  const distDir = path.join(__dirname, '..', 'dist');
  const manifestPath = path.join(distDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  const missingAssets = findMissingManifestAssets(distDir, manifest);

  assert.deepEqual(missingAssets, []);
});
