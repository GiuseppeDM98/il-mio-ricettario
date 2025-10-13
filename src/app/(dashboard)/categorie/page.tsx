'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import {
  getUserCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/lib/firebase/categories';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function GestioneCategoriePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#000000');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const loadCategories = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userCategories = await getUserCategories(user.uid);
      setCategories(userCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCategoryName) return;

    const newCategoryData = {
      name: newCategoryName,
      icon: newCategoryIcon,
      color: newCategoryColor,
      order: categories.length + 1,
      isDefault: false,
    };

    try {
      await createCategory(user.uid, newCategoryData);
      setNewCategoryName('');
      setNewCategoryIcon('');
      setNewCategoryColor('#000000');
      await loadCategories(); // Refresh list
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Sei sicuro di voler eliminare questa categoria?')) return;
    try {
      await deleteCategory(categoryId);
      await loadCategories(); // Refresh list
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      await updateCategory(editingCategory.id, {
        name: editingCategory.name,
        icon: editingCategory.icon,
        color: editingCategory.color,
      });
      setEditingCategory(null);
      await loadCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  if (loading) {
    return <div>Caricamento categorie...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestione Categorie</h1>

      {/* Edit Form */}
      {editingCategory && (
        <form onSubmit={handleUpdateCategory} className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Modifica Categoria</h2>
          <div className="flex flex-wrap gap-4">
            <Input
              type="text"
              value={editingCategory.name}
              onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
              placeholder="Nome categoria"
              required
              className="flex-grow"
            />
            <Input
              type="text"
              value={editingCategory.icon || ''}
              onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
              placeholder="Icona (es. 🍝)"
              className="w-24"
            />
            <Input
              type="color"
              value={editingCategory.color || '#000000'}
              onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
              className="w-24"
            />
            <Button type="submit">Salva Modifiche</Button>
            <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>Annulla</Button>
          </div>
        </form>
      )}

      {/* Create Form */}
      <form onSubmit={handleCreateCategory} className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Crea Nuova Categoria</h2>
        <div className="flex flex-wrap gap-4">
          <Input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Nome nuova categoria"
            required
            className="flex-grow"
          />
          <Input
            type="text"
            value={newCategoryIcon}
            onChange={(e) => setNewCategoryIcon(e.target.value)}
            placeholder="Icona (es. 🍝)"
            className="w-24"
          />
          <Input
            type="color"
            value={newCategoryColor}
            onChange={(e) => setNewCategoryColor(e.target.value)}
            className="w-24"
          />
          <Button type="submit">Crea</Button>
        </div>
      </form>

      {/* Category List */}
      <div className="space-y-2">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center p-2 border rounded-md">
            <span className="w-8 text-center" style={{ color: cat.color }}>
              {cat.icon || '●'}
            </span>
            <span className="flex-grow font-medium">{cat.name}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditingCategory(cat)}>Modifica</Button>
              {!cat.isDefault && (
                <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(cat.id)}>
                  Elimina
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}