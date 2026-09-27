import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar, 
  UtensilsCrossed, 
  Grid, 
  MessageSquare, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminTab = 'dashboard' | 'orders' | 'reservations' | 'menu' | 'categories' | 'reviews' | 'customers';

interface AdminLayoutProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export function AdminLayout({ activeTab, onSelectTab, children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const navItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'menu', label: 'Menu Catalog', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'reviews', label: 'Review Moderation', icon: MessageSquare },
    { id: 'customers', label: 'Customers', icon: Users },
  ];

  const handleTabClick = (tab: AdminTab) => {
    onSelectTab(tab);
    setIsMobileMenuOpen(false);
  };

  const currentTabLabel = navItems.find(item => item.id === activeTab)?.label || 'Console';

  return (
    <div className="min-h-screen md:h-screen bg-obsidian-950 text-cream-100 flex flex-col md:flex-row selection:bg-champagne-500 selection:text-obsidian-950 overflow-x-hidden md:overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-obsidian-900 border-r border-obsidian-800 shrink-0 h-full z-30">
        {/* Header Branding */}
        <div className="p-6 border-b border-obsidian-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-600 flex items-center justify-center text-obsidian-950 font-serif font-bold text-xl shadow-lg shadow-champagne-500/20 shrink-0">
              É
            </div>
            <div className="min-w-0">
              <h1 className="font-serif text-lg tracking-wider text-cream-100 font-bold uppercase truncate">L'Étoile Noir</h1>
              <div className="flex items-center gap-1 text-[11px] text-champagne-400 font-medium uppercase tracking-widest truncate">
                <ShieldCheck className="w-3 h-3 text-champagne-400 shrink-0" />
                <span className="truncate">Admin Console</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 min-h-[44px] ${
                  isActive
                    ? 'bg-champagne-500/15 text-champagne-400 border border-champagne-500/30 shadow-inner'
                    : 'text-cream-300 hover:text-cream-100 hover:bg-obsidian-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-champagne-400' : 'text-cream-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer Admin Profile & Actions */}
        <div className="p-4 border-t border-obsidian-800 bg-obsidian-950/40">
          <div className="flex items-center justify-between px-2 gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-cream-100 truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-cream-400 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              title="Logout"
              aria-label="Logout"
              className="p-2.5 rounded-md text-cream-400 hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-obsidian-900 border-b border-obsidian-800 sticky top-0 z-40">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-champagne-400 to-champagne-600 flex items-center justify-center text-obsidian-950 font-serif font-bold text-base shadow-md shrink-0">
            É
          </div>
          <div className="min-w-0">
            <h1 className="font-serif text-xs font-bold tracking-wider text-cream-100 uppercase truncate">L'Étoile Noir</h1>
            <p className="text-[9px] text-champagne-400 tracking-widest uppercase truncate">{currentTabLabel}</p>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="p-2.5 text-cream-200 hover:text-cream-100 hover:bg-obsidian-800 rounded-lg transition-colors shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Menu Drawer Overlay & Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sliding Content */}
          <div className="relative w-full max-w-xs bg-obsidian-900 border-r border-obsidian-800 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between p-4 border-b border-obsidian-800">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-champagne-500 text-obsidian-950 font-serif font-bold flex items-center justify-center shrink-0">
                  É
                </div>
                <span className="font-serif text-sm font-bold text-cream-100 truncate">Admin Navigation</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
                className="p-2 text-cream-400 hover:text-cream-100 rounded-lg shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${
                      isActive
                        ? 'bg-champagne-500/20 text-champagne-400 border border-champagne-500/30'
                        : 'text-cream-300 hover:bg-obsidian-800'
                    }`}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-champagne-400' : 'text-cream-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-obsidian-800 bg-obsidian-950/60 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-cream-100 truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-cream-400 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold hover:bg-red-500/20 shrink-0 min-h-[36px]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto p-3 sm:p-6 md:p-8 max-w-7xl mx-auto w-full min-w-0">
        {children}
      </main>
    </div>
  );
}
