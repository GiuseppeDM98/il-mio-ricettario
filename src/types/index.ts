import { Timestamp } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  section?: string;
}

export interface Step {
  id: string;
  order: number;
  description: string;
  duration?: number;
  section?: string;
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description?: string;
  categoryId?: string;
  subcategoryId?: string;
  difficulty?: 'facile' | 'media' | 'difficile';
  tags: string[];
  techniqueIds: string[];
  source?: {
    type: 'manual' | 'url' | 'pdf';
    url?: string;
    name?: string;
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