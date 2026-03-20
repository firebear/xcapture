#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');

function stripDistPrefix(filePath) {
  return filePath.replace(/^dist\//, '');
}

function rewriteManifestForDist(manifest) {
  return {
    ...manifest,
    content_scripts: (manifest.content_scripts || []).map((script) => ({
      ...script,
      js: (script.js || []).map(stripDistPrefix),
      css: (script.css || []).map(stripDistPrefix),
    })),
  };
}

function collectManifestAssets(manifest) {
  const assets = [];

  for (const script of manifest.content_scripts || []) {
    for (const file of script.js || []) {
      assets.push(file);
    }

    for (const file of script.css || []) {
      assets.push(file);
    }
  }

  for (const file of Object.values(manifest.icons || {})) {
    assets.push(file);
  }

  return assets;
}

function findMissingManifestAssets(releaseDir, manifest) {
  return collectManifestAssets(manifest).filter((assetPath) => {
    return !fs.existsSync(path.join(releaseDir, assetPath));
  });
}

module.exports = {
  findMissingManifestAssets,
  rewriteManifestForDist,
};
