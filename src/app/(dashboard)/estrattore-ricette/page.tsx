'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { RecipeExtractorUpload } from '@/components/recipe/recipe-extractor-upload';
import { ExtractedRecipePreview } from '@/components/recipe/extracted-recipe-preview';
import { parseExtractedRecipes, ParsedRecipe, getAISuggestionForRecipe } from '@/lib/utils/recipe-parser';
import { createRecipe } from '@/lib/firebase/firestore';
import { getUserCategories } from '@/lib/firebase/categories';
import { createCategoryIfNotExists } from '@/lib/firebase/categories';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Category, Season } from '@/types';

export default function RecipeExtractorPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedRecipes, setExtractedRecipes] = useState<ParsedRecipe[]>([]);
  const [savingStates, setSavingStates] = useState<Map<number, boolean>>(new Map());
  const [savedStates, setSavedStates] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [userCategories, setUserCategories] = useState<Category[]>([]);

  // Check if user is test account (AI disabled for test account)
  const isTestAccount = user?.email === 'test@test.com';

  // Load user categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      if (user) {
        try {
          const categories = await getUserCategories(user.uid);
          setUserCategories(categories);
        } catch (error) {
          console.error('Error loading categories:', error);
        }
      }
    };
    loadCategories();
  }, [user]);

  const handleFileSelected = async (file: File) => {
    if (!user) {
      toast.error('Devi effettuare il login per usare questa funzionalità');
      return;
    }

    // Block test account from using AI extraction
    if (user.email === 'test@test.com') {
      toast.error('L\'estrazione AI è disabilitata per l\'account di test');
      return;
    }

    setIsExtracting(true);
    setError(null);
    setExtractedRecipes([]);
    setSavingStates(new Map());
    setSavedStates(new Set());

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userCategories', JSON.stringify(userCategories.map(c => ({ name: c.name }))));

      const response = await fetch('/api/extract-recipes', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Errore durante l\'estrazione');
      }

      const data = await response.json();

      if (!data.success || !data.extractedRecipes) {
        throw new Error('Nessuna ricetta trovata nel PDF');
      }

      // Parse the markdown output into structured recipes
      const parsedRecipes = parseExtractedRecipes(data.extractedRecipes);

      if (parsedRecipes.length === 0) {
        throw new Error('Non è stato possibile estrarre ricette valide dal PDF');
      }

      // Get AI suggestions for each recipe
      toast.success(`${parsedRecipes.length} ricett${parsedRecipes.length === 1 ? 'a estratta' : 'e estratte'}! Ottenimento suggerimenti AI...`);

      const recipesWithSuggestions = await Promise.all(
        parsedRecipes.map(async (recipe) => {
          const suggestion = await getAISuggestionForRecipe(
            recipe.title,
            recipe.ingredients,
            userCategories.map(c => ({ name: c.name }))
          );
          return {
            ...recipe,
            aiSuggestion: suggestion || undefined
          };
        })
      );

      setExtractedRecipes(recipesWithSuggestions);
      toast.success(`Suggerimenti AI pronti!`);
    } catch (err: any) {
      console.error('Error extracting recipes:', err);
      setError(err.message || 'Errore durante l\'estrazione delle ricette');
      toast.error(err.message || 'Errore durante l\'estrazione');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSaveRecipe = async (recipe: ParsedRecipe, categoryName: string, season: Season, index: number) => {
    if (!user) return;

    // Set saving state
    setSavingStates(prev => new Map(prev).set(index, true));

    try {
      // Create category if it doesn't exist
      let categoryId = '';
      if (categoryName && categoryName.trim()) {
        categoryId = await createCategoryIfNotExists(user.uid, categoryName.trim());
      }

      const recipeData = {
        title: recipe.title,
        description: '',
        servings: recipe.servings || 4,
        prepTime: recipe.prepTime || 0,
        cookTime: recipe.cookTime || 0,
        totalTime: (recipe.prepTime || 0) + (recipe.cookTime || 0),
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        categoryId: categoryId,
        subcategoryId: '',
        season: season,
        aiSuggested: recipe.aiSuggestion ? true : false,
        difficulty: 'media' as const,
        tags: [],
        techniqueIds: [],
        source: {
          type: 'pdf' as const,
          name: 'Estratto da PDF con AI',
        },
        notes: recipe.notes || '',
        images: [],
      };

      const recipeId = await createRecipe(user.uid, recipeData);

      // Mark as saved
      setSavedStates(prev => new Set(prev).add(index));
      toast.success(`"${recipe.title}" salvata con successo!`);

      // Refresh categories if a new one was created
      const updatedCategories = await getUserCategories(user.uid);
      setUserCategories(updatedCategories);
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error(`Errore nel salvataggio di "${recipe.title}"`);
    } finally {
      // Clear saving state
      setSavingStates(prev => {
        const newMap = new Map(prev);
        newMap.delete(index);
        return newMap;
      });
    }
  };

  const handleSaveAll = async () => {
    if (!user || extractedRecipes.length === 0) return;

    for (let i = 0; i < extractedRecipes.length; i++) {
      if (!savedStates.has(i)) {
        const recipe = extractedRecipes[i];
        const categoryName = recipe.aiSuggestion?.categoryName || '';
        const season = recipe.aiSuggestion?.season || 'tutte_stagioni';
        await handleSaveRecipe(recipe, categoryName, season, i);
      }
    }

    toast.success('Tutte le ricette sono state salvate!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Estrattore di Ricette AI</h1>
        </div>
        <p className="text-gray-600">
          Carica un PDF contenente ricette e l'intelligenza artificiale le estrarrà automaticamente per te.
        </p>
      </div>

      {/* Test Account Warning */}
      {isTestAccount && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900">Funzionalità AI Disabilitata</h3>
            <p className="text-sm text-yellow-700 mt-1">
              L'estrazione AI è disabilitata per l'account di test per proteggere le risorse API.
              
            </p>
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-lg border p-6">
        <RecipeExtractorUpload
          onFileSelected={handleFileSelected}
          isLoading={isExtracting}
          disabled={isTestAccount}
        />

        {isExtracting && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-primary">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="font-medium">Analisi del PDF in corso...</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Questo processo può richiedere alcuni secondi
            </p>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Errore nell'estrazione</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message and Bulk Actions */}
      {extractedRecipes.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">
                  {extractedRecipes.length} ricett{extractedRecipes.length === 1 ? 'a estratta' : 'e estratte'}
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Controlla i dettagli di ogni ricetta e salvale nel tuo ricettario
                </p>
              </div>
            </div>
            {savedStates.size < extractedRecipes.length && (
              <Button onClick={handleSaveAll} size="sm">
                Salva Tutte ({extractedRecipes.length - savedStates.size})
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Extracted Recipes List */}
      {extractedRecipes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Ricette Estratte</h2>
          {extractedRecipes.map((recipe, index) => (
            <ExtractedRecipePreview
              key={index}
              recipe={recipe}
              index={index}
              onSave={(r, categoryName, season) => handleSaveRecipe(r, categoryName, season, index)}
              isSaving={savingStates.get(index)}
              isSaved={savedStates.has(index)}
            />
          ))}
        </div>
      )}

      {/* Help Section */}
      {extractedRecipes.length === 0 && !isExtracting && !error && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Come funziona?</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Carica un file PDF contenente una o più ricette</li>
            <li>L'AI di Claude analizzerà il documento ed estrarrà automaticamente tutte le ricette</li>
            <li>Controlla le ricette estratte e modificale se necessario</li>
            <li>Salva le ricette nel tuo ricettario personale</li>
          </ol>
          <p className="text-xs text-blue-600 mt-4">
            💡 Suggerimento: I PDF con ricette ben strutturate (con sezioni chiare per ingredienti e procedimento)
            daranno risultati migliori.
          </p>
        </div>
      )}
    </div>
  );
}
