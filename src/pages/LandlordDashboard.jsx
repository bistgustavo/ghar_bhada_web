import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLandlordRooms } from '../hooks/useLandlordRooms';
import { Button, Card, Badge, Modal, Alert, Skeleton, EmptyState, Toggle } from '../components/UI';

const MetricCard = ({ title, value, icon, color = 'green' }) => {
  const colors = {
    green: 'from-primary-500 to-emerald-600',
    blue: 'from-sky-500 to-blue-600',
    amber: 'from-amber-500 to-orange-500',
    red: 'from-rose-500 to-red-600',
  };
  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-2xl p-5 text-white shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/80">{title}</p>
          <p className="text-3xl font-extrabold mt-1">{value}</p>
        </div>
        <span className="text-3xl opacity-80">{icon}</span>
      </div>
    </div>
  );
};

export default function LandlordDashboard() {
  const { rooms, loading, error, fetchMyListings, toggleAvailability, deleteRoom } = useLandlordRooms();
  const [deleteModal, setDeleteModal] = useState({ open: false, room: null });
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchMyListings().catch(() => {}); }, [fetchMyListings]);

  const stats = useMemo(() => {
    const total = rooms.length;
    const available = rooms.filter((r) => r.is_available).length;
    const pending = rooms.filter((r) => r.status && r.status !== 'approved').length;
    return { total, available, occupied: total - available, pending };
  }, [rooms]);

  const handleToggle = async (roomId) => {
    setToggling(roomId);
    try { await toggleAvailability(roomId); } catch {}
    setToggling(null);
  };

  const handleDelete = async () => {
    if (!deleteModal.room) return;
    setDeleting(true);
    try {
      await deleteRoom(deleteModal.room.id);
      setDeleteModal({ open: false, room: null });
    } catch {}
    setDeleting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">My Listings</h1>
            <p className="text-slate-500 text-sm mt-0.5">Manage your room listings</p>
          </div>
          <Button variant="primary" onClick={() => navigate('/rooms/create')}>+ Add Room</Button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
          <MetricCard title="Total" value={stats.total} icon="📊" color="green" />
          <MetricCard title="Pending" value={stats.pending} icon="⏳" color="amber" />
          <MetricCard title="Available" value={stats.available} icon="✅" color="blue" />
          <MetricCard title="Occupied" value={stats.occupied} icon="👥" color="red" />
        </div>

        {error && <Alert type="error" className="mb-6">{error}</Alert>}

        {/* Loading */}
        {loading && rooms.length === 0 && (
          <Card><div className="space-y-4">{[...Array(3)].map((_, i) => <Skeleton key={i} height="h-16" />)}</div></Card>
        )}

        {/* Empty */}
        {!loading && rooms.length === 0 && (
          <EmptyState icon="🏠" title="No listings yet" description="Create your first room listing to start receiving tenants." action={<Button variant="primary" onClick={() => navigate('/rooms/create')}>Create First Listing</Button>} />
        )}

        {/* Table */}
        {rooms.length > 0 && (
          <Card noPadding className="overflow-hidden">
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Room</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Available</th>
                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rooms.map((room) => (
                    <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 line-clamp-1">{room.title}</p>
                        <p className="text-xs text-slate-500 capitalize">{room.room_type}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{room.city}, {room.district}</td>
                      <td className="px-6 py-4 font-bold text-slate-900">Rs. {room.price_per_month?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={room.status === 'approved' ? 'success' : room.status === 'rejected' ? 'danger' : 'warning'}>
                          {room.status || 'pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Toggle checked={room.is_available} onChange={() => handleToggle(room.id)} loading={toggling === room.id} />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button size="xs" variant="ghost" onClick={() => navigate(`/rooms/${room.id}`)}>View</Button>
                        <Button size="xs" variant="danger" onClick={() => setDeleteModal({ open: true, room })}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {rooms.map((room) => (
                <div key={room.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-slate-900">{room.title}</p>
                      <p className="text-xs text-slate-500">{room.city}, {room.district}</p>
                    </div>
                    <Badge variant={room.status === 'approved' ? 'success' : 'warning'}>{room.status || 'pending'}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-extrabold text-primary-600">Rs. {room.price_per_month?.toLocaleString()}</p>
                    <Toggle checked={room.is_available} onChange={() => handleToggle(room.id)} loading={toggling === room.id} />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" fullWidth onClick={() => navigate(`/rooms/${room.id}`)}>View</Button>
                    <Button size="sm" variant="danger" fullWidth onClick={() => setDeleteModal({ open: true, room })}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>

      {/* Delete Modal */}
      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, room: null })} title="Delete Room" size="sm">
        <Alert type="error">This will permanently remove "{deleteModal.room?.title}".</Alert>
        <div className="flex gap-3 mt-6">
          <Button variant="secondary" fullWidth onClick={() => setDeleteModal({ open: false, room: null })} disabled={deleting}>Cancel</Button>
          <Button variant="danger" fullWidth onClick={handleDelete} loading={deleting}>Delete</Button>
        </div>
      </Modal>
    </div>
  );
}
