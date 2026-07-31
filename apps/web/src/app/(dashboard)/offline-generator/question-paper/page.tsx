'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Printer, Lock, Trash2, Library, Info } from 'lucide-react';
import * as XLSX from 'xlsx';

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

interface QuestionBank {
  id: string;
  filename: string;
  questions: Question[];
  targetCount: number;
}

export default function OfflineGeneratorPage() {
  const [uploadedBanks, setUploadedBanks] = useState<QuestionBank[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [watermark, setWatermark] = useState<string>('CONFIDENTIAL - DO NOT COPY');
  const [password, setPassword] = useState<string>('');
  const [generatedPaper, setGeneratedPaper] = useState<Question[] | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!XLSX) {
      console.error("XLSX library failed to load");
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(f => f.name.endsWith('.xlsx') || f.name.endsWith('.xls') || f.name.endsWith('.csv'));
    
    if (validFiles.length === 0) {
      setError('Please upload valid Excel or CSV files.');
      return;
    }

    setError(null);
    processFiles(validFiles);
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);

    try {
      const newBanks: QuestionBank[] = [];

      for (const file of files) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) continue; // Skip empty files

        const headers = jsonData[0].map(h => String(h).toLowerCase().trim());
        const qIdx = headers.findIndex(h => h.includes('question'));
        const aIdx = headers.findIndex(h => h.includes('option a') || h === 'a');
        const bIdx = headers.findIndex(h => h.includes('option b') || h === 'b');
        const cIdx = headers.findIndex(h => h.includes('option c') || h === 'c');
        const dIdx = headers.findIndex(h => h.includes('option d') || h === 'd');
        const ansIdx = headers.findIndex(h => h.includes('correct') || h.includes('answer'));
        const marksIdx = headers.findIndex(h => h.includes('mark'));

        if (qIdx === -1) {
          throw new Error(`File ${file.name} is missing a 'Question' column.`);
        }

        const parsedQuestions: Question[] = [];
        const subjectName = file.name.replace(/\.[^/.]+$/, ""); // Extract subject from filename
        
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || !row[qIdx]) continue;

          parsedQuestions.push({
            id: `Q${i}_${Math.random().toString(36).substr(2, 5)}`,
            question: String(row[qIdx] || ''),
            optionA: aIdx !== -1 ? String(row[aIdx] || '') : undefined,
            optionB: bIdx !== -1 ? String(row[bIdx] || '') : undefined,
            optionC: cIdx !== -1 ? String(row[cIdx] || '') : undefined,
            optionD: dIdx !== -1 ? String(row[dIdx] || '') : undefined,
            correctAnswer: ansIdx !== -1 ? String(row[ansIdx] || '') : undefined,
            marks: marksIdx !== -1 ? Number(row[marksIdx]) || 1 : 1,
            subject: subjectName
          });
        }

        if (parsedQuestions.length > 0) {
          newBanks.push({
            id: Math.random().toString(36).substr(2, 9),
            filename: file.name,
            questions: parsedQuestions,
            targetCount: Math.min(10, parsedQuestions.length) // Default to 10 or max available
          });
        }
      }

      setUploadedBanks(prev => [...prev, ...newBanks]);
    } catch (err: any) {
      setError(err.message || "Failed to process files.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeBank = (id: string) => {
    setUploadedBanks(uploadedBanks.filter(b => b.id !== id));
    setGeneratedPaper(null);
  };

  const updateTargetCount = (id: string, count: number) => {
    setUploadedBanks(uploadedBanks.map(b => {
      if (b.id === id) {
        return { ...b, targetCount: Math.min(Math.max(0, count), b.questions.length) };
      }
      return b;
    }));
  };

  const generatePaper = () => {
    if (uploadedBanks.length === 0) return;
    
    let allSelectedQuestions: Question[] = [];

    uploadedBanks.forEach(bank => {
      const count = Math.min(bank.targetCount, bank.questions.length);
      if (count === 0) return;

      // Fisher-Yates shuffle algorithm for this specific bank
      const shuffled = [...bank.questions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      allSelectedQuestions = [...allSelectedQuestions, ...shuffled.slice(0, count)];
    });

    // Optionally shuffle the combined final paper so subjects are mixed
    // (Or we can leave them grouped by subject by omitting this shuffle)
    // For now, let's group them by subject as that's standard for multi-subject exams
    
    setGeneratedPaper(allSelectedQuestions);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSecureExport = () => {
    if (!generatedPaper) return;
    if (!password) {
      alert("Please enter a decryption password to secure the file.");
      return;
    }
    
    const payload = JSON.stringify({
      watermark,
      timestamp: new Date().toISOString(),
      questions: generatedPaper
    });

    // XOR Encryption
    const encodedPayload = encodeURIComponent(payload);
    let xorResult = '';
    for (let i = 0; i < encodedPayload.length; i++) {
      xorResult += String.fromCharCode(encodedPayload.charCodeAt(i) ^ password.charCodeAt(i % password.length));
    }
    
    const encrypted = btoa(encodeURIComponent(xorResult));
    
    const blob = new Blob([encrypted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SECURE_EXAM_PAPER.enc';
    a.click();
    URL.revokeObjectURL(url);
    alert('Secure file exported. Send the .enc file to the printing press.');
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
            <span>Total Questions: {generatedPaper?.length || 0}</span>
            <span>Time: __________________</span>
          </div>
        </div>
        
        <div className="space-y-6 relative z-10">
          {generatedPaper?.map((q, idx) => (
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Offline Question Paper Generator</h1>
            <p className="text-slate-500">
              Compile a massive final exam from multiple subjects securely on your device.
              <span className="text-emerald-600 ml-2 font-medium">100% offline - no data leaves your browser.</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Upload & Controls */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-slate-900">1. Upload Subject Banks</h2>
                <div className="relative group">
                  <Info size={18} className="text-slate-400 hover:text-blue-500 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    <strong>Schema Required:</strong><br/>
                    • <code>Question</code> (Required)<br/>
                    • <code>Option A, B, C, D</code> (Optional)<br/>
                    • <code>Correct Answer</code> (Optional)<br/>
                    • <code>Marks</code> (Optional)
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </div>
              
              <div 
                className="border-2 border-dashed border-slate-300 hover:border-blue-400 bg-white rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 group"
                onClick={() => fileInputRef.current?.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload}
                  accept=".xlsx, .xls, .csv" 
                  multiple
                  className="hidden" 
                />
                
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="animate-spin text-blue-600 mb-2" size={32} />
                    <span className="text-slate-600">Processing files...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <UploadCloud className="text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" size={32} />
                    <span className="text-slate-600 font-medium group-hover:text-blue-600 transition-colors">Click to upload multiple Excel/CSV</span>
                    <span className="text-slate-500 text-sm mt-1">e.g., Anatomy.xlsx, Physiology.xlsx</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                  <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {uploadedBanks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-700 mb-2">Configure Extractions:</h3>
                  {uploadedBanks.map(bank => (
                    <div key={bank.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl relative">
                      <button 
                        onClick={() => removeBank(bank.id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Remove Bank"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="flex items-center gap-2 mb-2 pr-6">
                        <Library size={16} className="text-blue-500 shrink-0" />
                        <h4 className="font-bold text-slate-800 text-sm truncate">{bank.filename}</h4>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded">
                          {bank.questions.length} total Qs
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">Extract:</span>
                          <input 
                            type="number" 
                            min={0} 
                            max={bank.questions.length}
                            value={bank.targetCount}
                            onChange={(e) => updateTargetCount(bank.id, parseInt(e.target.value) || 0)}
                            className="w-16 text-center bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {uploadedBanks.length > 0 && (
              <div className="glass p-6 rounded-2xl border border-slate-200 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-900 mb-4">2. Finalize & Generate</h2>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm font-bold flex justify-between items-center border border-blue-100">
                    <span>Total Output Size:</span>
                    <span className="text-lg">{uploadedBanks.reduce((sum, b) => sum + b.targetCount, 0)} Questions</span>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-1">
                      Security Watermark
                      <div className="relative group">
                        <Info size={14} className="text-slate-400 hover:text-blue-500 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                          This text is cryptographically embedded into the exported <code>.enc</code> file. If leaked, the decoder will reveal this exact watermark to trace the source.
                          <div className="absolute top-full left-1 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </div>
                    </label>
                    <input 
                      type="text" 
                      value={watermark}
                      onChange={(e) => setWatermark(e.target.value)}
                      placeholder="e.g. Generated by Dean XYZ"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 shadow-sm font-mono text-sm uppercase"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-1">
                      Decryption Password
                      <div className="relative group">
                        <Info size={14} className="text-slate-400 hover:text-blue-500 cursor-help" />
                        <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                          The printing press will need this password to open and print the <code>.enc</code> file.
                          <div className="absolute top-full left-1 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                      </div>
                    </label>
                    <input 
                      type="text" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a secure password"
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 shadow-sm text-sm"
                    />
                  </div>

                  <button 
                    onClick={generatePaper}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 relative group"
                  >
                    <FileText size={18} />
                    Compile Master Paper
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                      <strong>Fisher-Yates Shuffle:</strong> Extracted questions are securely randomized before compilation to prevent predictability.
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-2">
            <div className="glass p-6 rounded-2xl border border-slate-200 h-full min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {generatedPaper ? 'Generated Master Paper' : 'Question Bank Preview'}
                </h2>
                
                {generatedPaper && (
                  <div className="flex gap-3">
                    <button 
                      onClick={handleSecureExport}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-indigo-200 relative group"
                    >
                      <Lock size={16} />
                      Export Encrypted (.enc)
                      <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                        This file cannot be opened natively. It MUST be decrypted using the <strong>Printing Press Decoder</strong> tool.
                        <div className="absolute bottom-full right-4 border-4 border-transparent border-b-slate-800"></div>
                      </div>
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-slate-300"
                    >
                      <Printer size={16} />
                      Save as PDF / Print
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                {generatedPaper ? (
                  <div className="space-y-6">
                    {generatedPaper.map((q, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
                        <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">
                          {q.subject}
                        </div>
                        <div className="flex gap-3 text-slate-900 mb-3 mt-2">
                          <span className="font-bold text-blue-600">Q{idx + 1}.</span>
                          <p className="font-bold text-lg pr-4">{q.question}</p>
                          <span className="ml-auto text-sm text-slate-500 font-medium whitespace-nowrap bg-white px-2 py-1 rounded border border-slate-200 h-fit">
                            {q.marks} Mark{q.marks !== 1 ? 's' : ''}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-7">
                          {q.optionA && (
                            <div className={`p-2 rounded border border-slate-200 bg-white ${q.correctAnswer?.toLowerCase() === 'a' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                              <span className="text-slate-500 font-bold mr-2">A)</span> <span className="text-slate-700 font-medium">{q.optionA}</span>
                            </div>
                          )}
                          {q.optionB && (
                            <div className={`p-2 rounded border border-slate-200 bg-white ${q.correctAnswer?.toLowerCase() === 'b' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                              <span className="text-slate-500 font-bold mr-2">B)</span> <span className="text-slate-700 font-medium">{q.optionB}</span>
                            </div>
                          )}
                          {q.optionC && (
                            <div className={`p-2 rounded border border-slate-200 bg-white ${q.correctAnswer?.toLowerCase() === 'c' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                              <span className="text-slate-500 font-bold mr-2">C)</span> <span className="text-slate-700 font-medium">{q.optionC}</span>
                            </div>
                          )}
                          {q.optionD && (
                            <div className={`p-2 rounded border border-slate-200 bg-white ${q.correctAnswer?.toLowerCase() === 'd' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                              <span className="text-slate-500 font-bold mr-2">D)</span> <span className="text-slate-700 font-medium">{q.optionD}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : uploadedBanks.length > 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <Library size={48} className="mb-4 opacity-50" />
                    <p className="font-medium text-lg">Banks Loaded ({uploadedBanks.reduce((s, b) => s + b.questions.length, 0)} total Qs)</p>
                    <p className="text-sm mt-2">Adjust quantities on the left and click 'Compile Master Paper'</p>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p>Upload files to see preview here</p>
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
