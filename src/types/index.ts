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
  section?: string | null;
}

export interface Step {
  id: string;
  order: number;
  description: string;
  duration?: number | null;
  section?: string | null;
  sectionOrder?: number | null;
}

export type Season = 'primavera' | 'estate' | 'autunno' | 'inverno' | 'tutte_stagioni';

export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description?: string;
  categoryId?: string;
  subcategoryId?: string;
  season?: Season;
  aiSuggested?: boolean; // true se categoria/stagione sono suggerite da AI
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

export interface CookingSession {
  id: string;
  recipeId: string;
  userId: string;
  checkedIngredients: string[];
  checkedSteps: string[];
  startedAt: Timestamp;
  lastUpdatedAt: Timestamp;
}

export interface AISuggestion {
  categoryName: string; // Nome della categoria suggerita (può essere una esistente o nuova)
  season: Season;
  isNewCategory: boolean; // true se la categoria non esiste ancora
}

export interface ParsedRecipe {
  title: string;
  description?: string;
  servings?: number;
  prepTime?: number;
  cookTime?: number;
  ingredients: Ingredient[];
  steps: Step[];
  aiSuggestion?: AISuggestion; // Suggerimenti dall'AI
}