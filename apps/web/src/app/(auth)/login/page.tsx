'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('dean@aiimskalyani.edu.in');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const result = await response.json();
      
      // Store token (in a real app, prefer HttpOnly cookies for security)
      localStorage.setItem('akems_token', result.data.accessToken);
      localStorage.setItem('akems_user', JSON.stringify(result.data.user));

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-slate-200 shadow-2xl animate-fade-in-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-blue-100">
          <Lock className="text-blue-600" size={32} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AKEMS Portal</h1>
        <p className="text-slate-500 text-sm mt-2">Sign in to access your dashboard</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-rose-400 text-sm animate-fade-in-up">
          <ShieldAlert size={16} />
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail size={18} className="text-slate-500" />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
              placeholder="dean@aiimskalyani.edu.in"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-slate-500" />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl py-3 pl-10 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-md shadow-blue-500/20"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
          {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
      </form>
    </div>
  );
}
