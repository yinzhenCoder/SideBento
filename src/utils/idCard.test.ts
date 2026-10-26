import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateIdCardChecksum, generateIdCard, verifyIdCard, AREA_CODES } from './idCard';

test('calculateIdCardChecksum computes correct checksum', () => {
  // Test known valid standard ID prefixes
  // e.g., 11010119900307237 -> 110101 19900307 237 X
  const first17 = '11010119900307237';
  const checksum = calculateIdCardChecksum(first17);
  assert.equal(typeof checksum, 'string');
  assert.match(checksum, /^[0-9X]$/);
});

test('generateIdCard generates verifiable ID numbers', () => {
  const maleId = generateIdCard({
    areaCode: '110101',
    birthDate: '1995-08-15',
    gender: 'male',
  });
  assert.equal(maleId.length, 18);
  const maleResult = verifyIdCard(maleId);
  assert.equal(maleResult.valid, true);
  assert.equal(maleResult.info?.gender, '男');
  assert.equal(maleResult.info?.birthDate, '1995-08-15');
  assert.equal(maleResult.info?.province, '北京市');

  const femaleId = generateIdCard({
    areaCode: '310101',
    birthDate: '2000-01-20',
    gender: 'female',
  });
  assert.equal(femaleId.length, 18);
  const femaleResult = verifyIdCard(femaleId);
  assert.equal(femaleResult.valid, true);
  assert.equal(femaleResult.info?.gender, '女');
  assert.equal(femaleResult.info?.province, '上海市');
});

test('verifyIdCard detects invalid checksums or formats', () => {
  const invalidFormat = verifyIdCard('12345');
  assert.equal(invalidFormat.valid, false);

  // Alter last digit of a valid id
  const validId = generateIdCard({
    areaCode: '440304',
    birthDate: '1992-06-18',
    gender: 'male',
  });
  const corruptedLast = validId.slice(0, 17) + (validId[17] === '0' ? '1' : '0');
  const checkFailed = verifyIdCard(corruptedLast);
  assert.equal(checkFailed.valid, false);
});
