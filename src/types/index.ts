import { Timestamp } from 'firebase/firestore';

/**
 * Core Data Models - Il Mio Ricettario
 *
 * ARCHITECTURE:
 * - User-owned entities: All documents include userId field for multi-tenant isolation
 * - Recipe workflow: Manual entry OR AI extraction (PDF → recipes → category suggestions)
 * - Cooking workflow: Recipe → CookingSession (with ingredient scaling)
 *
 * AI EXTRACTION PIPELINE:
 * 1. PDF upload → /api/extract-recipes → ParsedRecipe[] with aiSuggestion
 * 2. User reviews → /api/suggest-category → AISuggestion (category + season)
 * 3. Save → Recipe (with aiSuggested flag for transparency)
 *
 * ITALIAN LOCALIZATION:
 * - Season values in Italian (target audience: Italian home cooks)
 * - Ingredient quantities use comma decimal separator (1,5 kg not 1.5 kg)
 * - All Firebase operations use null (not undefined) for optional fields
 */

// ============================================
// Core Entities
// ============================================

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// Recipe Components
// ============================================

/**
 * Recipe ingredient with optional section grouping.
 *
 * SECTION PATTERN (Italian multi-part recipes):
 * - null/undefined: Default ingredients (flat list)
 * - Named sections: E.g., "Per la pasta", "Per il sugo" (collapsible groups)
 *
 * Example: Lasagna might have "Per la besciamella" and "Per il ragù" sections.
 * See: ingredient-list-collapsible.tsx for rendering logic (null first, then alphabetical)
 */
export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  section?: string | null; // Section name (e.g., "Per la pasta") or null for default ingredients
}

/**
 * Recipe step with optional section grouping and ordering.
 *
 * SECTION PATTERN:
 * - section: Human-readable name ("Per la pasta") or null for default steps
 * - sectionOrder: Preserves PDF extraction order (1, 2, 3...) for multi-section recipes
 *
 * GLOBAL STEP NUMBERING:
 * Steps are numbered 1, 2, 3... globally across ALL sections (not per-section).
 * Example: Section A (steps 1-3), Section B (steps 4-6) - counter continues.
 * See: steps-list-collapsible.tsx for implementation (counter increments even for collapsed sections)
 *
 * WHY sectionOrder:
 * Multiple steps share same sectionOrder value (groups them together).
 * Sorts sections by original PDF document order, not alphabetically.
 */
export interface Step {
  id: string;
  order: number;
  description: string;
  duration?: number | null;
  section?: string | null; // Section name (e.g., "Per il sugo") or null for default steps
  sectionOrder?: number | null; // Preserves PDF extraction order (not alphabetical). Same value = same section.
}

// ============================================
// Recipe Entity
// ============================================

/**
 * Italian seasonal classification for ingredients and recipes.
 *
 * WHY ITALIAN:
 * Target audience is Italian home cooks. Seasons map to traditional Italian growing cycles.
 *
 * UI MAPPING:
 * - primavera (Spring): 🌸 - asparagus, artichokes, strawberries
 * - estate (Summer): ☀️ - tomatoes, eggplant, zucchini, basil
 * - autunno (Autumn): 🍂 - pumpkin, mushrooms, chestnuts
 * - inverno (Winter): ❄️ - black cabbage, cauliflower, citrus
 * - tutte_stagioni (All seasons): 🌍 - available year-round
 *
 * CHECKLIST: If you add a season value, update:
 * - SEASON_ICONS, SEASON_LABELS, ALL_SEASONS in lib/constants/seasons.ts
 * - ITALIAN_SEASONAL_INGREDIENTS in api/suggest-category/route.ts
 * - ITALIAN_SEASONAL_INGREDIENTS in api/extract-recipes/route.ts
 */
export type Season = 'primavera' | 'estate' | 'autunno' | 'inverno' | 'tutte_stagioni';

/**
 * Recipe entity - Core data model for user-created or AI-extracted recipes.
 *
 * DATA OWNERSHIP:
 * All recipes require userId field. Firebase security rules enforce read/write permissions.
 *
 * PROVENANCE TRACKING:
 * - source.type = 'manual': User-created recipe
 * - source.type = 'pdf': AI-extracted from PDF (name = "Estratto da PDF con AI")
 * - source.type = 'url': Imported from web (url field contains original link)
 *
 * AI TRANSPARENCY:
 * - aiSuggested flag: true if category/season were suggested by AI (not manually selected)
 * - Displays "✨ Suggerito da AI" badge in UI (season-selector.tsx)
 * - Users can modify AI suggestions before saving
 */
