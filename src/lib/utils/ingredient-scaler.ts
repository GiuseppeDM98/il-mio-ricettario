/**
 * Utility functions for scaling ingredient quantities based on servings
 */

/**
 * Scale an ingredient quantity from original servings to new servings
 *
 * Features:
 * - Normalizes Italian decimal format ("1, 5 kg" → "1,5 kg")
 * - Handles fractions with Unicode symbols ("1/2" → "½", "1.5" → "1½")
 * - Supports ranges ("2-3" → "4-6")
 * - Preserves non-scalable quantities ("q.b." remains unchanged)
 * - Uses Italian decimal notation (comma as separator)
 *
 * Examples:
 *   scaleQuantity("200 g", 4, 2) → "100 g"
 *   scaleQuantity("1/2 tazza", 2, 4) → "1 tazza"
 *   scaleQuantity("1,5 kg", 4, 6) → "2,25 kg"
 *   scaleQuantity("1, 5 kg", 4, 6) → "2,25 kg" (handles extra spaces)
 *   scaleQuantity("2-3 cucchiai", 4, 8) → "4-6 cucchiai"
 *   scaleQuantity("q.b.", 4, 2) → "q.b." (unchanged)
 *
 * @param quantity - Original quantity string (e.g., "200g", "1,5 kg", "1/2 cup")
 * @param originalServings - Original number of servings
 * @param newServings - New number of servings
 * @returns Scaled quantity string with proper Italian formatting
 */
export function scaleQuantity(
  quantity: string,
  originalServings: number,
  newServings: number
): string {
  // If servings are the same or invalid, return original
  if (originalServings <= 0 || newServings <= 0 || originalServings === newServings) {
    return quantity;
  }

  // Calculate scaling factor
  const scaleFactor = newServings / originalServings;

  // Common non-scalable quantities (Italian)
  const nonScalable = ['q.b.', 'quanto basta', 'un pizzico', 'una presa', 'a piacere'];
  const lowerQuantity = quantity.toLowerCase().trim();
  if (nonScalable.some(ns => lowerQuantity.includes(ns))) {
    return quantity;
  }

  // Try to extract and scale numbers
  try {
    return scaleNumericQuantity(quantity, scaleFactor);
  } catch (error) {
    // If parsing fails, return original quantity
    return quantity;
  }
}

/**
 * Scale numeric quantities in a string
 */
function scaleNumericQuantity(quantity: string, scaleFactor: number): string {
  // Normalize spaces around decimal separators first
  // "1, 5 kg" or "1 , 5 kg" → "1,5 kg"
  const normalized = quantity.replace(/(\d+)\s*[.,]\s*(\d+)/g, '$1,$2');

  // Handle fractions (e.g., "1/2 tazza", "3/4 cup")
  const fractionMatch = normalized.match(/^(\d+)\/(\d+)(.*)$/);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1]);
    const denominator = parseInt(fractionMatch[2]);
    const unit = fractionMatch[3].trim();

    const decimalValue = numerator / denominator;
    const scaledValue = decimalValue * scaleFactor;

    return formatScaledNumber(scaledValue, unit);
  }

  // Handle ranges (e.g., "2-3 cucchiai", "100-150g")
  const rangeMatch = normalized.match(/^(\d+(?:,\d+)?)\s*-\s*(\d+(?:,\d+)?)(.*)$/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1].replace(',', '.'));
    const max = parseFloat(rangeMatch[2].replace(',', '.'));
    const unit = rangeMatch[3].trim();

    const scaledMin = min * scaleFactor;
    const scaledMax = max * scaleFactor;

    return `${formatNumber(scaledMin)}-${formatNumber(scaledMax)}${unit ? ' ' + unit : ''}`;
  }

  // Handle simple numbers (e.g., "200g", "2 cucchiai", "1,5 kg")
  const numberMatch = normalized.match(/^(\d+(?:,\d+)?)(.*)$/);
  if (numberMatch) {
    const value = parseFloat(numberMatch[1].replace(',', '.'));
    const unit = numberMatch[2].trim();

    const scaledValue = value * scaleFactor;

    return formatScaledNumber(scaledValue, unit);
  }

  // If no number found, return original
  return quantity;
}

/**
 * Format a scaled number with its unit
 * Uses clear decimal notation or Unicode fractions when appropriate
 */
function formatScaledNumber(value: number, unit: string): string {
  // Common fractions with Unicode symbols for better readability
  const unicodeFractions = [
    { value: 0.25, display: '¼' },
    { value: 0.33, display: '⅓' },
    { value: 0.5, display: '½' },
    { value: 0.66, display: '⅔' },
    { value: 0.75, display: '¾' },
  ];

  // Check if value is exactly a simple fraction (less than 1)
  if (value < 1) {
    for (const fraction of unicodeFractions) {
      if (Math.abs(value - fraction.value) < 0.05) {
        return `${fraction.display}${unit ? ' ' + unit : ''}`;
      }
    }
  }

  // Check for whole number + fraction (e.g., 1.5 → "1½")
  const whole = Math.floor(value);
  const decimal = value - whole;

  if (whole > 0 && decimal > 0.05) {
    for (const fraction of unicodeFractions) {
      if (Math.abs(decimal - fraction.value) < 0.05) {
        return `${whole}${fraction.display}${unit ? ' ' + unit : ''}`;
      }
    }
  }

  // Otherwise format as decimal with comma (Italian format)
  return formatNumber(value) + (unit ? ' ' + unit : '');
}

/**
 * Format a number with appropriate decimal places (Italian format with comma)
 */
function formatNumber(value: number): string {
  // If it's a whole number, no decimals
  if (value % 1 === 0) {
    return value.toString();
  }

  // Round to 2 decimal places for better precision
  const rounded = Math.round(value * 100) / 100;

  // If after rounding it's a whole number, show without decimals
  if (rounded % 1 === 0) {
    return rounded.toString();
  }

  // Format with comma as decimal separator (Italian standard)
  return rounded.toString().replace('.', ',');
}
