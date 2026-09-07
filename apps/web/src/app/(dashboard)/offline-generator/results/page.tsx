'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckSquare, AlertCircle, Download, FileSpreadsheet, Trash2, Info, BarChart2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import Link from 'next/link';

interface UploadedSheet {
  id: string;
  name: string;
  data: any[];
}

interface ItemAnalysis {
  question: string;
  correctCount: number;
  totalStudents: number;
  percentage: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

interface MergedResult {
  rollNo: string;
  name: string;
  [key: string]: string | number; // Dynamic subject marks
  total: number;
  percentage: number;
  status: 'PASS' | 'FAIL';
}

export default function ResultCompilerPage() {
  const [sheets, setSheets] = useState<UploadedSheet[]>([]);
  const [results, setResults] = useState<MergedResult[] | null>(null);
  const [itemAnalysis, setItemAnalysis] = useState<ItemAnalysis[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [maxMarks, setMaxMarks] = useState<number>(100);
  const [activeTab, setActiveTab] = useState<'master' | 'analysis'>('master');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setError(null);
    setIsProcessing(true);
    
    try {
      const newSheets: UploadedSheet[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
        
        if (jsonData.length < 2) continue; // Skip empty
        
        // Find Roll No and Marks column
        const headers = jsonData[0].map(h => String(h).toLowerCase().trim());
        const rollIdx = headers.findIndex(h => h.includes('roll') || h === 'id');
        const nameIdx = headers.findIndex(h => h.includes('name'));
        
        // Assume any column with 'mark' or 'score' is the score, else pick the first numeric column
        let marksIdx = headers.findIndex(h => h.includes('mark') || h.includes('score'));
        if (marksIdx === -1) {
            // Find first column that is mostly numbers (after row 0)
            marksIdx = jsonData[1].findIndex((val, idx) => idx !== rollIdx && idx !== nameIdx && !isNaN(Number(val)));
        }
        
        if (rollIdx === -1 || marksIdx === -1) {
          throw new Error(`File ${file.name} must have a Roll No column and a Marks column.`);
        }
        
        // Find Question columns (e.g., Q1, Q.1, Question 1, 1, 1.)
        const qIndices = headers.reduce((acc, h, idx) => {
          if (h.match(/^(q|que|question)[\.\s]*\d+$/i) || h.match(/^\d+[\.]?$/)) acc.push(idx);
          return acc;
        }, [] as number[]);
        
        const extractedData = [];
        for (let j = 1; j < jsonData.length; j++) {
          if (!jsonData[j] || !jsonData[j][rollIdx]) continue;
          
          const questions: Record<string, number> = {};
          qIndices.forEach(idx => {
            const h = String(jsonData[0][idx]).toUpperCase().trim();
            const val = Number(jsonData[j][idx]);
            questions[h] = isNaN(val) ? 0 : val;
          });

          extractedData.push({
            rollNo: String(jsonData[j][rollIdx]).trim(),
            name: nameIdx !== -1 ? String(jsonData[j][nameIdx]).trim() : 'Unknown',
            marks: Number(jsonData[j][marksIdx]) || 0,
            questions
          });
        }
        
        newSheets.push({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
          data: extractedData
        });
      }
      
      setSheets([...sheets, ...newSheets]);
    } catch (err: any) {
      setError(err.message || "Failed to process files");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeSheet = (id: string) => {
    setSheets(sheets.filter(s => s.id !== id));
    setResults(null);
    setItemAnalysis(null);
  };

  const compileResults = () => {
    if (sheets.length === 0) return;
    
    setIsProcessing(true);
    
    setTimeout(() => {
      try {
        const studentMap = new Map<string, MergedResult>();
        
        // Merge all sheets
        sheets.forEach(sheet => {
          sheet.data.forEach(row => {
            const rollNo = row.rollNo;
            if (!studentMap.has(rollNo)) {
              studentMap.set(rollNo, {
                rollNo: row.rollNo,
                name: row.name,
                total: 0,
                percentage: 0,
                status: 'FAIL'
              });
            }
            
            const student = studentMap.get(rollNo)!;
            // Only update name if it was unknown
            if (student.name === 'Unknown' && row.name !== 'Unknown') {
              student.name = row.name;
            }
            
            student[sheet.name] = row.marks;
          });
        });
        
        const mergedArray = Array.from(studentMap.values());
        
        // Calculate totals and status
        // Using the user-defined maxMarks
        const maxMarksPerSubject = maxMarks; 
        
        mergedArray.forEach(student => {
          let total = 0;
          let allPassed = true;
          
          sheets.forEach(sheet => {
            const marks = (student[sheet.name] as number) || 0;
            total += marks;
            if (marks < (maxMarksPerSubject * 0.5)) {
              allPassed = false;
            }
          });
          
          student.total = total;
          student.percentage = (total / (sheets.length * maxMarksPerSubject)) * 100;
          student.status = allPassed ? 'PASS' : 'FAIL';
        });
        
        // Sort by Roll No
        mergedArray.sort((a, b) => a.rollNo.localeCompare(b.rollNo));
        setResults(mergedArray);

        // Compile Item Analysis
        const tempItemAnalysis = new Map<string, { correct: number, total: number }>();
        sheets.forEach(sheet => {
          sheet.data.forEach(row => {
            if (row.questions) {
              Object.entries(row.questions).forEach(([q, val]) => {
                if (!tempItemAnalysis.has(q)) {
                  tempItemAnalysis.set(q, { correct: 0, total: 0 });
                }
                const stats = tempItemAnalysis.get(q)!;
                stats.total += 1;
                // Treat positive numbers (e.g. 1) as correct for difficulty percentage
                if ((val as number) > 0) stats.correct += 1; 
              });
            }
          });
        });

        const analysisArray: ItemAnalysis[] = Array.from(tempItemAnalysis.entries()).map(([q, stats]) => {
          const percentage = (stats.correct / stats.total) * 100;
          let difficulty: 'Easy' | 'Medium' | 'Hard' = 'Medium';
          if (percentage > 80) difficulty = 'Easy';
          else if (percentage < 30) difficulty = 'Hard';
          
          return {
            question: q,
            correctCount: stats.correct,
            totalStudents: stats.total,
            percentage,
            difficulty
          };
        });

        analysisArray.sort((a, b) => {
          const aNum = parseInt(a.question.replace(/\D/g, '')) || 0;
          const bNum = parseInt(b.question.replace(/\D/g, '')) || 0;
          return aNum - bNum;
        });

        setItemAnalysis(analysisArray.length > 0 ? analysisArray : null);
        if (analysisArray.length > 0) {
          // Keep active tab as master initially
        } else {
          setActiveTab('master');
        }

      } catch(err: any) {
        setError("Error compiling results: " + err.message);
      } finally {
        setIsProcessing(false);
      }
    }, 500);
  };

  const exportToExcel = () => {
    if (!results || results.length === 0) return;
    
    const worksheet = XLSX.utils.json_to_sheet(results.map(r => ({
      'Roll No': r.rollNo,
      'Name': r.name,
      ...sheets.reduce((acc, sheet) => ({ ...acc, [sheet.name]: r[sheet.name] || 0 }), {}),
      'Total Marks': r.total,
      'Percentage (%)': r.percentage.toFixed(2),
      'Status': r.status
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Master Results");
    
    XLSX.writeFile(workbook, "Master_Result_Sheet.xlsx");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/offline-generator" className="text-slate-500 hover:text-slate-900 font-medium transition-colors">
          Offline Tools
        </Link>
        <span className="text-slate-300">/</span>
        <h1 className="text-2xl font-bold text-slate-900">Result Compiler</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Uploads */}
        <div className="space-y-6">
          <div className="glass p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-bold text-slate-900">1. Upload Subject Marks</h2>
              <div className="relative group flex-1">
                <Info size={16} className="text-slate-400 hover:text-blue-500 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                  <strong>Schema Required:</strong><br/>
                  • <code>Roll No</code> (Required)<br/>
                  • <code>Marks / Score</code> (Required)<br/>
                  • <code>Name</code> (Optional)<br/><br/>
                  <strong>For Item Analysis (Optional):</strong><br/>
                  Include columns <code>Q1, Q2, Q3...</code> filled with 1 (Correct) or 0 (Incorrect).
                  <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-4 font-medium">Upload multiple Excel files (e.g., Theory, Practical). Each must contain Roll No and Marks.</p>
            
            <div 
              className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-white rounded-xl p-6 text-center cursor-pointer transition-colors mb-4"
              onClick={() => fileInputRef.current?.click()}
            >
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls, .csv" multiple className="hidden" />
              <div className="flex flex-col items-center text-slate-500 font-medium">
                <UploadCloud className="mb-2" size={24} />
                <span>Upload Excel Files</span>
              </div>
            </div>

            {sheets.length > 0 && (
              <div className="space-y-3 mb-6">
                <h3 className="text-sm font-bold text-slate-600">Uploaded Sheets:</h3>
                {sheets.map(sheet => (
                  <div key={sheet.id} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileSpreadsheet size={16} className="text-blue-600 shrink-0" />
                      <span className="text-sm font-bold text-slate-700 truncate">{sheet.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-medium text-slate-500">{sheet.data.length} rows</span>
                      <button onClick={() => removeSheet(sheet.id)} className="text-red-500 hover:text-red-600 p-1">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Max Marks (Per Sheet)</label>
              <input 
                type="number" 
                min="1"
                value={maxMarks}
                onChange={(e) => setMaxMarks(Number(e.target.value) || 0)}
                className="w-full bg-white border border-slate-300 rounded-xl py-3 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all shadow-sm"
                placeholder="e.g. 100"
              />
              <p className="text-xs text-slate-500 mt-1">Used to calculate Pass/Fail and total percentage.</p>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-400 mb-4">
                <AlertCircle className="shrink-0" size={20} />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <button 
              onClick={compileResults}
              disabled={sheets.length < 1 || isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 relative group"
            >
              <CheckSquare size={18} />
              Compile Master Result
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                <strong>Result Compilation:</strong> Aggregates all uploaded sheets by Roll Number and calculates total percentages. It applies NMC criteria (50% threshold) to determine PASS/FAIL status.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Master Sheet Preview & Item Analysis */}
        <div className="lg:col-span-2 flex flex-col space-y-6">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('master')}
              className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${
                activeTab === 'master'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Master Result Sheet
            </button>
            {itemAnalysis && (
              <button
                onClick={() => setActiveTab('analysis')}
                className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
                  activeTab === 'analysis'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <BarChart2 size={16} />
                Item Analysis
              </button>
            )}
          </div>

          <div className={`glass p-6 rounded-2xl border border-slate-200 flex flex-col ${activeTab === 'master' ? 'h-[600px]' : 'hidden'}`}>
            <div className="flex items-center justify-between mb-6 shrink-0">
              <h2 className="text-xl font-bold text-slate-900">Master Result Sheet</h2>
              
              {results && (
                <button 
                  onClick={exportToExcel}
                  className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-emerald-200"
                >
                  <Download size={16} />
                  Export to Excel
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar">
              {!results ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 font-medium">
                  <CheckSquare size={48} className="mb-4 opacity-50" />
                  <p>Upload sheets and click Compile to see results</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="text-xs uppercase bg-slate-100 text-slate-500 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg whitespace-nowrap font-bold">Roll No</th>
                      <th className="px-4 py-3 font-bold">Name</th>
                      {sheets.map(s => (
                        <th key={s.id} className="px-4 py-3 font-bold">{s.name}</th>
                      ))}
                      <th className="px-4 py-3 text-slate-900 font-bold">Total</th>
                      <th className="px-4 py-3 font-bold">Percent</th>
                      <th className="px-4 py-3 rounded-tr-lg font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {results.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{r.rollNo}</td>
                        <td className="px-4 py-3 font-bold truncate max-w-[150px] text-slate-900">{r.name}</td>
                        {sheets.map(s => (
                          <td key={s.id} className="px-4 py-3 font-medium">{r[s.name] !== undefined ? r[s.name] : '-'}</td>
                        ))}
                        <td className="px-4 py-3 font-bold text-slate-900">{r.total}</td>
                        <td className="px-4 py-3 font-medium">{r.percentage.toFixed(1)}%</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${r.status === 'PASS' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          
          {/* Item Analysis Section */}
          {itemAnalysis && (
            <div className={`glass p-6 rounded-2xl border border-slate-200 flex flex-col animate-fade-in-up h-[600px] ${activeTab === 'analysis' ? '' : 'hidden'}`}>
              <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <BarChart2 size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Item Analysis (Difficulty Index)</h2>
                    <p className="text-sm text-slate-500">Percentage of students who answered correctly</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="text-xs uppercase bg-slate-100 text-slate-500 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg font-bold">Question</th>
                      <th className="px-4 py-3 font-bold">Correct / Total</th>
                      <th className="px-4 py-3 font-bold w-1/3">Success Rate</th>
                      <th className="px-4 py-3 rounded-tr-lg font-bold">Difficulty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {itemAnalysis.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-bold text-slate-900">{item.question}</td>
                        <td className="px-4 py-3 font-medium">{item.correctCount} / {item.totalStudents}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-700 w-12">{item.percentage.toFixed(1)}%</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${item.difficulty === 'Easy' ? 'bg-emerald-500' : item.difficulty === 'Medium' ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${item.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : item.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                            {item.difficulty}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
