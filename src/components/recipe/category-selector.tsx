'use client';

import { useState, useEffect } from 'react';
import { getUserCategories, getCategorySubcategories } from '@/lib/firebase/categories';
import { useAuth } from '@/lib/context/auth-context';
import { Category, Subcategory } from '@/types';

interface CategorySelectorProps {
  selectedCategoryId?: string;
  selectedSubcategoryId?: string;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategoryId: string) => void;
}

export function CategorySelector({
  selectedCategoryId,
  selectedSubcategoryId,
  onCategoryChange,
  onSubcategoryChange,
}: CategorySelectorProps) {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  useEffect(() => {
    if (selectedCategoryId) {
      loadSubcategories(selectedCategoryId);
    } else {
      setSubcategories([]);
    }
  }, [selectedCategoryId]);

  const loadCategories = async () => {
    if (!user) return;

    try {
      const cats = await getUserCategories(user.uid);
      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    try {
      const subs = await getCategorySubcategories(categoryId);
      setSubcategories(subs);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  if (loading) return <div>Caricamento categorie...</div>;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Categoria</label>
        <select
          value={selectedCategoryId || ''}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full border rounded-md p-2"
        >
          <option value="">Seleziona categoria</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>
      </div>

      {subcategories.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Sottocategoria</label>
          <select
            value={selectedSubcategoryId || ''}
            onChange={(e) => onSubcategoryChange(e.target.value)}
            className="w-full border rounded-md p-2"
          >
            <option value="">Seleziona sottocategoria</option>
            {subcategories.map(sub => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}