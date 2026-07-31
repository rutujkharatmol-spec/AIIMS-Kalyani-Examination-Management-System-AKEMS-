'use client';

import Link from 'next/link';
import { LayoutDashboard, Users, Settings, LogOut, ShieldCheck, CalendarDays, FileSpreadsheet, Grid2X2 } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';

export function Sidebar() {
  const { isOffline } = useOffline();

  return (
    <aside className="w-64 glass border-r border-slate-200 min-h-screen flex flex-col relative z-20 transition-all duration-300 print:hidden">
      <div className="p-6 flex items-center gap-3 border-b border-slate-200">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldCheck className="text-white" size={24} />
        </div>
        <div className="font-bold text-xl text-slate-800 tracking-wider">AKEMS</div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2 mt-4">
        {!isOffline ? (
          <>
            <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link href="/students" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
              <Users size={20} />
              Students
            </Link>
            <Link href="/exam-cycles" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
              <CalendarDays size={20} className="text-blue-600" />
              Exam Cycles
            </Link>
            <Link href="/seating" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
              <Grid2X2 size={20} />
              Seat Allocation
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300">
              <Settings size={20} />
              Settings
            </Link>
          </>
        ) : (
          <Link href="/offline-generator" className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 text-slate-800 font-medium border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-emerald-500/20">
            <FileSpreadsheet size={20} className="text-emerald-600" />
            Offline Tools
          </Link>
        )}
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <button className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
        <div className="text-xs text-slate-500 text-center mt-4">
          Dean View &bull; v1.0.0
        </div>
      </div>
    </aside>
  );
}
