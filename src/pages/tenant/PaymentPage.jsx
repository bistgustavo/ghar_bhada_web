import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { verifyPayment } from '../../store/slices/subscriptionSlice';
import { Card, Spinner, Button, Alert } from '../../components/UI';
import subscriptionService from '../../services/subscriptionService';

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { paymentStatus } = useSelector(state => state.subscriptions);

  useEffect(() => {
    const fetchSub = async () => {
      try {
        const data = await subscriptionService.getSubscriptionById(id);
        setSubscription(data);
      } catch (err) {
        setError('Failed to load subscription details.');
      } finally {
        setLoading(false);
      }
    };
    fetchSub();
  }, [id]);

  const handleSimulatePayment = async () => {
    // In a real eSewa integration, we would submit a form to eSewa's URL
    // Here we simulate the return flow for testing
    const esewa_ref_id = 'SIMULATED_REF_' + Math.floor(Math.random() * 1000000);
    
    const result = await dispatch(verifyPayment({
      transaction_uuid: subscription.transaction_uuid,
      esewa_ref_id,
      amount_npr: subscription.amount_npr
    }));

    if (verifyPayment.fulfilled.match(result)) {
      setTimeout(() => navigate('/tenant/subscriptions'), 2000);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner size="lg" /></div>;
  if (error || !subscription) return <div className="min-h-screen flex items-center justify-center p-4"><Alert type="error">{error || 'Subscription not found'}</Alert></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <Card className="text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          
          <h1 className="text-2xl font-extrabold text-slate-900 mb-2">Complete Payment</h1>
          <p className="text-slate-500 mb-8">Pay securely via eSewa to unlock chat with the landlord.</p>

          <div className="bg-slate-50 rounded-xl p-4 mb-8 text-left">
            <div className="flex justify-between mb-2">
              <span className="text-slate-500">Amount</span>
              <span className="font-bold text-slate-900">NPR {subscription.amount_npr}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono text-xs text-slate-900 mt-1">{subscription.transaction_uuid?.slice(0, 16) || 'N/A'}...</span>
            </div>
          </div>

          {paymentStatus === 'success' ? (
            <Alert type="success">Payment Verified! Redirecting...</Alert>
          ) : (
            <Button 
              variant="primary" 
              fullWidth 
              size="lg"
              className="bg-[#60bb46] hover:bg-[#4d9638] text-white border-none"
              onClick={handleSimulatePayment}
              loading={paymentStatus === 'verifying'}
            >
              Simulate eSewa Payment
            </Button>
          )}
          <button onClick={() => navigate(-1)} className="mt-4 text-sm text-slate-500 hover:text-slate-700">Cancel</button>
        </Card>
      </div>
    </div>
  );
}
