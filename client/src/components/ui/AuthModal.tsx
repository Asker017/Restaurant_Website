import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, Loader2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginValues = z.infer<typeof loginSchema>;
type RegisterValues = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, register: registerUser } = useAuth();

  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const {
    register: regRegister,
    handleSubmit: handleRegSubmit,
    formState: { errors: regErrors },
    reset: resetRegForm,
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
  });

  if (!isOpen) return null;

  const onLogin = async (values: LoginValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await login(values);
      resetLoginForm();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onRegister = async (values: RegisterValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await registerUser({
        name: values.name,
        email: values.email,
        phone: values.phone,
        password: values.password,
      });
      resetRegForm();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          className="relative w-full max-w-md bg-obsidian-900 border border-obsidian-750 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl z-10 my-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-obsidian-950/80 text-cream-200 hover:text-champagne-400 border border-obsidian-700 transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Mode Tabs */}
          <div className="flex items-center justify-center border-b border-obsidian-800 pb-4 mb-6">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage(null);
              }}
              className={`px-6 py-2 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
                mode === 'login' ? 'text-champagne-400' : 'text-cream-400 hover:text-cream-200'
              }`}
            >
              <span>Sign In</span>
              {mode === 'login' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne-500"
                />
              )}
            </button>

            <button
              onClick={() => {
                setMode('register');
                setErrorMessage(null);
              }}
              className={`px-6 py-2 text-sm font-semibold uppercase tracking-wider transition-colors relative ${
                mode === 'register' ? 'text-champagne-400' : 'text-cream-400 hover:text-cream-200'
              }`}
            >
              <span>Create Account</span>
              {mode === 'register' && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne-500"
                />
              )}
            </button>
          </div>

          <div className="text-center mb-6">
            <h3 className="font-serif text-2xl font-bold text-cream-100">
              {mode === 'login' ? 'Welcome Back' : 'Join L\'Étoile Noir'}
            </h3>
            <p className="text-xs text-cream-300 font-light mt-1">
              {mode === 'login'
                ? 'Sign in to access your order history & save favorite dishes.'
                : 'Create an account for expedited checkout & order tracking.'}
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs text-center">
              {errorMessage}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...loginRegister('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                  />
                </div>
                {loginErrors.email && (
                  <p className="text-xs text-rose-400 mt-1">{loginErrors.email.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    placeholder="Password"
                    {...loginRegister('password')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                  />
                </div>
                {loginErrors.password && (
                  <p className="text-xs text-rose-400 mt-1">{loginErrors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 px-3 sm:px-4 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle transition-all duration-300 flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 shrink-0" />
                    <span>Sign In</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegSubmit(onRegister)} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    {...regRegister('name')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                  />
                </div>
                {regErrors.name && (
                  <p className="text-xs text-rose-400 mt-1">{regErrors.name.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    {...regRegister('email')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                  />
                </div>
                {regErrors.email && (
                  <p className="text-xs text-rose-400 mt-1">{regErrors.email.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    {...regRegister('phone')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                  />
                </div>
                {regErrors.phone && (
                  <p className="text-xs text-rose-400 mt-1">{regErrors.phone.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    placeholder="Password (min 6 chars)"
                    {...regRegister('password')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                  />
                </div>
                {regErrors.password && (
                  <p className="text-xs text-rose-400 mt-1">{regErrors.password.message}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-cream-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    {...regRegister('confirmPassword')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-obsidian-950 border border-obsidian-800 text-cream-100 text-sm focus:border-champagne-500 focus:outline-none transition-colors placeholder:text-cream-400/60"
                  />
                </div>
                {regErrors.confirmPassword && (
                  <p className="text-xs text-rose-400 mt-1">{regErrors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 sm:py-4 px-3 sm:px-4 rounded-full text-[11px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle transition-all duration-300 flex items-center justify-center gap-2 mt-4"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 shrink-0" />
                    <span>Register Account</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
