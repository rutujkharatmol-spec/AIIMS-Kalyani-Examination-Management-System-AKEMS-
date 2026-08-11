'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Plus, Clock, CheckCircle2, AlertCircle, FileEdit, MoreVertical, X, Trash2 } from 'lucide-react';

export default function ExamCyclesPage() {
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  // Edit & Delete State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<any>(null);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [newCycle, setNewCycle] = useState({
    name: '',
    start_date: '',
    end_date: '',
    status: 'DRAFT'
  });

  const fetchCycles = async () => {
    try {
      const token = localStorage.getItem('akems_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001/api/v1` : 'http://localhost:3001/api/v1');
      
      const res = await fetch(`${apiUrl}/exam-cycles`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.status === 401) {
        localStorage.removeItem('akems_token');
        window.location.href = '/login';
        return;
      }

      const result = await res.json();
      if (result.success) {
        setCycles(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch exam cycles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const token = localStorage.getItem('akems_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001/api/v1` : 'http://localhost:3001/api/v1');
      
      const res = await fetch(`${apiUrl}/exam-cycles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCycle)
      });

      if (res.ok) {
        setIsCreateModalOpen(false);
        setNewCycle({ name: '', start_date: '', end_date: '', status: 'DRAFT' });
        fetchCycles();
      } else {
        alert('Failed to create cycle. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCycle = async (id: string) => {
    if (!confirm('Are you sure you want to delete this exam cycle?')) return;
    
    setIsDeletingId(id);
    setOpenDropdownId(null);
    try {
      const token = localStorage.getItem('akems_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001/api/v1` : 'http://localhost:3001/api/v1');
      
      const res = await fetch(`${apiUrl}/exam-cycles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchCycles();
      } else {
        alert('Failed to delete cycle.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setIsDeletingId(null);
    }
  };

  const openEditModal = (cycle: any) => {
    setEditingCycle({
      id: cycle.id,
      name: cycle.name,
      start_date: new Date(cycle.start_date).toISOString().split('T')[0],
      end_date: new Date(cycle.end_date).toISOString().split('T')[0],
      status: cycle.status
    });
    setOpenDropdownId(null);
    setIsEditModalOpen(true);
  };

  const handleUpdateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCycle) return;
    
    setIsCreating(true);
    try {
      const token = localStorage.getItem('akems_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:3001/api/v1` : 'http://localhost:3001/api/v1');
      
      const res = await fetch(`${apiUrl}/exam-cycles/${editingCycle.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingCycle)
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        setEditingCycle(null);
        fetchCycles();
      } else {
        alert('Failed to update cycle. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred.');
    } finally {
      setIsCreating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200"><AlertCircle size={14} /> Active Phase</span>;
      case 'UPCOMING':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200"><Clock size={14} /> Upcoming</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200"><CheckCircle2 size={14} /> Completed</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200"><FileEdit size={14} /> Draft</span>;
    }
  };

  const calculateDuration = (start: string, end: string) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return `${diffDays} days`;
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <CalendarDays className="text-blue-600" />
            Exam Cycles
          </h1>
          <p className="text-slate-500 mt-1">Manage and schedule academic examination periods across all courses.</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 hover:-translate-y-0.5"
        >
          <Plus size={18} />
          Create Cycle
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cycles.map((cycle) => (
            <div key={cycle.id} className="glass-panel p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all duration-300 group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                {getStatusBadge(cycle.status)}
                <div className="relative">
                  <button 
                    onClick={() => setOpenDropdownId(openDropdownId === cycle.id ? null : cycle.id)}
                    className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {openDropdownId === cycle.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setOpenDropdownId(null)} 
                      />
                      <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-20 animate-fade-in">
                        <button 
                          onClick={() => openEditModal(cycle)}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2 transition-colors"
                        >
                          <FileEdit size={16} /> Edit Cycle
                        </button>
                        <button 
                          onClick={() => handleDeleteCycle(cycle.id)}
                          disabled={isDeletingId === cycle.id}
                          className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={16} /> {isDeletingId === cycle.id ? 'Deleting...' : 'Delete Cycle'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                {cycle.name}
              </h3>
              
              <div className="mt-auto pt-6 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Timeline</span>
                  <span className="text-slate-700 font-bold">
                    {new Date(cycle.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(cycle.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-medium">Duration</span>
                  <span className="text-slate-700 font-bold">
                    {calculateDuration(cycle.start_date, cycle.end_date)}
                  </span>
                </div>
                
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden border border-slate-200">
                  <div className={`h-1.5 rounded-full ${cycle.status === 'ACTIVE' ? 'bg-blue-500 w-1/2 animate-pulse' : cycle.status === 'COMPLETED' ? 'bg-blue-500 w-full' : 'bg-slate-300 w-0'}`}></div>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Cycle Placeholder Card */}
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="glass-panel p-6 rounded-3xl border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex flex-col items-center justify-center h-full min-h-[240px] group"
          >
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100">
              <Plus size={28} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Draft New Cycle</h3>
            <p className="text-slate-500 text-sm mt-2 text-center">Setup schedules, seatings, and question papers for a new exam.</p>
          </button>
        </div>
      )}

      {/* Create Cycle Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Create New Exam Cycle</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreateCycle} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Cycle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS 2025 2nd Professional"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  value={newCycle.name}
                  onChange={e => setNewCycle({...newCycle, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={newCycle.start_date}
                    onChange={e => setNewCycle({...newCycle, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={newCycle.end_date}
                    onChange={e => setNewCycle({...newCycle, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Initial Status</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  value={newCycle.status}
                  onChange={e => setNewCycle({...newCycle, status: e.target.value})}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ACTIVE">Active Phase</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-70 flex items-center justify-center"
                >
                  {isCreating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    'Create Cycle'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Cycle Modal */}
      {isEditModalOpen && editingCycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Edit Exam Cycle</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateCycle} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Cycle Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS 2025 2nd Professional"
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  value={editingCycle.name}
                  onChange={e => setEditingCycle({...editingCycle, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={editingCycle.start_date}
                    onChange={e => setEditingCycle({...editingCycle, start_date: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                    value={editingCycle.end_date}
                    onChange={e => setEditingCycle({...editingCycle, end_date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                <select
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
                  value={editingCycle.status}
                  onChange={e => setEditingCycle({...editingCycle, status: e.target.value})}
                >
                  <option value="DRAFT">Draft</option>
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ACTIVE">Active Phase</option>
                  <option value="COMPLETED">Completed</option>
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
                  disabled={isCreating}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-70 flex items-center justify-center"
                >
                  {isCreating ? (
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
