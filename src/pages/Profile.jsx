import React, { useState, useEffect } from 'react';
import { authAPI } from '../api';

const Profile = ({ token, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');

  const loadProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setProfile(data);
      setName(data.name);
    } catch (err) {
      console.error(err);
      if(err.response?.status === 401) onLogout();
    }
  };

  useEffect(() => {
    if (token) loadProfile();
  }, [token]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    if (avatar) formData.append('avatar', avatar);
    try {
      await authAPI.updateProfile(formData);
      setMsg({ text: 'Profile updated', type: 'success' });
      loadProfile();
    } catch (err) {
      setMsg({ text: 'Failed to update profile: ' + (err.response?.data?.detail || err.message), type: 'error' });
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await authAPI.changePassword(currentPassword, newPassword);
      setMsg({ text: 'Password changed successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMsg({ text: 'Failed to change password: ' + (err.response?.data?.detail || err.message), type: 'error' });
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await authAPI.removeAvatar();
      setMsg({ text: 'Avatar removed', type: 'success' });
      loadProfile();
    } catch (err) {
      setMsg({ text: 'Failed to remove avatar', type: 'error' });
    }
  };

  if (!profile) return <div className="text-center mt-10"><p className="text-gray-500">Loading profile data...</p></div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
      </div>
      
      {msg && (
        <div className={`mb-6 p-4 rounded-md ${msg.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h3>
          <div className="flex flex-col items-center mb-6">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 mb-4 shadow" />
            ) : (
              <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-400 text-4xl font-bold mb-4 shadow">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}
            {profile.avatar_url && (
              <button onClick={handleRemoveAvatar} className="text-sm text-red-600 hover:text-red-800 underline">
                Remove Avatar
              </button>
            )}
          </div>
          <div className="space-y-3">
            <p className="text-gray-700"><span className="font-medium text-gray-900">Name:</span> {profile.name}</p>
            <p className="text-gray-700"><span className="font-medium text-gray-900">Email:</span> {profile.email}</p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Role:</span> 
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {profile.role}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Update Profile</h3>
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Avatar</label>
                <input type="file" onChange={e => setAvatar(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Update Information
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Change Password</h3>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
              <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
