'use client';

import { Recipe } from '@/types';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

interface RecipeCardProps {
  recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/ricette/${recipe.id}`}>
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>{recipe.title}</CardTitle>
          <CardDescription>{recipe.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{recipe.totalTime ? `${recipe.totalTime} min` : ''}</span>
            <span>{recipe.servings ? `${recipe.servings} porzioni` : ''}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}