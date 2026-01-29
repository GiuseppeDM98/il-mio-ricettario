/**
 * Centralized season constants for Il Mio Ricettario.
 *
 * WHY CENTRALIZED:
 * Previously duplicated across 6 files (season-selector, recipe-card,
 * recipe-detail, extracted-recipe-preview, ricette page, types).
 * Single source of truth prevents inconsistencies and simplifies updates.
 *
 * DRY PRINCIPLE:
 * Instead of maintaining 6 separate copies of SEASON_ICONS and SEASON_LABELS,
 * we have one canonical source that all components import from.
 * Adding a new season now requires updating only 3 locations:
 * - This file (add to all three exports)
 * - ITALIAN_SEASONAL_INGREDIENTS in api/suggest-category/route.ts
 * - ITALIAN_SEASONAL_INGREDIENTS in api/extract-recipes/route.ts
 *
 * CHECKLIST: If you add a season value, also update:
 * - ITALIAN_SEASONAL_INGREDIENTS in api/suggest-category/route.ts
 * - ITALIAN_SEASONAL_INGREDIENTS in api/extract-recipes/route.ts
 */

import { Season } from '@/types';

/**
 * Emoji icons for each season.
 *
 * Used for visual identification in UI (buttons, badges, cards).
 * Emojis are universally recognized and don't require localization.
 */
export const SEASON_ICONS: Record<Season, string> = {
  primavera: '🌸',
  estate: '☀️',
  autunno: '🍂',
  inverno: '❄️',
  tutte_stagioni: '🌍'
};

/**
 * Italian display labels for each season.
 *
 * Used in UI text, filters, and accessibility labels.
 * Capitalized for proper noun display in Italian.
 */
export const SEASON_LABELS: Record<Season, string> = {
  primavera: 'Primavera',
  estate: 'Estate',
  autunno: 'Autunno',
  inverno: 'Inverno',
  tutte_stagioni: 'Tutte le stagioni'
};

/**
 * Array of all season values in display order.
 *
 * Used for iteration in UI components (filters, multi-select).
 * Order: Spring → Summer → Autumn → Winter → All Seasons
 * (follows natural seasonal progression, with "all seasons" last)
 */
export const ALL_SEASONS: Season[] = [
  'primavera',
  'estate',
  'autunno',
  'inverno',
  'tutte_stagioni'
];
