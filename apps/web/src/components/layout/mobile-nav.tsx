'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, LayoutDashboard, Users, Settings, LogOut, ShieldCheck, CalendarDays, FileSpreadsheet, Grid2X2, GraduationCap, BarChart3, ClipboardCheck } from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { isOffline } = useOffline();

  return (
    <div className="md:hidden mr-4">
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
      >
        <Menu size={24} />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-50 shadow-2xl transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="text-white" size={24} />
            </div>
            <div className="font-bold text-xl text-slate-800 tracking-wider">AKEMS</div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {!isOffline ? (
            <>
              <Link onClick={() => setIsOpen(false)} href="/dashboard" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 transition-all">
                <LayoutDashboard size={20} />
                Dashboard
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/students" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 transition-all">
                <Users size={20} />
                Students
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/faculty" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 transition-all">
                <GraduationCap size={20} />
                Faculty
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/exam-cycles" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 transition-all">
                <CalendarDays size={20} className="text-blue-600" />
                Exam Cycles
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/seating" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 transition-all">
                <Grid2X2 size={20} />
                Seat Allocation
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/offline-generator/nmc-reports" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 transition-all">
                <BarChart3 size={20} className="text-rose-600" />
                Item Analysis
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/offline-generator/results" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 transition-all">
                <ClipboardCheck size={20} className="text-amber-600" />
                Master Result
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/dashboard/settings" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 transition-all">
                <Settings size={20} />
                Settings
              </Link>
            </>
          ) : (
            <>
              <Link onClick={() => setIsOpen(false)} href="/offline-generator" className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 text-slate-800 font-medium border border-slate-200">
                <FileSpreadsheet size={20} className="text-emerald-600" />
                Offline Tools
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/offline-generator/nmc-reports" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 transition-all ml-4">
                <BarChart3 size={18} className="text-rose-600" />
                Item Analysis
              </Link>
              <Link onClick={() => setIsOpen(false)} href="/offline-generator/results" className="flex items-center gap-3 p-3 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 transition-all ml-4">
                <ClipboardCheck size={18} className="text-amber-600" />
                Master Result
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button className="flex items-center gap-3 p-3 w-full rounded-xl text-slate-600 hover:bg-red-50 dark:hover:bg-slate-800 hover:text-red-600 transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
