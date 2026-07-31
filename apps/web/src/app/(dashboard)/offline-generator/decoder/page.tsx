'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, FileText, LockKeyhole, Printer, Info } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id?: string;
  question: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  correctAnswer?: string;
  marks?: number;
  subject?: string;
}

interface EncryptedPayload {
  watermark: string;
  timestamp: string;
  questions: Question[];
}

export default function DecoderPortalPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rawEncrypted, setRawEncrypted] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [payload, setPayload] = useState<EncryptedPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.enc')) {
      setError('Invalid file type. Please upload a .enc file.');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setPayload(null);
    setRawEncrypted(null);
    setPassword('');
    
    try {
      const text = await selectedFile.text();
      setRawEncrypted(text);
    } catch (err: any) {
      setError("Failed to read file.");
      setFile(null);
    }
  };

  const handleDecrypt = () => {
    if (!rawEncrypted) return;
    if (!password) {
      setError("Please enter the decryption password.");
      return;
    }

    try {
      // Decode Base64
      const decodedBase64 = atob(rawEncrypted);
      const decodedText = decodeURIComponent(decodedBase64);
      
      // XOR Decryption
      let xorResult = '';
      for (let i = 0; i < decodedText.length; i++) {
        xorResult += String.fromCharCode(decodedText.charCodeAt(i) ^ password.charCodeAt(i % password.length));
      }
      
      const finalJson = decodeURIComponent(xorResult);
      const parsed = JSON.parse(finalJson) as EncryptedPayload;
      
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid payload structure.");
      }
      
      setError(null);
      // Simulate decryption delay for UX
      setTimeout(() => {
        setPayload(parsed);
      }, 800);
      
    } catch (err: any) {
      setError("Decryption failed. Incorrect password or corrupt file.");
      setPayload(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">
      {/* Print-only View (Hidden on screen) */}
      <div className="hidden print:block text-black bg-white relative">
        <div className="text-center mb-8 border-b-2 border-black pb-4 relative z-10">
          <h1 className="text-3xl font-bold">AIIMS KALYANI</h1>
          <h2 className="text-xl mt-2">Examination Question Paper</h2>
          <div className="flex justify-between mt-6 text-sm font-bold">
            <span>Date: __________________</span>
            <span>Total Questions: {payload?.questions.length || 0}</span>
            <span>Time: __________________</span>
          </div>
        </div>
        
        <div className="space-y-6 relative z-10">
          {payload?.questions.map((q, idx) => (
            <div key={idx} className="break-inside-avoid">
              <div className="flex gap-2 font-medium">
                <span>{idx + 1}.</span>
                <p>{q.question}</p>
                <span className="ml-auto">[{q.marks} Mark{q.marks !== 1 ? 's' : ''}]</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-2 ml-6 text-sm">
                {q.optionA && <div>A) {q.optionA}</div>}
                {q.optionB && <div>B) {q.optionB}</div>}
                {q.optionC && <div>C) {q.optionC}</div>}
                {q.optionD && <div>D) {q.optionD}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Screen View (Hidden on print) */}
      <div className="print:hidden space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/offline-generator" className="text-slate-500 hover:text-slate-900 font-medium transition-colors">
            Offline Tools
          </Link>
          <span className="text-slate-300">/</span>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <LockKeyhole className="text-indigo-600" />
            Printing Press Decoder Portal
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Upload */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-slate-200 shadow-xl shadow-indigo-500/5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 relative">
                <LockKeyhole size={20} className="text-indigo-400" />
                Secure Decryption Box
                <div className="relative group ml-auto">
                  <Info size={18} className="text-indigo-300 hover:text-white cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 w-72 bg-slate-100 text-slate-800 text-xs rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                    <strong>Decryption Process:</strong> The encrypted <code>.enc</code> file contains an encoded payload. This offline portal securely decodes the file entirely within your local browser memory and exposes the hidden security watermark to verify authenticity.
                    <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-100"></div>
                  </div>
                </div>
              </h2>
              <p className="text-indigo-200 text-sm mb-6">
                Upload the `.enc` file provided by the Dean to safely decrypt and print the question paper.
              </p>
              
              <div 
                className={`border-2 border-dashed ${file && rawEncrypted ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-indigo-500/50 bg-white/5 hover:bg-white/10'} rounded-xl p-8 text-center cursor-pointer transition-colors group mb-6`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload}
                  accept=".enc" 
                  className="hidden" 
                />
                
                {file && rawEncrypted ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="text-emerald-400 mb-2" size={32} />
                    <span className="text-emerald-400 font-bold">{file.name}</span>
                    <span className="text-indigo-200 text-sm mt-1">{payload ? 'Decrypted successfully' : 'Ready for decryption'}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="text-indigo-400 mb-2 group-hover:text-indigo-300 transition-colors" size={32} />
                    <span className="text-indigo-100 font-medium">Click to upload .enc file</span>
                  </div>
                )}
              </div>

              {rawEncrypted && !payload && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-indigo-300 mb-1">
                      Decryption Password
                    </label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter the password"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button 
                    onClick={handleDecrypt}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    Unlock & Decrypt
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 flex items-start gap-3">
                  <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}
            </div>
            
            {payload && (
              <div className="glass p-6 rounded-2xl border border-slate-200 animate-fade-in">
                <h3 className="font-bold text-slate-800 mb-4">Decrypted Metadata</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Security Check:</span>
                    <span className="font-bold text-emerald-600">Passed</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Total Questions:</span>
                    <span className="font-bold text-slate-800">{payload.questions.length}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-2">
                    <span className="text-slate-500">Timestamp:</span>
                    <span className="font-bold text-slate-800">{new Date(payload.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Watermark:</span>
                    <span className="font-bold text-slate-800">{payload.watermark}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-2">
            <div className="glass p-6 rounded-2xl border border-slate-200 h-full min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {payload ? 'Decrypted Paper Preview' : 'Preview Area'}
                </h2>
                
                {payload && (
                  <button 
                    onClick={() => window.print()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-2"
                  >
                    <Printer size={18} />
                    Print Physical Copies
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                {payload ? (
                  <div className="space-y-6">
                    {payload.questions.map((q, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
                        {q.subject && (
                          <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">
                            {q.subject}
                          </div>
                        )}
                        <div className="flex gap-3 text-slate-900 mb-3 mt-2">
                          <span className="font-bold text-blue-600">Q{idx + 1}.</span>
                          <p className="font-bold text-lg pr-4">{q.question}</p>
                          <span className="ml-auto text-sm text-slate-500 font-medium whitespace-nowrap bg-white px-2 py-1 rounded border border-slate-200 h-fit">
                            {q.marks} Mark{q.marks !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                          {q.optionA && (
                            <div className="p-2 rounded border border-slate-200 bg-white">
                              <span className="text-slate-500 font-bold mr-2">A)</span> <span className="text-slate-700 font-medium">{q.optionA}</span>
                            </div>
                          )}
                          {q.optionB && (
                            <div className="p-2 rounded border border-slate-200 bg-white">
                              <span className="text-slate-500 font-bold mr-2">B)</span> <span className="text-slate-700 font-medium">{q.optionB}</span>
                            </div>
                          )}
                          {q.optionC && (
                            <div className="p-2 rounded border border-slate-200 bg-white">
                              <span className="text-slate-500 font-bold mr-2">C)</span> <span className="text-slate-700 font-medium">{q.optionC}</span>
                            </div>
                          )}
                          {q.optionD && (
                            <div className="p-2 rounded border border-slate-200 bg-white">
                              <span className="text-slate-500 font-bold mr-2">D)</span> <span className="text-slate-700 font-medium">{q.optionD}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <LockKeyhole size={48} className="mb-4 opacity-20" />
                    <p className="font-medium text-lg text-slate-400">Awaiting Encrypted File</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
