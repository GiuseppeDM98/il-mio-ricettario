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

// Delete category
export async function deleteCategory(categoryId: string): Promise<void> {
  const categoryRef = doc(db, 'categories', categoryId);
  await deleteDoc(categoryRef);
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