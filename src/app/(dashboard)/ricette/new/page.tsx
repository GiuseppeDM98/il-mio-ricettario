'use client';

import { RecipeForm } from '@/components/recipe/recipe-form';

export default function NewRecipePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Crea una nuova ricetta</h1>
      <RecipeForm mode="create" />
    </div>
  );
}