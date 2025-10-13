'use client';

import { useState } from 'react';
import { Ingredient } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface IngredientListCollapsibleProps {
  ingredients: Ingredient[];
  defaultExpanded?: boolean;
}

interface GroupedIngredients {
  section: string | null;
  ingredients: Ingredient[];
}

export function IngredientListCollapsible({ ingredients, defaultExpanded = false }: IngredientListCollapsibleProps) {
  // Group ingredients by section
  const groupedIngredients: GroupedIngredients[] = [];
  const ingredientsBySection = new Map<string | null, Ingredient[]>();

  ingredients.forEach(ingredient => {
    const section = ingredient.section || null;
    if (!ingredientsBySection.has(section)) {
      ingredientsBySection.set(section, []);
    }
    ingredientsBySection.get(section)!.push(ingredient);
  });

  // Convert to array and sort: null section first, then alphabetically
  ingredientsBySection.forEach((ingredients, section) => {
    groupedIngredients.push({ section, ingredients });
  });

  // Sort: null section first, then alphabetically
  groupedIngredients.sort((a, b) => {
    if (a.section === null) return -1;
    if (b.section === null) return 1;
    return a.section.localeCompare(b.section);
  });

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(defaultExpanded ? groupedIngredients.map(g => g.section || 'no-section') : [])
  );

  const toggleSection = (section: string | null) => {
    const key = section || 'no-section';
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <div className="space-y-4">
      {groupedIngredients.map((group) => {
        const sectionKey = group.section || 'no-section';
        const isExpanded = expandedSections.has(sectionKey);
        const hasSection = group.section !== null;

        // If no section, render ingredients directly without collapsible header
        if (!hasSection) {
          return (
            <ul key={sectionKey} className="space-y-3">
              {group.ingredients.map((ingredient) => (
                <li key={ingredient.id} className="flex items-start">
                  <span className="flex-shrink-0 mr-3 text-primary">&#10003;</span>
                  <div>
                    <span className="font-medium">{ingredient.name}</span>
                    {ingredient.quantity && (
                      <span className="text-gray-500 ml-2">({ingredient.quantity})</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          );
        }

        // Render collapsible section
        return (
          <div key={sectionKey} className="border rounded-lg overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => toggleSection(group.section)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                )}
                <h3 className="font-semibold text-lg text-gray-900">
                  {group.section}
                </h3>
              </div>
            </button>

            {/* Section Ingredients */}
            {isExpanded && (
              <div className="p-4 border-t">
                <ul className="space-y-3">
                  {group.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-start">
                      <span className="flex-shrink-0 mr-3 text-primary">&#10003;</span>
                      <div>
                        <span className="font-medium">{ingredient.name}</span>
                        {ingredient.quantity && (
                          <span className="text-gray-500 ml-2">({ingredient.quantity})</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
