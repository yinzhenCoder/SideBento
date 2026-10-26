import test from 'node:test';
import assert from 'node:assert/strict';
import { validateJson, formatJson, minifyJson } from './jsonTool';

test('validateJson validates valid and invalid JSON', () => {
  const valid = validateJson('{"name": "SideBento", "count": 20}');
  assert.equal(valid.valid, true);
  assert.equal((valid.data as { name: string }).name, 'SideBento');

  const invalid = validateJson('{"name": "SideBento",');
  assert.equal(invalid.valid, false);
  assert.notEqual(invalid.error, undefined);
});

test('formatJson formats correctly', () => {
  const raw = '{"a":1,"b":[2,3]}';
  const formatted = formatJson(raw, 2);
  assert.equal(formatted.success, true);
  assert.equal(formatted.result.includes('\n  "a": 1,'), true);
});

test('minifyJson compresses to single line', () => {
  const pretty = '{\n  "a": 1,\n  "b": 2\n}';
  const minified = minifyJson(pretty);
  assert.equal(minified.success, true);
  assert.equal(minified.result, '{"a":1,"b":2}');
});
