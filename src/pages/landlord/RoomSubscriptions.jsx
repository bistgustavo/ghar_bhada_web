import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Badge, Spinner, Button, Alert } from '../../components/UI';
import subscriptionService from '../../services/subscriptionService';
import { format } from 'date-fns';

export default function RoomSubscriptions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const data = await subscriptionService.getRoomSubscriptions(id);
        setSubscriptions(data);
      } catch (err) {
        setError('Failed to load subscriptions');
      } finally {
        setLoading(false);
      }
    };
    fetchSubs();
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending_payment': return <Badge variant="warning">Pending Payment</Badge>;
      case 'paid': return <Badge variant="info">Paid</Badge>;
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="error">Rejected</Badge>;
      case 'expired': return <Badge variant="default">Expired</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Room Subscriptions</h1>
            <p className="text-slate-500 mt-2">View tenants interested in your room.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate(-1)}>← Back</Button>
        </div>

        {error && <Alert type="error" className="mb-6">{error}</Alert>}

        {subscriptions.length === 0 ? (
          <Card className="text-center py-12 text-slate-500">
            No subscriptions yet for this room.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscriptions.map(sub => (
              <Card key={sub.id}>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-slate-900 truncate">Tenant: {sub.tenant_id.slice(0, 8)}...</h2>
                  {getStatusBadge(sub.status)}
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-slate-500">Amount: <span className="font-semibold text-slate-900">NPR {sub.amount_npr}</span></p>
                  {sub.paid_at && <p className="text-sm text-slate-500">Paid at: {format(new Date(sub.paid_at), 'MMM dd, yyyy')}</p>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
