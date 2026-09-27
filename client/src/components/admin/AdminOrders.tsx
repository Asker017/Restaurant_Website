import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Filter, ShoppingBag, CheckCircle, Eye, X } from 'lucide-react';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../services/adminApi';
import type { Order } from '../../types';

interface AdminOrdersProps {
  token: string;
}

const ORDER_STATUSES: { value: Order['status']; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready for Pickup' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['preparing', 'cancelled'],
  preparing: ['ready', 'out_for_delivery', 'cancelled'],
  ready: ['completed', 'cancelled'],
  out_for_delivery: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export function AdminOrders({ token }: AdminOrdersProps) {
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['adminOrders', token, statusFilter, typeFilter, paymentFilter, searchQuery],
    queryFn: () => fetchAdminOrders(token, {
      status: statusFilter,
      orderType: typeFilter,
      paymentStatus: paymentFilter,
      search: searchQuery
    }),
    refetchInterval: 15000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, paymentStatus }: { id: string; status: string; paymentStatus?: string }) =>
      updateAdminOrderStatus(token, id, { status, paymentStatus }),
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      if (selectedOrder && (selectedOrder._id === updatedOrder._id || selectedOrder.orderNumber === updatedOrder.orderNumber)) {
        setSelectedOrder(updatedOrder);
      }
      showToast(`Order ${updatedOrder.orderNumber} status updated to '${updatedOrder.status}'`);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to update order status');
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'preparing':
      case 'out_for_delivery':
      case 'ready':
      case 'confirmed':
        return 'bg-champagne-500/10 text-champagne-400 border-champagne-500/30';
      case 'cancelled':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    }
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream-100">Order Management</h2>
          <p className="text-xs text-cream-400 mt-1">Track, process, and update kitchen & delivery orders</p>
        </div>
        <div className="text-xs text-cream-400 font-mono bg-obsidian-900 border border-obsidian-800 px-3 py-1.5 rounded-lg w-fit">
          Total Orders: <span className="text-champagne-400 font-bold">{orders.length}</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-cream-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order #, name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-obsidian-950 border border-obsidian-800 focus:border-champagne-500 rounded-xl py-2.5 pl-10 pr-4 text-xs text-cream-100 placeholder:text-cream-400/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center gap-1.5 bg-obsidian-950 border border-obsidian-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-champagne-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs text-cream-200 focus:outline-none font-medium cursor-pointer"
            >
              <option value="all" className="bg-obsidian-900">All Statuses</option>
              {ORDER_STATUSES.map(s => (
                <option key={s.value} value={s.value} className="bg-obsidian-900">{s.label}</option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-obsidian-950 border border-obsidian-800 rounded-xl px-3 py-2 text-xs text-cream-200 focus:outline-none font-medium cursor-pointer"
          >
            <option value="all" className="bg-obsidian-900">All Types</option>
            <option value="pickup" className="bg-obsidian-900">Pickup</option>
            <option value="delivery" className="bg-obsidian-900">Delivery</option>
          </select>

          {/* Payment filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-obsidian-950 border border-obsidian-800 rounded-xl px-3 py-2 text-xs text-cream-200 focus:outline-none font-medium cursor-pointer"
          >
            <option value="all" className="bg-obsidian-900">All Payments</option>
            <option value="pending" className="bg-obsidian-900">Payment Pending</option>
            <option value="paid" className="bg-obsidian-900">Paid</option>
          </select>
        </div>
      </div>

      {/* Orders List Table / Responsive Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-obsidian-900 border border-obsidian-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 bg-obsidian-900 border border-obsidian-800 rounded-2xl text-center space-y-3">
          <ShoppingBag className="w-10 h-10 text-cream-400/40 mx-auto" />
          <h3 className="text-base font-serif font-bold text-cream-100">No orders found</h3>
          <p className="text-xs text-cream-400">Try adjusting your filters or search term.</p>
        </div>
      ) : (
        <div>
          {/* Desktop Table View (XL screens) */}
          <div className="hidden xl:block bg-obsidian-900 border border-obsidian-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-obsidian-800 bg-obsidian-950/60 text-[11px] font-semibold text-cream-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 whitespace-nowrap">Order #</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Customer</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Type</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Items</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Total</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Payment</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-800/60 text-xs">
                  {orders.map((ord) => {
                    const allowedNext = VALID_TRANSITIONS[ord.status] || [];
                    return (
                      <tr key={ord._id || ord.orderNumber} className="hover:bg-obsidian-800/40 transition-colors">
                        <td className="py-4 px-4 font-mono font-bold text-champagne-400 whitespace-nowrap">
                          {ord.orderNumber}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <p className="font-semibold text-cream-100">{ord.customerInfo.name}</p>
                          <p className="text-[10px] text-cream-400">{ord.customerInfo.phone}</p>
                        </td>
                        <td className="py-4 px-4 uppercase font-semibold text-[10px] text-cream-300 whitespace-nowrap">
                          {ord.orderType}
                        </td>
                        <td className="py-4 px-4 text-cream-200 whitespace-nowrap">
                          {ord.items.length} item(s)
                        </td>
                        <td className="py-4 px-4 font-bold text-cream-100 whitespace-nowrap">
                          {formatPrice(ord.total)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {/* Status Change Selector */}
                          <div className="relative inline-block">
                            <select
                              value={ord.status}
                              disabled={updateMutation.isPending || allowedNext.length === 0}
                              onChange={(e) => updateMutation.mutate({ id: String(ord._id), status: e.target.value })}
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadgeClass(ord.status)}`}
                            >
                              <option value={ord.status} className="bg-obsidian-900 text-cream-100">
                                {ord.status.replace(/_/g, ' ')}
                              </option>
                              {allowedNext.map((st) => (
                                <option key={st} value={st} className="bg-obsidian-900 text-cream-100">
                                  → Move to {st.replace(/_/g, ' ')}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="p-1.5 rounded-lg bg-obsidian-950 border border-obsidian-800 text-cream-300 hover:text-champagne-400 hover:border-champagne-500/40 transition-colors"
                            title="View Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Card View with distinct vertical spacing */}
          <div className="xl:hidden space-y-4">
            {orders.map((ord) => {
              const allowedNext = VALID_TRANSITIONS[ord.status] || [];
              return (
                <div key={ord._id || ord.orderNumber} className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5 hover:border-obsidian-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-champagne-400">{ord.orderNumber}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase font-semibold ${getStatusBadgeClass(ord.status)}`}>
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-cream-200">
                    <div>
                      <p className="font-bold text-cream-100 text-sm">{ord.customerInfo.name}</p>
                      <p className="text-[11px] text-cream-400">{ord.customerInfo.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-cream-100 text-sm">{formatPrice(ord.total)}</p>
                      <p className="text-[10px] text-cream-400 uppercase font-semibold">{ord.orderType} • {ord.items.length} items</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-obsidian-800/60">
                    <select
                      value={ord.status}
                      disabled={updateMutation.isPending || allowedNext.length === 0}
                      onChange={(e) => updateMutation.mutate({ id: String(ord._id), status: e.target.value })}
                      className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${getStatusBadgeClass(ord.status)}`}
                    >
                      <option value={ord.status} className="bg-obsidian-900 text-cream-100">
                        {ord.status.replace(/_/g, ' ')}
                      </option>
                      {allowedNext.map((st) => (
                        <option key={st} value={st} className="bg-obsidian-900 text-cream-100">
                          → {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setSelectedOrder(ord)}
                      className="px-3.5 py-1.5 bg-obsidian-950 border border-obsidian-800 rounded-lg text-xs font-semibold text-champagne-400 hover:bg-obsidian-800 hover:border-champagne-500/40 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-cream-400 hover:text-cream-100 rounded-lg hover:bg-obsidian-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title */}
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-serif text-xl font-bold text-cream-100">Order Details</h3>
                <span className="font-mono text-sm font-bold text-champagne-400">{selectedOrder.orderNumber}</span>
              </div>
              <p className="text-xs text-cream-400 mt-1">Placed on {new Date(selectedOrder.createdAt || '').toLocaleString()}</p>
            </div>

            {/* Status & Quick Action */}
            <div className="p-4 bg-obsidian-950 border border-obsidian-800 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cream-400 font-semibold">Current Lifecycle Status</span>
                <p className="text-sm font-bold text-cream-100 capitalize">{selectedOrder.status.replace(/_/g, ' ')}</p>
              </div>
              <div>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateMutation.mutate({ id: String(selectedOrder._id), status: e.target.value })}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none ${getStatusBadgeClass(selectedOrder.status)}`}
                >
                  <option value={selectedOrder.status} className="bg-obsidian-900 text-cream-100">
                    {selectedOrder.status.replace(/_/g, ' ')}
                  </option>
                  {(VALID_TRANSITIONS[selectedOrder.status] || []).map((st) => (
                    <option key={st} value={st} className="bg-obsidian-900 text-cream-100">
                      Update to {st.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Customer & Fulfillment Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-obsidian-950/60 border border-obsidian-800 rounded-xl space-y-1 text-xs">
                <span className="text-[10px] uppercase font-semibold text-champagne-400 tracking-wider">Customer Info</span>
                <p className="font-bold text-cream-100 text-sm">{selectedOrder.customerInfo.name}</p>
                <p className="text-cream-300">{selectedOrder.customerInfo.email}</p>
                <p className="text-cream-300">{selectedOrder.customerInfo.phone}</p>
              </div>

              <div className="p-4 bg-obsidian-950/60 border border-obsidian-800 rounded-xl space-y-1 text-xs">
                <span className="text-[10px] uppercase font-semibold text-champagne-400 tracking-wider">Fulfillment & Payment</span>
                <p className="font-bold text-cream-100 capitalize">{selectedOrder.orderType} Order</p>
                <p className="text-cream-300">Payment: <span className="uppercase font-semibold text-cream-100">{selectedOrder.paymentMethod}</span> ({selectedOrder.paymentStatus})</p>
                {selectedOrder.deliveryAddress && selectedOrder.orderType === 'delivery' && (
                  <p className="text-cream-400 text-[11px] pt-1">
                    Address: {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city}, {selectedOrder.deliveryAddress.state} {selectedOrder.deliveryAddress.zipCode}
                  </p>
                )}
              </div>
            </div>

            {/* Order Items Breakdown */}
            <div className="space-y-3">
              <span className="text-xs uppercase font-semibold text-cream-300 tracking-wider">Ordered Dishes</span>
              <div className="bg-obsidian-950 border border-obsidian-800 rounded-xl divide-y divide-obsidian-800/80">
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-cream-100">{it.nameSnapshot}</p>
                      <p className="text-[11px] text-cream-400">Qty: {it.quantity} × {formatPrice(it.priceSnapshot)}</p>
                      {it.specialInstructions && (
                        <p className="text-[10px] text-champagne-400 italic">Note: {it.specialInstructions}</p>
                      )}
                    </div>
                    <span className="font-bold text-cream-100">{formatPrice(it.priceSnapshot * it.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="p-4 bg-obsidian-950 border border-obsidian-800 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between text-cream-300">
                <span>Subtotal</span>
                <span>{formatPrice(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-cream-300">
                <span>Delivery Fee</span>
                <span>{formatPrice(selectedOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-cream-100 pt-2 border-t border-obsidian-800">
                <span>Total Amount</span>
                <span className="text-champagne-400">{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-obsidian-800 text-cream-100 hover:bg-obsidian-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
