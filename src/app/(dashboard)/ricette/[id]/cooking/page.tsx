'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getRecipe } from '@/lib/firebase/firestore';
import {
  getCookingSession,
  createCookingSession,
  updateCookingSession,
} from '@/lib/firebase/cooking-sessions';
import { Recipe, CookingSession } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { StepsListCollapsible } from '@/components/recipe/steps-list-collapsible';
import { IngredientListCollapsible } from '@/components/recipe/ingredient-list-collapsible';
import { ArrowLeft } from 'lucide-react';
import NoSleep from 'nosleep.js';

export default function CookingModePage() {
  const { id } = useParams();
  const { user } = useAuth();
  const router = useRouter();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cookingSession, setCookingSession] = useState<CookingSession | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<string[]>([]);
  const [checkedSteps, setCheckedSteps] = useState<string[]>([]);

  useEffect(() => {
    const noSleep = new NoSleep();

    noSleep.enable();

    return () => {
      noSleep.disable();
    };
  }, []);

  useEffect(() => {
    if (user && id) {
      const fetchData = async () => {
        try {
          // Fetch recipe
          const fetchedRecipe = await getRecipe(id as string, user.uid);
          if (!fetchedRecipe) {
            setError('Ricetta non trovata o non autorizzata.');
            setLoading(false);
            return;
          }
          setRecipe(fetchedRecipe);

          // Fetch or create cooking session
          let session = await getCookingSession(id as string, user.uid);
          if (!session) {
            const sessionId = await createCookingSession(id as string, user.uid);
            session = await getCookingSession(id as string, user.uid);
          }

          if (session) {
            setCookingSession(session);
            setCheckedIngredients(session.checkedIngredients);
            setCheckedSteps(session.checkedSteps);
          }
        } catch (err) {
          setError('Errore nel caricamento della ricetta.');
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [id, user]);

  const handleToggleIngredient = async (ingredientId: string) => {
    if (!cookingSession) return;

    const newCheckedIngredients = checkedIngredients.includes(ingredientId)
      ? checkedIngredients.filter(id => id !== ingredientId)
      : [...checkedIngredients, ingredientId];

    setCheckedIngredients(newCheckedIngredients);

    try {
      await updateCookingSession(cookingSession.id, {
        checkedIngredients: newCheckedIngredients,
      });
    } catch (err) {
      console.error('Error updating cooking session:', err);
    }
  };

  const handleToggleStep = async (stepId: string) => {
    if (!cookingSession) return;

    const newCheckedSteps = checkedSteps.includes(stepId)
      ? checkedSteps.filter(id => id !== stepId)
      : [...checkedSteps, stepId];

    setCheckedSteps(newCheckedSteps);

    try {
      await updateCookingSession(cookingSession.id, {
        checkedSteps: newCheckedSteps,
      });
    } catch (err) {
      console.error('Error updating cooking session:', err);
    }
  };

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
      <div className="flex items-center mb-6">
        <Button
          variant="outline"
          size="lg"
          onClick={() => router.push(`/ricette/${id}`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Esci dalla modalità cottura
        </Button>
      </div>

      <h1 className="text-5xl font-bold mb-8 text-center">{recipe.title}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-3xl font-semibold mb-4">Ingredienti</h2>
          <IngredientListCollapsible
            ingredients={recipe.ingredients}
            defaultExpanded={true}
            interactive={true}
            checkedIngredients={checkedIngredients}
            onToggleIngredient={handleToggleIngredient}
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold mb-4">Preparazione</h2>
          <StepsListCollapsible
            steps={recipe.steps}
            defaultExpanded={true}
            interactive={true}
            checkedSteps={checkedSteps}
            onToggleStep={handleToggleStep}
          />
        </div>
      </div>
    </div>
  );
}