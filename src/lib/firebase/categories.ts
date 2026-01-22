import {
  collection,
  doc,
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
import { Category, Subcategory } from '@/types';

/**
 * Category and Subcategory Management
 *
 * Architecture:
 * - Two collections: categories and subcategories
 * - User-scoped: All queries filter by userId
 * - Default categories: Created on user sign-up (see auth-context.tsx)
 * - Order field: Manual sorting (drag-drop in future)
 *
 * Helper Functions:
 * - generateColorFromName: Hash-based consistent color assignment
 * - generateIconFromName: Keyword matching for Italian food categories
 * - createCategoryIfNotExists: Idempotent creation for AI suggestions
 */

/**
 * Default categories created for new users
 *
 * Italian cuisine structure:
 * - Primi piatti (First courses): Pasta, risotto, soups
 * - Secondi piatti (Second courses): Meat, fish main dishes
 * - Contorni (Side dishes): Vegetables, salads
 * - Dolci (Desserts): Cakes, cookies, pastries
 * - Antipasti (Appetizers): Starters, finger foods
 *
 * Order determines display sequence in UI.
 *
 * CHECKLIST: If you add a default category here, also update:
 * - Category type definitions in types/index.ts (if new fields added)
 * - Recipe extraction prompts in app/api/extract-recipes/route.ts
 * - Category suggestion prompts in app/api/suggest-category/route.ts
 */
export const DEFAULT_CATEGORIES = [
  { name: 'Primi piatti', icon: '🍝', color: '#FF6B6B', order: 1 },
  { name: 'Secondi piatti', icon: '🥩', color: '#4ECDC4', order: 2 },
  { name: 'Contorni', icon: '🥗', color: '#95E1D3', order: 3 },
  { name: 'Dolci', icon: '🍰', color: '#F38181', order: 4 },
  { name: 'Antipasti', icon: '🧀', color: '#FFA07A', order: 5 },
];

// Initialize default categories for new user
export async function initializeDefaultCategories(userId: string): Promise<void> {
  const categoriesRef = collection(db, 'categories');

  const promises = DEFAULT_CATEGORIES.map(cat =>
    addDoc(categoriesRef, {
      ...cat,
      userId,
      isDefault: true,
      createdAt: serverTimestamp(),
    })
  );

  await Promise.all(promises);
}

// Get user categories
export async function getUserCategories(userId: string): Promise<Category[]> {
  const categoriesRef = collection(db, 'categories');
  const q = query(
    categoriesRef,
    where('userId', '==', userId),
    orderBy('order', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Category[];
}

// Create custom category
export async function createCategory(
  userId: string,
  categoryData: Omit<Category, 'id' | 'userId' | 'createdAt'>
): Promise<string> {
  const categoriesRef = collection(db, 'categories');

  const docRef = await addDoc(categoriesRef, {
    ...categoryData,
    userId,
    isDefault: false,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

// Update category
export async function updateCategory(
  categoryId: string,
  updates: Partial<Category>
): Promise<void> {
  const categoryRef = doc(db, 'categories', categoryId);
  await updateDoc(categoryRef, updates);
}

/**
 * Delete category and all its subcategories
 *
 * @param categoryId - Category to delete
 * @param userId - User ID for security filtering
 *
 * Cascade Delete Pattern:
 * 1. Query all subcategories for this category
 * 2. Delete all subcategories in parallel
 * 3. Delete the category itself
 *
 * Note: Does NOT delete recipes in this category - they become uncategorized.
 * This prevents accidental data loss.
 */
export async function deleteCategory(categoryId: string, userId: string): Promise<void> {
  // First, delete all subcategories in parallel for performance
  const subcategoriesRef = collection(db, 'subcategories');
  const q = query(
    subcategoriesRef,
    where('categoryId', '==', categoryId),
    where('userId', '==', userId)
  );

  const subcategoriesSnapshot = await getDocs(q);
  const deletePromises = subcategoriesSnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // Then delete the category itself
  const categoryRef = doc(db, 'categories', categoryId);
  await deleteDoc(categoryRef);
}

// Count subcategories for a category
export async function countSubcategories(categoryId: string, userId: string): Promise<number> {
  const subcategoriesRef = collection(db, 'subcategories');
  const q = query(
    subcategoriesRef,
    where('categoryId', '==', categoryId),
    where('userId', '==', userId)
  );

  const snapshot = await getDocs(q);
  return snapshot.size;
}

// Subcategories
export async function createSubcategory(
  userId: string,
  categoryId: string,
  name: string,
  order: number
): Promise<string> {
  const subcategoriesRef = collection(db, 'subcategories');

  const docRef = await addDoc(subcategoriesRef, {
    categoryId,
    userId,
    name,
    order,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getCategorySubcategories(
  categoryId: string,
  userId: string
): Promise<Subcategory[]> {
  const subcategoriesRef = collection(db, 'subcategories');
  const q = query(
    subcategoriesRef,
    where('categoryId', '==', categoryId),
    where('userId', '==', userId),
    orderBy('order', 'asc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Subcategory[];
}

// Update subcategory
export async function updateSubcategory(
  subcategoryId: string,
  updates: Partial<Subcategory>
): Promise<void> {
  const subcategoryRef = doc(db, 'subcategories', subcategoryId);
  await updateDoc(subcategoryRef, updates);
}

// Delete subcategory
export async function deleteSubcategory(subcategoryId: string): Promise<void> {
  const subcategoryRef = doc(db, 'subcategories', subcategoryId);
  await deleteDoc(subcategoryRef);
}

/**
 * Generate consistent color for a category name
 *
 * Algorithm: Simple hash function (DJB2 variant)
 * 1. Initialize hash to 0
 * 2. For each character: hash = charCode + ((hash << 5) - hash)
 *    - Left shift by 5 is equivalent to multiply by 32
 *    - Formula is: hash = charCode + (hash * 32 - hash) = charCode + hash * 31
 * 3. Take modulo of color palette size for index
 *
 * Properties:
 * - Same name always gets same color (consistency)
 * - Different names distribute across palette (variety)
 * - Fast computation (no cryptographic security needed)
 *
 * Reference: DJB2 hash (http://www.cse.yorku.ca/~oz/hash.html)
 */
function generateColorFromName(name: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#FFA07A',
    '#45B7D1', '#F7DC6F', '#BB8FCE', '#F8B739', '#52C41A'
  ];

  // Hash function: accumulates character codes with bit shift multiplication
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Generate appropriate emoji icon for an Italian category name
 *
 * Strategy: Keyword substring matching
 * - iconMap contains Italian food term roots (e.g., "zupp" matches "zuppa", "zuppe")
 * - Partial matching enables flexible recognition ("primi" in "primi piatti")
 * - Case-insensitive to handle "PASTA" vs "Pasta"
 *
 * Italian Cuisine Mapping:
 * - primi/pasta/risott → 🍝🍚 (carbs)
 * - secondi/carne/pesce → 🥩🐟 (proteins)
 * - contorni/verdur/insalat → 🥗🥬 (vegetables)
 * - dolci/frutta → 🍰🍎 (sweets)
 *
 * Fallback: 🍽️ (generic plate) for unrecognized categories
 */
function generateIconFromName(name: string): string {
  const iconMap: Record<string, string> = {
    'primi': '🍝',
    'secondi': '🥩',
    'contorni': '🥗',
    'dolci': '🍰',
    'antipasti': '🧀',
    'insalat': '🥗',
    'zupp': '🍲',
    'risott': '🍚',
    'pane': '🥖',
    'pizza': '🍕',
    'pasta': '🍝',
    'carne': '🥩',
    'pesce': '🐟',
    'verdur': '🥬',
    'frutta': '🍎',
    'bevand': '🥤',
    'salse': '🥫',
  };

  const lowerName = name.toLowerCase();

  // Try to match partial name (e.g., "zupp" matches "zuppa", "zuppe", "zuppiera")
  // First match wins - order in iconMap matters for ambiguous cases
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }

  // No match found - return generic food plate emoji
  return '🍽️';
}

/**
 * Create category if it doesn't exist, otherwise return existing category ID
 *
 * @param userId - User ID
 * @param categoryName - Name of category to create
 * @returns Category ID (existing or newly created)
 *
 * Use Case: AI recipe extraction suggests category names that may or may not
 * exist. This idempotent function prevents duplicate categories.
 *
 * Matching: Case-insensitive comparison ("DOLCI" === "Dolci" === "dolci")
 *
 * Order Assignment: New categories are appended to end (max order + 1)
 */
export async function createCategoryIfNotExists(
  userId: string,
  categoryName: string
): Promise<string> {
  // Check if category already exists (case-insensitive)
  // Prevents duplicates like "Dolci" and "dolci" from AI suggestions
  const categories = await getUserCategories(userId);
  const existingCategory = categories.find(
    cat => cat.name.toLowerCase() === categoryName.toLowerCase()
  );

  if (existingCategory) {
    return existingCategory.id;
  }

  // Category doesn't exist, create it
  const maxOrder = categories.length > 0
    ? Math.max(...categories.map(cat => cat.order))
    : 0;

  const newCategoryId = await createCategory(userId, {
    name: categoryName,
    icon: generateIconFromName(categoryName),
    color: generateColorFromName(categoryName),
    order: maxOrder + 1,
    isDefault: false,
  });

  return newCategoryId;
}