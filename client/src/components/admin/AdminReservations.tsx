import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Calendar as CalendarIcon, CheckCircle, Filter, Users } from 'lucide-react';
import { fetchAdminReservations, updateAdminReservationStatus } from '../../services/adminApi';
import type { Reservation } from '../../types';

interface AdminReservationsProps {
  token: string;
}

export function AdminReservations({ token }: AdminReservationsProps) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ['adminReservations', token, statusFilter, dateFilter],
    queryFn: () => fetchAdminReservations(token, { status: statusFilter, date: dateFilter }),
    refetchInterval: 20000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      updateAdminReservationStatus(token, id, status),
    onSuccess: (updatedRes) => {
      queryClient.invalidateQueries({ queryKey: ['adminReservations'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      showToast(`Booking ${updatedRes.bookingCode} status updated to ${updatedRes.status}`);
    },
    onError: (err: any) => {
      alert(err.message || 'Failed to update reservation status');
    }
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getStatusBadge = (status: Reservation['status'] | string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
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
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream-100">Reservation Management</h2>
          <p className="text-xs text-cream-400 mt-1">Review table booking requests, confirm, or mark completed</p>
        </div>
        <div className="text-xs text-cream-400 font-mono bg-obsidian-900 border border-obsidian-800 px-3 py-1.5 rounded-lg w-fit">
          Total Reservations: <span className="text-champagne-400 font-bold">{reservations.length}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2 bg-obsidian-950 border border-obsidian-800 rounded-xl px-3 py-2 flex-1 min-w-[140px]">
          <CalendarIcon className="w-4 h-4 text-champagne-400 shrink-0" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-xs text-cream-100 focus:outline-none cursor-pointer w-full"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter('')} className="text-xs text-cream-400 hover:text-cream-100 shrink-0">
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 bg-obsidian-950 border border-obsidian-800 rounded-xl px-3 py-2 flex-1 min-w-[140px]">
          <Filter className="w-4 h-4 text-champagne-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs text-cream-200 focus:outline-none font-medium cursor-pointer w-full"
          >
            <option value="all" className="bg-obsidian-900">All Statuses</option>
            <option value="pending" className="bg-obsidian-900">Pending</option>
            <option value="confirmed" className="bg-obsidian-900">Confirmed</option>
            <option value="completed" className="bg-obsidian-900">Completed</option>
            <option value="cancelled" className="bg-obsidian-900">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Reservations Listing */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-obsidian-900 border border-obsidian-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="p-8 sm:p-12 bg-obsidian-900 border border-obsidian-800 rounded-2xl text-center space-y-3">
          <CalendarIcon className="w-10 h-10 text-cream-400/40 mx-auto" />
          <h3 className="text-base font-serif font-bold text-cream-100">No reservations found</h3>
          <p className="text-xs text-cream-400">There are no table reservations matching the selected filters.</p>
        </div>
      ) : (
        <div>
          {/* Desktop Table View (XL screens) */}
          <div className="hidden xl:block bg-obsidian-900 border border-obsidian-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-obsidian-800 bg-obsidian-950/60 text-[11px] font-semibold text-cream-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4 whitespace-nowrap">Ref Code</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Customer</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Date & Time</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Guests</th>
                    <th className="py-3.5 px-4">Special Requests</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-obsidian-800/60 text-xs">
                  {reservations.map((res) => (
                    <tr key={res._id || res.bookingCode} className="hover:bg-obsidian-800/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-champagne-400 whitespace-nowrap">
                        {res.bookingCode}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-semibold text-cream-100">{res.name}</p>
                        <p className="text-[10px] text-cream-400">{res.phone} • {res.email}</p>
                      </td>
                      <td className="py-4 px-4 text-cream-200 whitespace-nowrap">
                        <p className="font-semibold">{res.date}</p>
                        <p className="text-[10px] text-cream-400">{res.time}</p>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="flex items-center gap-1 font-semibold text-cream-100">
                          <Users className="w-3.5 h-3.5 text-champagne-400" />
                          {res.guests} Guests
                        </span>
                      </td>
                      <td className="py-4 px-4 text-cream-300 max-w-xs truncate">
                        {res.specialRequests || <span className="text-cream-500 italic">None</span>}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border uppercase font-semibold ${getStatusBadge(res.status)}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-1">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => updateMutation.mutate({ id: String(res._id), status: 'confirmed' })}
                            className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg font-semibold text-[11px]"
                          >
                            Confirm
                          </button>
                        )}
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => updateMutation.mutate({ id: String(res._id), status: 'completed' })}
                            className="px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 rounded-lg font-semibold text-[11px]"
                          >
                            Complete
                          </button>
                        )}
                        {(res.status as string) !== 'cancelled' && (res.status as string) !== 'completed' && (
                          <button
                            onClick={() => updateMutation.mutate({ id: String(res._id), status: 'cancelled' })}
                            className="px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg font-semibold text-[11px]"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile & Tablet Card View with distinct vertical spacing */}
          <div className="xl:hidden space-y-4">
            {reservations.map((res) => (
              <div key={res._id || res.bookingCode} className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-4 sm:p-5 shadow-lg space-y-3.5 hover:border-obsidian-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-champagne-400">{res.bookingCode}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase font-semibold ${getStatusBadge(res.status)}`}>
                    {res.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold text-cream-100 text-sm">{res.name}</p>
                  <p className="text-[11px] text-cream-400">{res.phone} • {res.email}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-cream-200 bg-obsidian-950/60 p-2.5 sm:p-3 rounded-xl border border-obsidian-800/60">
                  <div>
                    <p className="font-semibold text-cream-100">{res.date}</p>
                    <p className="text-[10px] text-cream-400">{res.time}</p>
                  </div>
                  <span className="flex items-center gap-1 font-semibold text-champagne-400">
                    <Users className="w-3.5 h-3.5" />
                    {res.guests} Guests
                  </span>
                </div>

                {res.specialRequests && (
                  <p className="text-[11px] text-cream-300 italic bg-obsidian-950/40 p-2.5 rounded-lg border border-obsidian-800/40">
                    Special Request: "{res.specialRequests}"
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-obsidian-800/60">
                  {res.status === 'pending' && (
                    <button
                      onClick={() => updateMutation.mutate({ id: String(res._id), status: 'confirmed' })}
                      className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg font-semibold text-xs transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {res.status === 'confirmed' && (
                    <button
                      onClick={() => updateMutation.mutate({ id: String(res._id), status: 'completed' })}
                      className="px-3.5 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 rounded-lg font-semibold text-xs transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  {(res.status as string) !== 'cancelled' && (res.status as string) !== 'completed' && (
                    <button
                      onClick={() => updateMutation.mutate({ id: String(res._id), status: 'cancelled' })}
                      className="px-3.5 py-1.5 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 rounded-lg font-semibold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
