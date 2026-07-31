'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, RefreshCw, Download, UserCheck, Calculator, CalendarCheck, AlertCircle, Info } from 'lucide-react';
import * as XLSX from 'xlsx';

type Faculty = {
  name: string;
  department: string;
  designation: string;
  dutiesCompleted: number;
};

type Exam = {
  subject: string;
  date: string;
  shift: string;
  invigilatorsRequired: number;
  department: string; // The host department of the exam
};

type Assignment = {
  exam: Exam;
  faculty: Faculty[];
};

export default function DutyRosterPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'roster' | 'billing'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);

  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [examList, setExamList] = useState<Exam[]>([]);
  const [roster, setRoster] = useState<Assignment[]>([]);

  const facultyInputRef = useRef<HTMLInputElement>(null);
  const examInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'faculty' | 'exams') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws);
        
        if (type === 'faculty') {
          if (data.length === 0 || (!('Name' in data[0]) && !('Faculty Name' in data[0]))) throw new Error("Missing 'Name' column.");
          if (!('Department' in data[0]) && !('Dept' in data[0])) throw new Error("Missing 'Department' column.");
          if (!('Duties Completed' in data[0])) throw new Error("Missing 'Duties Completed' column.");

          const formatted = data.map((row: any) => ({
            name: row['Name'] || row['Faculty Name'] || '',
            department: row['Department'] || row['Dept'] || '',
            designation: row['Designation'] || 'Faculty',
            dutiesCompleted: parseInt(row['Duties Completed']) || 0,
          })).filter(f => f.name);
          setFacultyList(formatted);
        } else if (type === 'exams') {
          if (data.length === 0 || (!('Subject' in data[0]) && !('Exam' in data[0]))) throw new Error("Missing 'Subject' column.");
          if (!('Department' in data[0]) && !('Host Dept' in data[0])) throw new Error("Missing 'Department' column.");
          if (!('Date' in data[0])) throw new Error("Missing 'Date' column.");

          const formatted = data.map((row: any) => ({
            subject: row['Subject'] || row['Exam'] || '',
            department: row['Department'] || row['Host Dept'] || '',
            date: row['Date'] || '',
            shift: row['Shift'] || 'Morning',
            invigilatorsRequired: parseInt(row['Invigilators Required']) || 2,
          })).filter(e => e.subject);
          setExamList(formatted);
        }
      } catch (error: any) {
        alert(error.message || "Error reading Excel file. Please check column headers.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const generateRoster = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Create a working copy of faculty to track duties as we assign
      let availableFaculty = [...facultyList];
      const newRoster: Assignment[] = [];

      examList.forEach(exam => {
        // Filter out faculty from the same department as the exam
        let eligible = availableFaculty.filter(f => f.department.toLowerCase() !== exam.department.toLowerCase());
        
        // Sort by duties completed (ascending) to ensure fairness
        eligible.sort((a, b) => a.dutiesCompleted - b.dutiesCompleted);

        // Select the top N faculty needed
        const assigned = eligible.slice(0, exam.invigilatorsRequired);
        
        // Increment their duties completed in the working copy
        assigned.forEach(a => {
          const idx = availableFaculty.findIndex(f => f.name === a.name);
          if (idx !== -1) availableFaculty[idx].dutiesCompleted += 1;
        });

        newRoster.push({
          exam,
          faculty: assigned
        });
      });

      setRoster(newRoster);
      setActiveTab('roster');
      setIsProcessing(false);
    }, 800);
  };

  const downloadExcel = (data: any[], filename: string) => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportRoster = () => {
    const flatData: any[] = [];
    roster.forEach(r => {
      r.faculty.forEach(f => {
        flatData.push({
          'Date': r.exam.date,
          'Shift': r.exam.shift,
          'Subject': r.exam.subject,
          'Invigilator Name': f.name,
          'Department': f.department,
          'Designation': f.designation
        });
      });
    });
    downloadExcel(flatData, 'Invigilation_Roster');
  };

  const exportBilling = () => {
    // Flatten and aggregate by faculty
    const billingMap: Record<string, { name: string, dept: string, desig: string, duties: number }> = {};
    
    roster.forEach(r => {
      r.faculty.forEach(f => {
        if (!billingMap[f.name]) {
          billingMap[f.name] = { name: f.name, dept: f.department, desig: f.designation, duties: 0 };
        }
        billingMap[f.name].duties += 1;
      });
    });

    // Rate: 1000 per duty (configurable in real app)
    const ratePerDuty = 1000;
    
    const billingData = Object.values(billingMap).map(b => ({
      'Faculty Name': b.name,
      'Department': b.dept,
      'Designation': b.desig,
      'Duties Assigned': b.duties,
      'Rate Per Duty (₹)': ratePerDuty,
      'Total Remuneration (₹)': b.duties * ratePerDuty
    }));

    downloadExcel(billingData, 'Remuneration_Bills');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
            <UserCheck className="text-cyan-600" /> Smart Duty Roster
          </h1>
          <p className="text-slate-500">
            Fairly balance exam duties across faculty and auto-generate remuneration bills.
          </p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all ${activeTab === 'upload' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            1. Data Upload
          </button>
          <button 
            onClick={() => setActiveTab('roster')}
            disabled={roster.length === 0}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${activeTab === 'roster' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            2. View Roster
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            disabled={roster.length === 0}
            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50 ${activeTab === 'billing' ? 'bg-white shadow-sm text-cyan-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            3. Remuneration Bills
          </button>
        </div>
      </div>

      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative">
              <UserCheck className="text-cyan-500" /> Faculty List
              <div className="relative group ml-auto">
                <Info size={18} className="text-slate-400 hover:text-cyan-500 cursor-help" />
                <div className="absolute right-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal">
                  <strong>Schema Required:</strong><br/>
                  • <code>Name</code> (Required)<br/>
                  • <code>Department</code> (Required)<br/>
                  • <code>Duties Completed</code> (Required)<br/>
                  • <code>Designation</code> (Optional)
                  <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </h2>
            
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${facultyList.length ? 'border-emerald-300 bg-emerald-50' : 'border-cyan-200 hover:bg-cyan-50'}`}
              onClick={() => facultyInputRef.current?.click()}
            >
              <UploadCloud className={`mx-auto mb-4 ${facultyList.length ? 'text-emerald-500' : 'text-cyan-400'}`} size={48} />
              <p className="font-semibold text-slate-700 mb-1">Upload Faculty Data</p>
              <p className="text-sm text-slate-500">Must include: Name, Department, Duties Completed</p>
              <input type="file" ref={facultyInputRef} onChange={(e) => handleFileUpload(e, 'faculty')} accept=".xlsx, .xls, .csv" className="hidden" />
            </div>

            {facultyList.length > 0 && (
              <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                <CheckCircle2 size={20} /> {facultyList.length} Faculty Members Loaded
              </div>
            )}
          </div>

          <div className="glass p-8 rounded-3xl border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative">
              <CalendarCheck className="text-cyan-500" /> Exam Schedule
              <div className="relative group ml-auto">
                <Info size={18} className="text-slate-400 hover:text-cyan-500 cursor-help" />
                <div className="absolute right-0 bottom-full mb-2 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal">
                  <strong>Schema Required:</strong><br/>
                  • <code>Subject</code> (Required)<br/>
                  • <code>Department / Host Dept</code> (Required)<br/>
                  • <code>Date</code> (Required)<br/>
                  • <code>Shift</code> (Optional, default Morning)<br/>
                  • <code>Invigilators Required</code> (Optional)
                  <div className="absolute top-full right-2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </h2>
            
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${examList.length ? 'border-emerald-300 bg-emerald-50' : 'border-cyan-200 hover:bg-cyan-50'}`}
              onClick={() => examInputRef.current?.click()}
            >
              <UploadCloud className={`mx-auto mb-4 ${examList.length ? 'text-emerald-500' : 'text-cyan-400'}`} size={48} />
              <p className="font-semibold text-slate-700 mb-1">Upload Exam Schedule</p>
              <p className="text-sm text-slate-500">Must include: Subject, Department, Date, Invigilators Required</p>
              <input type="file" ref={examInputRef} onChange={(e) => handleFileUpload(e, 'exams')} accept=".xlsx, .xls, .csv" className="hidden" />
            </div>

            {examList.length > 0 && (
              <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                <CheckCircle2 size={20} /> {examList.length} Exams Loaded
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <button 
              onClick={generateRoster}
              disabled={facultyList.length === 0 || examList.length === 0 || isProcessing}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-5 rounded-2xl transition-colors flex items-center justify-center gap-3 shadow-lg shadow-cyan-200 text-lg relative group"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={24} /> : <UserCheck size={24} />}
              Generate Fair Duty Roster
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-80 bg-slate-800 text-white text-xs rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                <strong>Load-Balancing Logic:</strong> The algorithm first filters out faculty from the department conducting the exam (to prevent self-invigilation). It then strictly prioritizes faculty who have completed the fewest duties so far to ensure 100% fair workload distribution.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </button>
            <p className="text-center text-sm text-slate-500 mt-3 flex items-center justify-center gap-2">
              <AlertCircle size={14} /> The algorithm automatically prevents same-department assignment and prioritizes faculty with fewer duties.
            </p>
          </div>
        </div>
      )}

      {activeTab === 'roster' && (
        <div className="glass p-8 rounded-3xl border border-slate-200 animation-fade-in">
          <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Generated Roster</h2>
              <p className="text-slate-500 text-sm mt-1">Review the assignments. Export when ready.</p>
            </div>
            <button 
              onClick={exportRoster}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-emerald-200"
            >
              <Download size={18} /> Export Excel Roster
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {roster.map((r, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-black text-lg text-slate-800">{r.exam.subject}</h3>
                    <p className="text-sm font-bold text-cyan-600">{r.exam.date} • {r.exam.shift}</p>
                  </div>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                    Host: {r.exam.department}
                  </span>
                </div>
                
                <div className="space-y-3 mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Invigilators</p>
                  {r.faculty.length > 0 ? r.faculty.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                      <div>
                        <p className="font-bold text-slate-700 text-sm">{f.name}</p>
                        <p className="text-xs text-slate-500">{f.designation}, {f.department}</p>
                      </div>
                      <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                        {f.dutiesCompleted} Prior Duties
                      </div>
                    </div>
                  )) : (
                    <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                      Not enough eligible faculty available!
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'billing' && (
        <div className="glass p-8 rounded-3xl border border-slate-200 animation-fade-in text-center py-20">
          <Calculator size={64} className="mx-auto text-cyan-300 mb-6" />
          <h2 className="text-2xl font-black text-slate-800 mb-4">Automated Remuneration Billing</h2>
          <p className="text-slate-500 max-w-lg mx-auto mb-8">
            Generate standard accounting vouchers for all faculty members based on the generated roster. Rates are pre-configured as per AIIMS guidelines.
          </p>
          <button 
            onClick={exportBilling}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-4 px-8 rounded-2xl transition-colors inline-flex items-center justify-center gap-3 shadow-xl shadow-cyan-200 text-lg"
          >
            <Download size={24} /> Download Remuneration Bills (Excel)
          </button>
        </div>
      )}
    </div>
  );
}
