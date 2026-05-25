import React, { useEffect, useState } from 'react';
import { useAdminUsers, useAdminRooms } from '../../hooks/useAdmin';
import { Button, Card, Badge, Alert, Skeleton, Tabs, Modal } from '../../components/UI';
import SubscriptionReview from './SubscriptionReview';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage users and review room listings</p>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={[
            { id: 'users', label: '👥 Users', content: <UsersPanel /> },
            { id: 'rooms', label: '🏠 Rooms', content: <RoomsPanel /> },
            { id: 'subscriptions', label: '💳 Subscriptions', content: <SubscriptionReview /> },
          ]}
        />
      </main>
    </div>
  );
}

function UsersPanel() {
  const { users, loading, error, success, fetchUsers, activateUser, deactivateUser, verifyUser, clearMessages } = useAdminUsers();
  const [acting, setActing] = useState(null);

  useEffect(() => { fetchUsers().catch(() => {}); }, [fetchUsers]);

  const handleAction = async (userId, action) => {
    setActing(userId);
    try {
      if (action === 'activate') await activateUser(userId);
      else if (action === 'deactivate') await deactivateUser(userId);
      else if (action === 'verify') await verifyUser(userId);
    } catch {}
    setActing(null);
  };

  return (
    <div>
      {error && <Alert type="error" className="mb-4" onClose={clearMessages}>{error}</Alert>}
      {success && <Alert type="success" className="mb-4" onClose={clearMessages}>{success}</Alert>}

      {loading && users.length === 0 && (
        <Card><div className="space-y-3">{[...Array(4)].map((_, i) => <Skeleton key={i} height="h-12" />)}</div></Card>
      )}

      {users.length > 0 && (
        <Card noPadding className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">User</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Verified</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900 text-sm">{u.name || 'N/A'}</p>
                      <p className="text-xs text-slate-500">{u.email}</p>
                    </td>
                    <td className="px-5 py-3.5"><Badge variant="info" size="sm">{u.role}</Badge></td>
                    <td className="px-5 py-3.5">
                      <Badge variant={u.is_active ? 'success' : 'danger'} size="sm">{u.is_active ? 'Active' : 'Inactive'}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      {u.is_verified ? <span className="text-emerald-600 text-sm font-medium">✓ Yes</span> : <span className="text-slate-400 text-sm">No</span>}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      {u.is_active ? (
                        <Button size="xs" variant="danger" onClick={() => handleAction(u.id, 'deactivate')} disabled={acting === u.id}>Deactivate</Button>
                      ) : (
                        <Button size="xs" variant="primary" onClick={() => handleAction(u.id, 'activate')} disabled={acting === u.id}>Activate</Button>
                      )}
                      {!u.is_verified && (
                        <Button size="xs" variant="outline" onClick={() => handleAction(u.id, 'verify')} disabled={acting === u.id}>Verify</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!loading && users.length === 0 && <p className="text-center text-slate-500 py-12">No users found.</p>}
    </div>
  );
}

function RoomsPanel() {
  const { rooms, loading, error, success, fetchRooms, reviewRoom, clearMessages } = useAdminRooms();
  const [filter, setFilter] = useState('');
  const [reviewModal, setReviewModal] = useState({ open: false, room: null, action: '' });
  const [note, setNote] = useState('');
  const [acting, setActing] = useState(false);

  useEffect(() => { fetchRooms(filter ? { status: filter } : {}).catch(() => {}); }, [fetchRooms, filter]);

  const handleReview = async () => {
    if (!reviewModal.room) return;
    setActing(true);
    try {
      await reviewRoom(reviewModal.room.id, reviewModal.action, note);
      setReviewModal({ open: false, room: null, action: '' });
      setNote('');
    } catch {}
    setActing(false);
  };

  return (
    <div>
      {error && <Alert type="error" className="mb-4" onClose={clearMessages}>{error}</Alert>}
      {success && <Alert type="success" className="mb-4" onClose={clearMessages}>{success}</Alert>}

      {/* Status filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'pending', 'approved', 'rejected'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === s ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
      </div>

      {loading && rooms.length === 0 && (
        <Card><div className="space-y-3">{[...Array(3)].map((_, i) => <Skeleton key={i} height="h-14" />)}</div></Card>
      )}

      {rooms.length > 0 && (
        <Card noPadding className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Room</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Location</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Price</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-slate-900 text-sm line-clamp-1">{room.title}</p>
                      <p className="text-xs text-slate-500 capitalize">{room.room_type}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{room.city}, {room.district}</td>
                    <td className="px-5 py-3.5 font-bold text-sm text-slate-900">Rs. {room.price_per_month?.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={room.status === 'approved' ? 'success' : room.status === 'rejected' ? 'danger' : 'warning'} size="sm">
                        {room.status || 'pending'}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1">
                      {room.status !== 'approved' && (
                        <Button size="xs" variant="primary" onClick={() => setReviewModal({ open: true, room, action: 'approved' })}>Approve</Button>
                      )}
                      {room.status !== 'rejected' && (
                        <Button size="xs" variant="danger" onClick={() => setReviewModal({ open: true, room, action: 'rejected' })}>Reject</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {!loading && rooms.length === 0 && <p className="text-center text-slate-500 py-12">No rooms found.</p>}

      {/* Review Modal */}
      <Modal isOpen={reviewModal.open} onClose={() => { setReviewModal({ open: false, room: null, action: '' }); setNote(''); }} title={`${reviewModal.action === 'approved' ? 'Approve' : 'Reject'} Room`} size="sm">
        <p className="text-sm text-slate-600 mb-4">
          {reviewModal.action === 'approved' ? 'Approve' : 'Reject'} <strong>"{reviewModal.room?.title}"</strong>?
        </p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Admin note (optional)" rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none mb-4" />
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setReviewModal({ open: false, room: null, action: '' })} disabled={acting}>Cancel</Button>
          <Button variant={reviewModal.action === 'approved' ? 'primary' : 'danger'} fullWidth onClick={handleReview} loading={acting}>
            {reviewModal.action === 'approved' ? 'Approve' : 'Reject'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
