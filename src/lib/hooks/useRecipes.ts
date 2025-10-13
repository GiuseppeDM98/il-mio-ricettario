'use client';

import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/types';
import { getUserRecipes } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/hooks/useAuth';

export function useRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecipes = useCallback(async () => {
    if (!user) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userRecipes = await getUserRecipes(user.uid);
      setRecipes(userRecipes);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const refreshRecipes = useCallback(async () => {
    await fetchRecipes();
  }, [fetchRecipes]);

  return { recipes, loading, error, refreshRecipes };
}