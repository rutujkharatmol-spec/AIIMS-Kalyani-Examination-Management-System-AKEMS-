import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  SectionType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  PageBorderDisplay,
  PageBorderZOrder,
  PageBorderOffsetFrom,
} from "docx";
import { saveAs } from "file-saver";

// Match standard Word page borders offset from text
const pageBorders = {
  pageBorders: {
    display: PageBorderDisplay.ALL_PAGES,
    zOrder: PageBorderZOrder.FRONT,
    offsetFrom: PageBorderOffsetFrom.TEXT,
  },
  pageBorderTop: { style: BorderStyle.SINGLE, space: 24, size: 12, color: "000000" },
  pageBorderRight: { style: BorderStyle.SINGLE, space: 24, size: 12, color: "000000" },
  pageBorderBottom: { style: BorderStyle.SINGLE, space: 24, size: 12, color: "000000" },
  pageBorderLeft: { style: BorderStyle.SINGLE, space: 24, size: 12, color: "000000" },
};

const pageMargins = { top: 1440, right: 1440, bottom: 1440, left: 1440 };
const FULL_WIDTH = 9360;

export const exportToWord = async (
  config: any,
  generatedPaper: any[],
  logoSrc: string
) => {
  let logoArrayBuffer: ArrayBuffer | null = null;
  try {
    const res = await fetch(logoSrc);
    const blob = await res.blob();
    logoArrayBuffer = await blob.arrayBuffer();
  } catch (error) {
    console.error("Failed to fetch logo for DOCX embedding:", error);
  }

  if (config.paperType === 'final-exam') {
    // For Final Exam, generate ONLY the questions, then merge with FINAL_FOR_PRINT.docx template via API
    const questionsDoc = new Document({
      sections: buildFinalExamQuestionsOnly(generatedPaper)
    });
    
    const base64String = await Packer.toBase64String(questionsDoc);
    
    try {
      const response = await fetch('/api/merge-docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionsBase64: base64String }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to merge docx');
      }
      
      const blob = await response.blob();
      saveAs(blob, `${config.examTitle}_Paper.docx`);
    } catch (e) {
      console.error(e);
      alert('Error merging with template DOCX.');
    }
  } else {
    // For Professional MBBS, build full doc client-side
    const doc = new Document({
      sections: buildProfessionalMbbsSections(config, generatedPaper, logoArrayBuffer)
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${config.subjectName}_Paper.docx`);
  }
};

// ─── FINAL EXAM (QUESTIONS ONLY) ─────────────────────────────────

const buildFinalExamQuestionsOnly = (paper: any[]): any[] => {
  const sections: any[] = [];
  const questionChildren: any[] = [];

  paper.forEach((q, idx) => {
    questionChildren.push(
      new Paragraph({
        pageBreakBefore: idx === 0,
        spacing: { after: 60, before: idx === 0 ? 0 : 240 },
        indent: { left: 400, hanging: 400 },
        children: [
          new TextRun({ text: `${idx + 1}. `, bold: true, size: 20, font: "Arial" }),
          new TextRun({ text: q.question, bold: true, size: 20, font: "Arial" })
        ]
      })
    );

    if (q.type === 'MCQ') {
      const options = [];
      if (q.optionA) options.push(`(a) ${q.optionA}`);
      if (q.optionB) options.push(`(b) ${q.optionB}`);
      if (q.optionC) options.push(`(c) ${q.optionC}`);
      if (q.optionD) options.push(`(d) ${q.optionD}`);
      
      options.forEach(opt => {
        questionChildren.push(
          new Paragraph({
            indent: { left: 800 },
            spacing: { after: 40 },
            children: [new TextRun({ text: opt, size: 20, font: "Arial" })]
          })
        );
      });
    } else {
      questionChildren.push(
        new Paragraph({
          indent: { left: 800 },
          spacing: { after: 40 },
          children: [new TextRun({ text: `[${q.type === 'SAQ' ? 'Short Answer' : 'Long Answer'} - Write your answer below]`, size: 18, italics: true, color: "555555", font: "Arial" })]
        })
      );
    }
  });

  sections.push({
    properties: {
      type: SectionType.NEXT_PAGE,
      page: { margin: pageMargins, borders: pageBorders },
    },
    children: questionChildren
  });

  return sections;
};

// ─── PROFESSIONAL MBBS BUILDER ───────────────────────────────────

const buildProfessionalMbbsSections = (config: any, paper: any[], logo: ArrayBuffer | null): any[] => {
  const sections: any[] = [];
  const mcqs = paper.filter(q => q.type === 'MCQ');
  const saqs = paper.filter(q => q.type === 'SAQ');
  const laqs = paper.filter(q => q.type === 'LAQ');

  const headerChildren: any[] = [];

  if (logo) {
    headerChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [
          new ImageRun({
            data: logo,
            transformation: { width: 75, height: 75 }
          })
        ]
      })
    );
  }

  headerChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [new TextRun({ text: "All India Institute of Medical Sciences, Kalyani", bold: true, size: 28, font: "Arial" })]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 120 },
      children: [new TextRun({ text: `${config.examName}, ${config.examMonth}`, bold: true, size: 24, font: "Arial" })]
    })
  );

  headerChildren.push(
    new Table({
      width: { size: FULL_WIDTH, type: WidthType.DXA },
      borders: {
        top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        bottom: { style: BorderStyle.SINGLE, size: 12, color: "000000" },
        left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
        insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: Math.floor(FULL_WIDTH * 0.3), type: WidthType.DXA },
              margins: { bottom: 100 },
              children: [new Paragraph({ children: [new TextRun({ text: `Time: ${config.timeAllowed}`, bold: true, size: 20, font: "Arial" })] })]
            }),
            new TableCell({
              width: { size: Math.floor(FULL_WIDTH * 0.4), type: WidthType.DXA },
              margins: { bottom: 100 },
              children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: `${config.subjectName} (${config.paperNumber})`, bold: true, size: 22, font: "Arial" })] })]
            }),
            new TableCell({
              width: { size: Math.floor(FULL_WIDTH * 0.3), type: WidthType.DXA },
              margins: { bottom: 100 },
              children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: `Marks: ${config.maxMarks}`, bold: true, size: 20, font: "Arial" })] })]
            })
          ]
        })
      ]
    })
  );

  sections.push({
    properties: {
      type: SectionType.CONTINUOUS,
      page: { margin: pageMargins, borders: pageBorders },
    },
    children: headerChildren
  });

  if (mcqs.length > 0) {
    const mcqChildren: any[] = [];
    
    mcqChildren.push(
      new Paragraph({ spacing: { before: 200, after: 100 } }),
      new Table({
        width: { size: FULL_WIDTH, type: WidthType.DXA },
        borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                width: { size: Math.floor(FULL_WIDTH * 0.7), type: WidthType.DXA },
                children: [
                  new Paragraph({ children: [new TextRun({ text: "Instructions for Section-A:", bold: true, size: 18, font: "Arial" })] }),
                  new Paragraph({ indent: { left: 360, hanging: 360 }, children: [new TextRun({ text: "• Answer all questions & each question carries ONE mark.", size: 18, font: "Arial" })] }),
                  new Paragraph({ indent: { left: 360, hanging: 360 }, children: [new TextRun({ text: "• Please mark your answers in the OMR sheet as per the instructions.", size: 18, font: "Arial" })] }),
                  new Paragraph({ indent: { left: 360, hanging: 360 }, children: [new TextRun({ text: "• Section A should be answered in first 20 minutes of the Exam duration.", size: 18, font: "Arial" })] }),
                  new Paragraph({ indent: { left: 360, hanging: 360 }, children: [new TextRun({ text: "• Please do not write (or) put ✓ mark on the Question Paper.", size: 18, font: "Arial" })] })
                ]
              }),
              new TableCell({
                width: { size: Math.floor(FULL_WIDTH * 0.3), type: WidthType.DXA },
                children: [
                  new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Enrolment No.: _____________", bold: true, size: 18, font: "Arial" })] })
                ]
              })
            ]
          })
        ]
      })
    );

    mcqChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 240, after: 160 },
        children: [new TextRun({ text: `SECTION – A (${config.sectionAMarks} MARKS)`, bold: true, underline: {}, size: 22, font: "Arial" })]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [
          new TextRun({ text: "Multiple Choice Questions:", bold: true, size: 20, font: "Arial" }),
          new TextRun({ text: `\t\t[${mcqs.length}×${config.marksPerQuestion}=${mcqs.length * config.marksPerQuestion}]`, bold: true, size: 20, font: "Arial" })
        ]
      })
    );

    mcqs.forEach((q, idx) => {
      mcqChildren.push(
        new Paragraph({
          spacing: { after: 40, before: 120 },
          indent: { left: 360, hanging: 360 },
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true, size: 18, font: "Arial" }),
            new TextRun({ text: q.question, bold: true, size: 18, font: "Arial" })
          ]
        })
      );
      
      const options = [];
      if (q.optionA) options.push(`(a) ${q.optionA}`);
      if (q.optionB) options.push(`(b) ${q.optionB}`);
      if (q.optionC) options.push(`(c) ${q.optionC}`);
      if (q.optionD) options.push(`(d) ${q.optionD}`);
      
      options.forEach(opt => {
        mcqChildren.push(
          new Paragraph({
            indent: { left: 720 },
            spacing: { after: 20 },
            children: [new TextRun({ text: opt, size: 18, font: "Arial" })]
          })
        );
      });
    });

    sections.push({
      properties: {
        type: SectionType.CONTINUOUS,
        column: { space: 708, count: 2 },
      },
      children: mcqChildren
    });
  }

  const nonMcqChildren: any[] = [];
  
  if (saqs.length > 0) {
    nonMcqChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 160 },
        children: [new TextRun({ text: `SECTION – B (${config.sectionBMarks} MARKS)`, bold: true, underline: {}, size: 22, font: "Arial" })]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: "Short Answer Questions:", bold: true, size: 20, font: "Arial" })]
      })
    );

    saqs.forEach((q, idx) => {
      nonMcqChildren.push(
        new Paragraph({
          spacing: { after: 200 },
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true, size: 20, font: "Arial" }),
            new TextRun({ text: q.question, bold: true, size: 20, font: "Arial" }),
            new TextRun({ text: `\t\t[${q.marks} Marks]`, bold: true, size: 20, font: "Arial" })
          ]
        })
      );
    });
  }

  if (laqs.length > 0) {
    nonMcqChildren.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 160 },
        children: [new TextRun({ text: `SECTION – C (${config.sectionCMarks} MARKS)`, bold: true, underline: {}, size: 22, font: "Arial" })]
      }),
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: "Long Answer Questions:", bold: true, size: 20, font: "Arial" })]
      })
    );

    laqs.forEach((q, idx) => {
      nonMcqChildren.push(
        new Paragraph({
          spacing: { after: 240 },
          children: [
            new TextRun({ text: `${idx + 1}. `, bold: true, size: 20, font: "Arial" }),
            new TextRun({ text: q.question, bold: true, size: 20, font: "Arial" }),
            new TextRun({ text: `\t\t[${q.marks} Marks]`, bold: true, size: 20, font: "Arial" })
          ]
        })
      );
    });
  }

  if (nonMcqChildren.length > 0) {
    sections.push({
      properties: {
        type: SectionType.CONTINUOUS,
        column: { count: 1 },
      },
      children: nonMcqChildren
    });
  }

  return sections;
};
