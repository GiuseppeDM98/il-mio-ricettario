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

// Default categories to create for new users
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

// Delete category and all its subcategories
export async function deleteCategory(categoryId: string, userId: string): Promise<void> {
  // First, delete all subcategories
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

// Helper function to generate color based on category name
function generateColorFromName(name: string): string {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#FFA07A',
    '#45B7D1', '#F7DC6F', '#BB8FCE', '#F8B739', '#52C41A'
  ];

  // Simple hash function to get consistent color for same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

// Helper function to generate icon based on category name
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

  // Try to match partial name
  for (const [key, icon] of Object.entries(iconMap)) {
    if (lowerName.includes(key)) {
      return icon;
    }
  }

  // Default icon
  return '🍽️';
}

// Create category if it doesn't exist, otherwise return existing category ID
export async function createCategoryIfNotExists(
  userId: string,
  categoryName: string
): Promise<string> {
  // First, check if category already exists
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