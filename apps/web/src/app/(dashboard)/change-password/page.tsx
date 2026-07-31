'use client';

import { useState } from 'react';
import { KeyRound, ShieldCheck } from 'lucide-react';

export default function ChangePasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <KeyRound size={28} className="text-blue-600" />
        <h1 className="text-3xl font-bold text-slate-900">Change Password</h1>
      </div>
      
      <div className="glass p-8 rounded-3xl border border-slate-200">
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Updated</h2>
            <p className="text-slate-600 mb-6">Your password has been successfully changed.</p>
            <button 
              onClick={() => setSuccess(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-6 rounded-xl transition-colors"
            >
              Change Again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Current Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Enter current password"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">New Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Enter new password"
              />
              <p className="text-xs text-slate-500 mt-2">Must be at least 8 characters long and include a number and a symbol.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="Confirm new password"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-2.5 px-8 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
