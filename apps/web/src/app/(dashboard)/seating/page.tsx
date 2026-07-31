'use client';

import { useEffect, useState } from 'react';
import { Grid2X2, Settings2, Users, Maximize, Loader2 } from 'lucide-react';

export default function SeatAllocationPage() {
  const [arrangements, setArrangements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAllocating, setIsAllocating] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState('1'); // Mock cycle ID

  const fetchArrangements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('akems_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      
      const res = await fetch(`${apiUrl}/seating/${selectedCycle}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401) {
        localStorage.removeItem('akems_token');
        window.location.href = '/login';
        return;
      }

      const result = await res.json();
      if (result.success) {
        setArrangements(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch seating arrangements:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArrangements();
  }, [selectedCycle]);

  const handleAutoAllocate = async () => {
    setIsAllocating(true);
    try {
      const token = localStorage.getItem('akems_token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const res = await fetch(`${apiUrl}/seating/auto-allocate/${selectedCycle}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) {
        // Re-fetch to show new data
        await fetchArrangements();
      }
    } catch (error) {
      console.error('Failed to auto allocate:', error);
    } finally {
      setIsAllocating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Grid2X2 className="text-indigo-400" />
            Seat Allocation Engine
          </h1>
          <p className="text-slate-400 mt-1">Automated student distribution across examination rooms.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <select 
            className="bg-slate-900 border border-white/10 text-slate-300 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full md:w-64 p-2.5 transition-colors"
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
          >
            <option value="1">MBBS 2024 1st Professional</option>
            <option value="2">B.Sc Nursing 3rd Year Final</option>
          </select>
          
          <button 
            onClick={handleAutoAllocate}
            disabled={isAllocating}
            className={`font-medium py-2.5 px-5 rounded-xl transition-all shadow-lg flex items-center gap-2 ${
              isAllocating 
              ? 'bg-indigo-500/50 text-white/70 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25 hover:-translate-y-0.5'
            }`}
          >
            {isAllocating ? <Loader2 size={18} className="animate-spin" /> : <Settings2 size={18} />}
            {isAllocating ? 'Allocating...' : 'Auto-Allocate'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {arrangements.map((room) => {
            const percentage = Math.round((room.allocatedCount / room.capacity) * 100);
            return (
              <div key={room.roomId} className="glass-panel p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
                {/* Background Progress Fill */}
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-indigo-500/50 transition-all duration-1000"
                  style={{ width: `${percentage}%` }}
                />

                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">{room.roomNumber}</h3>
                    <p className="text-sm text-slate-400 mt-1 flex items-center gap-1.5">
                      <Maximize size={14} /> Total Capacity: {room.capacity}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-sm font-bold flex items-center gap-1.5 ${
                    percentage >= 100 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/20' : 
                    percentage > 75 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : 
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    <Users size={14} />
                    {room.allocatedCount} / {room.capacity}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Allocated Students (Sample)</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.students.map((student: string, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-800/50 border border-white/5 rounded-lg text-xs font-medium text-slate-300">
                        {student}
                      </span>
                    ))}
                    {room.allocatedCount > room.students.length && (
                      <span className="px-2.5 py-1 bg-slate-800/20 border border-dashed border-white/10 rounded-lg text-xs font-medium text-slate-500 flex items-center">
                        + {room.allocatedCount - room.students.length} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
