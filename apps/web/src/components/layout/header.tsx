'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Bell, Search, User, Wifi, WifiOff, LogOut, UserCircle, Settings2, 
  Shield, HelpCircle, Moon, Sun, KeyRound, History, FileText, 
  CheckCircle2, AlertTriangle, Info, Clock, ChevronRight, Mail,
  Download, Calendar, Megaphone
} from 'lucide-react';
import { useOffline } from '../../context/OfflineContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'update';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function Header() {
  const { isOffline, toggleOffline } = useOffline();
  const router = useRouter();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'update',
      title: 'NMC Compliance Update',
      message: 'New item analysis guidelines (v4.2) have been downloaded and applied to the NMC Reports module.',
      time: '10 mins ago',
      read: false,
    },
    {
      id: '2',
      type: 'success',
      title: 'Question Paper Exported',
      message: 'Anatomy (Phase I) paper with 50 MCQs was successfully encrypted and exported as .enc file.',
      time: '45 mins ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Duty Roster Conflict',
      message: 'Dr. Raghav (Physiology) has been assigned 3 consecutive duties. Review recommended.',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '4',
      type: 'info',
      title: 'System Backup Complete',
      message: 'Automated local database backup completed. 12 tables, 4,821 records preserved.',
      time: '2 hours ago',
      read: true,
    },
    {
      id: '5',
      type: 'success',
      title: 'Seating Arrangement Published',
      message: 'Hall A, B, C seating for Pharmacology exam on 15-Aug-2026 has been finalized.',
      time: '3 hours ago',
      read: true,
    },
    {
      id: '6',
      type: 'info',
      title: 'Hall Tickets Generated',
      message: '142 admit cards generated for 2nd Professional Phase examination batch.',
      time: 'Yesterday',
      read: true,
    },
  ]);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOfflineToggle = () => {
    toggleOffline();
    if (!isOffline) {
      router.push('/offline-generator');
    } else {
      router.push('/dashboard');
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markOneRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />;
      case 'warning': return <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />;
      case 'update': return <Download size={16} className="text-blue-500 shrink-0 mt-0.5" />;
      default: return <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />;
    }
  };

  const getNotifDot = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'update': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <header className="h-20 glass border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 print:hidden">
      <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 border border-slate-200 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-96">
        <Search size={18} className="text-slate-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search students, exams, rooms..." 
          className="bg-transparent border-none outline-none text-sm text-slate-800 w-full placeholder-slate-400"
        />
      </div>
      
      <div className="flex items-center gap-6">
        <button 
          onClick={handleOfflineToggle}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            isOffline 
              ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' 
              : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
          }`}
          title={isOffline ? "Offline Mode Active" : "Online Mode Active"}
        >
          {isOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
          <span className="hidden sm:inline">{isOffline ? 'Offline Mode' : 'Online Mode'}</span>
        </button>

        {/* ─── Notifications ─── */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`relative transition-colors ${showNotifications ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 rounded-full border-2 border-white text-[10px] text-white font-bold flex items-center justify-center px-1">
                {unreadCount}
              </span>
            )}
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 mt-4 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in-up">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800 text-base">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded-full font-bold">{unreadCount} new</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllRead} 
                        className="text-xs text-blue-600 font-semibold hover:text-blue-700 transition-colors hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Notification List */}
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell size={32} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-sm text-slate-400 font-medium">No notifications</p>
                    <p className="text-xs text-slate-300 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markOneRead(notif.id)}
                      className={`px-4 py-3.5 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${!notif.read ? 'bg-blue-50/40' : ''}`}
                    >
                      <div className="flex gap-3">
                        {getNotifIcon(notif.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-sm leading-tight ${!notif.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>
                              {notif.title}
                            </p>
                            {!notif.read && (
                              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${getNotifDot(notif.type)}`}></span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                          <div className="flex items-center gap-1 mt-1.5">
                            <Clock size={10} className="text-slate-300" />
                            <p className="text-[10px] text-slate-400">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <button 
                    onClick={clearAll}
                    className="text-xs text-slate-400 hover:text-red-500 font-medium transition-colors"
                  >
                    Clear all
                  </button>
                  <Link href="/activity" onClick={() => setShowNotifications(false)} className="text-xs text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1">
                    View All Activity <ChevronRight size={12} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* ─── Profile ─── */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <div className={`text-sm font-bold transition-colors ${showProfileMenu ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'}`}>Dr. Ajay Mallick</div>
              <div className="text-xs text-slate-500">Dean of Examinations</div>
            </div>
            <div className={`w-10 h-10 rounded-full border flex items-center justify-center overflow-hidden transition-all ${showProfileMenu ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-200' : 'bg-slate-200 border-slate-300 group-hover:border-slate-400'}`}>
              <User size={20} className={showProfileMenu ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-600'} />
            </div>
          </div>

          {showProfileMenu && (
            <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in-up">
              {/* Profile Card Header */}
              <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center backdrop-blur-sm">
                    <User size={28} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-base">Dr. Ajay Mallick</div>
                    <div className="text-blue-200 text-xs">Dean of Examinations</div>
                    <div className="text-blue-300 text-[10px] mt-0.5 flex items-center gap-1">
                      <Mail size={10} /> dean.exams@aiims-kalyani.edu.in
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-1 bg-white/15 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-semibold">
                    <Shield size={10} /> Admin Access
                  </div>
                  <div className="flex items-center gap-1 bg-emerald-500/30 backdrop-blur-sm rounded-full px-2.5 py-1 text-[10px] font-semibold text-emerald-100">
                    <CheckCircle2 size={10} /> Verified
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-px bg-slate-100 border-b border-slate-200">
                <div className="bg-white p-3 text-center">
                  <div className="text-lg font-black text-slate-800">24</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Exams</div>
                </div>
                <div className="bg-white p-3 text-center">
                  <div className="text-lg font-black text-slate-800">156</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Papers</div>
                </div>
                <div className="bg-white p-3 text-center">
                  <div className="text-lg font-black text-slate-800">1.2k</div>
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Students</div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <UserCircle size={18} /> My Profile
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </Link>
                <Link href="/settings" onClick={() => setShowProfileMenu(false)} className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <Settings2 size={18} /> Settings
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </Link>
                <Link href="/change-password" onClick={() => setShowProfileMenu(false)} className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <KeyRound size={18} /> Change Password
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </Link>
                <Link href="/activity" onClick={() => setShowProfileMenu(false)} className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <History size={18} /> Activity Log
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </Link>
                <Link href="/help" onClick={() => setShowProfileMenu(false)} className="flex items-center justify-between px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors group">
                  <div className="flex items-center gap-3">
                    <HelpCircle size={18} /> Help & Support
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-400 transition-colors" />
                </Link>
              </div>

              {/* Dark Mode Toggle */}
              <div className="px-4 py-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-sm font-medium text-slate-600">
                    {darkMode ? <Moon size={18} /> : <Sun size={18} />}
                    Dark Mode
                  </div>
                  <button 
                    onClick={() => {
                      setDarkMode(!darkMode);
                      if (!darkMode) {
                        document.documentElement.classList.add('dark');
                      } else {
                        document.documentElement.classList.remove('dark');
                      }
                    }}
                    className={`w-10 h-5 rounded-full transition-colors duration-200 relative ${darkMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${darkMode ? 'translate-x-5' : 'translate-x-0.5'}`}></span>
                  </button>
                </div>
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-slate-100">
                <button 
                  onClick={() => router.push('/login')}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut size={18} /> Sign Out
                </button>
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400">AKEMS v1.0.0 · AIIMS Kalyani</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
