import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, CheckCircle, AlertTriangle, X } from 'lucide-react';
import { fetchAdminCategories, createAdminCategory, updateAdminCategory, deleteAdminCategory } from '../../services/adminApi';
import type { Category } from '../../types';

interface AdminCategoriesProps {
  token: string;
}

export function AdminCategories({ token }: AdminCategoriesProps) {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [deletingCat, setDeletingCat] = useState<Category | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [displayOrder, setDisplayOrder] = useState('');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['adminCategories', token],
    queryFn: () => fetchAdminCategories(token),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createAdminCategory(token, data),
    onSuccess: (newCat) => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsFormOpen(false);
      showToast(`Category '${newCat.name}' created!`);
    },
    onError: (err: any) => alert(err.message || 'Failed to create category')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminCategory(token, id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsFormOpen(false);
      setEditingCat(null);
      showToast(`Category '${updated.name}' updated!`);
    },
    onError: (err: any) => alert(err.message || 'Failed to update category')
  });

  const [categoryDeleteError, setCategoryDeleteError] = useState<string | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminCategory(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setDeletingCat(null);
      showToast('Category deleted successfully!');
    },
    onError: (err: any) => {
      setDeletingCat(null);
      setCategoryDeleteError(err.message || 'Cannot delete this category.');
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingCat(null);
    setName('');
    setDescription('');
    setDisplayOrder('0');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setEditingCat(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setDisplayOrder(String(cat.displayOrder || 0));
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload = {
      name,
      description,
      displayOrder: parseInt(displayOrder) || 0
    };

    if (editingCat) {
      updateMutation.mutate({ id: String(editingCat._id), data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-champagne-500 text-obsidian-950 px-4 py-3 rounded-xl font-bold shadow-xl flex items-center gap-2 text-sm border border-champagne-400 animate-bounce">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream-100">Category Management</h2>
          <p className="text-xs text-cream-400 mt-1">Organize restaurant menu categories and display order</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-champagne-400 to-champagne-600 hover:from-champagne-300 hover:to-champagne-500 text-obsidian-950 font-bold rounded-xl text-xs transition-all duration-200 shadow-lg shadow-champagne-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-obsidian-900 border border-obsidian-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div key={cat._id || cat.slug} className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-5 flex flex-col justify-between hover:border-obsidian-700 transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-cream-100 text-base">{cat.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-obsidian-950 text-champagne-400 border border-champagne-500/20">
                    Order: {cat.displayOrder || 0}
                  </span>
                </div>
                <p className="text-xs text-cream-400 mt-2">{cat.description || 'No description provided.'}</p>
                <p className="text-[10px] font-mono text-cream-500 mt-1">Slug: {cat.slug}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-obsidian-800/60 mt-4">
                <button
                  onClick={() => handleOpenEdit(cat)}
                  className="p-1.5 bg-obsidian-950 border border-obsidian-800 text-cream-300 hover:text-champagne-400 rounded-lg text-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingCat(cat)}
                  className="p-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl relative">
            <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-cream-400 hover:text-cream-100">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-cream-100">
              {editingCat ? 'Edit Category' : 'Add Category'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-cream-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Starters"
                  className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl p-2.5 text-cream-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-cream-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief culinary summary..."
                  className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl p-2.5 text-cream-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-cream-300 mb-1">Display Order</label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl p-2.5 text-cream-100 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-obsidian-800 text-cream-200 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2 bg-champagne-500 text-obsidian-950 rounded-xl font-bold"
                >
                  {editingCat ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingCat && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-cream-100">Delete Category?</h3>
            </div>
            <p className="text-xs text-cream-300">
              Are you sure you want to delete <span className="font-bold text-cream-100">'{deletingCat.name}'</span>? Ensure no menu items are currently assigned to this category.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingCat(null)}
                className="px-4 py-2 bg-obsidian-800 hover:bg-obsidian-700 text-cream-200 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(String(deletingCat._id))}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blocked Category Deletion Warning Modal */}
      {categoryDeleteError && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-amber-500/30 rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setCategoryDeleteError(null)}
              className="absolute top-4 right-4 text-cream-400 hover:text-cream-100 p-1.5 rounded-lg hover:bg-obsidian-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 text-amber-400">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-cream-100">Cannot Delete Category</h3>
                <p className="text-[11px] text-amber-400 font-medium">Action Restricted</p>
              </div>
            </div>

            <div className="p-4 bg-obsidian-950 border border-obsidian-800 rounded-xl text-xs text-cream-200 leading-relaxed">
              {categoryDeleteError}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCategoryDeleteError(null)}
                className="px-6 py-2.5 bg-gradient-to-r from-champagne-400 to-champagne-600 hover:from-champagne-300 hover:to-champagne-500 text-obsidian-950 font-bold rounded-xl text-xs shadow-lg shadow-champagne-500/20 transition-all duration-200"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
