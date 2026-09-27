import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { MenuSection } from './components/sections/MenuSection';
import { AboutSection } from './components/sections/AboutSection';
import { GallerySection } from './components/sections/GallerySection';
import { ReviewsSection } from './components/sections/ReviewsSection';
import { LocationContact } from './components/sections/LocationContact';
import { ReservationSection } from './components/sections/ReservationSection';
import { Footer } from './components/layout/Footer';

import { FoodDetailModal } from './components/ui/FoodDetailModal';
import { CartDrawer } from './components/ui/CartDrawer';
import { AuthModal } from './components/ui/AuthModal';
import { CheckoutModal } from './components/ui/CheckoutModal';
import { OrderConfirmationModal } from './components/ui/OrderConfirmationModal';
import { OrderTrackingModal } from './components/ui/OrderTrackingModal';
import { AccountModal } from './components/ui/AccountModal';
import { ReviewSubmitModal } from './components/ui/ReviewSubmitModal';

import { AdminLayout } from './components/admin/AdminLayout';
import type { AdminTab } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminReservations } from './components/admin/AdminReservations';
import { AdminMenu } from './components/admin/AdminMenu';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminCustomers } from './components/admin/AdminCustomers';

import { useAuth } from './context/AuthContext';
import { fetchCategories, fetchMenu, fetchReviews, fetchGallery } from './services/api';
import type { MenuItem, Order } from './types';

export function App() {
  const [selectedFoodItem, setSelectedFoodItem] = useState<MenuItem | null>(null);
  const [prefilledDishName, setPrefilledDishName] = useState<string>('');

  // Modals state
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login',
  });
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [accountModalState, setAccountModalState] = useState<{ isOpen: boolean; tab: 'profile' | 'orders' | 'reservations' | 'favorites' }>({
    isOpen: false,
    tab: 'profile',
  });
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);

  // Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  // Fetch Menu Items
  const { data: menuItems = [], isLoading: isMenuLoading } = useQuery({
    queryKey: ['menu'],
    queryFn: () => fetchMenu(),
  });

  // Fetch Reviews
  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
  });

  // Fetch Gallery Items
  const { data: galleryItems = [] } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => fetchGallery(),
  });

  const scrollToReservation = (dishName?: string) => {
    if (dishName) {
      setPrefilledDishName(dishName);
    }
    const el = document.getElementById('reservation');
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // State for tracking view path (supports '/admin' and customer website)
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  const { user } = useAuth();

  // Listen to browser popstate for URL changes
  useEffect(() => {
    const handleLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateToPath = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  // Render Admin Section if URL starts with /admin OR if logged-in user is an admin
  const isAdminRoute = currentPath.startsWith('/admin') || (user && user.role === 'admin');

  if (isAdminRoute) {
    // If accessing admin area or user is an admin but not logged in, show Admin login
    if (!user || user.role !== 'admin') {
      return (
        <AdminLogin
          onSuccess={() => navigateToPath('/admin')}
          onNavigateHome={() => navigateToPath('/')}
        />
      );
    }

    const token = localStorage.getItem('etoile_auth_token') || '';

    return (
      <AdminLayout
        activeTab={adminTab}
        onSelectTab={(tab) => setAdminTab(tab)}
      >
        {adminTab === 'dashboard' && (
          <AdminDashboard
            token={token}
            onNavigateToOrders={() => setAdminTab('orders')}
            onNavigateToReservations={() => setAdminTab('reservations')}
          />
        )}
        {adminTab === 'orders' && <AdminOrders token={token} />}
        {adminTab === 'reservations' && <AdminReservations token={token} />}
        {adminTab === 'menu' && <AdminMenu token={token} />}
        {adminTab === 'categories' && <AdminCategories token={token} />}
        {adminTab === 'reviews' && <AdminReviews token={token} />}
        {adminTab === 'customers' && <AdminCustomers token={token} />}
      </AdminLayout>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-950 text-cream-100 font-sans selection:bg-champagne-500 selection:text-obsidian-950">
      {/* Navigation Header */}
      <Navbar
        onOpenReservation={() => scrollToReservation()}
        onOpenAuth={(mode = 'login') => setAuthModalState({ isOpen: true, mode })}
        onOpenAccount={(tab = 'profile') => setAccountModalState({ isOpen: true, tab })}
      />

      {/* Main Content Sections */}
      <main>
        <Hero onOpenReservation={() => scrollToReservation()} />
        
        <MenuSection
          categories={categories}
          items={menuItems}
          isLoading={isMenuLoading}
          onSelectItem={(item) => setSelectedFoodItem(item)}
          onRequireAuth={() => setAuthModalState({ isOpen: true, mode: 'login' })}
        />


        <AboutSection />

        <GallerySection items={galleryItems} />

        <ReviewsSection reviews={reviews} />

        <LocationContact />

        <ReservationSection prefilledSpecialRequest={prefilledDishName} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Food Detail View Modal */}
      <FoodDetailModal
        item={selectedFoodItem}
        onClose={() => setSelectedFoodItem(null)}
        onReserveItem={(dishTitle) => scrollToReservation(dishTitle)}
      />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        onClose={() => setAuthModalState((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => setConfirmedOrder(order)}
      />

      {/* Order Confirmation Modal */}
      {confirmedOrder && (
        <OrderConfirmationModal
          order={confirmedOrder}
          onClose={() => setConfirmedOrder(null)}
          onTrackOrder={(ord) => {
            setConfirmedOrder(null);
            setTrackingOrder(ord);
          }}
        />
      )}

      {/* Live Order Tracking Modal */}
      {trackingOrder && (
        <OrderTrackingModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      )}

      {/* Customer Account Dashboard Modal */}
      <AccountModal
        isOpen={accountModalState.isOpen}
        onClose={() => setAccountModalState((prev) => ({ ...prev, isOpen: false }))}
        onTrackOrder={(ord) => {
          setAccountModalState((prev) => ({ ...prev, isOpen: false }));
          setTrackingOrder(ord);
        }}
        onWriteReview={(ord) => {
          setAccountModalState((prev) => ({ ...prev, isOpen: false }));
          setReviewOrder(ord);
        }}
      />

      {/* Customer Review Submission Modal */}
      {reviewOrder && (
        <ReviewSubmitModal
          order={reviewOrder}
          onClose={() => setReviewOrder(null)}
          onSuccess={() => refetchReviews()}
        />
      )}
    </div>
  );
}

export default App;
