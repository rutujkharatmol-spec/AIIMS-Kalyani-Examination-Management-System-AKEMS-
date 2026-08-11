'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Printer, Lock, Trash2, Library, Info, Settings2, GraduationCap, ClipboardList, Download, Filter, Search, Shuffle, Edit3, GripVertical, ArrowLeftRight, Key, BarChart3, Save, RotateCcw, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import * as XLSX from 'xlsx';
import aiimsLogo from '@/assets/aiims-kalyani-logo.png';
import { exportToWord } from '@/lib/export-docx';

// ─── Types ────────────────────────────────────────────────────────

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
  type?: 'MCQ' | 'SAQ' | 'LAQ';
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  topic?: string;
  selected?: boolean; // for manual selection mode
}

interface QuestionBank {
  id: string;
  filename: string;
  questions: Question[];
  targetMCQ: number;
  targetSAQ: number;
  targetLAQ: number;
}

interface PaperConfig {
  paperType: 'final-exam' | 'professional-mbbs';
  // Final Exam fields
  examTitle: string;
  timeAllowed: string;
  maxMarks: number;
  marksPerQuestion: number;
  negativeMarking: string;
  examMonth: string;
  // Professional MBBS fields
  examName: string;
  subjectName: string;
  paperNumber: string;
  sectionAMarks: number;
  sectionBMarks: number;
  sectionCMarks: number;
}

interface ColumnMapping {
  question: number;
  optionA: number;
  optionB: number;
  optionC: number;
  optionD: number;
  correctAnswer: number;
  marks: number;
  type: number;
  difficulty: number;
  topic: number;
}

interface PendingFile {
  file: File;
  headers: string[];
  sampleRows: string[][];
  mapping: ColumnMapping;
}

const STORAGE_KEY = 'akems_qpgen_draft';

// ─── Component ────────────────────────────────────────────────────

