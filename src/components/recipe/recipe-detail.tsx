'use client';

import { Recipe, Season } from '@/types';
import { IngredientListCollapsible } from './ingredient-list-collapsible';
import { StepsListCollapsible } from './steps-list-collapsible';

interface RecipeDetailProps {
  recipe: Recipe;
}

const SEASON_ICONS: Record<Season, string> = {
  primavera: '🌸',
  estate: '☀️',
  autunno: '🍂',
  inverno: '❄️',
  tutte_stagioni: '🌍'
};

const SEASON_LABELS: Record<Season, string> = {
  primavera: 'Primavera',
  estate: 'Estate',
  autunno: 'Autunno',
  inverno: 'Inverno',
  tutte_stagioni: 'Tutte le stagioni'
};

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-4xl font-bold mb-4">{recipe.title}</h1>
      <p className="text-lg text-gray-600 mb-6">{recipe.description}</p>

      {/* Season Badge */}
      {recipe.season && (
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-2xl">{SEASON_ICONS[recipe.season]}</span>
          <span className="font-medium text-blue-900">{SEASON_LABELS[recipe.season]}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 text-center">
        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-500">Porzioni</div>
          <div className="text-xl font-semibold">{recipe.servings || 'N/A'}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-500">Preparazione</div>
          <div className="text-xl font-semibold">{recipe.prepTime ? `${recipe.prepTime} min` : 'N/A'}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-500">Cottura</div>
          <div className="text-xl font-semibold">{recipe.cookTime ? `${recipe.cookTime} min` : 'N/A'}</div>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="text-sm text-gray-500">Totale</div>
          <div className="text-xl font-semibold">{recipe.totalTime ? `${recipe.totalTime} min` : 'N/A'}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h2 className="text-2xl font-semibold mb-4">Ingredienti</h2>
          <IngredientListCollapsible ingredients={recipe.ingredients} defaultExpanded={false} />
        </div>
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">Preparazione</h2>
          <StepsListCollapsible steps={recipe.steps} defaultExpanded={false} />
        </div>
      </div>

      {recipe.notes && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Note</h2>
          <p className="text-gray-700 whitespace-pre-line">{recipe.notes}</p>
        </div>
      )}
    </div>
  );
}