export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description?: string;
  categoryId?: string;
  subcategoryId?: string;

  /**
   * SEASONS FIELD (migrated from single 'season'):
   * - Array of Season values (multiple seasons supported)
   * - Migration: Old recipes with 'season' field are auto-converted on first edit
   * - Empty array or null = no seasonal restriction
   * - ['tutte_stagioni'] = year-round availability
   *
   * WHY ARRAY:
   * Italian recipes often span multiple seasons (e.g., Pasta e Fagioli
   * is both autunno + inverno). Single season was too restrictive.
   *
   * BACKWARD COMPATIBILITY:
   * Display and filter components support both old 'season' field and new 'seasons' array
   * during transition period. Old recipes display correctly until user edits them.
   */
  seasons?: Season[];

  /**
   * @deprecated Use 'seasons' array instead. This field exists only for backward
   * compatibility with recipes created before the multi-season migration.
   * Will be removed once all recipes are migrated.
   */
  season?: Season;

  aiSuggested?: boolean; // true if category/season suggested by AI (displays "✨ Suggerito da AI" badge)
  difficulty?: 'facile' | 'media' | 'difficile';
  tags: string[];
  techniqueIds: string[];
  source?: {
    type: 'manual' | 'url' | 'pdf'; // Tracks recipe provenance (user-created vs AI-extracted vs imported)
    url?: string; // Original URL if type='url'
    name?: string; // Display name (e.g., "Estratto da PDF con AI" if type='pdf')
  };
  ingredients: Ingredient[];
  steps: Step[];
  images: string[];
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  totalTime?: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// Organization & Techniques
// ============================================

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  order: number;
  isDefault: boolean;
  createdAt: Timestamp;
}

export interface Subcategory {
  id: string;
  categoryId: string;
  userId: string;
  name: string;
  order: number;
  createdAt: Timestamp;
}

export interface Technique {
  id: string;
  userId: string;
  title: string;
  description: string;
  content: string;
  type?: 'cottura' | 'preparazione' | 'conservazione' | 'altro';
  tags: string[];
  relatedRecipeIds: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// Cooking Sessions
// ============================================

/**
 * Active cooking session with ingredient/step tracking and real-time scaling.
 *
 * LIFECYCLE:
 * 1. Setup mode: User selects servings before starting (prevents duplicate creation)
 * 2. Cooking mode: Track checked ingredients/steps, auto-delete at 100% completion
 *
 * INGREDIENT SCALING:
 * - servings field enables real-time quantity adjustment during cooking
 * - Uses scaleQuantity() utility with Italian decimal format (1,5 kg not 1.5 kg)
 * - Example: Recipe for 4 servings → user cooks for 6 → all quantities scale automatically
 *
 * WHY SEPARATE FROM RECIPE:
 * - Prevents pollution of Recipe entity with ephemeral cooking state
 * - Multiple users can cook same recipe with different servings simultaneously
 * - Auto-deletion keeps database clean (sessions are temporary, recipes are permanent)
 *
 * See: app/(dashboard)/ricette/[id]/cooking/page.tsx for setup pattern
 */
export interface CookingSession {
  id: string;
  recipeId: string;
  userId: string;
  servings?: number; // Servings being cooked (enables real-time ingredient scaling with scaleQuantity())
  checkedIngredients: string[];
  checkedSteps: string[];
  startedAt: Timestamp;
  lastUpdatedAt: Timestamp;
}

// ============================================
// AI Extraction Types
// ============================================

/**
 * AI-generated category and season suggestion for extracted recipes.
 *
 * TWO-PHASE EXTRACTION WORKFLOW:
 * 1. PDF → /api/extract-recipes → ParsedRecipe[] (with embedded aiSuggestion)
 * 2. User reviews → Can modify category/season before saving
 *
 * DUPLICATE PREVENTION:
 * - isNewCategory = false: Category exists → use existing categoryId
 * - isNewCategory = true: Category doesn't exist → create new category in Firebase
 *
 * WHY THIS FLAG:
 * Prevents creating duplicate categories if user already has "Primi piatti"
 * and AI suggests "Primi piatti" again.
 *
 * See: api/suggest-category/route.ts for categorization logic
 */
export interface AISuggestion {
  categoryName: string; // Suggested category name (matches existing category or proposes new one)
  season: Season;
  isNewCategory: boolean; // true if category doesn't exist (prevents duplicate category creation)
}

/**
 * Intermediary recipe representation from AI PDF extraction.
 *
 * EXTRACTION PIPELINE:
 * PDF → Claude AI → ParsedRecipe[] → User review → Recipe (saved to Firebase)
 *
 * WHY SEPARATE FROM RECIPE:
 * - Lacks Firebase metadata (id, userId, timestamps)
 * - Lacks user-specific fields (categoryId, techniqueIds, images)
 * - aiSuggestion is embedded (not yet applied to categoryId/season fields)
 *
 * TRANSFORMATION:
 * ExtractedRecipePreview component converts ParsedRecipe → Recipe on save.
 *
 * See: api/extract-recipes/route.ts for extraction logic
 */
export interface ParsedRecipe {
  title: string;
  description?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  ingredients: Ingredient[];
  steps: Step[];
  aiSuggestion?: AISuggestion; // AI-generated category and season suggestion
}