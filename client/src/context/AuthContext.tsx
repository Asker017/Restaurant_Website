import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { loginApi, registerApi, getMeApi, updateProfileApi, toggleFavoriteApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => void;
  setAuthTokenAndUser: (token: string, user: User) => void;
  updateProfile: (data: { name: string; email: string; phone: string }) => Promise<void>;
  toggleFavorite: (menuItemId: string) => Promise<boolean>;
  isFavorite: (menuItemId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('etoile_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const normalizeUser = (userData: User): User => {
    if (!userData || !userData.favorites) return { ...userData, favorites: [] };
    const normalizedFavs = userData.favorites.map((fav: any) =>
      typeof fav === 'object' && fav !== null ? String(fav._id || fav.id) : String(fav)
    );
    return { ...userData, favorites: normalizedFavs };
  };

  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await getMeApi(token);
        if (res.success && res.data) {
          setUser(normalizeUser(res.data));
        } else {
          logout();
        }
      } catch (err) {
        console.warn('[Auth] Failed to restore auth session');
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [token]);

  const handleSetToken = (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      localStorage.setItem('etoile_auth_token', newToken);
    } else {
      localStorage.removeItem('etoile_auth_token');
    }
  };

  const login = async (data: { email: string; password: string }) => {
    const res = await loginApi(data);
    if (res.token && res.data) {
      handleSetToken(res.token);
      setUser(normalizeUser(res.data));
    }
  };

  const register = async (data: { name: string; email: string; phone: string; password: string }) => {
    const res = await registerApi(data);
    if (res.token && res.data) {
      handleSetToken(res.token);
      setUser(normalizeUser(res.data));
    }
  };

  const logout = () => {
    handleSetToken(null);
    setUser(null);
  };

  const setAuthTokenAndUser = (newToken: string, newUser: User) => {
    handleSetToken(newToken);
    setUser(normalizeUser(newUser));
  };

  const updateProfile = async (data: { name: string; email: string; phone: string }) => {
    if (!token) throw new Error('Not authenticated');
    const res = await updateProfileApi(token, data);
    if (res.data) {
      setUser(prev => prev ? normalizeUser({ ...prev, name: res.data!.name, email: res.data!.email, phone: res.data!.phone }) : null);
    }
  };

  const toggleFavorite = async (menuItemId: string): Promise<boolean> => {
    if (!token || !user) {
      throw new Error('Please login to save favorite items.');
    }
    const res = await toggleFavoriteApi(token, menuItemId);
    if (res.success && res.favorites) {
      setUser(prev => prev ? normalizeUser({ ...prev, favorites: res.favorites }) : null);
      return res.isFavorited;
    }
    return false;
  };

  const isFavorite = (menuItemId: string): boolean => {
    if (!user || !user.favorites) return false;
    return user.favorites.some((fav: any) => {
      const favId = typeof fav === 'object' && fav !== null ? (fav._id || fav.id) : fav;
      return String(favId) === String(menuItemId);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        setAuthTokenAndUser,
        updateProfile,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
