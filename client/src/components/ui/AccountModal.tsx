import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User as UserIcon, ShoppingBag, Calendar, Heart, LogOut, Loader2, Star } from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getMyOrdersApi, getMyReservationsApi, fetchMenu } from '../../services/api';
import type { Order, Reservation, MenuItem } from '../../types';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackOrder: (order: Order) => void;
  onWriteReview?: (order: Order) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onTrackOrder,
  onWriteReview,
}) => {
  const { user, logout, updateProfile, token, isFavorite, toggleFavorite } = useAuth();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'reservations' | 'favorites'>('profile');
  
  // Profile edit state
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Favorites state
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (!isOpen) return;

    fetchMenu().then((items) => setAllMenuItems(items));

    if (!token) return;

    if (activeTab === 'orders') {
      setLoadingOrders(true);
      getMyOrdersApi(token)
        .then((res) => setOrders(res.data || []))
        .finally(() => setLoadingOrders(false));
    } else if (activeTab === 'reservations') {
      setLoadingReservations(true);
      getMyReservationsApi(token)
        .then((res) => setReservations(res.data || []))
        .finally(() => setLoadingReservations(false));
    }
  }, [isOpen, activeTab, token]);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMsg(null);
    try {
      await updateProfile({ name, email, phone });
      setProfileMsg({ type: 'success', text: 'Profile successfully updated!' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.message || 'Failed to update profile' });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const favoriteItems = allMenuItems.filter((item) =>
    isFavorite(item._id || item.id || item.title)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian-950/85 backdrop-blur-md"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          className="relative w-full max-w-3xl bg-obsidian-900 border border-obsidian-750 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 overflow-hidden shadow-2xl z-10 my-auto max-h-[88vh] flex flex-col justify-between"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-obsidian-950/80 text-cream-200 hover:text-champagne-400 border border-obsidian-700 transition-colors"
            aria-label="Close account modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* User Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-obsidian-800 pb-4 sm:pb-6 mb-4 sm:mb-6 gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-champagne-500/20 border border-champagne-500/40 flex items-center justify-center text-champagne-400 font-serif text-lg sm:text-xl font-bold shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-100 truncate">{user.name}</h3>
                <span className="text-[11px] sm:text-xs text-cream-400 font-light truncate block">{user.email}</span>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-obsidian-750 bg-obsidian-950 text-cream-300 hover:text-rose-400 hover:border-rose-500/40 text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-colors shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Account Tabs (2x2 grid on mobile, flex row on sm screens) */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 border-b border-obsidian-850 pb-3 mb-4 sm:mb-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-champagne-500 text-obsidian-950 shadow-gold-subtle'
                  : 'bg-obsidian-950 border border-obsidian-800 text-cream-300 hover:text-cream-100'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5 shrink-0" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'bg-champagne-500 text-obsidian-950 shadow-gold-subtle'
                  : 'bg-obsidian-950 border border-obsidian-800 text-cream-300 hover:text-cream-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'reservations'
                  ? 'bg-champagne-500 text-obsidian-950 shadow-gold-subtle'
                  : 'bg-obsidian-950 border border-obsidian-800 text-cream-300 hover:text-cream-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Reservations</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                activeTab === 'favorites'
                  ? 'bg-champagne-500 text-obsidian-950 shadow-gold-subtle'
                  : 'bg-obsidian-950 border border-obsidian-800 text-cream-300 hover:text-cream-100'
              }`}
            >
              <Heart className="w-3.5 h-3.5 shrink-0" />
              <span>Favorites ({user.favorites?.length || 0})</span>
            </button>
          </div>

          {/* Tab Content View */}
          <div className="flex-1 overflow-y-auto pr-1">
            {/* Tab 1: Profile Editor */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md mx-auto py-2">
                {profileMsg && (
                  <div
                    className={`p-3 rounded-xl text-xs text-center border ${
                      profileMsg.type === 'success'
                        ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
                        : 'bg-rose-950/80 border-rose-500/40 text-rose-300'
                    }`}
                  >
                    {profileMsg.text}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1 uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-cream-300 mb-1 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="w-full py-3.5 rounded-full text-xs font-semibold uppercase tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 transition-colors shadow-gold-subtle flex items-center justify-center gap-2 mt-4"
                >
                  {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Profile Changes'}
                </button>
              </form>
            )}

            {/* Tab 2: Orders History */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {loadingOrders ? (
                  <div className="text-center py-12 text-cream-400 text-xs flex justify-center items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-champagne-500" /> Loading your orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <ShoppingBag className="w-10 h-10 text-cream-400/40 mx-auto" />
                    <h4 className="font-serif text-lg text-cream-200">No Orders Placed Yet</h4>
                    <p className="text-xs text-cream-400">Your previous gourmet orders will appear here.</p>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord._id || ord.orderNumber}
                      className="p-4 sm:p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-obsidian-850 pb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="font-mono font-bold text-champagne-400 text-sm sm:text-base whitespace-nowrap block">
                            {ord.orderNumber}
                          </span>
                          <span className="text-[11px] text-cream-400 block">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-obsidian-900 border border-champagne-500/30 text-champagne-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap">
                            {ord.status.replace(/_/g, ' ')}
                          </span>

                          <button
                            onClick={() => onTrackOrder(ord)}
                            className="px-3 py-1 rounded-full bg-champagne-500 text-obsidian-950 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider hover:bg-champagne-400 transition-colors whitespace-nowrap"
                          >
                            Track
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-cream-300">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-baseline justify-between gap-3">
                            <span className="truncate flex-1">{it.quantity}x {it.nameSnapshot}</span>
                            <span className="font-serif font-bold text-cream-100 shrink-0">${(it.priceSnapshot * it.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-obsidian-850 flex items-center justify-between text-xs">
                        <span className="text-cream-400">Total Amount: <strong className="text-champagne-400 font-serif text-sm">${ord.total.toFixed(2)}</strong></span>

                        {ord.status === 'completed' && onWriteReview && (
                          <button
                            onClick={() => onWriteReview(ord)}
                            className="text-xs text-champagne-400 hover:underline flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5 fill-champagne-500" />
                            <span>Leave Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 3: Reservations */}
            {activeTab === 'reservations' && (
              <div className="space-y-4">
                {loadingReservations ? (
                  <div className="text-center py-12 text-cream-400 text-xs flex justify-center items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-champagne-500" /> Loading reservations...
                  </div>
                ) : reservations.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <Calendar className="w-10 h-10 text-cream-400/40 mx-auto" />
                    <h4 className="font-serif text-lg text-cream-200">No Reservations Found</h4>
                    <p className="text-xs text-cream-400">Your table reservations will be listed here.</p>
                  </div>
                ) : (
                  reservations.map((res) => (
                    <div
                      key={res._id || res.bookingCode}
                      className="p-5 rounded-2xl bg-obsidian-950 border border-obsidian-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-mono text-sm font-bold text-champagne-400">
                          {res.bookingCode}
                        </div>
                        <div className="text-xs text-cream-200 mt-1 font-medium">
                          {res.date} at {res.time} • {res.guests} Guests
                        </div>
                        {res.specialRequests && (
                          <span className="text-[11px] text-cream-400 italic block mt-0.5">
                            "{res.specialRequests}"
                          </span>
                        )}
                      </div>

                      <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        {res.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 4: Favorites */}
            {activeTab === 'favorites' && (
              <div>
                {favoriteItems.length === 0 ? (
                  <div className="text-center py-12 space-y-2">
                    <Heart className="w-10 h-10 text-cream-400/40 mx-auto" />
                    <h4 className="font-serif text-lg text-cream-200">No Favorite Dishes Saved</h4>
                    <p className="text-xs text-cream-400">Click the heart icon on any food item to save your favorites.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favoriteItems.map((item) => (
                      <div
                        key={item._id || item.title}
                        className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 flex gap-3 items-center"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-16 h-16 rounded-lg object-cover border border-obsidian-750 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm font-bold text-cream-100 truncate">
                            {item.title}
                          </h4>
                          <span className="font-serif text-xs font-bold text-champagne-400 block">
                            ${item.price}
                          </span>

                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => addToCart(item, 1)}
                              className="px-2.5 py-1 rounded-full bg-champagne-500 text-obsidian-950 text-[10px] font-semibold uppercase tracking-wider hover:bg-champagne-400 transition-colors"
                            >
                              Add to Cart
                            </button>

                            <button
                              onClick={() => toggleFavorite(item._id || item.id || item.title)}
                              className="p-1 text-rose-400 hover:text-cream-400 transition-colors"
                              title="Remove favorite"
                            >
                              <Heart className="w-4 h-4 fill-rose-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
