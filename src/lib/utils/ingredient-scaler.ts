/**
 * Utility functions for scaling ingredient quantities based on servings
 */

/**
 * Scale an ingredient quantity from original servings to new servings
 *
 * Examples:
 *   scaleQuantity("200g", 4, 2) → "100g"
 *   scaleQuantity("1/2 tazza", 2, 4) → "1 tazza"
 *   scaleQuantity("2-3 cucchiai", 4, 8) → "4-6 cucchiai"
 *   scaleQuantity("q.b.", 4, 2) → "q.b." (unchanged)
 *
 * @param quantity - Original quantity string (e.g., "200g", "1/2 cup")
 * @param originalServings - Original number of servings
 * @param newServings - New number of servings
 * @returns Scaled quantity string
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
  // Handle fractions (e.g., "1/2 tazza", "3/4 cup")
  const fractionMatch = quantity.match(/^(\d+)\/(\d+)(.*)$/);
  if (fractionMatch) {
    const numerator = parseInt(fractionMatch[1]);
    const denominator = parseInt(fractionMatch[2]);
    const unit = fractionMatch[3].trim();

    const decimalValue = numerator / denominator;
    const scaledValue = decimalValue * scaleFactor;

    return formatScaledNumber(scaledValue, unit);
  }

  // Handle ranges (e.g., "2-3 cucchiai", "100-150g")
  const rangeMatch = quantity.match(/^(\d+(?:[.,]\d+)?)\s*-\s*(\d+(?:[.,]\d+)?)(.*)$/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1].replace(',', '.'));
    const max = parseFloat(rangeMatch[2].replace(',', '.'));
    const unit = rangeMatch[3].trim();

    const scaledMin = min * scaleFactor;
    const scaledMax = max * scaleFactor;

    return `${formatNumber(scaledMin)}-${formatNumber(scaledMax)}${unit ? ' ' + unit : ''}`;
  }

  // Handle simple numbers (e.g., "200g", "2 cucchiai", "1.5 kg")
  const numberMatch = quantity.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
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
 * Attempts to convert decimals back to fractions when appropriate
 */
function formatScaledNumber(value: number, unit: string): string {
  // Check if value is close to a common fraction
  const fractions = [
    { value: 0.25, display: '1/4' },
    { value: 0.33, display: '1/3' },
    { value: 0.5, display: '1/2' },
    { value: 0.66, display: '2/3' },
    { value: 0.75, display: '3/4' },
  ];

  for (const fraction of fractions) {
    if (Math.abs(value - fraction.value) < 0.05) {
      return `${fraction.display}${unit ? ' ' + unit : ''}`;
    }
  }

  // Check for whole number + fraction (e.g., 1.5 → "1 1/2")
  const whole = Math.floor(value);
  const decimal = value - whole;

  if (whole > 0 && decimal > 0) {
    for (const fraction of fractions) {
      if (Math.abs(decimal - fraction.value) < 0.05) {
        return `${whole} ${fraction.display}${unit ? ' ' + unit : ''}`;
      }
    }
  }

  // Otherwise format as decimal
  return formatNumber(value) + (unit ? ' ' + unit : '');
}

/**
 * Format a number with appropriate decimal places
 */
function formatNumber(value: number): string {
  // Round to 1 decimal place if needed
  if (value % 1 === 0) {
    return value.toString();
  }

  // Round to 1 decimal place
  return (Math.round(value * 10) / 10).toString().replace('.', ',');
}
