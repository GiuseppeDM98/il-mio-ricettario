'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRecipes } from '@/lib/hooks/useRecipes';
import { RecipeCard } from '@/components/recipe/recipe-card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/context/auth-context';
import { getUserCategories, getCategorySubcategories } from '@/lib/firebase/categories';
import { Category, Subcategory, Season } from '@/types';
import Link from 'next/link';

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

export default function RecipesPage() {
  const { recipes, loading, error } = useRecipes();
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season | 'all'>('all');

  useEffect(() => {
    const loadCategoriesData = async () => {
      if (!user) return;

      try {
        const userCategories = await getUserCategories(user.uid);
        setCategories(userCategories);

        // Load all subcategories for all categories
        const allSubcategories: Subcategory[] = [];
        for (const category of userCategories) {
          const subs = await getCategorySubcategories(category.id, user.uid);
          allSubcategories.push(...subs);
        }
        setSubcategories(allSubcategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategoriesData();
  }, [user]);

  // Filter recipes by season
  const filteredRecipes = useMemo(() => {
    if (selectedSeason === 'all') {
      return recipes;
    }
    return recipes.filter(recipe => recipe.season === selectedSeason);
  }, [recipes, selectedSeason]);

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

      {/* Season Filter */}
      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-700">Filtra per stagione:</span>
          <button
            onClick={() => setSelectedSeason('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedSeason === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tutte ({recipes.length})
          </button>
          {(Object.keys(SEASON_ICONS) as Season[]).map((season) => {
            const count = recipes.filter(r => r.season === season).length;
            return (
              <button
                key={season}
                onClick={() => setSelectedSeason(season)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSeason === season
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-2">{SEASON_ICONS[season]}</span>
                {SEASON_LABELS[season]} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {recipes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">Nessuna ricetta trovata</h3>
          <p className="text-gray-500 mt-2">Inizia a creare la tua prima ricetta!</p>
          <Button asChild className="mt-4">
            <Link href="/ricette/new">Crea la tua prima ricetta</Link>
          </Button>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-semibold">Nessuna ricetta trovata per questa stagione</h3>
          <p className="text-gray-500 mt-2">Prova a selezionare un'altra stagione o crea una nuova ricetta.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              categories={categories}
              subcategories={subcategories}
            />
          ))}
        </div>
      )}
    </div>
  );
}