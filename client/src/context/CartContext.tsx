import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, MenuItem } from '../types';

interface CartContextType {
  items: CartItem[];
  addToCart: (menuItem: MenuItem, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  totalCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'etoile_cart_items';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (menuItem: MenuItem, quantity = 1, specialInstructions = '') => {
    const id = menuItem._id || menuItem.id || menuItem.title;
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (ci) => (ci.menuItem._id || ci.menuItem.id || ci.menuItem.title) === id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (specialInstructions) {
          updated[existingIndex].specialInstructions = specialInstructions;
        }
        return updated;
      } else {
        return [...prev, { menuItem, quantity, specialInstructions }];
      }
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setItems((prev) =>
      prev.filter(
        (ci) => (ci.menuItem._id || ci.menuItem.id || ci.menuItem.title) !== menuItemId
      )
    );
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }

    setItems((prev) =>
      prev.map((ci) => {
        const id = ci.menuItem._id || ci.menuItem.id || ci.menuItem.title;
        if (id === menuItemId) {
          return { ...ci, quantity };
        }
        return ci;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((acc, ci) => acc + ci.menuItem.price * ci.quantity, 0);
  const totalCount = items.reduce((acc, ci) => acc + ci.quantity, 0);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        totalCount,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
