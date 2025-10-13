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
  section?: string; // es. "Per la pasta", "Per il sugo"
}

export interface Step {
  id: string;
  order: number;
  description: string;
  duration?: number; // in minuti
}

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;        // Will be customizable in Phase 2
  subcategory?: string;     // Will be customizable in Phase 2
  servings?: number;
  prepTime?: number;        // minuti
  cookTime?: number;        // minuti
  totalTime?: number;       // minuti (auto-calculated)
  difficulty?: 'facile' | 'media' | 'difficile';
  ingredients: Ingredient[];
  steps: Step[];
  notes?: string;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}