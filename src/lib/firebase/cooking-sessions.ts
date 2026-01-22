import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { CookingSession } from '@/types';

/**
 * Cooking Session Management for Active Recipe Cooking
 *
 * Data Model:
 * - One session per (recipeId, userId) pair - prevents duplicates
 * - Stores checked state as arrays of IDs (not boolean flags on ingredients)
 * - Optional servings field enables quantity scaling during cooking
 *
 * Lifecycle (see AGENTS.md for gotchas):
 * 1. Setup screen: User selects servings (or uses default)
 * 2. Creation: createCookingSession called on user action (NOT useEffect)
 * 3. Active: Toggle functions update checked arrays
 * 4. Completion: Auto-deleted at 100% progress (see recipe cooking page)
 *
 * Array Choice Rationale:
 * - checkedIngredients/checkedSteps are arrays of IDs, not booleans on items
 * - Why: Recipe data is immutable, session state is separate concern
 * - Benefit: Can restore/reset session without modifying recipe structure
 * - Trade-off: Requires array manipulation instead of boolean toggle
 *
 * CHECKLIST: If you modify CookingSession fields, also update:
 * - types/index.ts (CookingSession interface)
 * - Recipe cooking page (app/(dashboard)/cotture-in-corso/[id]/page.tsx)
 * - Cooking session setup screen component
 * - AGENTS.md documentation (Cooking Mode section)
 */

/**
 * Get existing cooking session for a recipe
 *
 * @param recipeId - Recipe being cooked
 * @param userId - User cooking the recipe
 * @returns Existing session or null if not found
 *
 * Query guarantees: At most one session per (recipeId, userId) due to
 * setup screen pattern (see AGENTS.md#cooking-mode).
 */
export async function getCookingSession(
  recipeId: string,
  userId: string
): Promise<CookingSession | null> {
  const sessionsRef = collection(db, 'cooking_sessions');
  const q = query(
    sessionsRef,
    where('recipeId', '==', recipeId),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    } as CookingSession;
  }

  return null;
}

/**
 * Create new cooking session for a recipe
 *
 * @param recipeId - Recipe to cook
 * @param userId - User cooking the recipe
 * @param servings - Optional servings count for quantity scaling
 * @returns Session document ID
 *
 * CRITICAL: Must be called from user action (button click), NOT useEffect.
 * Calling in useEffect causes duplicate sessions on re-renders.
 * See AGENTS.md#setup-screen-pattern.
 */
export async function createCookingSession(
  recipeId: string,
  userId: string,
  servings?: number
): Promise<string> {
  const sessionsRef = collection(db, 'cooking_sessions');

  const docRef = await addDoc(sessionsRef, {
    recipeId,
    userId,
    servings: servings || null, // Firebase requires null instead of undefined for optional fields
    // Initialize as empty arrays (not sets/maps) for Firestore compatibility
    // and simple serialization. IDs are added/removed via toggle functions.
    checkedIngredients: [],
    checkedSteps: [],
    startedAt: serverTimestamp(),
    lastUpdatedAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Update cooking session fields
 *
 * @param sessionId - Session document ID
 * @param updates - Partial fields to update (typically checked arrays)
 *
 * Automatically updates lastUpdatedAt timestamp for tracking.
 * Used by toggle functions to persist checked state changes.
 */
export async function updateCookingSession(
  sessionId: string,
  updates: Partial<CookingSession>
): Promise<void> {
  const sessionRef = doc(db, 'cooking_sessions', sessionId);

  await updateDoc(sessionRef, {
    ...updates,
    lastUpdatedAt: serverTimestamp(),
  });
}

/**
 * Delete a cooking session
 *
 * @param sessionId - Session document ID
 *
 * Called when:
 * - User manually ends session early
 * - Auto-deleted at 100% completion (see recipe cooking page)
 *
 * Does NOT cascade delete - recipe remains unchanged.
 */
export async function deleteCookingSession(sessionId: string): Promise<void> {
  const sessionRef = doc(db, 'cooking_sessions', sessionId);
  await deleteDoc(sessionRef);
}

/**
 * Get all cooking sessions for a user
 *
 * @param userId - User ID to filter by
 * @returns Array of sessions, ordered by most recently updated
 */
export async function getUserCookingSessions(
  userId: string
): Promise<CookingSession[]> {
  const sessionsRef = collection(db, 'cooking_sessions');
  const q = query(
    sessionsRef,
    where('userId', '==', userId),
    orderBy('lastUpdatedAt', 'desc')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as CookingSession[];
}

/**
 * Toggle an ingredient's checked state in a cooking session
 *
 * @param sessionId - Session to update
 * @param ingredientId - Ingredient ID to toggle
 * @param currentCheckedIngredients - Current checked ingredient IDs
 *
 * Array Toggle Pattern:
 * - If ID in array: remove it (uncheck)
 * - If ID not in array: add it (check)
 *
 * This pattern is used instead of boolean flags on ingredients to keep
 * recipe data immutable and session state separate.
 */
export async function toggleIngredientChecked(
  sessionId: string,
  ingredientId: string,
  currentCheckedIngredients: string[]
): Promise<void> {
  // Toggle: remove if present (uncheck), add if absent (check)
  // Uses filter for removal, spread for addition (Firestore-friendly operations)
  const isChecked = currentCheckedIngredients.includes(ingredientId);
  const newCheckedIngredients = isChecked
    ? currentCheckedIngredients.filter(id => id !== ingredientId)
    : [...currentCheckedIngredients, ingredientId];

  await updateCookingSession(sessionId, {
    checkedIngredients: newCheckedIngredients,
  });
}

/**
 * Toggle a step's checked state in a cooking session
 *
 * @param sessionId - Session to update
 * @param stepId - Step ID to toggle
 * @param currentCheckedSteps - Current checked step IDs
 *
 * Same array toggle pattern as toggleIngredientChecked.
 * See that function for rationale.
 */
export async function toggleStepChecked(
  sessionId: string,
  stepId: string,
  currentCheckedSteps: string[]
): Promise<void> {
  const isChecked = currentCheckedSteps.includes(stepId);
  const newCheckedSteps = isChecked
    ? currentCheckedSteps.filter(id => id !== stepId)
    : [...currentCheckedSteps, stepId];

  await updateCookingSession(sessionId, {
    checkedSteps: newCheckedSteps,
  });
}
