'use client';

import { useRecipes } from '@/lib/hooks/useRecipes';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RecipesPage() {
  const { recipes, loading, error } = useRecipes();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">Errore nel caricamento delle ricette: {error}</p>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Le mie ricette</h1>
        <Button asChild>
          <Link href="/ricette/new">Crea Ricetta</Link>
        </Button>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">Nessuna ricetta trovata</h3>
          <p className="text-gray-500 mt-2">Inizia a creare la tua prima ricetta!</p>
          <Button asChild className="mt-4">
            <Link href="/ricette/new">Crea la tua prima ricetta</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  );
}