import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchLandlordConnections, updateConnectionStatus } from '../../store/slices/connectionSlice';
import { Card, Badge, Spinner, Button, Select } from '../../components/UI';
import { format } from 'date-fns';

export default function ConnectionManager() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { connections, loading } = useSelector(state => state.connections);

  useEffect(() => {
    dispatch(fetchLandlordConnections());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateConnectionStatus({ id, status }));
  };

  const getStatusOptions = () => [
    { value: 'chatting', label: '💬 Chatting' },
    { value: 'agreed', label: '🤝 Agreed' },
    { value: 'moved_in', label: '🏠 Moved In' },
    { value: 'ended', label: '🛑 Ended' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Connection Manager</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : connections.length === 0 ? (
          <Card className="text-center py-12 text-slate-500">
            You have no active tenant connections.
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {connections.map(conn => (
              <Card key={conn.id} className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Room: {conn.room_id.slice(0, 8)}...</h2>
                    <p className="text-sm text-slate-500 mt-1">Tenant: {conn.tenant_id.slice(0, 8)}...</p>
                  </div>
                  <Select 
                    value={conn.connection_status} 
                    onChange={(e) => handleStatusChange(conn.id, e.target.value)}
                    options={getStatusOptions()}
                    className="w-40"
                  />
                </div>
                <div className="space-y-2 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-sm text-slate-600">Agreed Rent: <span className="font-bold text-slate-900">NPR {conn.agreed_rent_npr}</span></p>
                  <p className="text-sm text-slate-600">Started: {format(new Date(conn.created_at), 'MMM dd, yyyy')}</p>
                </div>
                <div className="mt-auto">
                  <Button variant="primary" fullWidth onClick={() => navigate(`/tenant/chat/${conn.id}`)}>
                    Open Chat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
