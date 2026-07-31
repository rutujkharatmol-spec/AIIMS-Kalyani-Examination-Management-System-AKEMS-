'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Plus, Filter, Edit, Trash2 } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('akems_token');
        if (!token) {
          console.error('No token found, redirecting to login');
          window.location.href = '/login';
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        
        const res = await fetch(`${apiUrl}/students`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          console.error('Unauthorized, token may be invalid or expired');
          localStorage.removeItem('akems_token');
          window.location.href = '/login';
          return;
        }

        const result = await res.json();
        if (result.success) {
          setStudents(result.data);
        } else {
          console.error('API Error:', result);
        }
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" />
            Student Directory
          </h1>
          <p className="text-slate-500 mt-1">Manage student profiles, enrollments, and academic status.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 hover:-translate-y-0.5">
          <Plus size={18} />
          Add Student
        </button>
      </div>

      <div className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              className="w-full bg-white border border-slate-300 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
              placeholder="Search by name, roll number, or email..."
            />
          </div>
          <button className="w-full md:w-auto bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2">
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Roll No</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading student data...</td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No students found.</td>
                </tr>
              ) : (
                students.map((student, idx) => (
                  <tr key={student.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {student.roll_number}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-bold text-slate-900">{student.name}</div>
                      <div className="text-xs text-slate-500">{student.email}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
                        {student.course}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-600">
                      Sem {student.semester}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {student.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg transition-colors" title="Edit">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
