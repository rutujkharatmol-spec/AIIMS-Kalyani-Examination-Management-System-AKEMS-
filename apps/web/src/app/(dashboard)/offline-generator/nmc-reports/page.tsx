'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, RefreshCw, Download, BarChart3, PieChart, Activity, AlertTriangle, Info } from 'lucide-react';
import * as XLSX from 'xlsx';

type ItemStats = {
  questionNo: string;
  difficultyIndex: number;
  discriminationIndex: number;
  status: 'Good' | 'Needs Review' | 'Discard';
};

export default function NMCReportsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  
  const [itemStats, setItemStats] = useState<ItemStats[]>([]);
  const [summary, setSummary] = useState({
    totalStudents: 0,
    totalQuestions: 0,
    goodItems: 0,
    reviewItems: 0,
    discardItems: 0
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        // Read as array of arrays (first row is headers: RollNo, Q1, Q2, Q3...)
        const rawData = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        
        if (rawData.length < 5) {
          throw new Error("Need at least 5 students for statistical significance.");
        }

        const qIndices = rawData[0].map((h: any, idx: number) => (String(h).trim().startsWith('Q') || !isNaN(Number(h))) ? idx : -1).filter((idx: number) => idx !== -1);
        if (qIndices.length === 0) {
           throw new Error("Missing Question columns (e.g. Q1, Q2). First row must be headers.");
        }

        analyzeData(rawData);
      } catch (error: any) {
        alert(error.message || "Error reading Excel file. Please ensure it has standard columns.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const analyzeData = (data: any[][]) => {
    setIsProcessing(true);
    setTimeout(() => {
      const headers = data[0].map(h => String(h).trim());
      // Find columns that look like questions (e.g. Q1, Q2 or just numbers if standard format)
      const qIndices = headers.map((h, idx) => (h.startsWith('Q') || !isNaN(Number(h))) ? idx : -1).filter(idx => idx !== -1);
      
      const totalQuestions = qIndices.length;
      const studentRows = data.slice(1).filter(row => row && row.length > 0 && row[0]); // Skip empty
      const totalStudents = studentRows.length;

      // Calculate total score for each student
      const students = studentRows.map(row => {
        let score = 0;
        const qScores: Record<number, number> = {};
        qIndices.forEach(idx => {
          const val = Number(row[idx]) || 0;
          score += val;
          qScores[idx] = val;
        });
        return { score, qScores };
      });

      // Sort students by total score descending to find High (Top 27%) and Low (Bottom 27%) groups
      students.sort((a, b) => b.score - a.score);
      const groupSize = Math.max(1, Math.round(totalStudents * 0.27));
      const highGroup = students.slice(0, groupSize);
      const lowGroup = students.slice(students.length - groupSize);

      const stats: ItemStats[] = [];
      let goodItems = 0;
      let reviewItems = 0;
      let discardItems = 0;

      qIndices.forEach((qIdx) => {
        // Difficulty Index (P): (Total Correct in High + Total Correct in Low) / (Total Students in Both Groups)
        // Note: Assuming binary 1/0 for MCQs. If subjective, calculation changes, but we assume MCQ here.
        let highCorrect = 0;
        let lowCorrect = 0;
        let totalCorrect = 0;

        highGroup.forEach(s => { if (s.qScores[qIdx] > 0) highCorrect++; });
        lowGroup.forEach(s => { if (s.qScores[qIdx] > 0) lowCorrect++; });
        students.forEach(s => { if (s.qScores[qIdx] > 0) totalCorrect++; });

        const difficultyIndex = totalCorrect / totalStudents;
        
        // Discrimination Index (D): (Correct in High - Correct in Low) / Group Size
        const discriminationIndex = (highCorrect - lowCorrect) / groupSize;

        let status: 'Good' | 'Needs Review' | 'Discard' = 'Good';
        
        // General NMC rules of thumb:
        // Difficulty: 0.3 to 0.7 is ideal
        // Discrimination: > 0.2 is acceptable
        if (discriminationIndex < 0.1 || difficultyIndex < 0.2 || difficultyIndex > 0.9) {
          status = 'Discard';
          discardItems++;
        } else if (discriminationIndex < 0.2 || difficultyIndex < 0.3 || difficultyIndex > 0.7) {
          status = 'Needs Review';
          reviewItems++;
        } else {
          status = 'Good';
          goodItems++;
        }

        stats.push({
          questionNo: headers[qIdx],
          difficultyIndex: Number(difficultyIndex.toFixed(2)),
          discriminationIndex: Number(discriminationIndex.toFixed(2)),
          status
        });
      });

      setSummary({ totalStudents, totalQuestions, goodItems, reviewItems, discardItems });
      setItemStats(stats);
      setDataLoaded(true);
      setIsProcessing(false);
    }, 800);
  };

  const exportReport = () => {
    const reportData = itemStats.map(s => ({
      'Question Number': s.questionNo,
      'Difficulty Index (P)': s.difficultyIndex,
      'Discrimination Index (D)': s.discriminationIndex,
      'Status': s.status,
      'NMC Remark': s.status === 'Good' ? 'Acceptable' : s.status === 'Needs Review' ? 'Requires revision' : 'Reject item'
    }));

    const ws = XLSX.utils.json_to_sheet(reportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Item_Analysis");
    XLSX.writeFile(wb, `NMC_Compliance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <BarChart3 className="text-rose-600" /> NMC Compliance & Item Analysis
        </h1>
        <p className="text-slate-500">
          Statistically analyze MCQ responses to calculate Difficulty Index and Discrimination Index as mandated by the National Medical Commission.
        </p>
      </div>

      {!dataLoaded ? (
        <div className="glass p-12 rounded-3xl border border-slate-200 text-center max-w-3xl mx-auto">
          <UploadCloud className="mx-auto text-rose-400 mb-6" size={64} />
          <h2 className="text-2xl font-black text-slate-800 mb-2 flex items-center justify-center gap-2 relative">
            Upload Result Matrix
            <div className="relative group">
              <Info size={20} className="text-slate-400 hover:text-rose-500 cursor-help" />
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left">
                <strong>Schema Required:</strong><br/>
                • First row must contain Question IDs as headers (e.g., <code>Q1</code>, <code>Q2</code>)<br/>
                • Rows below must contain binary marks (<code>1</code> or <code>0</code>) for each student's response.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Upload an Excel file where rows are students and columns are Q1, Q2, etc., containing their marks (1 or 0).
          </p>
          
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".xlsx, .xls, .csv" className="hidden" />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-8 rounded-2xl transition-colors inline-flex items-center gap-3 shadow-lg shadow-rose-200"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <BarChart3 size={20} />}
            {isProcessing ? 'Analyzing Data...' : 'Upload & Run Analysis'}
          </button>
        </div>
      ) : (
        <div className="space-y-8 animation-fade-in">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Sample Size</p>
                <p className="text-3xl font-black text-slate-800">{summary.totalStudents}</p>
              </div>
            </div>
            
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider">Good Items</p>
                <p className="text-3xl font-black text-emerald-700">{summary.goodItems}</p>
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <PieChart size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-600 uppercase tracking-wider">Needs Review</p>
                <p className="text-3xl font-black text-amber-700">{summary.reviewItems}</p>
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-red-600 uppercase tracking-wider">Discard Items</p>
                <p className="text-3xl font-black text-red-700">{summary.discardItems}</p>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-3xl border border-slate-200">
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                  Item Analysis Report
                  <div className="relative group">
                    <Info size={18} className="text-slate-400 hover:text-rose-500 cursor-help" />
                    <div className="absolute left-0 bottom-full mb-2 w-80 bg-slate-800 text-white text-xs rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                      <strong>Difficulty Index (p-value):</strong> Percentage of students who answered correctly. Ideal: 30% - 70%.<br/><br/>
                      <strong>Discrimination Index (d-index):</strong> Ability of the question to distinguish between high scorers and low scorers. Ideal: &gt; 0.2.
                      <div className="absolute top-full left-2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  </div>
                </h2>
                <p className="text-slate-500 text-sm mt-1">Difficulty (P) and Discrimination (D) Indices per question.</p>
              </div>
              <button 
                onClick={exportReport}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-rose-200"
              >
                <Download size={18} /> Export NMC Report
              </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-600 font-bold">
                  <tr>
                    <th className="px-6 py-4 border-b">Question</th>
                    <th className="px-6 py-4 border-b">Difficulty Index (P)</th>
                    <th className="px-6 py-4 border-b">Discrimination Index (D)</th>
                    <th className="px-6 py-4 border-b">NMC Status</th>
                  </tr>
                </thead>
                <tbody>
                  {itemStats.map((item, idx) => (
                    <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="px-6 py-4 font-bold text-slate-700">{item.questionNo}</td>
                      <td className="px-6 py-4 font-mono">{item.difficultyIndex}</td>
                      <td className="px-6 py-4 font-mono">{item.discriminationIndex}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 border ${
                          item.status === 'Good' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          item.status === 'Needs Review' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                          'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {item.status === 'Good' && <CheckCircle2 size={14} />}
                          {item.status === 'Needs Review' && <PieChart size={14} />}
                          {item.status === 'Discard' && <AlertTriangle size={14} />}
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
              <p className="font-bold mb-2">NMC Guidelines Reference:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Difficulty Index (P)</strong>: Ideal range is 0.3 to 0.7. Values &lt; 0.3 are too difficult, &gt; 0.7 are too easy.</li>
                <li><strong>Discrimination Index (D)</strong>: Ideal &gt; 0.2. Negative values indicate defective questions (low scorers answered correctly more often than high scorers).</li>
              </ul>
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}
