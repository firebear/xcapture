const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('screenshot capture height limit supports long posts', () => {
  const filePath = path.join(__dirname, '..', 'src', 'content', 'screenshot.ts');
  const source = fs.readFileSync(filePath, 'utf8');

  const match = source.match(/axis === 'width' \? 1200 : (\d+)/);
  assert.ok(match, 'Expected capture dimension max definition in screenshot.ts');

  const heightMax = Number.parseInt(match[1], 10);
  assert.ok(Number.isFinite(heightMax), 'Height max should be numeric');
  assert.ok(heightMax >= 10000, `Height max too small for long posts: ${heightMax}`);
});
