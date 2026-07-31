'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  role: string;
  status: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id: '1', name: 'Dr. Sharma', role: 'HOD', status: 'Active' },
        { id: '2', name: 'Rahul K.', role: 'STUDENT', status: 'Active' },
        { id: '3', name: 'Priya S.', role: 'FACULTY', status: 'Locked' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <p className="text-slate-500 mt-1">Manage system users, roles, and statuses.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
          + New User
        </button>
      </div>
      
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex space-x-4 bg-white/50">
          <input 
            type="text" 
            placeholder="Search users..." 
            className="border border-slate-200 rounded-lg px-4 py-2 w-64 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
          />
          <select className="border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white">
            <option>All Roles</option>
            <option>DEAN</option>
            <option>HOD</option>
            <option>FACULTY</option>
            <option>STUDENT</option>
          </select>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-slate-500">Loading users...</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 text-sm border-b border-slate-200">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm bg-white">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-medium text-slate-900">{user.name}</td>
                  <td className="p-4 text-slate-600">{user.role}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-blue-600 font-medium cursor-pointer hover:text-blue-700 hover:underline">Edit</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
