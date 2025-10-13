'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/auth-context';
import {
  getUserCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getCategorySubcategories,
  createSubcategory,
} from '@/lib/firebase/categories';
import { Category, Subcategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { EmojiPicker } from '@/components/ui/emoji-picker';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function GestioneCategoriePage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#FF6B6B');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [expandedCategoryId, setExpandedCategoryId] = useState<string | null>(null);
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState<string | null>(null);

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

  const loadSubcategories = async (categoryId: string) => {
    if (!user) return;
    try {
      const subs = await getCategorySubcategories(categoryId, user.uid);
      setSubcategories(prev => ({ ...prev, [categoryId]: subs }));
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  useEffect(() => {
    if (user) {
      loadCategories();
    }
  }, [user]);

  useEffect(() => {
    if (expandedCategoryId && !subcategories[expandedCategoryId]) {
      loadSubcategories(expandedCategoryId);
    }
  }, [expandedCategoryId]);

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

  const handleDeleteCategory = async () => {
    if (!deletingCategory) return;
    try {
      await deleteCategory(deletingCategory.id);
      setDeletingCategory(null);
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !addingSubcategoryTo || !newSubcategoryName) return;

    try {
      const currentSubs = subcategories[addingSubcategoryTo] || [];
      await createSubcategory(
        user.uid,
        addingSubcategoryTo,
        newSubcategoryName,
        currentSubs.length + 1
      );
      setNewSubcategoryName('');
      setAddingSubcategoryTo(null);
      await loadSubcategories(addingSubcategoryTo);
    } catch (error) {
      console.error('Error creating subcategory:', error);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategoryId(prev => prev === categoryId ? null : categoryId);
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
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categorie</h1>
      </div>

      {/* Create Form */}
      <Card className="mb-6 p-6">
        <h2 className="text-xl font-semibold mb-4">Crea Nuova Categoria</h2>
        <form onSubmit={handleCreateCategory}>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-grow min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Nome</label>
              <Input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Es. Primi piatti"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icona</label>
              <EmojiPicker
                value={newCategoryIcon}
                onSelect={setNewCategoryIcon}
                className="w-20 h-10"
              />
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-2">Colore</label>
              <Input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="h-10 cursor-pointer"
              />
            </div>
            <Button type="submit" size="lg">Crea Categoria</Button>
          </div>
        </form>
      </Card>

      {/* Category List */}
      {categories.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500">Nessuna categoria trovata</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {categories.map((cat) => (
            <Card key={cat.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-grow">
                    <span
                      className="text-3xl w-12 h-12 flex items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                    >
                      {cat.icon || '●'}
                    </span>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{cat.name}</h3>
                      <p className="text-sm text-gray-500">
                        {cat.isDefault ? 'Categoria predefinita' : 'Categoria personalizzata'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCategory(cat.id)}
                    >
                      {expandedCategoryId === cat.id ? 'Chiudi' : 'Sottocategorie'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingCategory(cat)}
                    >
                      Modifica
                    </Button>
                    {!cat.isDefault && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeletingCategory(cat)}
                      >
                        Elimina
                      </Button>
                    )}
                  </div>
                </div>

                {/* Subcategories Section */}
                {expandedCategoryId === cat.id && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="mb-3">
                      <h4 className="font-medium mb-2">Sottocategorie</h4>
                      {subcategories[cat.id]?.length > 0 ? (
                        <div className="space-y-1">
                          {subcategories[cat.id].map((sub) => (
                            <div key={sub.id} className="flex items-center p-2 bg-gray-50 rounded">
                              <span className="flex-grow">{sub.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">Nessuna sottocategoria</p>
                      )}
                    </div>
                    {addingSubcategoryTo === cat.id ? (
                      <form onSubmit={handleAddSubcategory} className="flex gap-2">
                        <Input
                          type="text"
                          value={newSubcategoryName}
                          onChange={(e) => setNewSubcategoryName(e.target.value)}
                          placeholder="Nome sottocategoria"
                          required
                          className="flex-grow"
                        />
                        <Button type="submit" size="sm">Aggiungi</Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setAddingSubcategoryTo(null);
                            setNewSubcategoryName('');
                          }}
                        >
                          Annulla
                        </Button>
                      </form>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setAddingSubcategoryTo(cat.id)}
                      >
                        + Aggiungi Sottocategoria
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica Categoria</DialogTitle>
            <DialogDescription>
              Modifica i dettagli della categoria
            </DialogDescription>
          </DialogHeader>
          {editingCategory && (
            <form onSubmit={handleUpdateCategory}>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <Input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    placeholder="Nome categoria"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Icona</label>
                  <EmojiPicker
                    value={editingCategory.icon || ''}
                    onSelect={(icon) => setEditingCategory({ ...editingCategory, icon })}
                    className="w-20 h-10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Colore</label>
                  <Input
                    type="color"
                    value={editingCategory.color || '#000000'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    className="h-10 cursor-pointer"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                  Annulla
                </Button>
                <Button type="submit">Salva Modifiche</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingCategory} onOpenChange={(open) => !open && setDeletingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Elimina Categoria</DialogTitle>
            <DialogDescription>
              Sei sicuro di voler eliminare la categoria "{deletingCategory?.name}"? Questa azione non può essere annullata.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingCategory(null)}>
              Annulla
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Elimina
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}