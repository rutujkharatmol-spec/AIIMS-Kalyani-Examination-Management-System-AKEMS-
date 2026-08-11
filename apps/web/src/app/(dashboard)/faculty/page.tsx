'use client';

import { useEffect, useState } from 'react';
import { Users, Search, Plus, Filter, Edit, Trash2, X } from 'lucide-react';

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Faculty Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  // Edit & Delete State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Search and Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterDesignation, setFilterDesignation] = useState('All');

  const [newFaculty, setNewFaculty] = useState({
    employee_id: '',
    name: '',
    email: '',
    department: '',
    designation: '',
    status: 'ACTIVE'
  });

  const fetchFaculty = async () => {
    try {
      const token = localStorage.getItem('akems_token');
      if (!token) {
        console.error('No token found, redirecting to login');
        window.location.href = '/login';
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      
      const res = await fetch(`${apiUrl}/faculty`, {
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
        setFaculty(result.data);
      } else {
        console.error('API Error:', result);
      }
    } catch (error) {
      console.error('Failed to fetch faculty:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const token = localStorage.getItem('akems_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      
      const res = await fetch(`${apiUrl}/faculty`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newFaculty)
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        setNewFaculty({
          employee_id: '',
          name: '',
          email: '',
          department: '',
          designation: '',
          status: 'ACTIVE'
        });
        fetchFaculty();
      } else {
        const errorData = await res.json();
        alert(`Failed to add faculty. ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (!confirm('Are you sure you want to delete this faculty profile?')) return;
    
    setIsDeletingId(id);
    try {
      const token = localStorage.getItem('akems_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      
      const res = await fetch(`${apiUrl}/faculty/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchFaculty();
      } else {
        alert('Failed to delete faculty.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const openEditModal = (facultyMember: any) => {
    setEditingFaculty({
      id: facultyMember.id,
      employee_id: facultyMember.employee_id,
      name: facultyMember.name,
      email: facultyMember.email,
      department: facultyMember.department,
      designation: facultyMember.designation,
      status: facultyMember.status
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;
    
    setIsAdding(true);
    try {
      const token = localStorage.getItem('akems_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      
      const res = await fetch(`${apiUrl}/faculty/${editingFaculty.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingFaculty)
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingFaculty(null);
        fetchFaculty();
      } else {
        alert('Failed to update faculty. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setIsAdding(false);
    }
  };

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = 
      (f.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (f.employee_id || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (f.email || '').toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDept = filterDepartment === 'All' || f.department === filterDepartment;
    const matchesDesig = filterDesignation === 'All' || f.designation === filterDesignation;
    
    return matchesSearch && matchesDept && matchesDesig;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" />
            Teachers Directory
          </h1>
          <p className="text-slate-500 mt-1">Manage faculty profiles, department assignments, and availability.</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Add Faculty
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
              placeholder="Search by name, employee ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-auto">
            <button 
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="w-full md:w-auto bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Filter size={18} />
              Filters
            </button>
            {isFiltersOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsFiltersOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 p-4 z-20 animate-fade-in">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
                      <select 
                        className="w-full border border-slate-200 bg-white text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                      >
                        <option value="All">All Departments</option>
                        <option value="Anatomy">Anatomy</option>
                        <option value="Physiology">Physiology</option>
                        <option value="Biochemistry">Biochemistry</option>
                        <option value="Pathology">Pathology</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Designation</label>
                      <select 
                        className="w-full border border-slate-200 bg-white text-slate-900 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        value={filterDesignation}
                        onChange={(e) => setFilterDesignation(e.target.value)}
                      >
                        <option value="All">All Designations</option>
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Emp ID</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Faculty Name</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Designation</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="pb-3 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">Loading faculty data...</td>
                </tr>
              ) : filteredFaculty.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No faculty found matching your filters.</td>
                </tr>
              ) : (
                filteredFaculty.map((f, idx) => (
                  <tr key={f.id} className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                      {f.employee_id}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm font-bold text-slate-900">{f.name}</div>
                      <div className="text-xs text-slate-500">{f.email}</div>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-600">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
                        {f.department}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-slate-600">
                      {f.designation}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {f.status === 'ACTIVE' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5"></span>
                          {f.status === 'ON_LEAVE' ? 'On Leave' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(f)}
                          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteFaculty(f.id)}
                          disabled={isDeletingId === f.id}
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 rounded-lg transition-colors disabled:opacity-50" 
                          title="Delete"
                        >
                          {isDeletingId === f.id ? (
                             <div className="w-4 h-4 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin"></div>
                          ) : (
                            <Trash2 size={16} />
                          )}
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

      {/* Add Faculty Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Add New Faculty</h3>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddFaculty} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    placeholder="EMP1005"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={newFaculty.employee_id}
                    onChange={e => setNewFaculty({...newFaculty, employee_id: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Dr. New Faculty"
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={newFaculty.name}
                    onChange={e => setNewFaculty({...newFaculty, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@aiimskalyani.edu.in"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  value={newFaculty.email}
                  onChange={e => setNewFaculty({...newFaculty, email: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={newFaculty.department}
                    onChange={e => setNewFaculty({...newFaculty, department: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="Anatomy">Anatomy</option>
                    <option value="Physiology">Physiology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Pathology">Pathology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Designation</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={newFaculty.designation}
                    onChange={e => setNewFaculty({...newFaculty, designation: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select Designation</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  value={newFaculty.status}
                  onChange={e => setNewFaculty({...newFaculty, status: e.target.value})}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-70 flex items-center justify-center"
                >
                  {isAdding ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Add Faculty'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Faculty Modal */}
      {isEditModalOpen && editingFaculty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Edit Faculty</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateFaculty} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={editingFaculty.employee_id}
                    onChange={e => setEditingFaculty({...editingFaculty, employee_id: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={editingFaculty.name}
                    onChange={e => setEditingFaculty({...editingFaculty, name: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  value={editingFaculty.email}
                  onChange={e => setEditingFaculty({...editingFaculty, email: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={editingFaculty.department}
                    onChange={e => setEditingFaculty({...editingFaculty, department: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select Department</option>
                    <option value="Anatomy">Anatomy</option>
                    <option value="Physiology">Physiology</option>
                    <option value="Biochemistry">Biochemistry</option>
                    <option value="Pathology">Pathology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Designation</label>
                  <select
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={editingFaculty.designation}
                    onChange={e => setEditingFaculty({...editingFaculty, designation: e.target.value})}
                    required
                  >
                    <option value="" disabled>Select Designation</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  value={editingFaculty.status}
                  onChange={e => setEditingFaculty({...editingFaculty, status: e.target.value})}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="ON_LEAVE">On Leave</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAdding}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-70 flex items-center justify-center"
                >
                  {isAdding ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
