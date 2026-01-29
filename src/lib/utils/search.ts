/**
 * Search utilities for recipe filtering with Italian character support.
 *
 * Provides case-insensitive search functionality that properly handles
 * Italian accented characters (à, è, é, ì, ò, ù) using Unicode normalization.
 */

/**
 * Normalizes Italian text for case-insensitive search with accent support.
 *
 * Converts "Risotto à la Milanese" → "risotto a la milanese"
 * Uses Unicode NFD decomposition to handle accents (è → e + combining mark)
 *
 * WHY NFD NORMALIZATION:
 * Italian keyboards can produce characters in two forms:
 * - Composed: single character 'è' (U+00E8)
 * - Decomposed: 'e' + combining grave accent (U+0065 + U+0300)
 *
 * NFD (Canonical Decomposition) ensures consistent comparison regardless
 * of which input method was used. After decomposition, we remove combining
 * marks to get the base character for accent-insensitive matching.
 *
 * @param text - Text to normalize
 * @returns Lowercase text with accents removed and trimmed
 */
export function normalizeItalianText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // Decompose accented chars (è → e + ̀)
    .replace(/[\u0300-\u036f]/g, '') // Remove combining diacritical marks
    .trim();
}

/**
 * Checks if recipe title matches search query (case-insensitive, accent-insensitive).
 *
 * Empty queries return true (no filtering applied).
 * Uses partial matching: "riso" will match "Risotto alla milanese"
 *
 * Searches only in recipe title as per user preference.
 * Can be extended to search additional fields if needed.
 *
 * @param query - Search query string entered by user
 * @param title - Recipe title to search within
 * @returns true if query matches title (or query is empty)
 *
 * @example
 * matchesSearch("riso", "Risotto alla milanese") // true
 * matchesSearch("PASTA", "Pasta al pomodoro")    // true
 * matchesSearch("risotto", "Risottò")           // true (accent-insensitive)
 * matchesSearch("", "Any title")                 // true (empty query)
 */
export function matchesSearch(query: string, title: string): boolean {
  // Empty query matches everything (no filter applied)
  if (!query.trim()) return true;

  const normalizedQuery = normalizeItalianText(query);
  const normalizedTitle = normalizeItalianText(title);

  // Partial match: query can be anywhere in title
  return normalizedTitle.includes(normalizedQuery);
}
