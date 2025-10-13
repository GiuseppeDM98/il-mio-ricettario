'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Recipe, Ingredient, Step } from '@/types';
import { useAuth } from '@/lib/hooks/useAuth';
import { createRecipe, updateRecipe } from '@/lib/firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';
import { CategorySelector } from './category-selector';

interface RecipeFormProps {
  recipe?: Recipe; // For edit mode
  mode: 'create' | 'edit';
}

export function RecipeForm({ recipe, mode }: RecipeFormProps) {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState(recipe?.title || '');
  const [description, setDescription] = useState(recipe?.description || '');
  const [servings, setServings] = useState(recipe?.servings || 4);
  const [prepTime, setPrepTime] = useState(recipe?.prepTime || 0);
  const [cookTime, setCookTime] = useState(recipe?.cookTime || 0);
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients || []);
  const [steps, setSteps] = useState<Step[]>(recipe?.steps || []);
  const [categoryId, setCategoryId] = useState(recipe?.categoryId || '');
  const [subcategoryId, setSubcategoryId] = useState(recipe?.subcategoryId || '');
  const [loading, setLoading] = useState(false);

  const addIngredient = () => {
    setIngredients([...ingredients, { id: uuidv4(), name: '', quantity: '', section: '' }]);
  };

  const updateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(ing =>
      ing.id === id ? { ...ing, [field]: value } : ing
    ));
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const addStep = () => {
    setSteps([...steps, { id: uuidv4(), order: steps.length + 1, description: '' }]);
  };

  const updateStep = (id: string, description: string) => {
    setSteps(steps.map(step =>
      step.id === id ? { ...step, description } : step
    ));
  };

  const removeStep = (id: string) => {
    setSteps(steps.filter(step => step.id !== id).map((step, idx) => ({
      ...step,
      order: idx + 1
    })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let recipeId = recipe?.id;

      const recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
        title,
        description: description || '',
        servings: servings || 0,
        prepTime: prepTime || 0,
        cookTime: cookTime || 0,
        totalTime: (prepTime || 0) + (cookTime || 0),
        ingredients,
        steps,
        categoryId: categoryId || '',
        subcategoryId: subcategoryId || '',
        difficulty: recipe?.difficulty || 'facile',
        tags: recipe?.tags || [],
        techniqueIds: recipe?.techniqueIds || [],
        source: recipe?.source || { type: 'manual' },
        notes: recipe?.notes || '',
        images: recipe?.images || [],
      };

      if (mode === 'create') {
        recipeId = await createRecipe(user.uid, recipeData);
      } else if (recipeId) {
        await updateRecipe(recipeId, recipeData);
      }

      router.push(`/ricette/${recipeId}`);
    } catch (error) {
      console.error('Error saving recipe:', error);
      alert('Errore nel salvataggio della ricetta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Titolo</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Es. Pasta alla carbonara"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Descrizione</label>
        <textarea
          className="w-full border rounded-md p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Breve descrizione della ricetta..."
        />
      </div>

      <CategorySelector
        selectedCategoryId={categoryId}
        selectedSubcategoryId={subcategoryId}
        onCategoryChange={setCategoryId}
        onSubcategoryChange={setSubcategoryId}
      />

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Porzioni</label>
          <Input
            type="number"
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Prep (min)</label>
          <Input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(Number(e.target.value))}
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Cottura (min)</label>
          <Input
            type="number"
            value={cookTime}
            onChange={(e) => setCookTime(Number(e.target.value))}
            min={0}
          />
        </div>
      </div>

      {/* Ingredients Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Ingredienti</label>
          <Button type="button" onClick={addIngredient} size="sm">
            + Aggiungi
          </Button>
        </div>
        <div className="space-y-2">
          {ingredients.map((ing) => (
            <div key={ing.id} className="flex gap-2">
              <Input
                placeholder="Nome ingrediente"
                value={ing.name}
                onChange={(e) => updateIngredient(ing.id, 'name', e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Quantità"
                value={ing.quantity}
                onChange={(e) => updateIngredient(ing.id, 'quantity', e.target.value)}
                className="w-32"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeIngredient(ing.id)}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Steps Section */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Preparazione</label>
          <Button type="button" onClick={addStep} size="sm">
            + Aggiungi Step
          </Button>
        </div>
        <div className="space-y-2">
          {steps.map((step, idx) => (
            <div key={step.id} className="flex gap-2">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-sm font-medium">
                {idx + 1}
              </span>
              <textarea
                className="flex-1 border rounded-md p-2"
                value={step.description}
                onChange={(e) => updateStep(step.id, e.target.value)}
                rows={2}
                placeholder="Descrivi questo passaggio..."
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeStep(step.id)}
              >
                ✕
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvataggio...' : mode === 'create' ? 'Crea Ricetta' : 'Salva Modifiche'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Annulla
        </Button>
      </div>
    </form>
  );
}