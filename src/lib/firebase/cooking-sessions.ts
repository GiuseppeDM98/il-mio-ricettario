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

// Get or create cooking session for a recipe
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

// Create new cooking session
export async function createCookingSession(
  recipeId: string,
  userId: string,
  servings?: number
): Promise<string> {
  const sessionsRef = collection(db, 'cooking_sessions');

  const docRef = await addDoc(sessionsRef, {
    recipeId,
    userId,
    servings: servings || null, // Firebase requires null instead of undefined
    checkedIngredients: [],
    checkedSteps: [],
    startedAt: serverTimestamp(),
    lastUpdatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Update cooking session
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

// Delete cooking session
export async function deleteCookingSession(sessionId: string): Promise<void> {
  const sessionRef = doc(db, 'cooking_sessions', sessionId);
  await deleteDoc(sessionRef);
}

// Get all cooking sessions for a user
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

// Toggle ingredient checked state
export async function toggleIngredientChecked(
  sessionId: string,
  ingredientId: string,
  currentCheckedIngredients: string[]
): Promise<void> {
  const isChecked = currentCheckedIngredients.includes(ingredientId);
  const newCheckedIngredients = isChecked
    ? currentCheckedIngredients.filter(id => id !== ingredientId)
    : [...currentCheckedIngredients, ingredientId];

  await updateCookingSession(sessionId, {
    checkedIngredients: newCheckedIngredients,
  });
}

// Toggle step checked state
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
