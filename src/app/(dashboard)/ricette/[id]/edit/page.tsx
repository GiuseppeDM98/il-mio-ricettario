'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getRecipe } from '@/lib/firebase/firestore';
import { Recipe } from '@/types';
import { RecipeForm } from '@/components/recipe/recipe-form';
import { Spinner } from '@/components/ui/spinner';

export default function EditRecipePage() {
  const { id } = useParams();
  const { user } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return <div className="flex justify-center items-center h-full"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!recipe) {
    return <p>Ricetta non trovata.</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Modifica ricetta</h1>
      <RecipeForm mode="edit" recipe={recipe} />
    </div>
  );
}