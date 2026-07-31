'use client';

import { Activity, Download, Settings, FileText, CheckCircle2 } from 'lucide-react';

export default function ActivityLogPage() {
  const activities = [
    { id: 1, action: 'Exported Question Paper', subject: 'Anatomy (Phase I)', time: '45 mins ago', icon: <Download size={18} className="text-blue-500" /> },
    { id: 2, action: 'Updated NMC Guidelines', subject: 'System Settings', time: '2 hours ago', icon: <Settings size={18} className="text-slate-500" /> },
    { id: 3, action: 'Generated Seating Arrangement', subject: 'Pharmacology', time: '3 hours ago', icon: <FileText size={18} className="text-purple-500" /> },
    { id: 4, action: 'Approved Duty Roster', subject: 'Final Year Exams', time: 'Yesterday', icon: <CheckCircle2 size={18} className="text-emerald-500" /> },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <Activity size={28} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900">Activity Log</h1>
      </div>
      
      <div className="glass rounded-3xl border border-slate-200 overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200">
          <h2 className="font-bold text-slate-800">Recent Actions</h2>
          <p className="text-sm text-slate-500 mt-1">Audit trail of all administrative actions performed by your account.</p>
        </div>
        
        <div className="divide-y divide-slate-100">
          {activities.map(activity => (
            <div key={activity.id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
              <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm">
                {activity.icon}
              </div>
              <div>
                <p className="font-bold text-slate-800">{activity.action}</p>
                <p className="text-sm text-slate-600 mt-0.5">{activity.subject}</p>
                <p className="text-xs text-slate-400 mt-2 font-medium">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Load More Activity
          </button>
        </div>
      </div>
    </div>
  );
}
