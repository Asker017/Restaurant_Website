import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { adminLoginApi } from '../../services/adminApi';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onSuccess: () => void;
  onNavigateHome: () => void;
}

export function AdminLogin({ onSuccess, onNavigateHome }: AdminLoginProps) {
  const { setAuthTokenAndUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await adminLoginApi({ email, password });
      if (response.token && response.data) {
        setAuthTokenAndUser(response.token, response.data);
        onSuccess();
      } else {
        throw new Error('Invalid server authentication response');
      }
    } catch (err: any) {
      setError(err.message || 'Administrator authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex flex-col items-center justify-center p-4 selection:bg-champagne-500 selection:text-obsidian-950">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute inset-0 bg-radial from-champagne-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-600 flex items-center justify-center text-obsidian-950 font-serif font-bold text-3xl mx-auto mb-4 shadow-xl shadow-champagne-500/20">
            É
          </div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-wider text-cream-100 uppercase">
            L'Étoile Noir
          </h1>
          <p className="text-xs uppercase tracking-widest text-champagne-400 font-semibold mt-1">
            Restaurant Management Console
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/80 backdrop-blur-md">
          <h2 className="text-xl font-serif font-bold text-cream-100 mb-2 text-center">
            Admin Authentication
          </h2>
          <p className="text-xs text-cream-400 mb-6 text-center">
            Sign in with authorized restaurant management credentials
          </p>

          {error && (
            <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400 text-xs font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl py-3 pl-10 pr-4 text-sm text-cream-100 placeholder:text-cream-400/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-cream-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl py-3 pl-10 pr-4 text-sm text-cream-100 placeholder:text-cream-400/50 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-champagne-400 to-champagne-600 hover:from-champagne-300 hover:to-champagne-500 text-obsidian-950 font-bold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-champagne-500/20 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-obsidian-800 text-center">
            <button
              onClick={onNavigateHome}
              className="text-xs text-cream-400 hover:text-champagne-400 transition-colors"
            >
              ← Back to Main Customer Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
