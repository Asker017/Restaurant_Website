import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit2, Trash2, CheckCircle, AlertTriangle, X, UtensilsCrossed } from 'lucide-react';
import { fetchAdminMenuItems, fetchAdminCategories, createAdminMenuItem, updateAdminMenuItem, deleteAdminMenuItem } from '../../services/adminApi';
import type { MenuItem } from '../../types';

interface AdminMenuProps {
  token: string;
}

export function AdminMenu({ token }: AdminMenuProps) {
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MenuItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isChefSpecial: false,
    isVegetarian: false,
    isSpicy: false,
    isGlutenFree: false,
    isAvailable: true,
    ingredients: '',
    calories: '',
    preparationTime: ''
  });

  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['adminMenuItems', token],
    queryFn: () => fetchAdminMenuItems(token),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['adminCategories', token],
    queryFn: () => fetchAdminCategories(token),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => createAdminMenuItem(token, data),
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ['adminMenuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setIsFormOpen(false);
      showToast(`Menu item '${newItem.title}' created successfully!`);
    },
    onError: (err: any) => alert(err.message || 'Failed to create item')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateAdminMenuItem(token, id, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['adminMenuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setIsFormOpen(false);
      setEditingItem(null);
      showToast(`Menu item '${updated.title}' updated successfully!`);
    },
    onError: (err: any) => alert(err.message || 'Failed to update item')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminMenuItem(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminMenuItems'] });
      queryClient.invalidateQueries({ queryKey: ['menu'] });
      setDeletingItem(null);
      showToast('Menu item deleted successfully!');
    },
    onError: (err: any) => alert(err.message || 'Failed to delete item')
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      price: '',
      category: categories[0]?.slug || 'starters',
      image: '',
      isChefSpecial: false,
      isVegetarian: false,
      isSpicy: false,
      isGlutenFree: false,
      isAvailable: true,
      ingredients: '',
      calories: '',
      preparationTime: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      price: String(item.price),
      category: item.category,
      image: item.image,
      isChefSpecial: !!item.isChefSpecial,
      isVegetarian: !!item.isVegetarian,
      isSpicy: !!item.isSpicy,
      isGlutenFree: !!item.isGlutenFree,
      isAvailable: item.isAvailable !== false,
      ingredients: item.ingredients ? item.ingredients.join(', ') : '',
      calories: item.calories ? String(item.calories) : '',
      preparationTime: item.preparationTime || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.price || !formData.category || !formData.image) {
      alert('Please fill in all required fields.');
      return;
    }

    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      calories: formData.calories ? parseInt(formData.calories) : undefined,
      ingredients: formData.ingredients ? formData.ingredients.split(',').map(s => s.trim()) : []
    };

    if (editingItem) {
      updateMutation.mutate({ id: String(editingItem._id || editingItem.id), data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-champagne-500 text-obsidian-950 px-4 py-3 rounded-xl font-bold shadow-xl flex items-center gap-2 text-sm border border-champagne-400 animate-bounce">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream-100">Menu Catalog</h2>
          <p className="text-xs text-cream-400 mt-1">Manage gourmet dishes, pricing, dietary flags, and availability</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-champagne-400 to-champagne-600 hover:from-champagne-300 hover:to-champagne-500 text-obsidian-950 font-bold rounded-xl text-xs transition-all duration-200 shadow-lg shadow-champagne-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Menu Item</span>
        </button>
      </div>

      {/* Search and Category Filters */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl py-2 pl-10 pr-4 text-xs text-cream-100 placeholder:text-cream-400/50 focus:outline-none transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-obsidian-950 border border-obsidian-800 rounded-xl px-3 py-2 text-xs text-cream-200 focus:outline-none cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat.slug} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Menu Cards / Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-obsidian-900 border border-obsidian-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-12 bg-obsidian-900 border border-obsidian-800 rounded-2xl text-center space-y-3">
          <UtensilsCrossed className="w-10 h-10 text-cream-400/40 mx-auto" />
          <h3 className="text-base font-serif font-bold text-cream-100">No dishes match your query</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div key={item._id || item.id} className="bg-obsidian-900 border border-obsidian-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-obsidian-700 transition-colors">
              <div>
                <div className="relative h-40 bg-obsidian-950 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-obsidian-950/80 text-champagne-400 border border-champagne-500/30">
                      {item.category}
                    </span>
                    {item.isChefSpecial && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-champagne-500 text-obsidian-950">
                        Chef's Special
                      </span>
                    )}
                  </div>
                  <div className="absolute top-2 right-2">
                    <button
                      onClick={() => updateMutation.mutate({
                        id: String(item._id || item.id),
                        data: { isAvailable: !item.isAvailable }
                      })}
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shadow ${
                        item.isAvailable !== false ? 'bg-emerald-500 text-obsidian-950' : 'bg-red-500 text-white'
                      }`}
                    >
                      {item.isAvailable !== false ? 'In Stock' : 'Unavailable'}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-cream-100 text-base leading-snug">{item.title}</h3>
                    <span className="font-bold text-champagne-400 text-sm shrink-0">{formatPrice(item.price)}</span>
                  </div>
                  <p className="text-xs text-cream-400 line-clamp-2">{item.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-end gap-2 border-t border-obsidian-800/60 mt-2">
                <button
                  onClick={() => handleOpenEdit(item)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-obsidian-950 border border-obsidian-800 hover:border-champagne-500/40 text-cream-200 hover:text-champagne-400 rounded-lg text-xs font-medium transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeletingItem(item)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Item Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setIsFormOpen(false)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-2 text-cream-400 hover:text-cream-100 rounded-lg hover:bg-obsidian-800 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-100 pr-8">
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-cream-300 mb-1">Dish Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Seared Wagyu Carpaccio"
                  className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl p-2.5 text-cream-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-cream-300 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="38"
                    className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl p-2.5 text-cream-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-cream-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl p-2.5 text-cream-100 focus:outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat.slug} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-cream-300 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Artisanal preparation description..."
                  className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl p-2.5 text-cream-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-cream-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl p-2.5 text-cream-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-cream-200">
                  <input
                    type="checkbox"
                    checked={formData.isChefSpecial}
                    onChange={(e) => setFormData({ ...formData, isChefSpecial: e.target.checked })}
                    className="accent-champagne-500 w-4 h-4 shrink-0"
                  />
                  <span className="truncate">Chef's Special</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-cream-200">
                  <input
                    type="checkbox"
                    checked={formData.isVegetarian}
                    onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                    className="accent-champagne-500 w-4 h-4 shrink-0"
                  />
                  <span className="truncate">Vegetarian</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-cream-200">
                  <input
                    type="checkbox"
                    checked={formData.isGlutenFree}
                    onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                    className="accent-champagne-500 w-4 h-4 shrink-0"
                  />
                  <span className="truncate">Gluten Free</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-cream-200">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="accent-champagne-500 w-4 h-4 shrink-0"
                  />
                  <span className="truncate">In Stock</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-obsidian-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 bg-obsidian-800 hover:bg-obsidian-700 text-cream-200 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-5 py-2 bg-champagne-500 hover:bg-champagne-400 text-obsidian-950 rounded-xl font-bold"
                >
                  {editingItem ? 'Save Changes' : 'Create Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-red-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-cream-100">Delete Menu Item?</h3>
            </div>
            <p className="text-xs text-cream-300">
              Are you sure you want to delete <span className="font-bold text-cream-100">'{deletingItem.title}'</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 bg-obsidian-800 hover:bg-obsidian-700 text-cream-200 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(String(deletingItem._id || deletingItem.id))}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
