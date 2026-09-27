import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, CheckCircle, Trash2, Filter, MessageSquare } from 'lucide-react';
import { fetchAdminReviews, updateAdminReviewStatus, deleteAdminReview } from '../../services/adminApi';

interface AdminReviewsProps {
  token: string;
}

export function AdminReviews({ token }: AdminReviewsProps) {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['adminReviews', token, statusFilter],
    queryFn: () => fetchAdminReviews(token, statusFilter),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'approved' | 'rejected' }) =>
      updateAdminReviewStatus(token, id, status),
    onSuccess: (updatedRev) => {
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      showToast(`Review by ${updatedRev.name} marked as '${updatedRev.status}'`);
    },
    onError: (err: any) => alert(err.message || 'Failed to update review status')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminReview(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      showToast('Review deleted successfully!');
    },
    onError: (err: any) => alert(err.message || 'Failed to delete review')
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-champagne-500 text-obsidian-950 px-4 py-3 rounded-xl font-bold shadow-xl flex items-center gap-2 text-sm border border-champagne-400 animate-bounce">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-cream-100">Review Moderation</h2>
          <p className="text-xs text-cream-400 mt-1">Approve, reject, or delete customer dining feedback</p>
        </div>

        <div className="flex items-center gap-2 bg-obsidian-900 border border-obsidian-800 rounded-xl px-3 py-2">
          <Filter className="w-4 h-4 text-champagne-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-xs text-cream-200 focus:outline-none cursor-pointer"
          >
            <option value="all" className="bg-obsidian-900">All Reviews</option>
            <option value="approved" className="bg-obsidian-900">Approved</option>
            <option value="pending" className="bg-obsidian-900">Pending</option>
            <option value="rejected" className="bg-obsidian-900">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-obsidian-900 border border-obsidian-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-12 bg-obsidian-900 border border-obsidian-800 rounded-2xl text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-cream-400/40 mx-auto" />
          <h3 className="text-base font-serif font-bold text-cream-100">No reviews found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => {
            const status = rev.status || 'approved';
            return (
              <div key={rev._id} className="bg-obsidian-900 border border-obsidian-800 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-cream-100 text-sm">{rev.name}</h4>
                      <p className="text-[10px] text-cream-400">{rev.role || 'Verified Guest'} • {rev.date || 'Recently'}</p>
                    </div>

                    <div className="flex items-center gap-1 text-champagne-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-champagne-400' : 'text-obsidian-700'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-cream-200 mt-3 italic">"{rev.comment}"</p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-obsidian-800/60">
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase font-bold ${
                    status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {status}
                  </span>

                  <div className="flex items-center gap-2">
                    {status !== 'approved' && (
                      <button
                        onClick={() => updateMutation.mutate({ id: String(rev._id), status: 'approved' })}
                        className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 rounded-lg text-xs font-semibold"
                      >
                        Approve
                      </button>
                    )}
                    {status !== 'rejected' && (
                      <button
                        onClick={() => updateMutation.mutate({ id: String(rev._id), status: 'rejected' })}
                        className="px-2.5 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 rounded-lg text-xs font-semibold"
                      >
                        Reject
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(String(rev._id))}
                      className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
