import React, { useEffect, useState } from 'react';
import { Card, Badge, Alert, Spinner, Button, Modal } from '../../components/UI';
import subscriptionService from '../../services/subscriptionService';
import { format } from 'date-fns';

export default function SubscriptionReview() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewModal, setReviewModal] = useState({ open: false, sub: null, action: '' });
  const [note, setNote] = useState('');
  const [acting, setActing] = useState(false);

  const fetchSubs = async () => {
    try {
      setLoading(true);
      const data = await subscriptionService.getAllSubscriptions();
      setSubscriptions(data);
    } catch (err) {
      setError('Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, []);

  const handleReview = async () => {
    if (!reviewModal.sub) return;
    setActing(true);
    try {
      await subscriptionService.reviewSubscription(reviewModal.sub.id, reviewModal.action, note);
      setReviewModal({ open: false, sub: null, action: '' });
      setNote('');
      fetchSubs();
    } catch (err) {
      setError('Failed to review subscription');
    } finally {
      setActing(false);
    }
  };

  if (loading && subscriptions.length === 0) return <div className="py-12 flex justify-center"><Spinner /></div>;

  return (
    <div>
      {error && <Alert type="error" className="mb-4">{error}</Alert>}

      {subscriptions.length > 0 ? (
        <Card noPadding className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Tenant & Room</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Amount & eSewa Ref</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subscriptions.map(sub => (
                  <tr key={sub.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-slate-900">Tenant: {sub.tenant_id.slice(0, 6)}...</p>
                      <p className="text-xs text-slate-500">Room: {sub.room_id.slice(0, 6)}...</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-bold text-slate-900">Rs. {sub.amount_npr}</p>
                      <p className="text-xs text-slate-500 font-mono">{sub.esewa_ref_id || 'N/A'}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={sub.status === 'approved' ? 'success' : sub.status === 'paid' ? 'info' : 'default'} size="sm">
                        {sub.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      {sub.status === 'paid' && (
                        <>
                          <Button size="xs" variant="primary" onClick={() => setReviewModal({ open: true, sub, action: 'approved' })}>Approve</Button>
                          <Button size="xs" variant="danger" onClick={() => setReviewModal({ open: true, sub, action: 'rejected' })}>Reject</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <p className="text-center text-slate-500 py-12">No subscriptions found.</p>
      )}

      {/* Review Modal */}
      <Modal isOpen={reviewModal.open} onClose={() => { setReviewModal({ open: false, sub: null, action: '' }); setNote(''); }} title={`${reviewModal.action === 'approved' ? 'Approve' : 'Reject'} Payment`} size="sm">
        <p className="text-sm text-slate-600 mb-4">
          {reviewModal.action === 'approved' ? 'Approve' : 'Reject'} payment for subscription <strong>{reviewModal.sub?.id.slice(0,8)}...</strong>?
        </p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Admin note (optional)" rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none mb-4" />
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setReviewModal({ open: false, sub: null, action: '' })} disabled={acting}>Cancel</Button>
          <Button variant={reviewModal.action === 'approved' ? 'primary' : 'danger'} fullWidth onClick={handleReview} loading={acting}>
            {reviewModal.action === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
