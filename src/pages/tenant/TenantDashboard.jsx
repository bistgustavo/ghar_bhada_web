import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMySubscriptions } from '../../store/slices/subscriptionSlice';
import { fetchTenantConnections } from '../../store/slices/connectionSlice';
import { fetchSavedRooms } from '../../store/slices/savedRoomSlice';
import { Card, Badge, Spinner } from '../../components/UI';

export default function TenantDashboard() {
  const dispatch = useDispatch();
  const { subscriptions, loading: subLoading } = useSelector(state => state.subscriptions);
  const { connections, loading: connLoading } = useSelector(state => state.connections);
  const { savedRooms, loading: savedLoading } = useSelector(state => state.savedRooms);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchMySubscriptions());
    dispatch(fetchTenantConnections());
    dispatch(fetchSavedRooms());
  }, [dispatch]);

  const isLoading = subLoading || connLoading || savedLoading;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Tenant Dashboard</h1>
          <p className="text-slate-500 mt-2">Welcome back, {user?.name || 'User'}! Here is your overview.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <h2 className="text-xl font-bold mb-4">Saved Rooms</h2>
              <div className="text-4xl font-extrabold text-primary-600 mb-4">{savedRooms.length}</div>
              <Link to="/tenant/saved-rooms" className="text-primary-600 font-semibold hover:underline">View all saved rooms →</Link>
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-4">Active Subscriptions</h2>
              <div className="text-4xl font-extrabold text-primary-600 mb-4">{subscriptions.length}</div>
              <Link to="/tenant/subscriptions" className="text-primary-600 font-semibold hover:underline">Manage subscriptions →</Link>
            </Card>

            <Card>
              <h2 className="text-xl font-bold mb-4">Active Connections</h2>
              <div className="text-4xl font-extrabold text-primary-600 mb-4">{connections.length}</div>
              <Link to="/tenant/connections" className="text-primary-600 font-semibold hover:underline">View connections →</Link>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
