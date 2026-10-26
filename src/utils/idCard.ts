/**
 * Chinese Citizen Identification Number (GB 11643-1999)
 * 18-digit verification and generation with ISO 7064:1983.MOD 11-2
 */

export interface AreaOption {
  code: string;
  name: string;
  province: string;
}

export const AREA_CODES: AreaOption[] = [
  { code: '110101', name: '北京市东城区', province: '北京市' },
  { code: '110108', name: '北京市海淀区', province: '北京市' },
  { code: '110105', name: '北京市朝阳区', province: '北京市' },
  { code: '310101', name: '上海市黄浦区', province: '上海市' },
  { code: '310115', name: '上海市浦东新区', province: '上海市' },
  { code: '310104', name: '上海市徐汇区', province: '上海市' },
  { code: '440304', name: '广东省深圳市福田区', province: '广东省' },
  { code: '440305', name: '广东省深圳市南山区', province: '广东省' },
  { code: '440106', name: '广东省广州市天河区', province: '广东省' },
  { code: '330106', name: '浙江省杭州市西湖区', province: '浙江省' },
  { code: '330108', name: '浙江省杭州市滨江区', province: '浙江省' },
  { code: '510104', name: '四川省成都市锦江区', province: '四川省' },
  { code: '510107', name: '四川省成都市武侯区', province: '四川省' },
  { code: '320102', name: '江苏省南京市玄武区', province: '江苏省' },
  { code: '420106', name: '湖北省武汉市武昌区', province: '湖北省' },
  { code: '610113', name: '陕西省西安市雁塔区', province: '陕西省' },
];

const WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const CHECK_CODES = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];

/**
 * Calculates check code for the first 17 digits
 */
export function calculateIdCardChecksum(first17: string): string {
  if (first17.length !== 17 || !/^\d{17}$/.test(first17)) {
    throw new Error('First 17 digits must be numeric string');
  }

  let sum = 0;
  for (let i = 0; i < 17; i++) {
    sum += parseInt(first17[i], 10) * WEIGHTS[i];
  }
  const mod = sum % 11;
  return CHECK_CODES[mod];
}

/**
 * Generates valid 18-digit ID card string
 */
export function generateIdCard(options: {
  areaCode: string;
  birthDate: string; // YYYY-MM-DD or YYYYMMDD
  gender: 'male' | 'female';
  seq?: number;
}): string {
  const cleanBirth = options.birthDate.replace(/-/g, '');
  if (cleanBirth.length !== 8 || !/^\d{8}$/.test(cleanBirth)) {
    throw new Error('Birth date must be 8 digits (YYYYMMDD)');
  }

  // Sequence number (2 digits) + gender digit (odd for male, even for female)
  let seqNumber = options.seq !== undefined ? options.seq : Math.floor(Math.random() * 90) + 10;
  let genderDigit = Math.floor(Math.random() * 5) * 2; // 0, 2, 4, 6, 8
  if (options.gender === 'male') {
    genderDigit += 1; // 1, 3, 5, 7, 9
  }

  const seqStr = String(seqNumber).padStart(2, '0').slice(-2) + genderDigit;
  const first17 = `${options.areaCode}${cleanBirth}${seqStr}`;
  const checkCode = calculateIdCardChecksum(first17);
  return `${first17}${checkCode}`;
}

/**
 * Verifies validity of 18-digit ID card
 */
export function verifyIdCard(id: string): {
  valid: boolean;
  reason?: string;
  info?: {
    province: string;
    areaName: string;
    birthDate: string;
    gender: '男' | '女';
    age: number;
  };
} {
  const cleanId = id.trim().toUpperCase();
  if (!/^\d{17}[\dX]$/.test(cleanId)) {
    return { valid: false, reason: '格式错误：必须为18位且仅最后一位可为X' };
  }

  const first17 = cleanId.slice(0, 17);
  const checkDigit = cleanId[17];
  const expectedCheck = calculateIdCardChecksum(first17);

  if (checkDigit !== expectedCheck) {
    return { valid: false, reason: `校验位错误：末位应为 ${expectedCheck}，实际为 ${checkDigit}` };
  }

  const areaCode = cleanId.slice(0, 6);
  const birthStr = cleanId.slice(6, 14);
  const year = parseInt(birthStr.slice(0, 4), 10);
  const month = parseInt(birthStr.slice(4, 6), 10);
  const day = parseInt(birthStr.slice(6, 8), 10);

  const birthDateObj = new Date(year, month - 1, day);
  if (
    birthDateObj.getFullYear() !== year ||
    birthDateObj.getMonth() + 1 !== month ||
    birthDateObj.getDate() !== day
  ) {
    return { valid: false, reason: '出生日期无效' };
  }

  const currentYear = new Date().getFullYear();
  const age = Math.max(0, currentYear - year);

  const genderDigit = parseInt(cleanId[16], 10);
  const gender = genderDigit % 2 === 1 ? '男' : '女';

  const matchedArea = AREA_CODES.find((a) => a.code === areaCode);
  const areaName = matchedArea ? matchedArea.name : `行政区代码 ${areaCode}`;
  const province = matchedArea ? matchedArea.province : '未知地区';

  return {
    valid: true,
    info: {
      province,
      areaName,
      birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      gender,
      age,
    },
  };
}
