'use client';

import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '@/types';
import { getUserRecipes } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/hooks/useAuth';

/**
 * Hook for fetching and managing user recipes
 *
 * Features:
 * - Automatic fetching on user change
 * - Loading and error states
 * - Manual refresh capability
 *
 * Pattern: useCallback + useEffect ensures stable function references
 * and prevents infinite fetch loops.
 */

/**
 * Fetch and manage recipes for the authenticated user
 *
 * @returns Recipes array, loading state, error message, and refresh function
 *
 * Auto-refetches when user changes (login/logout).
 * Use refreshRecipes() to manually refetch after mutations.
 */
export function useRecipes() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Wrapped in useCallback with [user] dependency to prevent infinite loops
  // Without useCallback, function would be recreated on every render, triggering
  // useEffect infinitely (fetchRecipes is in useEffect's dependency array)
  const fetchRecipes = useCallback(async () => {
    if (!user) {
      // User logged out - clear recipes immediately without API call
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

  // Auto-fetch on user change (login/logout) or on mount
  // fetchRecipes is stable thanks to useCallback, preventing infinite loops
  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  /**
   * Manually refresh recipes from Firestore
   *
   * Use after creating/updating/deleting recipes to sync state.
   * Alternative to real-time listeners (which would increase read costs).
   */
  const refreshRecipes = useCallback(async () => {
    // Simply calls fetchRecipes - wrapped in useCallback for stable reference
    await fetchRecipes();
  }, [fetchRecipes]);

  return { recipes, loading, error, refreshRecipes };
}