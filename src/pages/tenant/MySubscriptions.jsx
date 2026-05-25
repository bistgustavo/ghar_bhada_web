import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMySubscriptions } from '../../store/slices/subscriptionSlice';
import { Card, Badge, Spinner, Button } from '../../components/UI';
import { format } from 'date-fns';

export default function MySubscriptions() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { subscriptions, loading } = useSelector(state => state.subscriptions);

  useEffect(() => {
    dispatch(fetchMySubscriptions());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_payment': return <Badge variant="warning">Pending Payment</Badge>;
      case 'paid': return <Badge variant="info">Paid (Awaiting Approval)</Badge>;
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="error">Rejected</Badge>;
      case 'expired': return <Badge variant="default">Expired</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My Subscriptions</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : subscriptions.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500 mb-4">You don't have any active subscriptions.</p>
            <Link to="/rooms" className="text-primary-600 font-semibold hover:underline">Browse Rooms</Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map(sub => (
              <Card key={sub.id} className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-slate-900 truncate">Room: {sub.room_id.slice(0, 8)}...</h2>
                  {getStatusBadge(sub.status)}
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-slate-500">Amount: <span className="font-semibold text-slate-900">NPR {sub.amount_npr}</span></p>
                  {sub.paid_at && <p className="text-sm text-slate-500">Paid at: {format(new Date(sub.paid_at), 'MMM dd, yyyy')}</p>}
                </div>
                <div className="mt-auto">
                  {sub.status === 'pending_payment' && (
                    <Button variant="primary" fullWidth onClick={() => navigate(`/tenant/payment/${sub.id}`)}>
                      Pay Now with eSewa
                    </Button>
                  )}
                  {sub.status === 'approved' && (
                    <Button variant="secondary" fullWidth onClick={() => navigate(`/tenant/connections`)}>
                      View Connection
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
