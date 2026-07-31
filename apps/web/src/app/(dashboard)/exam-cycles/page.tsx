'use client';

import { useEffect, useState } from 'react';
import { CalendarDays, Plus, Clock, CheckCircle2, AlertCircle, FileEdit, MoreVertical } from 'lucide-react';

export default function ExamCyclesPage() {
  const [cycles, setCycles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCycles = async () => {
      try {
        const token = localStorage.getItem('akems_token');
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        
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

    fetchCycles();
  }, []);

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
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 hover:-translate-y-0.5">
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
                <button className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
                  <MoreVertical size={18} />
                </button>
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
          <button className="glass-panel p-6 rounded-3xl border border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 flex flex-col items-center justify-center h-full min-h-[240px] group">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 group-hover:bg-blue-100">
              <Plus size={28} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <h3 className="text-lg font-bold text-slate-600 group-hover:text-slate-900 transition-colors">Draft New Cycle</h3>
            <p className="text-slate-500 text-sm mt-2 text-center">Setup schedules, seatings, and question papers for a new exam.</p>
          </button>
        </div>
      )}
    </div>
  );
}
