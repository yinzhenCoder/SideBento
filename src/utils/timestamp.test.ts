import test from 'node:test';
import assert from 'node:assert/strict';
import { formatDateTime, parseToDate, dateToTimestamps, getRelativeTimeDescription } from './timestamp';

test('formatDateTime formats date cleanly', () => {
  const d = new Date(2026, 9, 21, 14, 30, 45, 120); // 2026-10-21 14:30:45.120
  assert.equal(formatDateTime(d, false), '2026-10-21 14:30:45');
  assert.equal(formatDateTime(d, true), '2026-10-21 14:30:45.120');
});

test('parseToDate parses numeric seconds and milliseconds', () => {
  const secStr = '1792571460';
  const parsedSec = parseToDate(secStr);
  assert.notEqual(parsedSec, null);
  assert.equal(Math.floor(parsedSec!.getTime() / 1000), 1792571460);

  const msStr = '1792571460000';
  const parsedMs = parseToDate(msStr);
  assert.notEqual(parsedMs, null);
  assert.equal(parsedMs!.getTime(), 1792571460000);
});

test('parseToDate parses date strings', () => {
  const d = parseToDate('2026-10-21 12:00:00');
  assert.notEqual(d, null);
  assert.equal(d!.getFullYear(), 2026);
  assert.equal(d!.getMonth(), 9); // October
  assert.equal(d!.getDate(), 21);
});

test('getRelativeTimeDescription works as expected', () => {
  const now = new Date(2026, 9, 21, 12, 0, 0);
  const fiveMinAgo = new Date(2026, 9, 21, 11, 55, 0);
  assert.equal(getRelativeTimeDescription(fiveMinAgo, now), '5 分钟前');

  const twoHoursLater = new Date(2026, 9, 21, 14, 0, 0);
  assert.equal(getRelativeTimeDescription(twoHoursLater, now), '2 小时后');
});
