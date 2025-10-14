'use client';

import { useState } from 'react';
import { ParsedRecipe } from '@/lib/utils/recipe-parser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Check, Clock, Users } from 'lucide-react';

interface ExtractedRecipePreviewProps {
  recipe: ParsedRecipe;
  index: number;
  onSave: (recipe: ParsedRecipe) => void;
  isSaving?: boolean;
  isSaved?: boolean;
}

export function ExtractedRecipePreview({
  recipe,
  index,
  onSave,
  isSaving,
  isSaved,
}: ExtractedRecipePreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group ingredients by section
  const ingredientSections = new Map<string, typeof recipe.ingredients>();
  recipe.ingredients.forEach(ing => {
    const sectionName = ing.section || 'Ingredienti';
    if (!ingredientSections.has(sectionName)) {
      ingredientSections.set(sectionName, []);
    }
    ingredientSections.get(sectionName)!.push(ing);
  });

  // Group steps by section
  const stepSections = new Map<string, typeof recipe.steps>();
  recipe.steps.forEach(step => {
    const sectionName = step.section || 'Preparazione';
    if (!stepSections.has(sectionName)) {
      stepSections.set(sectionName, []);
    }
    stepSections.get(sectionName)!.push(step);
  });

  return (
    <Card className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              {index + 1}
            </span>
            <h3 className="text-2xl font-bold text-gray-900">{recipe.title}</h3>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {recipe.servings && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} porzioni</span>
              </div>
            )}
            {recipe.prepTime && recipe.prepTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Prep: {recipe.prepTime} min</span>
              </div>
            )}
            {recipe.cookTime && recipe.cookTime > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>Cottura: {recipe.cookTime} min</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" />
                Riduci
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" />
                Espandi
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={() => onSave(recipe)}
            disabled={isSaving || isSaved}
            size="sm"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Salvata
              </>
            ) : isSaving ? (
              'Salvataggio...'
            ) : (
              'Salva Ricetta'
            )}
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="space-y-6 pt-4 border-t">
          {/* Ingredients */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Ingredienti</h4>
            <div className="space-y-4">
              {Array.from(ingredientSections.entries()).map(([sectionName, ingredients]) => (
                <div key={sectionName}>
                  {ingredientSections.size > 1 && (
                    <h5 className="font-medium text-gray-700 mb-2">
                      {sectionName}
                    </h5>
                  )}
                  <ul className="space-y-1 ml-4">
                    {ingredients.map(ing => (
                      <li key={ing.id} className="flex items-baseline gap-2">
                        <span className="text-gray-400">•</span>
                        <span className="flex-1">
                          <span className="font-medium">{ing.name}</span>
                          {ing.quantity && (
                            <span className="text-gray-600 ml-2">- {ing.quantity}</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Preparazione</h4>
            <div className="space-y-4">
              {Array.from(stepSections.entries()).map(([sectionName, steps]) => (
                <div key={sectionName}>
                  {stepSections.size > 1 && (
                    <h5 className="font-medium text-gray-700 mb-2">
                      {sectionName}
                    </h5>
                  )}
                  <ol className="space-y-3">
                    {steps.map((step, idx) => (
                      <li key={step.id} className="flex gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex-shrink-0 mt-0.5">
                          {step.order}
                        </span>
                        <span className="flex-1 text-gray-700 leading-relaxed">
                          {step.description}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {recipe.notes && (
            <div>
              <h4 className="text-lg font-semibold mb-2">Note</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-line">{recipe.notes}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
