import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, DollarSign, Clock, Calendar, Users, ArrowUpRight, ChevronRight, AlertCircle } from 'lucide-react';
import { fetchAdminDashboard } from '../../services/adminApi';
import type { Order } from '../../types';

interface AdminDashboardProps {
  token: string;
  onNavigateToOrders: () => void;
  onNavigateToReservations: () => void;
}

export function AdminDashboard({ token, onNavigateToOrders, onNavigateToReservations }: AdminDashboardProps) {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['adminDashboard', token],
    queryFn: () => fetchAdminDashboard(token),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-obsidian-800 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-obsidian-900 border border-obsidian-800 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 bg-obsidian-900 border border-red-500/30 rounded-2xl text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h3 className="text-lg font-serif font-bold text-cream-100">Failed to load dashboard metrics</h3>
        <p className="text-xs text-cream-400">{(error as any)?.message || 'Check database connection'}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-champagne-500 text-obsidian-950 rounded-lg text-xs font-bold hover:bg-champagne-400 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'preparing':
      case 'out_for_delivery':
      case 'ready':
        return 'bg-champagne-500/10 text-champagne-400 border-champagne-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream-100">Restaurant Overview</h2>
        <p className="text-xs text-cream-400 mt-1">Real-time performance metrics and operations snapshot</p>
      </div>

      {/* Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Today's Orders */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 sm:p-5 hover:border-obsidian-700 transition-colors flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-semibold text-cream-400 uppercase tracking-wider leading-snug">Today's Orders</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-champagne-500/10 border border-champagne-500/20 flex items-center justify-center text-champagne-400 shrink-0">
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-cream-100 mt-2 sm:mt-3">{stats.todayOrdersCount}</p>
        </div>

        {/* Today's Revenue */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 sm:p-5 hover:border-obsidian-700 transition-colors flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-semibold text-cream-400 uppercase tracking-wider leading-snug">Today's Revenue</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-400 mt-2 sm:mt-3">{formatPrice(stats.todayRevenue)}</p>
        </div>

        {/* Pending Orders */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 sm:p-5 hover:border-obsidian-700 transition-colors flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-semibold text-cream-400 uppercase tracking-wider leading-snug">Pending Orders</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-400 mt-2 sm:mt-3">{stats.pendingOrdersCount}</p>
        </div>

        {/* Active Reservations */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 sm:p-5 hover:border-obsidian-700 transition-colors flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-semibold text-cream-400 uppercase tracking-wider leading-snug">Active Bookings</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-cream-100 mt-2 sm:mt-3">{stats.activeReservationsCount}</p>
        </div>

        {/* Total Customers */}
        <div className="col-span-2 sm:col-span-1 bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 sm:p-5 hover:border-obsidian-700 transition-colors flex flex-col justify-between">
          <div className="flex items-start justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-semibold text-cream-400 uppercase tracking-wider leading-snug">Registered Guests</span>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-cream-100 mt-2 sm:mt-3">{stats.totalCustomersCount}</p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Orders Widget */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold text-cream-100">Live Orders Stream</h3>
              <button
                onClick={onNavigateToOrders}
                className="text-xs text-champagne-400 hover:text-champagne-300 flex items-center gap-1 font-semibold"
              >
                <span>View All Orders</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {stats.recentOrders.length === 0 ? (
              <p className="text-xs text-cream-400 py-6 text-center">No recent orders placed today.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentOrders.map((ord) => (
                  <div
                    key={ord._id || ord.orderNumber}
                    className="flex items-center justify-between p-3 bg-obsidian-950/60 rounded-xl border border-obsidian-800/80"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-champagne-400">{ord.orderNumber}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border uppercase font-semibold ${getStatusBadge(ord.status)}`}>
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-cream-200 mt-1">{ord.customerInfo.name} • {ord.items.length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-cream-100">{formatPrice(ord.total)}</p>
                      <p className="text-[10px] text-cream-400 uppercase tracking-wider">{ord.orderType}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Operations Widget */}
        <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg font-bold text-cream-100 mb-2">Quick Management</h3>
            <p className="text-xs text-cream-400 mb-6">Direct access to primary administrative channels</p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onNavigateToOrders}
                className="p-4 bg-obsidian-950 border border-obsidian-800 hover:border-champagne-500/50 rounded-xl text-left transition-all duration-200 group"
              >
                <div className="flex items-center justify-between text-champagne-400 mb-2">
                  <ShoppingBag className="w-5 h-5" />
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-sm font-semibold text-cream-100">Manage Orders</h4>
                <p className="text-[11px] text-cream-400 mt-0.5">Status updates & tracking</p>
              </button>

              <button
                onClick={onNavigateToReservations}
                className="p-4 bg-obsidian-950 border border-obsidian-800 hover:border-champagne-500/50 rounded-xl text-left transition-all duration-200 group"
              >
                <div className="flex items-center justify-between text-blue-400 mb-2">
                  <Calendar className="w-5 h-5" />
                  <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-sm font-semibold text-cream-100">Table Bookings</h4>
                <p className="text-[11px] text-cream-400 mt-0.5">Confirm or cancel requests</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
