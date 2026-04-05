const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('capture width calculation does not expand to scrollWidth overflow', () => {
  const filePath = path.join(__dirname, '..', 'src', 'content', 'screenshot.ts');
  const source = fs.readFileSync(filePath, 'utf8');

  assert.ok(
    !source.includes('Math.ceil(element.scrollWidth)'),
    'width calculation should ignore scrollWidth to avoid oversized right whitespace'
  );
});
