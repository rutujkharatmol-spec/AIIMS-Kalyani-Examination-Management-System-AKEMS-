'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, RefreshCw, Printer, Lock, Trash2, Library, Info, Settings2, GraduationCap, ClipboardList } from 'lucide-react';
import * as XLSX from 'xlsx';
import aiimsLogo from '@/assets/aiims-kalyani-logo.png';

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

// ─── Component ────────────────────────────────────────────────────

export default function OfflineGeneratorPage() {
  const [uploadedBanks, setUploadedBanks] = useState<QuestionBank[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [watermark, setWatermark] = useState<string>('CONFIDENTIAL - DO NOT COPY');
  const [password, setPassword] = useState<string>('');
  const [generatedPaper, setGeneratedPaper] = useState<Question[] | null>(null);

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

  useEffect(() => {
    if (!XLSX) {
      console.error("XLSX library failed to load");
    }
  }, []);

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

        if (jsonData.length < 2) continue;

        const headers = jsonData[0].map(h => String(h).toLowerCase().trim());
        const qIdx = headers.findIndex(h => h.includes('question') && !h.includes('type'));
        const aIdx = headers.findIndex(h => h.includes('option a') || h === 'a');
        const bIdx = headers.findIndex(h => h.includes('option b') || h === 'b');
        const cIdx = headers.findIndex(h => h.includes('option c') || h === 'c');
        const dIdx = headers.findIndex(h => h.includes('option d') || h === 'd');
        const ansIdx = headers.findIndex(h => h.includes('correct') || h.includes('answer'));
        const marksIdx = headers.findIndex(h => h.includes('mark'));
        const typeIdx = headers.findIndex(h => h.includes('type'));

        if (qIdx === -1) {
          throw new Error(`File ${file.name} is missing a 'Question' column.`);
        }

        const parsedQuestions: Question[] = [];
        const subjectName = file.name.replace(/\.[^/.]+$/, "");

        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i];
          if (!row || !row[qIdx]) continue;
          
          let qType: 'MCQ' | 'SAQ' | 'LAQ' = 'MCQ';
          if (typeIdx !== -1 && row[typeIdx]) {
            const t = String(row[typeIdx]).trim().toUpperCase();
            if (t === 'SAQ' || t === 'LAQ') {
              qType = t;
            }
          }

          parsedQuestions.push({
            id: `Q${i}_${Math.random().toString(36).substr(2, 5)}`,
            question: String(row[qIdx] || ''),
            optionA: aIdx !== -1 ? String(row[aIdx] || '') : undefined,
            optionB: bIdx !== -1 ? String(row[bIdx] || '') : undefined,
            optionC: cIdx !== -1 ? String(row[cIdx] || '') : undefined,
            optionD: dIdx !== -1 ? String(row[dIdx] || '') : undefined,
            correctAnswer: ansIdx !== -1 ? String(row[ansIdx] || '') : undefined,
            marks: (marksIdx !== -1 && row[marksIdx]) ? Number(row[marksIdx]) : (qType === 'MCQ' ? 1 : (qType === 'SAQ' ? 5 : 10)),
            subject: subjectName,
            type: qType
          });
        }

        if (parsedQuestions.length > 0) {
          const mcqCount = parsedQuestions.filter(q => q.type === 'MCQ').length;
          const saqCount = parsedQuestions.filter(q => q.type === 'SAQ').length;
          const laqCount = parsedQuestions.filter(q => q.type === 'LAQ').length;

          newBanks.push({
            id: Math.random().toString(36).substr(2, 9),
            filename: file.name,
            questions: parsedQuestions,
            targetMCQ: Math.min(10, mcqCount),
            targetSAQ: Math.min(2, saqCount),
            targetLAQ: Math.min(1, laqCount)
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

  // ─── Generate Paper ───────────────────────────────────────────

  const generatePaper = () => {
    if (uploadedBanks.length === 0) return;

    let allSelectedQuestions: Question[] = [];

    uploadedBanks.forEach(bank => {
      // Group questions by type
      const mcqs = bank.questions.filter(q => q.type === 'MCQ');
      const saqs = bank.questions.filter(q => q.type === 'SAQ');
      const laqs = bank.questions.filter(q => q.type === 'LAQ');

      // Helper to process and shuffle a specific type
      const processQuestions = (questions: Question[], count: number, shuffleOptions: boolean) => {
        if (count === 0) return [];
        
        let processed = [...questions];

        // Map and shuffle options for MCQs
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

            // Fisher-Yates shuffle for options
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

        // Fisher-Yates shuffle for question order
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

    setGeneratedPaper(allSelectedQuestions);
  };

  // ─── Export Handlers ──────────────────────────────────────────

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

  // ═══════════════════════════════════════════════════════════════
  // PRINT LAYOUTS
  // ═══════════════════════════════════════════════════════════════

  // ─── FINAL EXAM (TEST BOOKLET) Print Layout ───────────────────

  const renderFinalExamPrint = () => {
    if (!generatedPaper) return null;

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
    if (!generatedPaper) return null;

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
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in-up">

      {/* ─── Print Views (Hidden on screen) ─── */}
      {config.paperType === 'final-exam' && renderFinalExamPrint()}
      {config.paperType === 'professional-mbbs' && renderProfessionalMbbsPrint()}

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
                  {uploadedBanks.map(bank => {
                    const totalMCQs = bank.questions.filter(q => q.type === 'MCQ').length;
                    const totalSAQs = bank.questions.filter(q => q.type === 'SAQ').length;
                    const totalLAQs = bank.questions.filter(q => q.type === 'LAQ').length;

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
                    <span className="text-lg">{uploadedBanks.reduce((sum, b) => sum + b.targetMCQ + b.targetSAQ + b.targetLAQ, 0)} Questions</span>
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
                  <div className="flex gap-3">
                    <button
                      onClick={handleSecureExport}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-indigo-200"
                    >
                      <Lock size={16} />
                      Export Encrypted (.enc)
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
                    {/* Format badge */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                        {config.paperType === 'final-exam' ? '📋 Final Exam (Test Booklet)' : '🎓 Professional MBBS'}
                      </span>
                      <span className="bg-slate-100 text-slate-600 text-xs font-medium px-3 py-1 rounded-full">
                        {generatedPaper.length} Questions • {config.maxMarks} Marks • {config.timeAllowed}
                      </span>
                    </div>

                    {generatedPaper.map((q, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
                        <div className="absolute top-0 right-0 bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">
                          {q.subject}
                        </div>
                        <div className="flex gap-3 text-slate-900 mb-3 mt-2">
                          <span className="font-bold text-blue-600">Q{idx + 1}.</span>
                          <div className="flex-1">
                            <p className="font-bold text-lg pr-4">{q.question}</p>
                            {q.type !== 'MCQ' && (
                              <span className="inline-block mt-2 text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {q.type === 'SAQ' ? 'Short Answer' : 'Long Answer'}
                              </span>
                            )}
                          </div>
                          <span className="ml-auto text-sm text-slate-500 font-medium whitespace-nowrap bg-white px-2 py-1 rounded border border-slate-200 h-fit">
                            {q.marks} Mark{q.marks !== 1 ? 's' : ''}
                          </span>
                        </div>

                        {q.type === 'MCQ' && (
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
                        )}
                      </div>
                    ))}
                  </div>
                ) : uploadedBanks.length > 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <Library size={48} className="mb-4 opacity-50" />
                    <p className="font-medium text-lg">Banks Loaded ({uploadedBanks.reduce((s, b) => s + b.questions.length, 0)} total Qs)</p>
                    <p className="text-sm mt-2">Adjust quantities on the left and click &apos;Compile Master Paper&apos;</p>
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
