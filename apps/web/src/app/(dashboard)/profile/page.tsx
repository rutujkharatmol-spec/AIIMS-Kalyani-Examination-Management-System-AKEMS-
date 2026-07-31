'use client';

import { UserCircle, Mail, Phone, Shield, Building } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
      
      <div className="glass p-8 rounded-3xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 rounded-full bg-blue-100 border-4 border-blue-50 flex items-center justify-center shrink-0">
            <UserCircle size={64} className="text-blue-500" />
          </div>
          
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Dr. Ajay Mallick</h2>
              <p className="text-blue-600 font-medium">Dean of Examinations</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Email</label>
                <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Mail size={16} className="text-slate-400" /> dean.exams@aiims-kalyani.edu.in
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Phone</label>
                <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Phone size={16} className="text-slate-400" /> +91 98765 43210
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Department</label>
                <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Building size={16} className="text-slate-400" /> Examination Section
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Role</label>
                <div className="flex items-center gap-2 text-slate-700 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <Shield size={16} className="text-slate-400" /> Super Admin
                </div>
              </div>
            </div>
            
            <div className="pt-6">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl transition-colors shadow-lg shadow-blue-500/20">
                Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
