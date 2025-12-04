/**
 * WCAG Color Contrast Validator
 * 
 * Utilities for calculating and validating color contrast ratios
 * according to WCAG 2.1 accessibility standards.
 * 
 * WCAG Levels:
 * - AA (Normal): 4.5:1 for normal text, 3:1 for large text
 * - AAA (Enhanced): 7:1 for normal text, 4.5:1 for large text
 * - Graphical Objects: 3:1
 */

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface ContrastResult {
  ratio: number;
  level: 'AAA' | 'AA' | 'AA-large' | 'AAA-large' | 'Fail';
  normalText: boolean;
  largeText: boolean;
  graphicalObjects: boolean;
  percentage: string;
}

/**
 * Convert hex color to RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB color to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Calculate relative luminance as per WCAG formula
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
export function calculateLuminance(color: RGBColor): number {
  const [r, g, b] = [color.r, color.g, color.b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 * https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
 */
export function calculateContrastRatio(foreground: RGBColor, background: RGBColor): number {
  const l1 = calculateLuminance(foreground);
  const l2 = calculateLuminance(background);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Validate contrast ratio against WCAG standards
 */
export function validateContrast(
  foregroundHex: string,
  backgroundHex: string
): ContrastResult {
  const foreground = hexToRgb(foregroundHex);
  const background = hexToRgb(backgroundHex);

  if (!foreground || !background) {
    throw new Error('Invalid color format. Please use hex colors (e.g., #FF0000)');
  }

  const ratio = calculateContrastRatio(foreground, background);

  // Determine WCAG level
  let level: 'AAA' | 'AA' | 'AA-large' | 'AAA-large' | 'Fail' = 'Fail';

  if (ratio >= 7) {
    level = 'AAA';
  } else if (ratio >= 4.5) {
    level = 'AA';
  } else if (ratio >= 4.5) {
    level = 'AAA-large';
  } else if (ratio >= 3) {
    level = 'AA-large';
  }

  return {
    ratio: parseFloat(ratio.toFixed(2)),
    level,
    normalText: ratio >= 4.5,
    largeText: ratio >= 3,
    graphicalObjects: ratio >= 3,
    percentage: `${(ratio * 100).toFixed(0)}%`,
  };
}

/**
 * Check if color contrast meets minimum standards
 */
export function meetsMinimumContrast(foregroundHex: string, backgroundHex: string): boolean {
  const result = validateContrast(foregroundHex, backgroundHex);
  return result.normalText;
}

/**
 * Check if color contrast meets AAA standard
 */
export function meetsAAAContrast(foregroundHex: string, backgroundHex: string): boolean {
  const result = validateContrast(foregroundHex, backgroundHex);
  return result.level === 'AAA';
}

/**
 * Get contrast recommendation
 */
export function getContrastRecommendation(result: ContrastResult): string {
  const ratio = result.ratio;

  if (ratio >= 7) {
    return '✅ Excellent - Meets AAA standard for all text sizes';
  } else if (ratio >= 4.5) {
    return '✅ Good - Meets AA standard for normal text and AAA for large text';
  } else if (ratio >= 3) {
    return '⚠️ Fair - Meets AA standard for large text only (18pt+)';
  } else {
    return '❌ Poor - Does not meet WCAG standards for text. Use for graphics only.';
  }
}

/**
 * Color palette for the application with contrast validation
 */
export const colorPalette = {
  background: '#ffffff',
  foreground: '#000000',
  accent: '#0ea5e9',
  primary: '#3b82f6',
  muted: '#6b7280',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#06b6d4',
};

/**
 * Validate entire color palette
 */
export function validatePalette(palette: Record<string, string>) {
  const results: Record<string, ContrastResult> = {};

  const foregroundColor = palette.foreground;

  for (const [name, color] of Object.entries(palette)) {
    if (name === 'foreground' || name === 'background') continue;

    try {
      results[name] = validateContrast(foregroundColor, color);
    } catch (error) {
      console.error(`Error validating ${name}:`, error);
    }
  }

  return results;
}

/**
 * Generate accessibility report
 */
export function generateAccessibilityReport(palette: Record<string, string>): string {
  const validation = validatePalette(palette);
  const foreground = palette.foreground;
  const background = palette.background;
  const baseContrast = validateContrast(foreground, background);

  let report = `
# Accessibility Color Contrast Report

## Base Contrast (Foreground on Background)
- Colors: ${foreground} on ${background}
- Ratio: ${baseContrast.ratio}:1
- Level: ${baseContrast.level}
- Status: ${getContrastRecommendation(baseContrast)}

## Individual Color Contrast (on Background)
`;

  for (const [name, result] of Object.entries(validation)) {
    const recommendation = getContrastRecommendation(result);
    report += `
### ${name}
- Ratio: ${result.ratio}:1
- ${recommendation}
- Normal Text: ${result.normalText ? '✓' : '✗'}
- Large Text: ${result.largeText ? '✓' : '✗'}
`;
  }

  return report;
}

/**
 * Sample color combinations for testing
 */
export const testColorCombinations = [
  // Excellent contrast (AAA)
  { fg: '#000000', bg: '#ffffff', expected: 'AAA' }, // Black on white
  { fg: '#ffffff', bg: '#000000', expected: 'AAA' }, // White on black

  // Good contrast (AA)
  { fg: '#0ea5e9', bg: '#ffffff', expected: 'AA' }, // Sky blue on white
  { fg: '#3b82f6', bg: '#ffffff', expected: 'AA' }, // Blue on white

  // Fair contrast (AA-large)
  { fg: '#6b7280', bg: '#ffffff', expected: 'AA-large' }, // Gray on white

  // Poor contrast (Fail)
  { fg: '#cccccc', bg: '#ffffff', expected: 'Fail' }, // Light gray on white
];

/**
 * Run all color tests
 */
export function runColorTests(): Map<string, boolean> {
  const results = new Map<string, boolean>();

  testColorCombinations.forEach(({ fg, bg, expected }) => {
    const result = validateContrast(fg, bg);
    const passed = result.level === expected || (expected === 'Fail' && result.level === 'Fail');
    results.set(`${fg}-${bg}`, passed);
  });

  return results;
}
