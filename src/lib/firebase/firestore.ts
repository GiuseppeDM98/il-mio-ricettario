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
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { Recipe } from '@/types';

// Create a new recipe
export async function createRecipe(userId: string, recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const recipesRef = collection(db, 'recipes');

  const docRef = await addDoc(recipesRef, {
    ...recipeData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

// Get single recipe, ensuring ownership
export async function getRecipe(recipeId: string, userId: string): Promise<Recipe | null> {
  const recipeRef = doc(db, 'recipes', recipeId);
  const recipeSnap = await getDoc(recipeRef);

  if (!recipeSnap.exists() || recipeSnap.data().userId !== userId) {
    // Return null if the recipe doesn't exist or the user is not the owner
    return null;
  }

  return {
    id: recipeSnap.id,
    ...recipeSnap.data(),
  } as Recipe;
}

// Get all recipes for a user
export async function getUserRecipes(userId: string): Promise<Recipe[]> {
  const recipesRef = collection(db, 'recipes');
  const q = query(
    recipesRef,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as Recipe[];
}

// Update recipe
export async function updateRecipe(recipeId: string, updates: Partial<Recipe>): Promise<void> {
  const recipeRef = doc(db, 'recipes', recipeId);

  await updateDoc(recipeRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

// Delete recipe
export async function deleteRecipe(recipeId: string): Promise<void> {
  const recipeRef = doc(db, 'recipes', recipeId);
  await deleteDoc(recipeRef);
}