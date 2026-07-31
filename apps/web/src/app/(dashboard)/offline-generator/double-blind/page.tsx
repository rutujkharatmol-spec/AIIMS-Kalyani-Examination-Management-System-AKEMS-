'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Download, EyeOff, ShieldCheck, ArrowRightLeft, Info } from 'lucide-react';
import * as XLSX from 'xlsx';

type Student = {
  rollNo: string;
  name: string;
  fictitiousCode?: string;
};

export default function DoubleBlindPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'encode' | 'decode'>('encode');
  
  // Encoding State
  const [generatedMatrix, setGeneratedMatrix] = useState<Student[]>([]);
  
  // Decoding State
  const [decodingMatrixFile, setDecodingMatrixFile] = useState<any[]>([]);
  const [evaluatedSheetFile, setEvaluatedSheetFile] = useState<any[]>([]);
  const [finalResults, setFinalResults] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const decodeMatrixRef = useRef<HTMLInputElement>(null);
  const evaluatedSheetRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'students' | 'decodeMatrix' | 'evaluatedSheet') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws) as any[];
        
        if (type === 'students') {
          if (data.length === 0 || (!('Roll No' in data[0]) && !('Roll Number' in data[0]) && !('RollNo' in data[0]))) {
            throw new Error("Missing 'Roll No' column.");
          }
          const formatted = data.map((row: any) => ({
            rollNo: row['Roll No'] || row['Roll Number'] || row['RollNo'] || '',
            name: row['Name'] || row['Student Name'] || ''
          })).filter(s => s.rollNo);
          setStudents(formatted);
          setGeneratedMatrix([]);
        } else if (type === 'decodeMatrix') {
          setDecodingMatrixFile(data);
        } else if (type === 'evaluatedSheet') {
          setEvaluatedSheetFile(data);
        }
      } catch (error: any) {
        alert(error.message || "Error reading Excel file. Please ensure it has standard columns.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const generateFictitiousCodes = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const coded = students.map(s => {
        // Generate a random 6 character code like AK-XYZ-123
        const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
        const randomNum = Math.floor(Math.random() * 900) + 100;
        return {
          ...s,
          fictitiousCode: `AK-${randomStr}-${randomNum}`
        };
      });
      setGeneratedMatrix(coded);
      setIsProcessing(false);
    }, 600);
  };

  const decodeResults = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (!decodingMatrixFile.length || !evaluatedSheetFile.length) {
        alert("Please upload both files for decoding.");
        setIsProcessing(false);
        return;
      }
      
      const results = decodingMatrixFile.map(dm => {
        const matchingEval = evaluatedSheetFile.find(es => es['Fictitious Code'] === dm['Fictitious Code']);
        return {
          'Roll No': dm['Roll No'],
          'Name': dm['Name'],
          'Fictitious Code': dm['Fictitious Code'],
          'Marks': matchingEval ? matchingEval['Marks'] : 'Absent',
          'Remarks': matchingEval ? matchingEval['Remarks'] : ''
        };
      });
      
      setFinalResults(results);
      setIsProcessing(false);
    }, 600);
  };

  const downloadExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const downloadEncodingFiles = () => {
    // 1. Download Decoding Matrix (Confidential)
    const decodingMatrixData = generatedMatrix.map(s => ({
      'Roll No': s.rollNo,
      'Name': s.name,
      'Fictitious Code': s.fictitiousCode
    }));
    downloadExcel(decodingMatrixData, 'CONFIDENTIAL_Decoding_Matrix');

    // 2. Download Evaluator Sheet (Safe to share)
    const evaluatorData = generatedMatrix.map(s => ({
      'Fictitious Code': s.fictitiousCode,
      'Marks': '',
      'Remarks': ''
    }));
    // Randomize the order of evaluator sheet to completely detach from roll no order
    for (let i = evaluatorData.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [evaluatorData[i], evaluatorData[j]] = [evaluatorData[j], evaluatorData[i]];
    }
    
    downloadExcel(evaluatorData, 'Evaluator_Sheet_Blank');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <EyeOff className="text-indigo-600" /> Double-Blind Evaluation
          </h1>
          <p className="text-slate-500">
            Generate fictitious roll numbers for unbiased grading, and decode them securely.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('encode')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'encode' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Step 1: Generate Codes
          </button>
          <button 
            onClick={() => setActiveTab('decode')}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'decode' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Step 2: Decode Results
          </button>
        </div>
      </div>

      {activeTab === 'encode' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* ENCODING: LEFT PANEL */}
          <div className="glass p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative">
              <ShieldCheck className="text-indigo-500" /> Upload Student List
              <div className="relative group ml-auto">
                <Info size={18} className="text-slate-400 hover:text-indigo-500 cursor-help" />
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal">
                  <strong>Schema Required:</strong><br/>
                  • <code>Roll No</code> (Required)<br/>
                  • <code>Name</code> (Optional)
                  <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </h2>
            
            <div 
              className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 text-center hover:bg-indigo-50/50 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud className="mx-auto text-indigo-400 mb-4" size={48} />
              <p className="font-semibold text-slate-700 mb-1">Click to upload Student List</p>
              <p className="text-sm text-slate-500">Excel file (.xlsx) with 'Roll No' and 'Name'</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => handleFileUpload(e, 'students')} 
                accept=".xlsx, .xls, .csv" 
                className="hidden" 
              />
            </div>

            {students.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-lg">
                    <CheckCircle2 size={20} /> {students.length} Students Loaded
                  </div>
                </div>
                <button 
                  onClick={generateFictitiousCodes}
                  disabled={isProcessing}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <EyeOff size={20} />}
                  Generate Fictitious Codes
                </button>
              </div>
            )}
          </div>

          {/* ENCODING: RIGHT PANEL */}
          <div className="glass p-8 rounded-3xl border border-slate-200 flex flex-col">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Generated Codes</h2>
            
            {generatedMatrix.length > 0 ? (
              <div className="flex-1 flex flex-col">
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6 text-sm text-indigo-800 flex gap-3">
                  <AlertCircle className="shrink-0" />
                  <p><strong>Success!</strong> Codes generated. Please download the confidential matrix for your records and the blank evaluator sheet for the examiners.</p>
                </div>
                
                <div className="flex-1 overflow-y-auto bg-white rounded-xl border border-slate-200 mb-6">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-600 font-bold sticky top-0">
                      <tr>
                        <th className="px-4 py-3 border-b">Roll No</th>
                        <th className="px-4 py-3 border-b">Fictitious Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedMatrix.slice(0, 5).map((s, idx) => (
                        <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-700">{s.rollNo}</td>
                          <td className="px-4 py-3 font-mono text-indigo-600 font-bold">{s.fictitiousCode}</td>
                        </tr>
                      ))}
                      {generatedMatrix.length > 5 && (
                        <tr>
                          <td colSpan={2} className="px-4 py-4 text-center text-slate-400 italic bg-slate-50">
                            ... {generatedMatrix.length - 5} more records hidden
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <button 
                  onClick={downloadEncodingFiles}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-200"
                >
                  <Download size={20} /> Download Both Excel Files
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <ShieldCheck size={64} className="mb-4 opacity-20" />
                <p>Upload a student list and generate codes</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'decode' && (
        <div className="glass p-8 rounded-3xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative">
            <ArrowRightLeft className="text-indigo-500" /> Decode Examiner Results
            <div className="relative group ml-auto">
              <Info size={18} className="text-slate-400 hover:text-indigo-500 cursor-help" />
              <div className="absolute right-0 bottom-full mb-2 w-80 bg-slate-800 text-white text-xs rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                <strong>Phase 2: Decoding & Merge</strong><br/>
                Upload the <strong>Decoding Matrix</strong> (which you saved in Phase 1) AND the <strong>Evaluated Sheet</strong> (returned by the examiner containing fictitious codes and marks). The system will securely map the marks back to the original Real Roll Numbers.
                <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </div>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div 
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${decodingMatrixFile.length ? 'border-emerald-300 bg-emerald-50' : 'border-indigo-200 hover:bg-indigo-50'}`}
              onClick={() => decodeMatrixRef.current?.click()}
            >
              <UploadCloud className={`mx-auto mb-3 ${decodingMatrixFile.length ? 'text-emerald-500' : 'text-indigo-400'}`} size={32} />
              <p className="font-bold text-slate-700 mb-1">1. Decoding Matrix (Confidential)</p>
              <p className="text-xs text-slate-500">{decodingMatrixFile.length ? `${decodingMatrixFile.length} records loaded` : 'Upload previously generated matrix'}</p>
              <input type="file" ref={decodeMatrixRef} onChange={(e) => handleFileUpload(e, 'decodeMatrix')} accept=".xlsx, .xls, .csv" className="hidden" />
            </div>

            <div 
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors cursor-pointer ${evaluatedSheetFile.length ? 'border-emerald-300 bg-emerald-50' : 'border-indigo-200 hover:bg-indigo-50'}`}
              onClick={() => evaluatedSheetRef.current?.click()}
            >
              <UploadCloud className={`mx-auto mb-3 ${evaluatedSheetFile.length ? 'text-emerald-500' : 'text-indigo-400'}`} size={32} />
              <p className="font-bold text-slate-700 mb-1">2. Evaluated Sheet (From Examiner)</p>
              <p className="text-xs text-slate-500">{evaluatedSheetFile.length ? `${evaluatedSheetFile.length} records loaded` : 'Upload sheet containing marks'}</p>
              <input type="file" ref={evaluatedSheetRef} onChange={(e) => handleFileUpload(e, 'evaluatedSheet')} accept=".xlsx, .xls, .csv" className="hidden" />
            </div>
          </div>

          <button 
            onClick={decodeResults}
            disabled={!decodingMatrixFile.length || !evaluatedSheetFile.length || isProcessing}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <ArrowRightLeft size={20} />}
            Decode Results & Match Marks
          </button>

          {finalResults.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-200 animation-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">Final Decoded Results</h3>
                <button 
                  onClick={() => downloadExcel(finalResults, 'Final_Decoded_Marks')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                >
                  <Download size={16} /> Export Final Results
                </button>
              </div>
              <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold">
                    <tr>
                      <th className="px-4 py-3 border-b">Roll No</th>
                      <th className="px-4 py-3 border-b">Name</th>
                      <th className="px-4 py-3 border-b">Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finalResults.slice(0, 10).map((r, idx) => (
                      <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-700">{r['Roll No']}</td>
                        <td className="px-4 py-3 text-slate-600">{r['Name']}</td>
                        <td className="px-4 py-3 font-bold text-indigo-600">{r['Marks']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
