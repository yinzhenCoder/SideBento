/**
 * JSON Prettify, Minify, and Validation Utilities
 */

export interface JsonValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
  data?: unknown;
}

/**
 * Validates JSON string with line and column extraction
 */
export function validateJson(text: string): JsonValidationResult {
  const trimmed = text.trim();
  if (!trimmed) {
    return { valid: false, error: '输入内容为空' };
  }

  try {
    const data = JSON.parse(trimmed);
    return { valid: true, data };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    // Parse position if available (e.g., "Unexpected token 'x' in JSON at position 25")
    let line = 1;
    let column = 1;

    const matchPos = message.match(/at position (\d+)/i);
    if (matchPos && matchPos[1]) {
      const pos = parseInt(matchPos[1], 10);
      const prefix = trimmed.slice(0, pos);
      const lines = prefix.split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      valid: false,
      error: message,
      line,
      column,
    };
  }
}

/**
 * Prettifies JSON string with specified indent (default 2)
 */
export function formatJson(text: string, space = 2): { success: boolean; result: string; error?: string } {
  const val = validateJson(text);
  if (!val.valid) {
    return { success: false, result: text, error: val.error };
  }
  return {
    success: true,
    result: JSON.stringify(val.data, null, space),
  };
}

/**
 * Minifies JSON string to single line without spaces
 */
export function minifyJson(text: string): { success: boolean; result: string; error?: string } {
  const val = validateJson(text);
  if (!val.valid) {
    return { success: false, result: text, error: val.error };
  }
  return {
    success: true,
    result: JSON.stringify(val.data),
  };
}

export const SAMPLE_JSON = JSON.stringify(
  {
    product: 'SideBento Chrome Extension',
    version: '1.2.0',
    features: ['Vertical Dock Rail', 'Zero-squeeze Bento Drawer', 'Quick Micro-tools'],
    activeUser: {
      id: 'usr_8921',
      role: 'Frontend Architect',
      preferences: {
        theme: 'auto',
        labelExpanded: true,
        pinned: false,
      },
    },
    metrics: {
      widgetsCount: 24,
      avgLatencyMs: 12,
    },
  },
  null,
  2
);
