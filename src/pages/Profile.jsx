import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useProfile } from '../hooks/useProfile';
import { Button, Card, Input, Alert, Spinner, Avatar, Tabs } from '../components/UI';

export default function ProfilePage() {
  const { user } = useSelector(state => state.auth);
  const { loading, error, success, updateProfile, changePassword, removeAvatar, clearMessages } = useProfile();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [occupation, setOccupation] = useState(user?.occupation || '');
  const [avatarFile, setAvatarFile] = useState(null);
  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setOccupation(user?.occupation || '');
  }, [user]);

  const avatarPreview = useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    return user?.avatar_url || '';
  }, [avatarFile, user?.avatar_url]);

  useEffect(() => {
    return () => { if (avatarFile) URL.revokeObjectURL(avatarPreview); };
  }, [avatarPreview, avatarFile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await updateProfile({ name, phone, occupation }, avatarFile);
      setAvatarFile(null);
      setIsEditing(false);
    } catch (err) { setLocalError(err?.message || 'Failed to update'); }
  };

  const handleChangePw = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (newPw !== confirmPw) { setLocalError('Passwords do not match'); return; }
    if (newPw.length < 8) { setLocalError('Password must be at least 8 characters'); return; }
    try {
      await changePassword(curPw, newPw);
      setCurPw(''); setNewPw(''); setConfirmPw('');
    } catch (err) { setLocalError(err?.message || 'Failed to change password'); }
  };

  const handleRemoveAvatar = async () => {
    setLocalError('');
    try { await removeAvatar(); setAvatarFile(null); }
    catch (err) { setLocalError(err?.message || 'Failed'); }
  };

  const msg = localError || error || null;
  const suc = !localError && !error && success ? success : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl font-extrabold text-slate-900">My Profile</h1>
          <p className="text-slate-500 text-sm mt-0.5">Manage your account details and security</p>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {msg && <Alert type="error" className="mb-6" onClose={() => { setLocalError(''); clearMessages(); }}>{msg}</Alert>}
        {suc && <Alert type="success" className="mb-6" onClose={clearMessages}>{suc}</Alert>}

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Avatar Card */}
          <Card className="h-fit text-center">
            <div className="relative mx-auto mb-4 w-28 h-28 group">
              <Avatar src={avatarPreview} name={name || user?.email} size="xl" className="w-28 h-28" />
              <label className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center cursor-pointer transition-all">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">📷 Change</span>
                <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files?.[0] || null)} className="hidden" />
              </label>
            </div>
            <p className="text-lg font-bold text-slate-900">{name || user?.email || 'User'}</p>
            <p className="text-sm text-slate-500 capitalize">{user?.role?.toLowerCase() || 'Member'}</p>

            {avatarFile && (
              <Button variant="primary" fullWidth className="mt-4" onClick={handleSave} loading={loading}>Save Avatar</Button>
            )}
            {user?.avatar_url && !avatarFile && (
              <Button variant="ghost" fullWidth className="mt-3" onClick={handleRemoveAvatar} disabled={loading}>Remove Avatar</Button>
            )}
          </Card>

          {/* Tabs */}
          <div>
            <Tabs
              activeTab={activeTab}
              onTabChange={(t) => { setActiveTab(t); setLocalError(''); clearMessages(); }}
              tabs={[
                {
                  id: 'personal',
                  label: 'Personal Info',
                  content: (
                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                        <Button variant={isEditing ? 'ghost' : 'secondary'} size="sm" onClick={() => setIsEditing(!isEditing)}>
                          {isEditing ? 'Cancel' : 'Edit Profile'}
                        </Button>
                      </div>
                      <form className="space-y-4" onSubmit={handleSave}>
                        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} disabled={!isEditing || loading} />
                        <Input label="Email" value={user?.email || ''} disabled />
                        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} disabled={!isEditing || loading} placeholder="e.g., +977-9800000000" />
                        <Input label="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} disabled={!isEditing || loading} />
                        {isEditing && (
                          <div className="flex gap-3 pt-2">
                            <Button variant="secondary" type="button" fullWidth onClick={() => setIsEditing(false)}>Cancel</Button>
                            <Button variant="primary" type="submit" fullWidth loading={loading}>Save Changes</Button>
                          </div>
                        )}
                      </form>
                    </Card>
                  ),
                },
                {
                  id: 'security',
                  label: 'Account Security',
                  content: (
                    <Card>
                      <h2 className="text-lg font-bold text-slate-900 mb-6">Change Password</h2>
                      <form className="space-y-4" onSubmit={handleChangePw}>
                        <Input label="Current Password" type="password" value={curPw} onChange={(e) => setCurPw(e.target.value)} disabled={loading} required />
                        <Input label="New Password" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} disabled={loading} hint="Minimum 8 characters" required />
                        <Input label="Confirm New Password" type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} disabled={loading} required />
                        <Button variant="primary" type="submit" fullWidth loading={loading}>Update Password</Button>
                      </form>
                    </Card>
                  ),
                },
              ]}
            />
          </div>
        </div>

        {loading && <div className="fixed bottom-6 right-6 bg-white rounded-full shadow-lg p-3"><Spinner size="sm" /></div>}
      </main>
    </div>
  );
}
