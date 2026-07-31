'use client';

import React, { useState } from 'react';
import { Package, QrCode, Scan, ShieldCheck, Download, CheckCircle2, History, Printer } from 'lucide-react';

type Bundle = {
  id: string;
  subject: string;
  semester: string;
  bundleNo: string;
  quantity: number;
  status: 'In Strong Room' | 'With Examiner' | 'Archived';
  lastUpdated: string;
};

type LogEntry = {
  time: string;
  bundleId: string;
  action: string;
};

export default function StrongRoomPage() {
  const [activeTab, setActiveTab] = useState<'register' | 'scan' | 'inventory'>('register');
  
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  
  // Registration Form State
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [bundleNo, setBundleNo] = useState('');
  const [quantity, setQuantity] = useState(50);

  // Scanning State
  const [scanInput, setScanInput] = useState('');
  const [scanSuccess, setScanSuccess] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `BNDL-${Math.floor(Math.random() * 9000) + 1000}`;
    const newBundle: Bundle = {
      id,
      subject,
      semester,
      bundleNo,
      quantity,
      status: 'In Strong Room',
      lastUpdated: new Date().toLocaleTimeString()
    };
    
    setBundles([...bundles, newBundle]);
    setLogs([{ time: new Date().toLocaleTimeString(), bundleId: id, action: 'Registered & Added to Strong Room' }, ...logs]);
    
    setSubject('');
    setSemester('');
    setBundleNo('');
    setQuantity(50);
    alert(`Bundle ${id} registered successfully!`);
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const bndl = bundles.find(b => b.id === scanInput.trim().toUpperCase());
    
    if (bndl) {
      const newStatus = bndl.status === 'In Strong Room' ? 'With Examiner' : 'In Strong Room';
      
      setBundles(bundles.map(b => 
        b.id === bndl.id ? { ...b, status: newStatus, lastUpdated: new Date().toLocaleTimeString() } : b
      ));
      
      setLogs([{ time: new Date().toLocaleTimeString(), bundleId: bndl.id, action: `Status changed to: ${newStatus}` }, ...logs]);
      
      setScanSuccess(`Success! Bundle ${bndl.id} is now ${newStatus}.`);
      setScanInput('');
      
      setTimeout(() => setScanSuccess(null), 3000);
    } else {
      alert("Bundle not found! Please check the ID.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <ShieldCheck className="text-violet-600" /> Strong Room Vault
          </h1>
          <p className="text-slate-500">
            Generate QR codes for physical answer sheet bundles and track their chain of custody.
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('register')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'register' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Package size={16} /> Register Bundle
          </button>
          <button 
            onClick={() => setActiveTab('scan')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'scan' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Scan size={16} /> Scan In/Out
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'inventory' ? 'bg-white shadow-sm text-violet-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <History size={16} /> Live Inventory
          </button>
        </div>
      </div>

      {activeTab === 'register' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Register Answer Sheet Bundle</h2>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Subject</label>
                <input 
                  type="text" required
                  value={subject} onChange={e => setSubject(e.target.value)}
                  placeholder="e.g. Anatomy Paper 1"
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500/30 outline-none"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Semester/Year</label>
                  <input 
                    type="text" required
                    value={semester} onChange={e => setSemester(e.target.value)}
                    placeholder="e.g. First Year"
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500/30 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-600 mb-1">Bundle No.</label>
                  <input 
                    type="text" required
                    value={bundleNo} onChange={e => setBundleNo(e.target.value)}
                    placeholder="e.g. B-01"
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500/30 outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">Approx. Sheets Quantity</label>
                <input 
                  type="number" required min="1"
                  value={quantity} onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-violet-500/30 outline-none"
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-3.5 rounded-xl transition-colors mt-4 flex items-center justify-center gap-2 shadow-lg shadow-violet-200"
              >
                <QrCode size={18} /> Generate Bundle & QR Sticker
              </button>
            </form>
          </div>
          
          <div className="glass p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-between">
              Recent Bundles
              <button 
                onClick={() => window.print()} 
                className="text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Printer size={16} /> Print Stickers
              </button>
            </h2>
            
            {bundles.length > 0 ? (
              <div className="space-y-4">
                {bundles.slice().reverse().slice(0, 3).map(b => (
                  <div key={b.id} className="bg-white border-2 border-dashed border-slate-300 p-4 rounded-xl flex items-center gap-6 print:border-solid print:border-black print:mb-4">
                    {/* Simulated QR Code */}
                    <div className="w-24 h-24 bg-slate-100 p-2 border border-slate-200 rounded flex items-center justify-center relative">
                      <QrCode size={48} className="text-slate-800 opacity-80" />
                      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg')] bg-contain opacity-50"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-lg">{b.subject}</h3>
                      <p className="text-sm font-bold text-slate-500 mb-1">{b.semester} • Bundle {b.bundleNo}</p>
                      <div className="inline-block bg-slate-900 text-white font-mono text-sm px-3 py-1 rounded-md tracking-widest mt-1">
                        {b.id}
                      </div>
                      <p className="text-xs text-slate-400 mt-2">{b.quantity} Sheets</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                <Package size={48} className="mb-4 opacity-20" />
                <p>No bundles registered yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'scan' && (
        <div className="max-w-xl mx-auto">
          <div className="glass p-10 rounded-3xl border border-slate-200 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-400/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <Scan size={64} className="mx-auto text-violet-500 mb-6" />
            <h2 className="text-2xl font-black text-slate-800 mb-2">Scan Bundle</h2>
            <p className="text-slate-500 mb-8">Scan the QR code or manually enter the Bundle ID to check it In/Out of the Strong Room.</p>
            
            <form onSubmit={handleScan} className="relative z-10">
              <input 
                type="text" 
                value={scanInput}
                onChange={e => setScanInput(e.target.value)}
                placeholder="Enter Bundle ID (e.g. BNDL-1234)"
                className="w-full bg-white border-2 border-slate-300 rounded-xl px-6 py-4 text-center text-lg font-mono tracking-widest uppercase focus:outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-500/20 shadow-inner mb-4"
                autoFocus
              />
              <button 
                type="submit"
                disabled={!scanInput}
                className="w-full bg-violet-600 disabled:bg-slate-300 disabled:text-slate-500 hover:bg-violet-700 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-violet-200"
              >
                Process Scan
              </button>
            </form>

            {scanSuccess && (
              <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 font-bold flex items-center justify-center gap-2 animate-fade-in">
                <CheckCircle2 size={20} /> {scanSuccess}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center justify-between">
              Live Bundle Status
              <button className="text-sm bg-violet-50 text-violet-700 hover:bg-violet-100 px-3 py-1.5 rounded-lg flex items-center gap-2 font-bold transition-colors">
                <Download size={16} /> Export CSV
              </button>
            </h2>
            
            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="px-4 py-3 border-b">Bundle ID</th>
                    <th className="px-4 py-3 border-b">Details</th>
                    <th className="px-4 py-3 border-b">Qty</th>
                    <th className="px-4 py-3 border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bundles.length > 0 ? bundles.map(b => (
                    <tr key={b.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-slate-700">{b.id}</td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-slate-800">{b.subject}</p>
                        <p className="text-xs text-slate-500">Bundle {b.bundleNo}</p>
                      </td>
                      <td className="px-4 py-3">{b.quantity}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          b.status === 'In Strong Room' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        Inventory is empty.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="glass p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <History size={20} className="text-slate-400" /> Audit Logs
            </h2>
            
            <div className="space-y-4">
              {logs.length > 0 ? logs.map((log, idx) => (
                <div key={idx} className="border-l-2 border-violet-200 pl-4 pb-4 last:pb-0 relative">
                  <div className="absolute w-2 h-2 bg-violet-500 rounded-full -left-[5px] top-1"></div>
                  <p className="text-xs font-bold text-slate-400 mb-1">{log.time}</p>
                  <p className="text-sm font-medium text-slate-700">
                    <span className="font-mono font-bold text-violet-700 mr-1">{log.bundleId}</span>
                    {log.action}
                  </p>
                </div>
              )) : (
                <p className="text-sm text-slate-400">No activity yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
