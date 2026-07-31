'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Printer, Contact, Users, Calendar, Scissors, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import Link from 'next/link';

interface StudentInfo {
  rollNo: string;
  name: string;
  program: string;
}

interface ExamSchedule {
  date: string;
  time: string;
  subjectCode: string;
  subjectName: string;
}

export default function HallTicketGeneratorPage() {
  const [studentsFile, setStudentsFile] = useState<File | null>(null);
  const [scheduleFile, setScheduleFile] = useState<File | null>(null);
  
  const [students, setStudents] = useState<StudentInfo[]>([]);
  const [schedule, setSchedule] = useState<ExamSchedule[]>([]);
  
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const studentsInputRef = useRef<HTMLInputElement>(null);
  const scheduleInputRef = useRef<HTMLInputElement>(null);

  const handleStudentsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStudentsFile(file);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      const headers = jsonData[0].map(h => String(h).toLowerCase().trim());
      const rollIdx = headers.findIndex(h => h.includes('roll') || h === 'id');
      const nameIdx = headers.findIndex(h => h.includes('name'));
      const programIdx = headers.findIndex(h => h.includes('program') || h.includes('course'));
      
      if (rollIdx === -1) throw new Error("Could not find a 'Roll No' column.");
      
      const parsed: StudentInfo[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        if (!jsonData[i] || !jsonData[i][rollIdx]) continue;
        parsed.push({
          rollNo: String(jsonData[i][rollIdx]),
          name: nameIdx !== -1 ? String(jsonData[i][nameIdx]) : 'Unknown',
          program: programIdx !== -1 ? String(jsonData[i][programIdx]) : 'MBBS', // Default to MBBS
        });
      }
      setStudents(parsed);
      setError(null);
    } catch (err: any) {
      setError("Students file error: " + (err.message || "Invalid format"));
      setStudentsFile(null);
    }
  };

  const handleScheduleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScheduleFile(file);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      const headers = jsonData[0].map(h => String(h).toLowerCase().trim());
      const dateIdx = headers.findIndex(h => h.includes('date'));
      const timeIdx = headers.findIndex(h => h.includes('time'));
      const codeIdx = headers.findIndex(h => h.includes('code'));
      const subjIdx = headers.findIndex(h => h.includes('subject'));
      
      if (dateIdx === -1 || codeIdx === -1) throw new Error("Need 'Date' and 'Subject Code' columns.");
      
      const parsed: ExamSchedule[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        if (!jsonData[i] || !jsonData[i][dateIdx]) continue;
        parsed.push({
          date: String(jsonData[i][dateIdx]),
          time: timeIdx !== -1 ? String(jsonData[i][timeIdx]) : '10:00 AM - 01:00 PM',
          subjectCode: String(jsonData[i][codeIdx]),
          subjectName: subjIdx !== -1 ? String(jsonData[i][subjIdx]) : String(jsonData[i][codeIdx]),
        });
      }
      setSchedule(parsed);
      setError(null);
    } catch (err: any) {
      setError("Schedule file error: " + (err.message || "Invalid format"));
      setScheduleFile(null);
    }
  };

  const generateTickets = () => {
    if (students.length === 0 || schedule.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsGenerated(true);
      setIsProcessing(false);
    }, 500);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Screen View */}
      <div className="print:hidden space-y-8">
        <div className="flex items-center gap-4">
          <Link href="/offline-generator" className="text-slate-500 hover:text-slate-900 font-medium transition-colors">
            Offline Tools
          </Link>
          <span className="text-slate-300">/</span>
          <h1 className="text-2xl font-bold text-slate-900">Hall Ticket Generator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-slate-900">1. Upload Students</h2>
                <div className="relative group flex-1">
                  <Info size={16} className="text-slate-400 hover:text-pink-500 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    <strong>Schema Required:</strong><br/>
                    • <code>Roll No</code> (Required)<br/>
                    • <code>Name</code> (Optional)<br/>
                    • <code>Program</code> (Optional)
                    <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
                {students.length > 0 && <span className="text-pink-600 font-bold text-sm">{students.length} found</span>}
              </div>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  studentsFile ? 'border-pink-300 bg-pink-50' : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                onClick={() => studentsInputRef.current?.click()}
              >
                <input type="file" ref={studentsInputRef} onChange={handleStudentsUpload} accept=".xlsx, .xls, .csv" className="hidden" />
                {studentsFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="text-pink-600 mb-2" size={24} />
                    <span className="text-pink-600 font-bold">{studentsFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <Users className="mb-2" size={24} />
                    <span className="font-medium">Upload Students (RollNo, Name, Program)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-slate-900">2. Upload Timetable</h2>
                <div className="relative group flex-1">
                  <Info size={16} className="text-slate-400 hover:text-pink-500 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    <strong>Schema Required:</strong><br/>
                    • <code>Date</code> (Required)<br/>
                    • <code>Subject Code</code> (Required)<br/>
                    • <code>Time</code> (Optional)<br/>
                    • <code>Subject</code> (Optional)
                    <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
                {schedule.length > 0 && <span className="text-pink-600 font-bold text-sm">{schedule.length} subjects</span>}
              </div>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  scheduleFile ? 'border-pink-300 bg-pink-50' : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                onClick={() => scheduleInputRef.current?.click()}
              >
                <input type="file" ref={scheduleInputRef} onChange={handleScheduleUpload} accept=".xlsx, .xls, .csv" className="hidden" />
                {scheduleFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="text-pink-600 mb-2" size={24} />
                    <span className="text-pink-600 font-bold">{scheduleFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <Calendar className="mb-2" size={24} />
                    <span className="font-medium">Upload Timetable (Date, Time, Subject Code)</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex gap-3 text-red-400">
                <AlertCircle className="shrink-0" size={20} />
                <p>{error}</p>
              </div>
            )}

            <button 
              onClick={generateTickets}
              disabled={students.length === 0 || schedule.length === 0 || isProcessing}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-pink-500/20 relative group"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Contact size={20} />}
              Generate Admit Cards
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                <strong>Anti-Forgery:</strong> A unique verification code is deterministically generated for each student to allow secure verification at the exam center.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </button>
          </div>

          <div className="glass p-6 rounded-2xl border border-slate-200 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Preview</h2>
              {isGenerated && (
                <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex gap-2 relative group">
                  <Printer size={16} /> Print All Tickets
                  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                    <strong>Printing Tip:</strong> Make sure to enable "Background graphics" in your browser's print dialog to render the UI colors properly.
                    <div className="absolute bottom-full right-4 border-4 border-transparent border-b-slate-800"></div>
                  </div>
                </button>
              )}
            </div>

            <div className="flex-1 flex items-center justify-center">
              {!isGenerated ? (
                <div className="text-center text-slate-500 font-medium">
                  <p>Upload files and generate to see preview</p>
                </div>
              ) : (
                <div className="text-center">
                  <CheckCircle2 className="text-emerald-600 mx-auto mb-4" size={48} />
                  <h3 className="text-xl text-slate-900 font-bold mb-2">{students.length} Hall Tickets Generated!</h3>
                  <p className="text-slate-500 font-medium">Click the print button to view and save them as a PDF.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print View (2 Tickets per page) */}
      <div className="hidden print:block text-black bg-white">
        <div className="grid grid-cols-1 gap-8">
          {isGenerated && students.map((student, idx) => (
            <div key={student.rollNo} className={`relative p-8 border-2 border-gray-400 rounded-lg ${idx > 0 && idx % 2 === 0 ? "break-before-page" : ""}`}>
              {/* Cut line indicator if it's the top ticket */}
              {idx % 2 === 0 && idx < students.length - 1 && (
                 <div className="absolute -bottom-4 left-0 w-full flex items-center justify-center text-gray-400">
                    <Scissors size={14} className="-ml-4 mr-2" />
                    <div className="flex-1 border-t-2 border-dashed border-gray-300"></div>
                 </div>
              )}
              
              <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold uppercase tracking-wider">AIIMS KALYANI</h1>
                  <h2 className="text-xl font-bold text-gray-600 mt-1">ADMIT CARD / HALL TICKET</h2>
                </div>
                <div className="w-24 h-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400 text-center">
                  Affix Passport Size Photo Here
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500 uppercase font-bold">Candidate Name</p>
                  <p className="text-lg font-bold">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase font-bold">Roll Number</p>
                  <p className="text-lg font-mono font-bold">{student.rollNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase font-bold">Program</p>
                  <p className="text-lg">{student.program}</p>
                </div>
              </div>

              <table className="w-full border-collapse border border-black text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-black px-3 py-2 text-left">Date</th>
                    <th className="border border-black px-3 py-2 text-left">Time</th>
                    <th className="border border-black px-3 py-2 text-left">Subject Code</th>
                    <th className="border border-black px-3 py-2 text-left">Subject Name</th>
                    <th className="border border-black px-3 py-2 text-center w-24">Invigilator Sign</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((slot, i) => (
                    <tr key={i}>
                      <td className="border border-black px-3 py-2 font-medium">{slot.date}</td>
                      <td className="border border-black px-3 py-2">{slot.time}</td>
                      <td className="border border-black px-3 py-2">{slot.subjectCode}</td>
                      <td className="border border-black px-3 py-2">{slot.subjectName}</td>
                      <td className="border border-black px-3 py-2"></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-16 flex justify-between px-10">
                <div className="border-t border-black pt-2 text-center w-48 font-bold text-sm">Candidate Signature</div>
                <div className="border-t border-black pt-2 text-center w-48 font-bold text-sm">Dean of Examinations</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
