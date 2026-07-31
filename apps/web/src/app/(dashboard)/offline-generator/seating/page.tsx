'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, AlertCircle, RefreshCw, Printer, Map, Users, ArrowRight, Info } from 'lucide-react';
import * as XLSX from 'xlsx';
import Link from 'next/link';

interface Student {
  rollNo: string;
  name: string;
}

interface Room {
  roomNo: string;
  capacity: number;
}

interface SeatingAllocation {
  roomNo: string;
  capacity: number;
  students: Student[];
}

export default function SeatingGeneratorPage() {
  const [studentsFile, setStudentsFile] = useState<File | null>(null);
  const [roomsFile, setRoomsFile] = useState<File | null>(null);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  
  const [allocation, setAllocation] = useState<SeatingAllocation[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const studentsInputRef = useRef<HTMLInputElement>(null);
  const roomsInputRef = useRef<HTMLInputElement>(null);

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
      
      if (rollIdx === -1) throw new Error("Could not find a 'Roll No' or 'ID' column.");
      
      const parsed: Student[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        if (!jsonData[i] || !jsonData[i][rollIdx]) continue;
        parsed.push({
          rollNo: String(jsonData[i][rollIdx]),
          name: nameIdx !== -1 ? String(jsonData[i][nameIdx]) : 'Unknown',
        });
      }
      setStudents(parsed);
      setError(null);
    } catch (err: any) {
      setError("Students file error: " + (err.message || "Invalid format"));
      setStudentsFile(null);
    }
  };

  const handleRoomsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setRoomsFile(file);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      const headers = jsonData[0].map(h => String(h).toLowerCase().trim());
      const roomIdx = headers.findIndex(h => h.includes('room'));
      const capIdx = headers.findIndex(h => h.includes('capacity'));
      
      if (roomIdx === -1 || capIdx === -1) throw new Error("Need 'Room' and 'Capacity' columns.");
      
      const parsed: Room[] = [];
      for (let i = 1; i < jsonData.length; i++) {
        if (!jsonData[i] || !jsonData[i][roomIdx]) continue;
        parsed.push({
          roomNo: String(jsonData[i][roomIdx]),
          capacity: Number(jsonData[i][capIdx]) || 0,
        });
      }
      setRooms(parsed.filter(r => r.capacity > 0));
      setError(null);
    } catch (err: any) {
      setError("Rooms file error: " + (err.message || "Invalid format"));
      setRoomsFile(null);
    }
  };

  const generateSeating = () => {
    if (students.length === 0 || rooms.length === 0) return;
    
    setIsProcessing(true);
    setError(null);
    
    setTimeout(() => {
      try {
        const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
        if (students.length > totalCapacity) {
          throw new Error(`Not enough capacity! Students: ${students.length}, Capacity: ${totalCapacity}`);
        }

        // Simple sequential allocation
        const sortedStudents = [...students].sort((a, b) => a.rollNo.localeCompare(b.rollNo));
        const newAllocation: SeatingAllocation[] = [];
        
        let studentIdx = 0;
        
        for (const room of rooms) {
          const roomStudents = [];
          for (let i = 0; i < room.capacity && studentIdx < sortedStudents.length; i++) {
            roomStudents.push(sortedStudents[studentIdx]);
            studentIdx++;
          }
          
          if (roomStudents.length > 0) {
            newAllocation.push({
              roomNo: room.roomNo,
              capacity: room.capacity,
              students: roomStudents
            });
          }
          
          if (studentIdx >= sortedStudents.length) break;
        }
        
        setAllocation(newAllocation);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsProcessing(false);
      }
    }, 500); // Fake delay for UI
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
          <h1 className="text-2xl font-bold text-slate-900">Seating Arrangement</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-slate-900">1. Upload Students</h2>
                <div className="relative group flex-1">
                  <Info size={16} className="text-slate-400 hover:text-emerald-500 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    <strong>Schema Required:</strong><br/>
                    • <code>Roll No</code> (Required)<br/>
                    • <code>Name</code> (Optional)
                    <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
                {students.length > 0 && <span className="text-emerald-600 font-bold text-sm">{students.length} found</span>}
              </div>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  studentsFile ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                onClick={() => studentsInputRef.current?.click()}
              >
                <input type="file" ref={studentsInputRef} onChange={handleStudentsUpload} accept=".xlsx, .xls, .csv" className="hidden" />
                {studentsFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="text-emerald-600 mb-2" size={24} />
                    <span className="text-emerald-600 font-bold">{studentsFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <Users className="mb-2" size={24} />
                    <span className="font-medium">Upload Students (RollNo, Name)</span>
                  </div>
                )}
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-slate-900">2. Upload Rooms</h2>
                <div className="relative group flex-1">
                  <Info size={16} className="text-slate-400 hover:text-emerald-500 cursor-help" />
                  <div className="absolute left-0 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    <strong>Schema Required:</strong><br/>
                    • <code>Room No</code> (Required)<br/>
                    • <code>Capacity</code> (Required)
                    <div className="absolute top-full left-4 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
                {rooms.length > 0 && <span className="text-emerald-600 font-bold text-sm">Capacity: {rooms.reduce((s,r) => s+r.capacity, 0)}</span>}
              </div>
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                  roomsFile ? 'border-blue-300 bg-blue-50' : 'border-slate-300 hover:border-slate-400 bg-white'
                }`}
                onClick={() => roomsInputRef.current?.click()}
              >
                <input type="file" ref={roomsInputRef} onChange={handleRoomsUpload} accept=".xlsx, .xls, .csv" className="hidden" />
                {roomsFile ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 className="text-emerald-600 mb-2" size={24} />
                    <span className="text-emerald-600 font-bold">{roomsFile.name}</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-500">
                    <Map className="mb-2" size={24} />
                    <span className="font-medium">Upload Rooms (RoomNo, Capacity)</span>
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
              onClick={generateSeating}
              disabled={students.length === 0 || rooms.length === 0 || isProcessing}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 relative group"
            >
              {isProcessing ? <RefreshCw className="animate-spin" size={20} /> : <Map size={20} />}
              Generate Seating Plan
              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl font-normal text-left leading-relaxed">
                <strong>Allocation Algorithm:</strong> Students are sorted alphabetically by Roll Number and sequentially allocated to available rooms until capacity is met.
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
              </div>
            </button>
          </div>

          {/* Preview Section */}
          <div className="glass p-6 rounded-2xl border border-slate-200 flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900">Preview</h2>
              {allocation && (
                <button onClick={() => window.print()} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-bold border border-slate-300 transition-colors flex gap-2">
                  <Printer size={16} /> Print Door Displays
                </button>
              )}
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar pr-2">
              {!allocation ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 font-medium">
                  <p>Upload files and generate to see plan</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {allocation.map((room) => (
                    <div key={room.roomNo} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-200">
                        <h3 className="font-bold text-lg text-emerald-600">Room {room.roomNo}</h3>
                        <span className="text-sm font-medium text-slate-500">
                          {room.students.length} / {room.capacity} occupied
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {room.students.map(s => (
                          <div key={s.rollNo} className="bg-white border border-slate-200 shadow-sm p-2 rounded text-sm text-slate-700 flex justify-between">
                            <span className="font-mono font-bold text-slate-900">{s.rollNo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print View (Door Displays) */}
      <div className="hidden print:block text-black bg-white">
        {allocation?.map((room, idx) => (
          <div key={room.roomNo} className={idx > 0 ? "break-before-page" : ""}>
            <div className="border-4 border-black p-8 min-h-screen">
              <div className="text-center mb-12 border-b-2 border-black pb-6">
                <h1 className="text-5xl font-bold uppercase mb-2">AIIMS KALYANI</h1>
                <h2 className="text-3xl font-bold text-gray-700">Seating Arrangement</h2>
                <div className="mt-8 flex justify-between px-12">
                  <h3 className="text-4xl font-bold">ROOM: {room.roomNo}</h3>
                  <h3 className="text-2xl font-bold pt-2">Total Candidates: {room.students.length}</h3>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-x-12 gap-y-6 px-12">
                {room.students.map((s, i) => (
                  <div key={s.rollNo} className="text-2xl font-mono p-4 border border-gray-400 text-center font-bold">
                    {s.rollNo}
                  </div>
                ))}
              </div>
              
              <div className="mt-20 text-center text-gray-500">
                <p>Roll Numbers starting from {room.students[0]?.rollNo} to {room.students[room.students.length-1]?.rollNo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
