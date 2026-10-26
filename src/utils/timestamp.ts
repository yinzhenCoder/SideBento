/**
 * Timestamp and Date Conversion Utilities
 */

export interface FormattedDate {
  iso: string;
  local: string;
  utc: string;
  seconds: number;
  milliseconds: number;
}

/**
 * Formats a Date instance into human-readable string: YYYY-MM-DD HH:mm:ss
 */
export function formatDateTime(date: Date, includeMs = false): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const pad3 = (n: number) => String(n).padStart(3, '0');

  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  const ss = pad(date.getSeconds());

  if (includeMs) {
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}.${pad3(date.getMilliseconds())}`;
  }
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
}

/**
 * Parse an input (seconds, milliseconds, or datetime string) into Date
 */
export function parseToDate(input: string | number): Date | null {
  if (typeof input === 'number') {
    // If <= 10 digits, assume seconds; else ms
    const ms = input < 10000000000 ? input * 1000 : input;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }

  const trimmed = input.trim();
  if (!trimmed) return null;

  // Check if pure numeric
  if (/^\d+$/.test(trimmed)) {
    const num = parseInt(trimmed, 10);
    const ms = trimmed.length <= 10 ? num * 1000 : num;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  }

  // Replace space with T if needed for ISO compatibility or standard parse
  const sanitized = trimmed.replace(' ', 'T');
  const d = new Date(sanitized);
  if (!isNaN(d.getTime())) return d;

  const fallback = new Date(trimmed);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Converts date to timestamp seconds and milliseconds
 */
export function dateToTimestamps(date: Date): { seconds: number; milliseconds: number } {
  const ms = date.getTime();
  return {
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
  };
}

/**
 * Calculates human relative time (e.g. "刚刚", "12分钟前", "3小时后")
 */
export function getRelativeTimeDescription(targetDate: Date, baseDate = new Date()): string {
  const diffMs = targetDate.getTime() - baseDate.getTime();
  const isFuture = diffMs > 0;
  const absDiffSec = Math.floor(Math.abs(diffMs) / 1000);

  if (absDiffSec < 5) return '刚刚';
  if (absDiffSec < 60) return `${absDiffSec} 秒${isFuture ? '后' : '前'}`;
  
  const min = Math.floor(absDiffSec / 60);
  if (min < 60) return `${min} 分钟${isFuture ? '后' : '前'}`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时${isFuture ? '后' : '前'}`;

  const days = Math.floor(hr / 24);
  return `${days} 天${isFuture ? '后' : '前'}`;
}