export default function OfflineGeneratorPage() {
  const [uploadedBanks, setUploadedBanks] = useState<QuestionBank[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [watermark, setWatermark] = useState<string>('CONFIDENTIAL - DO NOT COPY');
  const [password, setPassword] = useState<string>('');
  const [generatedPaper, setGeneratedPaper] = useState<Question[] | null>(null);

  // Selection & filter state
  const [selectionMode, setSelectionMode] = useState<'random' | 'manual'>('random');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [filterTopic, setFilterTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBankId, setExpandedBankId] = useState<string | null>(null);

  // Inline editing state
  const [editingQuestion, setEditingQuestion] = useState<{ idx: number; field: string } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Drag-and-drop state
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  // Column mapping state
  const [pendingFile, setPendingFile] = useState<PendingFile | null>(null);

  // Draft restore state
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  // Answer key print state
  const [printAnswerKey, setPrintAnswerKey] = useState(false);

  const [config, setConfig] = useState<PaperConfig>({
    paperType: 'final-exam',
    examTitle: 'Written examination for the post of Junior Resident (Non-Academic)',
    timeAllowed: '50 Min.',
    maxMarks: 60,
    marksPerQuestion: 1,
    negativeMarking: 'one-third (1/3)',
    examMonth: 'July 2026',
    examName: 'Fourth Professional MBBS Examination',
    subjectName: 'Obstetrics & Gynaecology',
    paperNumber: 'Paper-II',
    sectionAMarks: 20,
    sectionBMarks: 40,
    sectionCMarks: 40,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Draft Persistence ──────────────────────────────────────────

  // Auto-save to localStorage
  useEffect(() => {
    if (uploadedBanks.length === 0 && !generatedPaper) return;
    const draft = {
      config,
      uploadedBanks,
      generatedPaper,
      watermark,
      selectionMode,
      timestamp: new Date().toISOString(),
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch (e) {
      // localStorage full or unavailable – silently ignore
    }
  }, [config, uploadedBanks, generatedPaper, watermark, selectionMode]);

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.uploadedBanks?.length > 0 || draft.generatedPaper) {
          setShowRestorePrompt(true);
        }
      }
    } catch (e) {
      // Corrupted data – ignore
    }
  }, []);

  const restoreDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        if (draft.config) setConfig(draft.config);
        if (draft.uploadedBanks) setUploadedBanks(draft.uploadedBanks);
        if (draft.generatedPaper) setGeneratedPaper(draft.generatedPaper);
        if (draft.watermark) setWatermark(draft.watermark);
        if (draft.selectionMode) setSelectionMode(draft.selectionMode);
      }
    } catch (e) {
      setError('Failed to restore draft.');
    }
    setShowRestorePrompt(false);
  };

  const discardDraft = () => {
    localStorage.removeItem(STORAGE_KEY);
    setShowRestorePrompt(false);
  };

  // ─── Download Template ──────────────────────────────────────────

  const downloadTemplate = () => {
    const templateData = [
      ['Question', 'Type', 'Option A', 'Option B', 'Option C', 'Option D', 'Correct Answer', 'Marks', 'Difficulty', 'Topic'],
      ['What is the capital of India?', 'MCQ', 'Mumbai', 'Delhi', 'Kolkata', 'Chennai', 'B', 1, 'Easy', 'General Knowledge'],
      ['Describe the structure of DNA.', 'SAQ', '', '', '', '', '', 5, 'Medium', 'Biochemistry'],
      ['Explain the pathophysiology of diabetes mellitus.', 'LAQ', '', '', '', '', '', 10, 'Hard', 'Medicine'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(templateData);
    // Set column widths
    ws['!cols'] = [
      { wch: 50 }, { wch: 8 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 20 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Questions');
    XLSX.writeFile(wb, 'AKEMS_Question_Bank_Template.xlsx');
  };

  // ─── File Upload ──────────────────────────────────────────────

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

  // ─── Auto-detect columns helper ─────────────────────────────

  const autoDetectMapping = (headers: string[]): ColumnMapping => {
    const h = headers.map(hh => String(hh).toLowerCase().trim());
    return {
      question: h.findIndex(x => x.includes('question') && !x.includes('type')),
      optionA: h.findIndex(x => x.includes('option a') || x === 'a'),
      optionB: h.findIndex(x => x.includes('option b') || x === 'b'),
      optionC: h.findIndex(x => x.includes('option c') || x === 'c'),
      optionD: h.findIndex(x => x.includes('option d') || x === 'd'),
      correctAnswer: h.findIndex(x => x.includes('correct') || x.includes('answer')),
      marks: h.findIndex(x => x.includes('mark')),
      type: h.findIndex(x => x.includes('type')),
      difficulty: h.findIndex(x => x.includes('difficult') || x.includes('level')),
      topic: h.findIndex(x => x.includes('topic') || x.includes('chapter') || x.includes('subject')),
    };
  };

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    setError(null);

    try {
      for (const file of files) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length < 2) continue;

        const headers = jsonData[0].map(h => String(h || ''));
        const mapping = autoDetectMapping(headers);

        // If we can't detect the question column, show mapping UI
        if (mapping.question === -1) {
          const sampleRows = jsonData.slice(1, 4).map(row => row.map(cell => String(cell || '')));
          setPendingFile({ file, headers, sampleRows, mapping });
          setIsProcessing(false);
          return;
        }

        // Process with detected mapping
        processWithMapping(file, jsonData, mapping);
      }
    } catch (err: any) {
      setError(err.message || "Failed to process files.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const processWithMapping = (file: File, jsonData: any[][], mapping: ColumnMapping) => {
    const parsedQuestions: Question[] = [];
    const subjectName = file.name.replace(/\.[^/.]+$/, "");

    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || (mapping.question !== -1 && !row[mapping.question])) continue;

      let qType: 'MCQ' | 'SAQ' | 'LAQ' = 'MCQ';
      if (mapping.type !== -1 && row[mapping.type]) {
        const t = String(row[mapping.type]).trim().toUpperCase();
        if (t === 'SAQ' || t === 'LAQ') {
          qType = t;
        }
      }

      let difficulty: 'Easy' | 'Medium' | 'Hard' | undefined;
      if (mapping.difficulty !== -1 && row[mapping.difficulty]) {
        const d = String(row[mapping.difficulty]).trim().toLowerCase();
        if (d.startsWith('easy') || d === 'e') difficulty = 'Easy';
        else if (d.startsWith('medium') || d === 'm') difficulty = 'Medium';
        else if (d.startsWith('hard') || d === 'h') difficulty = 'Hard';
      }

      parsedQuestions.push({
        id: `Q${i}_${Math.random().toString(36).substr(2, 5)}`,
        question: mapping.question !== -1 ? String(row[mapping.question] || '') : '',
        optionA: mapping.optionA !== -1 ? String(row[mapping.optionA] || '') : undefined,
        optionB: mapping.optionB !== -1 ? String(row[mapping.optionB] || '') : undefined,
        optionC: mapping.optionC !== -1 ? String(row[mapping.optionC] || '') : undefined,
        optionD: mapping.optionD !== -1 ? String(row[mapping.optionD] || '') : undefined,
        correctAnswer: mapping.correctAnswer !== -1 ? String(row[mapping.correctAnswer] || '') : undefined,
        marks: (mapping.marks !== -1 && row[mapping.marks]) ? Number(row[mapping.marks]) : (qType === 'MCQ' ? 1 : (qType === 'SAQ' ? 5 : 10)),
        subject: subjectName,
        type: qType,
        difficulty,
        topic: mapping.topic !== -1 ? String(row[mapping.topic] || '') : undefined,
        selected: true, // default selected for manual mode
      });
    }

    if (parsedQuestions.length > 0) {
      const mcqCount = parsedQuestions.filter(q => q.type === 'MCQ').length;
      const saqCount = parsedQuestions.filter(q => q.type === 'SAQ').length;
      const laqCount = parsedQuestions.filter(q => q.type === 'LAQ').length;

      setUploadedBanks(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        filename: file.name,
        questions: parsedQuestions,
        targetMCQ: Math.min(10, mcqCount),
        targetSAQ: Math.min(2, saqCount),
        targetLAQ: Math.min(1, laqCount)
      }]);
    }
  };

  const confirmMapping = () => {
    if (!pendingFile) return;

    const { file, headers, mapping } = pendingFile;

    if (mapping.question === -1) {
      setError('You must map the "Question" column.');
      return;
    }

    // Re-read the file and process with user-provided mapping
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      processWithMapping(pendingFile.file, jsonData, mapping);
      setPendingFile(null);
    };
    reader.readAsArrayBuffer(file);
  };

  const removeBank = (id: string) => {
    setUploadedBanks(uploadedBanks.filter(b => b.id !== id));
    setGeneratedPaper(null);
  };

  const updateTargetCount = (id: string, type: 'MCQ' | 'SAQ' | 'LAQ', count: number) => {
    setUploadedBanks(uploadedBanks.map(b => {
      if (b.id === id) {
        const available = b.questions.filter(q => q.type === type).length;
        const validCount = Math.min(Math.max(0, count), available);
        if (type === 'MCQ') return { ...b, targetMCQ: validCount };
        if (type === 'SAQ') return { ...b, targetSAQ: validCount };
        if (type === 'LAQ') return { ...b, targetLAQ: validCount };
      }
      return b;
    }));
  };

  // ─── Toggle question selection (manual mode) ──────────────────

  const toggleQuestionSelection = (bankId: string, questionId: string) => {
    setUploadedBanks(prev => prev.map(b => {
      if (b.id !== bankId) return b;
      return {
        ...b,
        questions: b.questions.map(q =>
          q.id === questionId ? { ...q, selected: !q.selected } : q
        )
      };
    }));
  };

  const selectAllInBank = (bankId: string, selected: boolean) => {
    setUploadedBanks(prev => prev.map(b => {
      if (b.id !== bankId) return b;
      return {
        ...b,
        questions: b.questions.map(q => ({ ...q, selected }))
      };
    }));
  };

  // ─── Filter questions helper ──────────────────────────────────

  const getFilteredQuestions = (questions: Question[]) => {
    return questions.filter(q => {
      if (filterType !== 'all' && q.type !== filterType) return false;
      if (filterDifficulty !== 'all' && q.difficulty !== filterDifficulty) return false;
      if (filterTopic !== 'all' && q.topic !== filterTopic) return false;
      if (searchQuery && !q.question.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  };

  // Get unique topics across all banks
  const allTopics = Array.from(new Set(uploadedBanks.flatMap(b => b.questions.map(q => q.topic).filter((t): t is string => Boolean(t)))));

  // ─── Generate Paper ───────────────────────────────────────────

  const generatePaper = () => {
    if (uploadedBanks.length === 0) return;

    let allSelectedQuestions: Question[] = [];

    if (selectionMode === 'manual') {
      // In manual mode, just use the selected questions
      uploadedBanks.forEach(bank => {
        const selected = bank.questions.filter(q => q.selected);
        allSelectedQuestions = [...allSelectedQuestions, ...selected];
      });
    } else {
      // Random mode - existing logic
      uploadedBanks.forEach(bank => {
        const mcqs = bank.questions.filter(q => q.type === 'MCQ');
        const saqs = bank.questions.filter(q => q.type === 'SAQ');
        const laqs = bank.questions.filter(q => q.type === 'LAQ');

        const processQuestions = (questions: Question[], count: number, shuffleOptions: boolean) => {
          if (count === 0) return [];

          let processed = [...questions];

          if (shuffleOptions) {
            processed = processed.map(q => {
              const options = [
                { originalKey: 'a', val: q.optionA },
                { originalKey: 'b', val: q.optionB },
                { originalKey: 'c', val: q.optionC },
                { originalKey: 'd', val: q.optionD }
              ].filter(o => o.val !== undefined && o.val.toString().trim() !== '');

              let originalCorrectKey = '';
              const ca = q.correctAnswer ? String(q.correctAnswer).trim().toLowerCase() : '';

              if (ca === 'a' || ca === 'b' || ca === 'c' || ca === 'd') {
                originalCorrectKey = ca;
              } else if (ca) {
                const matched = options.find(o => o.val?.toString().trim().toLowerCase() === ca);
                if (matched) originalCorrectKey = matched.originalKey;
              }

              for (let i = options.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [options[i], options[j]] = [options[j], options[i]];
              }

              const newQ = { ...q };
              if (options.length > 0) newQ.optionA = options[0].val; else delete newQ.optionA;
              if (options.length > 1) newQ.optionB = options[1].val; else delete newQ.optionB;
              if (options.length > 2) newQ.optionC = options[2].val; else delete newQ.optionC;
              if (options.length > 3) newQ.optionD = options[3].val; else delete newQ.optionD;

              if (originalCorrectKey) {
                const newCorrectIndex = options.findIndex(o => o.originalKey === originalCorrectKey);
                if (newCorrectIndex !== -1) {
                  newQ.correctAnswer = ['A', 'B', 'C', 'D'][newCorrectIndex];
                }
              }

              return newQ;
            });
          }

          for (let i = processed.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [processed[i], processed[j]] = [processed[j], processed[i]];
          }

          return processed.slice(0, count);
        };

        const selectedMCQs = processQuestions(mcqs, bank.targetMCQ, true);
        const selectedSAQs = processQuestions(saqs, bank.targetSAQ, false);
        const selectedLAQs = processQuestions(laqs, bank.targetLAQ, false);

        allSelectedQuestions = [...allSelectedQuestions, ...selectedMCQs, ...selectedSAQs, ...selectedLAQs];
      });
    }

    setGeneratedPaper(allSelectedQuestions);
  };

  // ─── Inline Editing ──────────────────────────────────────────

  const startEditing = (idx: number, field: string, currentValue: string) => {
    setEditingQuestion({ idx, field });
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (!editingQuestion || !generatedPaper) return;
    const updated = [...generatedPaper];
    const q = { ...updated[editingQuestion.idx] };
    (q as any)[editingQuestion.field] = editValue;
    updated[editingQuestion.idx] = q;
    setGeneratedPaper(updated);
    setEditingQuestion(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
    setEditValue('');
  };

  // ─── Drag-and-Drop Reordering ────────────────────────────────

  const handleDragStart = (idx: number) => {
    setDragIdx(idx);
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    setDragOverIdx(idx);
  };

  const handleDrop = (idx: number) => {
    if (dragIdx === null || !generatedPaper) return;
    const updated = [...generatedPaper];
    const [removed] = updated.splice(dragIdx, 1);
    updated.splice(idx, 0, removed);
    setGeneratedPaper(updated);
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  // ─── Swap Question ───────────────────────────────────────────

  const swapQuestion = (idx: number) => {
    if (!generatedPaper) return;
    const currentQ = generatedPaper[idx];
    const currentBank = uploadedBanks.find(b => b.questions.some(q => q.subject === currentQ.subject));
    if (!currentBank) return;

    const sameTypeQuestions = currentBank.questions.filter(
      q => q.type === currentQ.type && !generatedPaper.some(gq => gq.id === q.id)
    );

    if (sameTypeQuestions.length === 0) {
      setError(`No more ${currentQ.type} questions available in "${currentBank.filename}" to swap with.`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    const randomIdx = Math.floor(Math.random() * sameTypeQuestions.length);
    const replacement = { ...sameTypeQuestions[randomIdx] };

    const updated = [...generatedPaper];
    updated[idx] = replacement;
    setGeneratedPaper(updated);
  };

  // ─── Shuffle Options for Single Question ───────────────────

  const shuffleOptionsForQuestion = (idx: number) => {
    if (!generatedPaper) return;
    const q = generatedPaper[idx];
    if (q.type !== 'MCQ') return;

    const options = [
      { key: 'a', val: q.optionA },
      { key: 'b', val: q.optionB },
      { key: 'c', val: q.optionC },
      { key: 'd', val: q.optionD },
    ].filter(o => o.val !== undefined && o.val.toString().trim() !== '');

    let correctKey = '';
    const ca = q.correctAnswer ? String(q.correctAnswer).trim().toLowerCase() : '';
    if (['a', 'b', 'c', 'd'].includes(ca)) {
      correctKey = ca;
    } else if (ca) {
      const matched = options.find(o => o.val?.toString().trim().toLowerCase() === ca);
      if (matched) correctKey = matched.key;
    }

    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }

    const newQ = { ...q };
    newQ.optionA = options[0]?.val;
    newQ.optionB = options[1]?.val;
    newQ.optionC = options[2]?.val;
    newQ.optionD = options[3]?.val;

    if (correctKey) {
      const newIdx = options.findIndex(o => o.key === correctKey);
      if (newIdx !== -1) {
        newQ.correctAnswer = ['A', 'B', 'C', 'D'][newIdx];
      }
    }

    const updated = [...generatedPaper];
    updated[idx] = newQ;
    setGeneratedPaper(updated);
  };

  // ─── Randomize Order ─────────────────────────────────────────

  const randomizeOrder = () => {
    if (!generatedPaper || generatedPaper.length < 2) return;

    const shuffled = generatedPaper.map(q => {
      // Shuffle options for MCQs
      if (q.type === 'MCQ') {
        const options = [
          { key: 'a', val: q.optionA },
          { key: 'b', val: q.optionB },
          { key: 'c', val: q.optionC },
          { key: 'd', val: q.optionD },
        ].filter(o => o.val !== undefined && o.val.toString().trim() !== '');

        // Identify which key is the correct answer
        let correctKey = '';
        const ca = q.correctAnswer ? String(q.correctAnswer).trim().toLowerCase() : '';
        if (['a', 'b', 'c', 'd'].includes(ca)) {
          correctKey = ca;
        } else if (ca) {
          const matched = options.find(o => o.val?.toString().trim().toLowerCase() === ca);
          if (matched) correctKey = matched.key;
        }

        // Fisher-Yates shuffle options
        for (let i = options.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [options[i], options[j]] = [options[j], options[i]];
        }

        const newQ = { ...q };
        newQ.optionA = options[0]?.val;
        newQ.optionB = options[1]?.val;
        newQ.optionC = options[2]?.val;
        newQ.optionD = options[3]?.val;

        if (correctKey) {
          const newIdx = options.findIndex(o => o.key === correctKey);
          if (newIdx !== -1) {
            newQ.correctAnswer = ['A', 'B', 'C', 'D'][newIdx];
          }
        }
        return newQ;
      }
      return { ...q };
    });

    // Shuffle question order
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setGeneratedPaper(shuffled);
  };

  // ─── Export Handlers ──────────────────────────────────────────

  const handlePrint = () => {
    setPrintAnswerKey(false);
    setTimeout(() => window.print(), 100);
  };

  const handlePrintAnswerKey = () => {
    setPrintAnswerKey(true);
    setTimeout(() => window.print(), 100);
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

  // ─── Computed values ──────────────────────────────────────────

  const totalQuestions = generatedPaper?.length || uploadedBanks.reduce((sum, b) => sum + b.targetMCQ + b.targetSAQ + b.targetLAQ, 0);

  // ─── Editable Text Component ──────────────────────────────────

  const EditableText = ({ value, idx, field, className = '' }: { value: string; idx: number; field: string; className?: string }) => {
    const isEditing = editingQuestion?.idx === idx && editingQuestion?.field === field;

    if (isEditing) {
      return (
        <div className="flex items-center gap-1 w-full">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
            className="flex-1 bg-white border-2 border-blue-400 rounded px-2 py-1 text-sm text-slate-900 focus:outline-none"
            autoFocus
          />
          <button onClick={saveEdit} className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"><Check size={14} /></button>
          <button onClick={cancelEdit} className="p-1 text-red-500 hover:bg-red-50 rounded"><X size={14} /></button>
        </div>
      );
    }

    return (
      <span
        className={`cursor-pointer hover:bg-blue-50 hover:outline hover:outline-1 hover:outline-blue-300 rounded px-1 -mx-1 transition-colors ${className}`}
        onClick={() => startEditing(idx, field, value)}
        title="Click to edit"
      >
        {value}
      </span>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // COLUMN MAPPING MODAL
  // ═══════════════════════════════════════════════════════════════

  const renderColumnMappingModal = () => {
    if (!pendingFile) return null;

    const fieldNames: { key: keyof ColumnMapping; label: string; required: boolean }[] = [
      { key: 'question', label: 'Question Text', required: true },
      { key: 'type', label: 'Type (MCQ/SAQ/LAQ)', required: false },
      { key: 'optionA', label: 'Option A', required: false },
      { key: 'optionB', label: 'Option B', required: false },
      { key: 'optionC', label: 'Option C', required: false },
      { key: 'optionD', label: 'Option D', required: false },
      { key: 'correctAnswer', label: 'Correct Answer', required: false },
      { key: 'marks', label: 'Marks', required: false },
      { key: 'difficulty', label: 'Difficulty', required: false },
      { key: 'topic', label: 'Topic / Subject', required: false },
    ];

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="text-amber-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Column Mapping Required</h3>
              <p className="text-sm text-slate-500">
                We couldn&apos;t auto-detect columns in <strong>{pendingFile.file.name}</strong>. Map them manually:
              </p>
            </div>
          </div>

          {/* Sample data preview */}
          <div className="mb-4 overflow-x-auto">
            <table className="text-xs border-collapse w-full">
              <thead>
                <tr>
                  {pendingFile.headers.map((h, i) => (
                    <th key={i} className="bg-slate-100 border border-slate-200 px-2 py-1 font-bold text-slate-700">
                      Col {i}: {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pendingFile.sampleRows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className="border border-slate-200 px-2 py-1 text-slate-600 max-w-[120px] truncate">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mapping dropdowns */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {fieldNames.map(({ key, label, required }) => (
              <div key={key}>
                <label className="text-xs font-bold text-slate-600 mb-1 block">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                <select
                  value={pendingFile.mapping[key]}
                  onChange={(e) => {
                    setPendingFile(prev => prev ? {
                      ...prev,
                      mapping: { ...prev.mapping, [key]: parseInt(e.target.value) }
                    } : null);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                >
                  <option value={-1}>— Not mapped —</option>
                  {pendingFile.headers.map((h, i) => (
                    <option key={i} value={i}>Col {i}: {h}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setPendingFile(null)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmMapping}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-bold transition-colors shadow-md"
            >
              Apply Mapping & Import
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // PRINT LAYOUTS
  // ═══════════════════════════════════════════════════════════════

  // ─── ANSWER KEY Print Layout ──────────────────────────────────

  const renderAnswerKeyPrint = () => {
    if (!generatedPaper || !printAnswerKey) return null;

    const mcqs = generatedPaper.filter(q => q.type === 'MCQ');
    const saqs = generatedPaper.filter(q => q.type === 'SAQ');
    const laqs = generatedPaper.filter(q => q.type === 'LAQ');

    // Blueprint: marks by subject
    const subjectMap: Record<string, { mcq: number; saq: number; laq: number; total: number }> = {};
    generatedPaper.forEach(q => {
      const subj = q.subject || 'Unknown';
      if (!subjectMap[subj]) subjectMap[subj] = { mcq: 0, saq: 0, laq: 0, total: 0 };
      const m = q.marks || 0;
      if (q.type === 'MCQ') subjectMap[subj].mcq += m;
      else if (q.type === 'SAQ') subjectMap[subj].saq += m;
      else subjectMap[subj].laq += m;
      subjectMap[subj].total += m;
    });

    return (
      <div className="hidden print:block" style={{ fontFamily: "'Times New Roman', Times, serif", color: 'black' }}>

        {/* ═══ ANSWER KEY ═══ */}
        <div style={{ textAlign: 'center', marginBottom: '16pt' }}>
          <img src={aiimsLogo.src} alt="AIIMS Kalyani" className="print-logo" style={{ display: 'inline-block', width: '55pt', height: 'auto' }} />
        </div>
        <div style={{ textAlign: 'center', fontSize: '14pt', fontWeight: 'bold', marginBottom: '4pt' }}>
          All India Institute of Medical Sciences (AIIMS), Kalyani
        </div>
        <div style={{ textAlign: 'center', fontSize: '12pt', fontWeight: 'bold', marginBottom: '6pt' }}>
          ANSWER KEY — {config.paperType === 'final-exam' ? config.examTitle : config.examName}, {config.examMonth}
        </div>
        <hr style={{ border: 'none', borderTop: '1.5pt solid black', margin: '8pt 0' }} />

        {/* MCQ Answer Key Grid */}
        {mcqs.length > 0 && (
          <div style={{ marginBottom: '20pt' }}>
            <div style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '8pt', textDecoration: 'underline' }}>
              MCQ Answers:
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
              <thead>
                <tr>
                  <th style={{ border: '1pt solid black', padding: '4pt 8pt', backgroundColor: '#f0f0f0' }}>Q. No.</th>
                  <th style={{ border: '1pt solid black', padding: '4pt 8pt', backgroundColor: '#f0f0f0' }}>Answer</th>
                  <th style={{ border: '1pt solid black', padding: '4pt 8pt', backgroundColor: '#f0f0f0' }}>Q. No.</th>
                  <th style={{ border: '1pt solid black', padding: '4pt 8pt', backgroundColor: '#f0f0f0' }}>Answer</th>
                  <th style={{ border: '1pt solid black', padding: '4pt 8pt', backgroundColor: '#f0f0f0' }}>Q. No.</th>
                  <th style={{ border: '1pt solid black', padding: '4pt 8pt', backgroundColor: '#f0f0f0' }}>Answer</th>
                  <th style={{ border: '1pt solid black', padding: '4pt 8pt', backgroundColor: '#f0f0f0' }}>Q. No.</th>
                  <th style={{ border: '1pt solid black', padding: '4pt 8pt', backgroundColor: '#f0f0f0' }}>Answer</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.ceil(mcqs.length / 4) }).map((_, rowIdx) => (
                  <tr key={rowIdx}>
                    {[0, 1, 2, 3].map(colIdx => {
                      const qIdx = rowIdx + colIdx * Math.ceil(mcqs.length / 4);
                      const q = mcqs[qIdx];
                      return (
                        <React.Fragment key={colIdx}>
                          <td style={{ border: '1pt solid black', padding: '3pt 8pt', textAlign: 'center' }}>
                            {q ? qIdx + 1 : ''}
                          </td>
                          <td style={{ border: '1pt solid black', padding: '3pt 8pt', textAlign: 'center', fontWeight: 'bold' }}>
                            {q?.correctAnswer || ''}
                          </td>
                        </React.Fragment>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SAQ/LAQ Answers */}
        {saqs.length > 0 && (
          <div style={{ marginBottom: '16pt' }}>
            <div style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '6pt', textDecoration: 'underline' }}>SAQ Answers:</div>
            {saqs.map((q, idx) => (
              <div key={idx} style={{ fontSize: '10pt', marginBottom: '4pt' }}>
                <strong>{idx + 1}.</strong> {q.correctAnswer || '(No answer provided)'}
              </div>
            ))}
          </div>
        )}

        {laqs.length > 0 && (
          <div style={{ marginBottom: '16pt' }}>
            <div style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '6pt', textDecoration: 'underline' }}>LAQ Answers:</div>
            {laqs.map((q, idx) => (
              <div key={idx} style={{ fontSize: '10pt', marginBottom: '4pt' }}>
                <strong>{idx + 1}.</strong> {q.correctAnswer || '(No answer provided)'}
              </div>
            ))}
          </div>
        )}

        {/* ═══ EXAM BLUEPRINT ═══ */}
        <div className="print-page-break" />
        <div style={{ textAlign: 'center', fontSize: '13pt', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '12pt', marginTop: '20pt' }}>
          EXAM BLUEPRINT
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10pt' }}>
          <thead>
            <tr>
              <th style={{ border: '1pt solid black', padding: '6pt', backgroundColor: '#f0f0f0' }}>Subject / Bank</th>
              <th style={{ border: '1pt solid black', padding: '6pt', backgroundColor: '#f0f0f0' }}>MCQ Marks</th>
              <th style={{ border: '1pt solid black', padding: '6pt', backgroundColor: '#f0f0f0' }}>SAQ Marks</th>
              <th style={{ border: '1pt solid black', padding: '6pt', backgroundColor: '#f0f0f0' }}>LAQ Marks</th>
              <th style={{ border: '1pt solid black', padding: '6pt', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(subjectMap).map(([subj, data]) => (
              <tr key={subj}>
                <td style={{ border: '1pt solid black', padding: '4pt 8pt' }}>{subj}</td>
                <td style={{ border: '1pt solid black', padding: '4pt 8pt', textAlign: 'center' }}>{data.mcq}</td>
                <td style={{ border: '1pt solid black', padding: '4pt 8pt', textAlign: 'center' }}>{data.saq}</td>
                <td style={{ border: '1pt solid black', padding: '4pt 8pt', textAlign: 'center' }}>{data.laq}</td>
                <td style={{ border: '1pt solid black', padding: '4pt 8pt', textAlign: 'center', fontWeight: 'bold' }}>{data.total}</td>
              </tr>
            ))}
            <tr>
              <td style={{ border: '1pt solid black', padding: '4pt 8pt', fontWeight: 'bold' }}>Grand Total</td>
              <td style={{ border: '1pt solid black', padding: '4pt 8pt', textAlign: 'center', fontWeight: 'bold' }}>
                {Object.values(subjectMap).reduce((s, d) => s + d.mcq, 0)}
              </td>
              <td style={{ border: '1pt solid black', padding: '4pt 8pt', textAlign: 'center', fontWeight: 'bold' }}>
                {Object.values(subjectMap).reduce((s, d) => s + d.saq, 0)}
              </td>
              <td style={{ border: '1pt solid black', padding: '4pt 8pt', textAlign: 'center', fontWeight: 'bold' }}>
                {Object.values(subjectMap).reduce((s, d) => s + d.laq, 0)}
              </td>
              <td style={{ border: '1pt solid black', padding: '4pt 8pt', textAlign: 'center', fontWeight: 'bold' }}>
                {Object.values(subjectMap).reduce((s, d) => s + d.total, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // ─── FINAL EXAM (TEST BOOKLET) Print Layout ───────────────────

  const renderFinalExamPrint = () => {
    if (!generatedPaper || printAnswerKey) return null;

    return (
      <div className="hidden print:block" style={{ fontFamily: "'Times New Roman', Times, serif", color: 'black' }}>

        {/* ═══ PAGE 1: COVER PAGE ═══ */}
        <div className="print-page-break">
          <div className="print-cover-border" style={{ textAlign: 'center' }}>
            {/* Logo */}
            <div style={{ marginBottom: '8pt' }}>
              <img src={aiimsLogo.src} alt="AIIMS Kalyani" className="print-logo" style={{ display: 'inline-block', width: '70pt', height: 'auto' }} />
            </div>

            {/* Header */}
            <div style={{ fontSize: '11pt', fontStyle: 'italic', fontWeight: 'bold', marginBottom: '2pt' }}>
              Examination Section
            </div>
            <div style={{ fontSize: '16pt', fontWeight: 'bold', marginBottom: '2pt' }}>
              All India Institute of Medical Sciences (AIIMS), Kalyani
            </div>
            <div style={{ fontSize: '9pt', marginBottom: '10pt' }}>
              NH-34 connector, Basantpur, Saguna, Kalyani, Nadia, West Bengal -741245
            </div>

            {/* Exam Title */}
            <div style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '6pt' }}>
              {config.examTitle}, {config.examMonth}
            </div>

            {/* TEST BOOKLET */}
            <div style={{ fontSize: '13pt', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '12pt' }}>
              TEST BOOKLET
            </div>

            {/* Time & Marks row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10pt', marginBottom: '10pt', borderTop: '1pt solid black', borderBottom: '1pt solid black', padding: '4pt 0' }}>
              <div style={{ fontWeight: 'bold', textAlign: 'left' }}>
                Time Allowed: {config.timeAllowed}
              </div>
              <div style={{ fontWeight: 'bold', textAlign: 'right' }}>
                Max. Marks: {config.maxMarks}
              </div>
            </div>

            {/* Enrollment No */}
            <div style={{ fontSize: '11pt', fontWeight: 'bold', marginBottom: '14pt', textAlign: 'center' }}>
              ENROLLMENT NO.:&nbsp;&nbsp;
              <span className="print-enrollment-box">&nbsp;</span>
            </div>

            {/* Instructions */}
            <div style={{ fontSize: '12pt', fontWeight: 'bold', textDecoration: 'underline', marginBottom: '8pt', textAlign: 'center' }}>
              INSTRUCTIONS
            </div>

            <ol style={{ textAlign: 'left', fontSize: '9.5pt', lineHeight: '1.5', paddingLeft: '16pt', listStyleType: 'decimal', marginBottom: '14pt' }}>
              <li style={{ marginBottom: '4pt' }}>
                IMMEDIATELY AFTER THE COMMENCEMENT OF THE EXAMINATION, YOU SHOULD CHECK THAT THIS TEST BOOKLET DOES <em style={{ fontWeight: 'bold' }}>NOT</em> HAVE ANY UNPRINTED OR TORN OR MISSING PAGES OR ITEMS ETC. IF SO, GET IT REPLACED BY A COMPLETE TEST BOOKLET.
              </li>
              <li style={{ marginBottom: '4pt', fontWeight: 'bold' }}>
                Please note that it is the candidate&apos;s responsibility to encode and fill in the Enrollment Number carefully and without omission or discrepancy at the appropriate places in the OMR Answer Sheet. Any omission/discrepancy will render the Answer Sheet liable for rejection.
              </li>
              <li style={{ marginBottom: '4pt' }}>
                This Test Booklet contains <strong>{generatedPaper.length} questions</strong>. Each question comprises <strong>four responses</strong> (answers). You may select the response which you want to mark on the Answer Sheet and encircle it. In case you feel that there is more than one correct response, encircle the response which you consider the best. In any case, choose <strong>ONLY ONE</strong> response for each question.
              </li>
              <li style={{ marginBottom: '4pt' }}>
                You have to mark all your responses <strong>ONLY</strong> on the OMR Sheet provided. See direction in the OMR Sheet.
              </li>
              <li style={{ marginBottom: '4pt' }}>
                The question paper shall consist of <strong>{generatedPaper.length} multiple-choice questions (MCQs)</strong>, each carrying <strong>{config.marksPerQuestion} mark</strong>. A <strong>negative marking of {config.negativeMarking} of the marks</strong>.
              </li>
              <li style={{ marginBottom: '4pt' }}>
                After you have completed filling in all your responses on the OMR sheet and the examination has been conducted, you should <strong>hand over to the Invigilator both Test Booklet and OMR Sheet</strong>.
              </li>
              <li style={{ marginBottom: '4pt' }}>
                Sheet for rough work is appended in the Test Booklet at the end.
              </li>
              <li style={{ marginBottom: '4pt' }}>
                If a candidate gives more than one answer, it will be treated as a wrong answer even if one of the given answers happens to be correct.
              </li>
            </ol>

            {/* Warning Box */}
            <div className="print-warning-box" style={{ fontSize: '11pt', marginTop: '10pt' }}>
              DO NOT OPEN THIS TEST BOOKLET UNTIL YOU ARE TOLD TO DO SO
            </div>

            {/* Signature */}
            <div style={{ textAlign: 'right', fontSize: '10pt', fontWeight: 'bold', marginTop: '24pt', paddingRight: '10pt' }}>
              Signature of Candidate with date
            </div>
          </div>
        </div>

        {/* ═══ PAGE 2: DO NOT WRITE ON THIS PAGE ═══ */}
        <div className="print-page-break">
          <div className="print-page-border" style={{ display: 'flex', justifyContent: 'center', paddingTop: '30pt' }}>
            <div style={{ fontSize: '13pt', fontWeight: 'bold', textDecoration: 'underline', textAlign: 'center' }}>
              DO NOT WRITE ON THIS PAGE
            </div>
          </div>
        </div>

        {/* ═══ PAGE 3+: QUESTIONS ═══ */}
        <div className="print-page-border">
          {generatedPaper.map((q, idx) => (
            <div key={idx} className="print-avoid-break" style={{ marginBottom: '14pt' }}>
              <div style={{ display: 'flex', gap: '6pt' }}>
                <span style={{ fontWeight: 'bold', minWidth: '20pt' }}>{idx + 1}.</span>
                <span style={{ fontWeight: 'bold', textAlign: 'justify', flex: 1 }}>{q.question}</span>
              </div>
              {q.type === 'MCQ' && (
                <div style={{ marginLeft: '30pt', marginTop: '4pt' }}>
                  {q.optionA && <div style={{ marginBottom: '2pt' }}>a.&nbsp;&nbsp;&nbsp;{q.optionA}</div>}
                  {q.optionB && <div style={{ marginBottom: '2pt' }}>b.&nbsp;&nbsp;&nbsp;{q.optionB}</div>}
                  {q.optionC && <div style={{ marginBottom: '2pt' }}>c.&nbsp;&nbsp;&nbsp;{q.optionC}</div>}
                  {q.optionD && <div style={{ marginBottom: '2pt' }}>d.&nbsp;&nbsp;&nbsp;{q.optionD}</div>}
                </div>
              )}
              {q.type !== 'MCQ' && (
                 <div style={{ marginLeft: '30pt', marginTop: '10pt', marginBottom: '20pt', fontStyle: 'italic', fontSize: '9pt', color: '#555' }}>
                   [{q.type === 'SAQ' ? 'Short Answer' : 'Long Answer'} - Write your answer below or in the provided booklet]
                 </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // ─── PROFESSIONAL MBBS Print Layout ───────────────────────────

  const renderProfessionalMbbsPrint = () => {
    if (!generatedPaper || printAnswerKey) return null;

    const mcqs = generatedPaper.filter(q => q.type === 'MCQ');
    const saqs = generatedPaper.filter(q => q.type === 'SAQ');
    const laqs = generatedPaper.filter(q => q.type === 'LAQ');

    const mcqCount = mcqs.length;
    const mcqMarksEach = config.marksPerQuestion;
    const sectionATotal = config.sectionAMarks;

    return (
      <div className="hidden print:block" style={{ fontFamily: "'Times New Roman', Times, serif", color: 'black' }}>

        {/* ═══ HEADER ═══ */}
        <div>
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '6pt' }}>
            <img src={aiimsLogo.src} alt="AIIMS Kalyani" className="print-logo" style={{ display: 'inline-block', width: '55pt', height: 'auto' }} />
          </div>
          <div style={{ textAlign: 'center', fontSize: '14pt', fontWeight: 'bold', marginBottom: '1pt' }}>
            All India Institute of Medical Sciences, Kalyani
          </div>
          <div style={{ textAlign: 'center', fontSize: '12pt', fontWeight: 'bold', marginBottom: '6pt' }}>
            {config.examName}, {config.examMonth}
          </div>

          {/* Time / Subject / Marks row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '10pt', marginBottom: '2pt' }}>
            <div><strong>Time: {config.timeAllowed}</strong></div>
            <div style={{ textAlign: 'center', fontSize: '11pt', fontWeight: 'bold' }}>
              {config.subjectName} ({config.paperNumber})
            </div>
            <div><strong>Marks: {config.maxMarks}</strong></div>
          </div>

          {/* Separator line */}
          <hr style={{ border: 'none', borderTop: '1pt solid black', margin: '4pt 0' }} />

          {/* ═══ SECTION A (MCQs) ═══ */}
          {mcqs.length > 0 && (
            <div style={{ marginBottom: '20pt' }}>
              {/* Instructions & Enrollment No */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9.5pt', marginBottom: '4pt' }}>
                <div style={{ flex: 1 }}>
                  <strong>Instructions for Section-A:</strong>
                  <ul style={{ paddingLeft: '14pt', margin: '2pt 0', listStyleType: 'disc', lineHeight: 1.4 }}>
                    <li>Answer all questions &amp; each question carries ONE mark.</li>
                    <li>Please mark your answers in the OMR sheet as per the instructions.</li>
                    <li>Section A should be answered in first 20 minutes of the Exam duration. Both MCQ Question Paper and filled in OMR sheet should be handed over to the invigilators.</li>
                    <li>Please do not write (or) put ✓ mark on the Question Paper.</li>
                  </ul>
                </div>
                <div style={{ textAlign: 'right', whiteSpace: 'nowrap', marginLeft: '12pt' }}>
                  <strong>Enrolment No.:</strong>&nbsp;
                  <span className="print-enrollment-box">&nbsp;</span>
                </div>
              </div>

              {/* Section Title */}
              <div className="print-section-title" style={{ marginTop: '10pt' }}>
                SECTION – A ({sectionATotal} MARKS)
              </div>

              {/* Multiple Choice Questions heading */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10pt', marginBottom: '8pt' }}>
                <div><strong>Multiple Choice Questions:</strong></div>
                <div style={{ textAlign: 'right' }}><strong>[{mcqCount}×{mcqMarksEach}={mcqCount * mcqMarksEach}]</strong></div>
              </div>

              {/* Questions in 2-column layout */}
              <div className="print-two-col" style={{ fontSize: '9.5pt' }}>
                {mcqs.map((q, idx) => (
                  <div key={idx} className="print-avoid-break" style={{ marginBottom: '10pt' }}>
                    <div style={{ display: 'flex', gap: '4pt' }}>
                      <span style={{ minWidth: '16pt', fontWeight: 'normal' }}>{idx + 1}.</span>
                      <span style={{ textAlign: 'justify', flex: 1 }}>{q.question}</span>
                    </div>
                    <div style={{ marginLeft: '22pt', marginTop: '2pt' }}>
                      {q.optionA && <div style={{ marginBottom: '1pt' }}>a.&nbsp;&nbsp;{q.optionA}</div>}
                      {q.optionB && <div style={{ marginBottom: '1pt' }}>b.&nbsp;&nbsp;{q.optionB}</div>}
                      {q.optionC && <div style={{ marginBottom: '1pt' }}>c.&nbsp;&nbsp;{q.optionC}</div>}
                      {q.optionD && <div style={{ marginBottom: '1pt' }}>d.&nbsp;&nbsp;{q.optionD}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ SECTION B (SAQs) ═══ */}
          {saqs.length > 0 && (
            <div style={{ marginTop: '16pt', marginBottom: '20pt' }}>
              <div className="print-section-title">
                SECTION – B ({config.sectionBMarks} MARKS)
              </div>
              <div style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '8pt' }}>
                Short Answer Questions:
              </div>
              
              <div style={{ fontSize: '10.5pt' }}>
                {saqs.map((q, idx) => (
                  <div key={idx} className="print-avoid-break" style={{ marginBottom: '12pt' }}>
                    <div style={{ display: 'flex', gap: '6pt', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '6pt' }}>
                        <span style={{ fontWeight: 'normal', minWidth: '16pt' }}>{idx + 1}.</span>
                        <span style={{ textAlign: 'justify' }}>{q.question}</span>
                      </div>
                      <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '10pt' }}>
                        [{q.marks} Marks]
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ SECTION C (LAQs) ═══ */}
          {laqs.length > 0 && (
            <div style={{ marginTop: '16pt', marginBottom: '20pt' }}>
              <div className="print-section-title">
                SECTION – C ({config.sectionCMarks} MARKS)
              </div>
              <div style={{ fontSize: '10pt', fontWeight: 'bold', marginBottom: '8pt' }}>
                Long Answer Questions:
              </div>
              
              <div style={{ fontSize: '10.5pt' }}>
                {laqs.map((q, idx) => (
                  <div key={idx} className="print-avoid-break" style={{ marginBottom: '14pt' }}>
                    <div style={{ display: 'flex', gap: '6pt', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', gap: '6pt' }}>
                        <span style={{ fontWeight: 'normal', minWidth: '16pt' }}>{idx + 1}.</span>
                        <span style={{ textAlign: 'justify' }}>{q.question}</span>
                      </div>
                      <div style={{ fontWeight: 'bold', whiteSpace: 'nowrap', marginLeft: '10pt' }}>
                        [{q.marks} Marks]
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // SCREEN UI
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up print:p-0 print:m-0 print:max-w-none print:w-full print:space-y-0">

      {/* ─── Print Views (Hidden on screen) ─── */}
      {config.paperType === 'final-exam' && renderFinalExamPrint()}
      {config.paperType === 'professional-mbbs' && renderProfessionalMbbsPrint()}
      {renderAnswerKeyPrint()}

      {/* ─── Column Mapping Modal ─── */}
      {renderColumnMappingModal()}

      {/* ─── Restore Draft Prompt ─── */}
      {showRestorePrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <RotateCcw className="text-blue-600" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Restore Previous Session?</h3>
            <p className="text-sm text-slate-500 mb-6">
              You have a saved draft from a previous session. Would you like to restore it?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={discardDraft}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl text-sm font-medium transition-colors border border-slate-200"
              >
                Discard
              </button>
              <button
                onClick={restoreDraft}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors shadow-md"
              >
                Restore Draft
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Screen View (Hidden on print) ─── */}
      <div className="print:hidden space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Offline Question Paper Generator</h1>
            <p className="text-slate-500">
              Compile a massive final exam from multiple subjects securely on your device.
              <span className="text-emerald-600 ml-2 font-medium">100% offline - no data leaves your browser.</span>
            </p>
          </div>
          <button
            onClick={downloadTemplate}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors border border-emerald-200 shrink-0"
          >
            <Download size={16} />
            Download Template
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ─── Left Column: Upload & Config ─── */}
          <div className="space-y-6">

            {/* Paper Type Selector */}
            <div className="glass p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Settings2 size={20} className="text-blue-500" />
                <h2 className="text-xl font-bold text-slate-900">Paper Format</h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfig(prev => ({ ...prev, paperType: 'final-exam' }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${config.paperType === 'final-exam'
                    ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <ClipboardList size={24} className={config.paperType === 'final-exam' ? 'text-blue-600 mb-2' : 'text-slate-400 mb-2'} />
                  <div className="font-bold text-sm text-slate-900">Final Exam</div>
                  <div className="text-xs text-slate-500 mt-1">TEST BOOKLET format with cover page</div>
                </button>

                <button
                  onClick={() => setConfig(prev => ({ ...prev, paperType: 'professional-mbbs' }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${config.paperType === 'professional-mbbs'
                    ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                >
                  <GraduationCap size={24} className={config.paperType === 'professional-mbbs' ? 'text-blue-600 mb-2' : 'text-slate-400 mb-2'} />
                  <div className="font-bold text-sm text-slate-900">Professional MBBS</div>
                  <div className="text-xs text-slate-500 mt-1">Multi-section with MCQs, SAQs, LAQs</div>
                </button>
              </div>
            </div>

            {/* Configuration Fields */}
            <div className="glass p-6 rounded-2xl border border-slate-200">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info size={16} className="text-blue-500" />
                Paper Details
              </h2>

              <div className="space-y-3">
                {config.paperType === 'final-exam' ? (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Examination Title</label>
                      <input
                        type="text"
                        value={config.examTitle}
                        onChange={(e) => setConfig(prev => ({ ...prev, examTitle: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Time Allowed</label>
                        <input
                          type="text"
                          value={config.timeAllowed}
                          onChange={(e) => setConfig(prev => ({ ...prev, timeAllowed: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Max. Marks</label>
                        <input
                          type="number"
                          value={config.maxMarks}
                          onChange={(e) => setConfig(prev => ({ ...prev, maxMarks: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Marks/Question</label>
                        <input
                          type="number"
                          value={config.marksPerQuestion}
                          onChange={(e) => setConfig(prev => ({ ...prev, marksPerQuestion: parseInt(e.target.value) || 1 }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Exam Month/Year</label>
                        <input
                          type="text"
                          value={config.examMonth}
                          onChange={(e) => setConfig(prev => ({ ...prev, examMonth: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Negative Marking</label>
                      <input
                        type="text"
                        value={config.negativeMarking}
                        onChange={(e) => setConfig(prev => ({ ...prev, negativeMarking: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Examination Name</label>
                      <input
                        type="text"
                        value={config.examName}
                        onChange={(e) => setConfig(prev => ({ ...prev, examName: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Subject</label>
                        <input
                          type="text"
                          value={config.subjectName}
                          onChange={(e) => setConfig(prev => ({ ...prev, subjectName: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Paper Number</label>
                        <input
                          type="text"
                          value={config.paperNumber}
                          onChange={(e) => setConfig(prev => ({ ...prev, paperNumber: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Time</label>
                        <input
                          type="text"
                          value={config.timeAllowed}
                          onChange={(e) => setConfig(prev => ({ ...prev, timeAllowed: e.target.value }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Total Marks</label>
                        <input
                          type="number"
                          value={config.maxMarks}
                          onChange={(e) => setConfig(prev => ({ ...prev, maxMarks: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 mb-1 block">Exam Month/Year</label>
                      <input
                        type="text"
                        value={config.examMonth}
                        onChange={(e) => setConfig(prev => ({ ...prev, examMonth: e.target.value }))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Section A</label>
                        <input
                          type="number"
                          value={config.sectionAMarks}
                          onChange={(e) => setConfig(prev => ({ ...prev, sectionAMarks: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Section B</label>
                        <input
                          type="number"
                          value={config.sectionBMarks}
                          onChange={(e) => setConfig(prev => ({ ...prev, sectionBMarks: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-600 mb-1 block">Section C</label>
                        <input
                          type="number"
                          value={config.sectionCMarks}
                          onChange={(e) => setConfig(prev => ({ ...prev, sectionCMarks: parseInt(e.target.value) || 0 }))}
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Upload Section */}
            <div className="glass p-6 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-xl font-bold text-slate-900">Upload Question Banks</h2>
                <div className="relative group">
                  <Info size={18} className="text-slate-400 hover:text-blue-500 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                    <strong>Schema Required:</strong><br/>
                    • <code>Question</code> (Required)<br/>
                    • <code>Type</code> (Optional: MCQ, SAQ, LAQ. Default: MCQ)<br/>
                    • <code>Option A, B, C, D</code> (Optional, for MCQs)<br/>
                    • <code>Correct Answer</code> (Optional, for MCQs)<br/>
                    • <code>Marks</code> (Optional)<br/>
                    • <code>Difficulty</code> (Optional: Easy, Medium, Hard)<br/>
                    • <code>Topic</code> (Optional)
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </div>

              {/* Selection Mode Toggle */}
              <div className="flex items-center gap-2 mb-4 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectionMode('random')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${
                    selectionMode === 'random'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Shuffle size={14} /> Random Pick
                </button>
                <button
                  onClick={() => setSelectionMode('manual')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-bold transition-all ${
                    selectionMode === 'manual'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <CheckCircle2 size={14} /> Manual Select
                </button>
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
                  <h3 className="font-bold text-slate-700 mb-2">
                    {selectionMode === 'random' ? 'Configure Extractions:' : 'Select Questions:'}
                  </h3>

                  {/* Filters (for manual mode) */}
                  {selectionMode === 'manual' && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Filter size={12} /> Filters
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
                        >
                          <option value="all">All Types</option>
                          <option value="MCQ">MCQ</option>
                          <option value="SAQ">SAQ</option>
                          <option value="LAQ">LAQ</option>
                        </select>
                        <select
                          value={filterDifficulty}
                          onChange={(e) => setFilterDifficulty(e.target.value)}
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
                        >
                          <option value="all">All Difficulty</option>
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        <select
                          value={filterTopic}
                          onChange={(e) => setFilterTopic(e.target.value)}
                          className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-slate-700"
                        >
                          <option value="all">All Topics</option>
                          {allTopics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="relative">
                        <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search questions..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-slate-700 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                  )}

                  {uploadedBanks.map(bank => {
                    const totalMCQs = bank.questions.filter(q => q.type === 'MCQ').length;
                    const totalSAQs = bank.questions.filter(q => q.type === 'SAQ').length;
                    const totalLAQs = bank.questions.filter(q => q.type === 'LAQ').length;
                    const isExpanded = expandedBankId === bank.id;
                    const filteredQuestions = getFilteredQuestions(bank.questions);
                    const selectedCount = bank.questions.filter(q => q.selected).length;

                    return (
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
                        
                        {selectionMode === 'random' ? (
                          /* Random mode: extraction controls */
                          <div className="space-y-2 mt-3">
                            {totalMCQs > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded">
                                  {totalMCQs} MCQs available
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-700">Extract:</span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={totalMCQs}
                                    value={bank.targetMCQ}
                                    onChange={(e) => updateTargetCount(bank.id, 'MCQ', parseInt(e.target.value) || 0)}
                                    className="w-16 text-center bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            )}
                            
                            {totalSAQs > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded">
                                  {totalSAQs} SAQs available
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-700">Extract:</span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={totalSAQs}
                                    value={bank.targetSAQ}
                                    onChange={(e) => updateTargetCount(bank.id, 'SAQ', parseInt(e.target.value) || 0)}
                                    className="w-16 text-center bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            )}

                            {totalLAQs > 0 && (
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded">
                                  {totalLAQs} LAQs available
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-700">Extract:</span>
                                  <input
                                    type="number"
                                    min={0}
                                    max={totalLAQs}
                                    value={bank.targetLAQ}
                                    onChange={(e) => updateTargetCount(bank.id, 'LAQ', parseInt(e.target.value) || 0)}
                                    className="w-16 text-center bg-white border border-slate-300 rounded px-2 py-1 text-sm text-slate-900 focus:outline-none focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          /* Manual mode: question list with checkboxes */
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-slate-500 font-medium">{selectedCount}/{bank.questions.length} selected</span>
                              <div className="flex gap-2">
                                <button onClick={() => selectAllInBank(bank.id, true)} className="text-xs text-blue-600 hover:underline font-medium">Select All</button>
                                <button onClick={() => selectAllInBank(bank.id, false)} className="text-xs text-slate-500 hover:underline font-medium">Deselect All</button>
                                <button
                                  onClick={() => setExpandedBankId(isExpanded ? null : bank.id)}
                                  className="text-xs text-slate-500 hover:text-slate-700"
                                >
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="max-h-60 overflow-y-auto space-y-1.5 border-t border-slate-200 pt-2">
                                {filteredQuestions.map(q => (
                                  <label key={q.id} className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors ${q.selected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-slate-100 border border-transparent'}`}>
                                    <input
                                      type="checkbox"
                                      checked={q.selected || false}
                                      onChange={() => toggleQuestionSelection(bank.id, q.id!)}
                                      className="mt-0.5 accent-blue-600"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs text-slate-800 line-clamp-2">{q.question}</p>
                                      <div className="flex gap-1.5 mt-1">
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${q.type === 'MCQ' ? 'bg-blue-100 text-blue-700' : q.type === 'SAQ' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'}`}>{q.type}</span>
                                        {q.difficulty && <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{q.difficulty}</span>}
                                        {q.topic && <span className="text-[10px] text-slate-500 bg-slate-200 px-1.5 py-0.5 rounded">{q.topic}</span>}
                                      </div>
                                    </div>
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Generate Section */}
            {uploadedBanks.length > 0 && (
              <div className="glass p-6 rounded-2xl border border-slate-200 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Finalize & Generate</h2>

                <div className="space-y-4">
                  <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm font-bold flex justify-between items-center border border-blue-100">
                    <span>Total Output Size:</span>
                    <span className="text-lg">
                      {selectionMode === 'manual'
                        ? uploadedBanks.reduce((sum, b) => sum + b.questions.filter(q => q.selected).length, 0)
                        : uploadedBanks.reduce((sum, b) => sum + b.targetMCQ + b.targetSAQ + b.targetLAQ, 0)
                      } Questions
                    </span>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-slate-600 mb-1">
                      Security Watermark
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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <FileText size={18} />
                    Compile Master Paper
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── Right Column: Preview ─── */}
          <div className="lg:col-span-2">
            <div className="glass p-6 rounded-2xl border border-slate-200 h-full min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {generatedPaper ? 'Generated Master Paper' : 'Question Bank Preview'}
                </h2>

                {generatedPaper && (
                  <div className="flex gap-2 flex-wrap justify-end">
                    <button
                      onClick={() => exportToWord(config, generatedPaper, aiimsLogo.src)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-blue-200"
                    >
                      <FileText size={14} />
                      Word (.docx)
                    </button>
                    <button
                      onClick={handleSecureExport}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-indigo-200"
                    >
                      <Lock size={14} />
                      Encrypted (.enc)
                    </button>
                    <button
                      onClick={handlePrint}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-300"
                    >
                      <Printer size={14} />
                      PDF / Print
                    </button>
                    <button
                      onClick={handlePrintAnswerKey}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-emerald-200"
                    >
                      <Key size={14} />
                      Answer Key
                    </button>
                    <button
                      onClick={randomizeOrder}
                      className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-amber-200"
                      title="Shuffle the order of all questions randomly"
                    >
                      <Shuffle size={14} />
                      Randomize
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-auto pr-2 custom-scrollbar">
                {generatedPaper ? (
                  <div className="space-y-4">
                    {/* Format badge */}
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                        {config.paperType === 'final-exam' ? '📋 Final Exam (Test Booklet)' : '🎓 Professional MBBS'}
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                        {generatedPaper.length} Questions • {config.maxMarks} Marks • {config.timeAllowed}
                      </span>
                      <span className="bg-amber-100 text-amber-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1">
                        <Edit3 size={10} /> Click questions to edit • Drag to reorder
                      </span>
                    </div>

                    {generatedPaper.map((q, idx) => (
                      <div
                        key={idx}
                        className={`bg-slate-50 border rounded-xl p-4 transition-all ${
                          dragOverIdx === idx ? 'border-blue-400 bg-blue-50 shadow-md' : 'border-slate-200'
                        } ${dragIdx === idx ? 'opacity-50' : ''}`}
                        draggable
                        onDragStart={() => handleDragStart(idx)}
                        onDragOver={(e) => handleDragOver(e, idx)}
                        onDrop={() => handleDrop(idx)}
                        onDragEnd={handleDragEnd}
                      >
                        {/* Top row: drag handle, subject badge, marks, swap */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0">
                            <GripVertical size={16} />
                          </div>
                          <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded">
                            {q.subject}
                          </span>
                          {q.difficulty && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                              {q.difficulty}
                            </span>
                          )}
                          <div className="flex-1" />
                          <span className="text-sm text-slate-500 font-medium whitespace-nowrap bg-white px-2 py-0.5 rounded border border-slate-200">
                            {q.marks} Mark{q.marks !== 1 ? 's' : ''}
                          </span>
                          <button
                            onClick={() => swapQuestion(idx)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors shrink-0"
                            title="Swap with another random question"
                          >
                            <ArrowLeftRight size={14} />
                          </button>
                        </div>

                        {/* Question content */}
                        <div className="flex gap-3 text-slate-900 mb-3 ml-6">
                          <span className="font-bold text-blue-600 shrink-0">Q{idx + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-lg">
                              <EditableText value={q.question} idx={idx} field="question" />
                            </div>
                            {q.type !== 'MCQ' && (
                              <span className="inline-block mt-2 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {q.type === 'SAQ' ? 'Short Answer' : 'Long Answer'}
                              </span>
                            )}
                          </div>
                        </div>

                        {q.type === 'MCQ' && (
                          <div className="ml-6">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex-1" />
                              <button
                                onClick={() => shuffleOptionsForQuestion(idx)}
                                className="flex items-center gap-1 text-xs text-slate-400 hover:text-amber-600 hover:bg-amber-50 px-2 py-1 rounded-lg transition-colors"
                                title="Shuffle options A/B/C/D for this question"
                              >
                                <Shuffle size={12} />
                                Shuffle Options
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                              {q.optionA && (
                                <div className={`p-2 rounded border border-slate-200 bg-white ${q.correctAnswer?.toLowerCase() === 'a' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                                  <span className="text-slate-500 font-bold mr-2">A)</span>
                                  <EditableText value={q.optionA} idx={idx} field="optionA" className="text-slate-700 font-medium" />
                                </div>
                              )}
                              {q.optionB && (
                                <div className={`p-2 rounded border border-slate-200 bg-white ${q.correctAnswer?.toLowerCase() === 'b' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                                  <span className="text-slate-500 font-bold mr-2">B)</span>
                                  <EditableText value={q.optionB} idx={idx} field="optionB" className="text-slate-700 font-medium" />
                                </div>
                              )}
                              {q.optionC && (
                                <div className={`p-2 rounded border border-slate-200 bg-white ${q.correctAnswer?.toLowerCase() === 'c' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                                  <span className="text-slate-500 font-bold mr-2">C)</span>
                                  <EditableText value={q.optionC} idx={idx} field="optionC" className="text-slate-700 font-medium" />
                                </div>
                              )}
                              {q.optionD && (
                                <div className={`p-2 rounded border border-slate-200 bg-white ${q.correctAnswer?.toLowerCase() === 'd' ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                                  <span className="text-slate-500 font-bold mr-2">D)</span>
                                  <EditableText value={q.optionD} idx={idx} field="optionD" className="text-slate-700 font-medium" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : uploadedBanks.length > 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <Library size={48} className="mb-4 opacity-50" />
                    <p className="font-medium text-lg">Banks Loaded ({uploadedBanks.reduce((s, b) => s + b.questions.length, 0)} total Qs)</p>
                    <p className="text-sm mt-2">
                      {selectionMode === 'random'
                        ? "Adjust quantities on the left and click 'Compile Master Paper'"
                        : "Select questions on the left and click 'Compile Master Paper'"
                      }
                    </p>
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
