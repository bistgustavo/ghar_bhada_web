import React, { useState, useEffect } from 'react';
import { authAPI } from '../api';

const Admin = ({ token }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      authAPI.listUsers()
        .then(data => setUsers(data.items || data))
        .catch(err => setError(err.response?.data?.detail || 'Failed to fetch users'));
    }
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto mt-10 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Admin - List Users</h2>
      {error && <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded">{error}</div>}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users?.length > 0 ? users.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                    u.role === 'LANDLORD' ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
              </tr>
            )) : <tr><td colSpan="4" className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">No users found</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Admin;
