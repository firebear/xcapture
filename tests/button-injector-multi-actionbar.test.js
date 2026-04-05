const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

test('button injector targets all action bars and watches late DOM updates', () => {
  const filePath = path.join(__dirname, '..', 'src', 'content', 'button-injector.ts');
  const source = fs.readFileSync(filePath, 'utf8');

  assert.ok(
    source.includes("querySelectorAll('[role=\"group\"]')") || source.includes("querySelectorAll('[role=\'group\']')"),
    'injector should target all role=group action bars'
  );

  assert.ok(
    source.includes('new MutationObserver'),
    'injector should watch tweet subtree for late-added action bars'
  );
});
