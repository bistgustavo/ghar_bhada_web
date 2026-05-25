import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchTenantConnections } from '../../store/slices/connectionSlice';
import { Card, Badge, Spinner, Button } from '../../components/UI';
import { format } from 'date-fns';

export default function MyConnections() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { connections, loading } = useSelector(state => state.connections);

  useEffect(() => {
    dispatch(fetchTenantConnections());
  }, [dispatch]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'chatting': return <Badge variant="info">Chatting</Badge>;
      case 'agreed': return <Badge variant="warning">Agreed</Badge>;
      case 'moved_in': return <Badge variant="success">Moved In</Badge>;
      case 'ended': return <Badge variant="default">Ended</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8">My Connections</h1>

        {loading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : connections.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-slate-500 mb-4">You have no active connections. Subscribe to a room to start connecting with landlords.</p>
            <Link to="/rooms" className="text-primary-600 font-semibold hover:underline">Browse Rooms</Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {connections.map(conn => (
              <Card key={conn.id} className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-bold text-slate-900 truncate">Room: {conn.room_id.slice(0, 8)}...</h2>
                  {getStatusBadge(conn.connection_status)}
                </div>
                <div className="space-y-2 mb-6">
                  <p className="text-sm text-slate-500">Agreed Rent: <span className="font-semibold text-slate-900">NPR {conn.agreed_rent_npr}</span></p>
                  <p className="text-sm text-slate-500">Started: {format(new Date(conn.created_at), 'MMM dd, yyyy')}</p>
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
