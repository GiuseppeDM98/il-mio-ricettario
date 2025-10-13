'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getRecipe } from '@/lib/firebase/firestore';
import { Recipe } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { StepsListCollapsible } from '@/components/recipe/steps-list-collapsible';
import { IngredientListCollapsible } from '@/components/recipe/ingredient-list-collapsible';
import NoSleep from 'nosleep.js';

export default function CookingModePage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const noSleep = new NoSleep();

    noSleep.enable();

    return () => {
      noSleep.disable();
    };
  }, []);

  useEffect(() => {
    if (user && id) {
      const fetchRecipe = async () => {
        try {
          const fetchedRecipe = await getRecipe(id as string, user.uid);
          if (fetchedRecipe) {
            setRecipe(fetchedRecipe);
          } else {
            setError('Ricetta non trovata o non autorizzata.');
          }
        } catch (err) {
          setError('Errore nel caricamento della ricetta.');
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [id, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  if (!recipe) {
    return <p className="text-center mt-10">Ricetta non trovata.</p>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 text-xl">
      <h1 className="text-5xl font-bold mb-8 text-center">{recipe.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Ingredienti</h2>
          <IngredientListCollapsible ingredients={recipe.ingredients} defaultExpanded={true} />
        </div>
        <div>
          <h2 className="text-3xl font-semibold mb-4">Preparazione</h2>
          <StepsListCollapsible steps={recipe.steps} defaultExpanded={true} />
        </div>
      </div>
    </div>
  );
}