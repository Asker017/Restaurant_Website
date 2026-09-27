import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Calendar, Menu as MenuIcon, X, Phone, Clock, ShoppingBag, User as UserIcon, LogOut, Heart, FileText, ChevronDown } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenReservation: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAccount: (tab?: 'profile' | 'orders' | 'reservations' | 'favorites') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenReservation,
  onOpenAuth,
  onOpenAccount,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const { toggleCart, totalCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      const sections = ['hero', 'menu', 'about', 'gallery', 'reviews', 'contact', 'reservation'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Menu', href: '#menu' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-obsidian-900/90 backdrop-blur-md border-b border-obsidian-750/50 py-4 shadow-dark-card'
          : 'bg-gradient-to-b from-obsidian-950/90 via-obsidian-950/40 to-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-full border border-champagne-500/40 flex items-center justify-center bg-obsidian-850 group-hover:border-champagne-400 transition-colors">
              <UtensilsCrossed className="w-5 h-5 text-champagne-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-cream-100 group-hover:text-champagne-400 transition-colors">
                L'Étoile Noir
              </span>
              <span className="text-[10px] tracking-[0.25em] text-champagne-500 uppercase font-medium">
                Haute Cuisine
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-3 xl:gap-8">
            {navLinks.map((link) => {
              const linkId = link.href.replace('#', '');
              const isActive = activeSection === linkId;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`relative text-xs xl:text-sm tracking-wider font-medium transition-colors py-1 whitespace-nowrap ${
                    isActive ? 'text-champagne-400' : 'text-cream-300 hover:text-cream-100'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-champagne-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right Action CTAs (Cart + Auth/User + Reserve) */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-4">
            {/* Cart Button */}
            <button
              onClick={toggleCart}
              className="relative p-2 xl:p-2.5 rounded-full bg-obsidian-850 border border-obsidian-750 text-cream-200 hover:text-champagne-400 hover:border-champagne-500/40 transition-colors shrink-0"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 xl:w-5 xl:h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 xl:w-5 xl:h-5 rounded-full bg-champagne-500 text-obsidian-950 font-bold text-[9px] xl:text-[10px] flex items-center justify-center shadow-gold-subtle animate-bounce">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Auth Buttons or User Dropdown */}
            {isAuthenticated && user ? (
              <div className="relative shrink-0" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 xl:px-4 py-2 rounded-full bg-obsidian-850 border border-obsidian-750 hover:border-champagne-500/40 text-cream-100 text-xs font-semibold uppercase tracking-wider transition-colors whitespace-nowrap"
                >
                  <div className="w-5 h-5 xl:w-6 xl:h-6 rounded-full bg-champagne-500/20 text-champagne-400 flex items-center justify-center font-serif font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[80px] xl:max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-cream-400" />
                </button>

                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-obsidian-900 border border-obsidian-750 rounded-2xl shadow-2xl overflow-hidden z-50 py-2"
                    >
                      {user.role === 'admin' && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            window.history.pushState({}, '', '/admin');
                            window.dispatchEvent(new Event('popstate'));
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-champagne-400 bg-champagne-500/10 hover:bg-champagne-500/20 flex items-center gap-2.5 transition-colors border-b border-obsidian-800"
                        >
                          <UtensilsCrossed className="w-4 h-4 text-champagne-400" />
                          <span>Admin Portal</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAccount('profile');
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs text-cream-200 hover:text-champagne-400 hover:bg-obsidian-850 flex items-center gap-2.5 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-champagne-500" />
                        <span>My Account</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAccount('orders');
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs text-cream-200 hover:text-champagne-400 hover:bg-obsidian-850 flex items-center gap-2.5 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-champagne-500" />
                        <span>Order History</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAccount('favorites');
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs text-cream-200 hover:text-champagne-400 hover:bg-obsidian-850 flex items-center gap-2.5 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-champagne-500" />
                        <span>My Favorites</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          onOpenAccount('reservations');
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs text-cream-200 hover:text-champagne-400 hover:bg-obsidian-850 flex items-center gap-2.5 transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-champagne-500" />
                        <span>Reservations</span>
                      </button>

                      <div className="my-1 border-t border-obsidian-800" />

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 xl:gap-2 shrink-0">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-2.5 xl:px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider text-cream-200 hover:text-champagne-400 transition-colors whitespace-nowrap"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3 xl:px-4 py-2 rounded-full border border-champagne-500/40 text-champagne-400 hover:bg-champagne-500 hover:text-obsidian-950 text-xs font-semibold uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
                >
                  Register
                </button>
              </div>
            )}

            {/* Reserve Table Button */}
            <button
              onClick={onOpenReservation}
              className="relative inline-flex items-center gap-1.5 xl:gap-2 px-3.5 xl:px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 shadow-gold-subtle hover:shadow-gold-glow transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Reserve</span>
            </button>
          </div>

          {/* Mobile Actions Header */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Mobile Cart Toggle */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-full bg-obsidian-850 text-cream-100 border border-obsidian-750"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-champagne-500" />
              {totalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-champagne-500 text-obsidian-950 font-bold text-[9px] flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-obsidian-800 text-cream-100 border border-obsidian-700 hover:text-champagne-400 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-obsidian-900/98 backdrop-blur-xl border-b border-obsidian-750 overflow-hidden"
          >
            <div className="px-6 pt-6 pb-8 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="block text-lg font-serif text-cream-200 hover:text-champagne-400 transition-colors border-b border-obsidian-800 pb-3"
                >
                  {link.name}
                </a>
              ))}

              {isAuthenticated && user ? (
                <div className="pt-2 space-y-2 border-b border-obsidian-800 pb-4">
                  <div className="text-xs text-champagne-400 font-semibold uppercase tracking-wider mb-1">
                    Signed in as {user.name} {user.role === 'admin' && '(Admin)'}
                  </div>
                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        window.history.pushState({}, '', '/admin');
                        window.dispatchEvent(new Event('popstate'));
                      }}
                      className="w-full text-left text-sm font-bold text-champagne-400 bg-champagne-500/10 hover:bg-champagne-500/20 py-2 px-3 rounded-lg flex items-center gap-2.5 transition-colors border border-champagne-500/30"
                    >
                      <UtensilsCrossed className="w-4 h-4 text-champagne-400 shrink-0" />
                      <span>Open Admin Portal</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAccount('profile');
                    }}
                    className="w-full text-left text-sm text-cream-200 hover:text-champagne-400 py-1.5 flex items-center gap-2.5 transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-champagne-500 shrink-0" />
                    <span>My Account / Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAccount('orders');
                    }}
                    className="w-full text-left text-sm text-cream-200 hover:text-champagne-400 py-1.5 flex items-center gap-2.5 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-champagne-500 shrink-0" />
                    <span>Order History & Tracker</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAccount('reservations');
                    }}
                    className="w-full text-left text-sm text-cream-200 hover:text-champagne-400 py-1.5 flex items-center gap-2.5 transition-colors"
                  >
                    <Calendar className="w-4 h-4 text-champagne-500 shrink-0" />
                    <span>My Table Reservations</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAccount('favorites');
                    }}
                    className="w-full text-left text-sm text-cream-200 hover:text-champagne-400 py-1.5 flex items-center gap-2.5 transition-colors"
                  >
                    <Heart className="w-4 h-4 text-champagne-500 shrink-0" />
                    <span>My Favorites ({user.favorites?.length || 0})</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left text-sm text-rose-400 hover:text-rose-300 py-1.5 flex items-center gap-2.5 transition-colors pt-2 border-t border-obsidian-800/60"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full py-2.5 rounded-lg border border-obsidian-750 text-xs font-semibold uppercase text-cream-200"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="w-full py-2.5 rounded-lg bg-champagne-500 text-obsidian-950 text-xs font-semibold uppercase"
                  >
                    Register
                  </button>
                </div>
              )}

              <div className="pt-4 flex flex-col gap-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenReservation();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-semibold uppercase tracking-widest text-obsidian-950 bg-champagne-500 hover:bg-champagne-400 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve A Table</span>
                </button>
                <div className="flex items-center justify-between text-xs text-cream-400 pt-2 border-t border-obsidian-800/60">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-champagne-500" />
                    5:00 PM – 11:30 PM
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-champagne-500" />
                    +1 (555) 839-2041
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
