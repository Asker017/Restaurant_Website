import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Eye, X } from 'lucide-react';
import { fetchAdminCustomers, fetchAdminCustomerDetail } from '../../services/adminApi';

interface AdminCustomersProps {
  token: string;
}

export function AdminCustomers({ token }: AdminCustomersProps) {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['adminCustomers', token],
    queryFn: () => fetchAdminCustomers(token),
  });

  const { data: customerDetail, isLoading: isDetailLoading } = useQuery({
    queryKey: ['adminCustomerDetail', token, selectedCustomerId],
    queryFn: () => (selectedCustomerId ? fetchAdminCustomerDetail(token, selectedCustomerId) : null),
    enabled: !!selectedCustomerId,
  });

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream-100">Customer Accounts</h2>
          <p className="text-xs text-cream-400 mt-1">View registered guest directory, order metrics, and spend history</p>
        </div>
        <div className="text-xs text-cream-400 font-mono bg-obsidian-900 border border-obsidian-800 px-3 py-1.5 rounded-lg w-fit">
          Total Registered: <span className="text-champagne-400 font-bold">{customers.length}</span>
        </div>
      </div>

      {/* Customer Listing */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-obsidian-900 border border-obsidian-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : customers.length === 0 ? (
        <div className="p-8 sm:p-12 bg-obsidian-900 border border-obsidian-800 rounded-2xl text-center space-y-3">
          <Users className="w-10 h-10 text-cream-400/40 mx-auto" />
          <h3 className="text-base font-serif font-bold text-cream-100">No registered customers</h3>
        </div>
      ) : (
        <div>
          {/* Desktop Table View (XL screens) */}
          <div className="hidden xl:block bg-obsidian-900 border border-obsidian-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-obsidian-800 bg-obsidian-950/60 text-[11px] font-semibold text-cream-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 whitespace-nowrap">Name</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Email / Phone</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Registered Date</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Orders Count</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Total Spent</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-800/60 text-xs">
                  {customers.map((c) => (
                    <tr key={c._id} className="hover:bg-obsidian-800/40 transition-colors">
                      <td className="py-4 px-4 font-bold text-cream-100 whitespace-nowrap">{c.name}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="text-cream-200">{c.email}</p>
                        <p className="text-[10px] text-cream-400">{c.phone}</p>
                      </td>
                      <td className="py-4 px-4 text-cream-300 whitespace-nowrap">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 font-semibold text-cream-100 whitespace-nowrap">
                        {c.totalOrders} order(s)
                      </td>
                      <td className="py-4 px-4 font-bold text-champagne-400 whitespace-nowrap">
                        {formatPrice(c.totalSpending)}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setSelectedCustomerId(c._id)}
                          className="px-3 py-1.5 bg-obsidian-950 border border-obsidian-800 hover:border-champagne-500/40 text-cream-200 hover:text-champagne-400 rounded-lg text-xs font-semibold flex items-center gap-1.5 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Profile</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Card View with distinct vertical spacing */}
          <div className="xl:hidden space-y-4">
            {customers.map((c) => (
              <div key={c._id} className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5 hover:border-obsidian-700 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-cream-100 text-sm">{c.name}</h3>
                    <p className="text-xs text-cream-300">{c.email}</p>
                    <p className="text-[10px] text-cream-400">{c.phone}</p>
                  </div>
                  <span className="text-[10px] font-mono text-cream-400 bg-obsidian-950 px-2 py-0.5 rounded border border-obsidian-800 shrink-0">
                    Joined {new Date(c.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs p-2.5 sm:p-3 bg-obsidian-950/60 rounded-xl border border-obsidian-800/60">
                  <div>
                    <span className="text-[10px] uppercase text-cream-400 font-medium">Orders</span>
                    <p className="font-bold text-cream-100">{c.totalOrders} order(s)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-cream-400 font-medium">Total Spent</span>
                    <p className="font-bold text-champagne-400">{formatPrice(c.totalSpending)}</p>
                  </div>
                </div>

                <div className="pt-1 flex justify-end">
                  <button
                    onClick={() => setSelectedCustomerId(c._id)}
                    className="w-full sm:w-auto px-4 py-2 bg-obsidian-950 border border-obsidian-800 hover:border-champagne-500/40 text-champagne-400 hover:bg-obsidian-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Full Profile</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomerId && (
        <div className="fixed inset-0 z-50 bg-obsidian-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCustomerId(null)}
              aria-label="Close dialog"
              className="absolute top-4 right-4 p-2 text-cream-400 hover:text-cream-100 rounded-lg hover:bg-obsidian-800 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>

            {isDetailLoading || !customerDetail ? (
              <div className="py-12 text-center text-cream-400 animate-pulse text-xs">Loading guest metrics...</div>
            ) : (
              <>
                <div className="pr-8">
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-cream-100">{customerDetail.customer.name}</h3>
                  <p className="text-xs text-cream-400">Guest Account • Member since {new Date(customerDetail.customer.createdAt).toLocaleDateString()}</p>
                </div>

                {/* Profile Overview Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-xs">
                  <div className="p-3 bg-obsidian-950 border border-obsidian-800 rounded-xl">
                    <span className="text-[10px] uppercase text-cream-400 font-medium">Total Orders</span>
                    <p className="text-base sm:text-lg font-bold text-cream-100 mt-1">{customerDetail.stats.totalOrders}</p>
                  </div>

                  <div className="p-3 bg-obsidian-950 border border-obsidian-800 rounded-xl">
                    <span className="text-[10px] uppercase text-cream-400 font-medium">Completed</span>
                    <p className="text-base sm:text-lg font-bold text-emerald-400 mt-1">{customerDetail.stats.completedOrders}</p>
                  </div>

                  <div className="p-3 bg-obsidian-950 border border-obsidian-800 rounded-xl">
                    <span className="text-[10px] uppercase text-cream-400 font-medium">Cancelled</span>
                    <p className="text-base sm:text-lg font-bold text-red-400 mt-1">{customerDetail.stats.cancelledOrders}</p>
                  </div>

                  <div className="p-3 bg-obsidian-950 border border-obsidian-800 rounded-xl">
                    <span className="text-[10px] uppercase text-cream-400 font-medium">Total Spent</span>
                    <p className="text-base sm:text-lg font-bold text-champagne-400 mt-1">{formatPrice(customerDetail.stats.totalSpending)}</p>
                  </div>
                </div>

                {/* Recent Orders History */}
                <div>
                  <h4 className="font-serif font-bold text-cream-100 text-sm mb-3">Recent Orders</h4>
                  {customerDetail.recentOrders.length === 0 ? (
                    <p className="text-xs text-cream-400 py-4 text-center bg-obsidian-950 border border-obsidian-800 rounded-xl">No order history available.</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {customerDetail.recentOrders.map((ord) => (
                        <div key={ord._id || ord.orderNumber} className="p-3 bg-obsidian-950 border border-obsidian-800 rounded-xl flex items-center justify-between text-xs gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-champagne-400">{ord.orderNumber}</span>
                              <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-obsidian-900 text-cream-300 font-semibold">{ord.status}</span>
                            </div>
                            <p className="text-[11px] text-cream-400 mt-0.5">{ord.items.length} items • {ord.orderType}</p>
                          </div>
                          <span className="font-bold text-cream-100 shrink-0">{formatPrice(ord.total)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Table Reservations History */}
                <div>
                  <h4 className="font-serif font-bold text-cream-100 text-sm mb-3">Table Reservations</h4>
                  {customerDetail.reservations.length === 0 ? (
                    <p className="text-xs text-cream-400 py-4 text-center bg-obsidian-950 border border-obsidian-800 rounded-xl">No reservation records.</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {customerDetail.reservations.map((res) => (
                        <div key={res._id || res.bookingCode} className="p-3 bg-obsidian-950 border border-obsidian-800 rounded-xl flex items-center justify-between text-xs gap-2">
                          <div>
                            <span className="font-mono font-bold text-champagne-400">{res.bookingCode}</span>
                            <p className="text-[11px] text-cream-300 mt-0.5">{res.date} at {res.time} ({res.guests} Guests)</p>
                          </div>
                          <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-obsidian-900 text-cream-300 font-semibold shrink-0">{res.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
