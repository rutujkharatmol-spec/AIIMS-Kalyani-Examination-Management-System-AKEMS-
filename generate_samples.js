const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'sample_data');
if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
}

// Utility to create directories
const createDir = (name) => {
    const dirPath = path.join(baseDir, name);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath);
    return dirPath;
};

// ---------------------------------------------------------
// 1. Question Banks (For Question Paper Generator)
// ---------------------------------------------------------
const qbDir = createDir('1_Question_Banks');
const subjects = [
  { name: 'Anatomy', questions: ["What is the longest bone in the human body?,Tibia,Fibula,Femur,Humerus,C,2"] },
  { name: 'Physiology', questions: ["What is the normal resting heart rate for adults?,40-50 bpm,60-100 bpm,110-130 bpm,140-160 bpm,B,2"] },
  { name: 'Pharmacology', questions: ["Which drug is a first-line treatment for anaphylaxis?,Epinephrine,Aspirin,Penicillin,Ibuprofen,A,2"] }
];

subjects.forEach(sub => {
  const content = ["Question,Option A,Option B,Option C,Option D,Correct Answer,Marks"];
  content.push(...sub.questions);
  for (let i = 2; i <= 20; i++) {
    content.push(`Dummy ${sub.name} Question ${i},Option A,Option B,Option C,Option D,A,2`);
  }
  fs.writeFileSync(path.join(qbDir, `${sub.name}_Bank.csv`), content.join('\n'));
});

// ---------------------------------------------------------
// 2. Seating Arrangement
// ---------------------------------------------------------
const seatingDir = createDir('2_Seating_Arrangement');

const seatingStudents = ["Roll No,Name"];
for(let i=1; i<=120; i++) {
  seatingStudents.push(`MBBS24${String(i).padStart(3, '0')},Student ${i}`);
}
fs.writeFileSync(path.join(seatingDir, 'Students_List.csv'), seatingStudents.join('\n'));

const seatingRooms = [
  "Room No,Capacity",
  "LT-1,50",
  "LT-2,50",
  "Auditorium,100",
  "Lab-A,30"
];
fs.writeFileSync(path.join(seatingDir, 'Rooms_Capacity.csv'), seatingRooms.join('\n'));

// ---------------------------------------------------------
// 3. Result Compiler
// ---------------------------------------------------------
const resultsDir = createDir('3_Result_Compiler');

const generateMarks = (subjectName) => {
    const marks = [`Roll No,Name,${subjectName} Score`];
    for(let i=1; i<=30; i++) {
        const score = Math.floor(Math.random() * 50) + 40; // 40-90
        marks.push(`MBBS24${String(i).padStart(3, '0')},Student ${i},${score}`);
    }
    return marks.join('\n');
};
fs.writeFileSync(path.join(resultsDir, 'Anatomy_Marks.csv'), generateMarks('Anatomy'));
fs.writeFileSync(path.join(resultsDir, 'Physiology_Marks.csv'), generateMarks('Physiology'));
fs.writeFileSync(path.join(resultsDir, 'Biochemistry_Marks.csv'), generateMarks('Biochemistry'));

// ---------------------------------------------------------
// 4. Hall Ticket Generator
// ---------------------------------------------------------
const hallTicketDir = createDir('4_Hall_Tickets');

const htStudents = ["Roll No,Name,Course,Year"];
for(let i=1; i<=50; i++) {
  htStudents.push(`MBBS24${String(i).padStart(3, '0')},Student ${i},MBBS,First Year`);
}
fs.writeFileSync(path.join(hallTicketDir, 'Eligible_Students.csv'), htStudents.join('\n'));

const timetable = [
  "Date,Time,Subject Code,Subject",
  "12/08/2026,10:00 AM - 01:00 PM,ANA101,Anatomy Paper I",
  "14/08/2026,10:00 AM - 01:00 PM,PHY101,Physiology Paper I",
  "16/08/2026,10:00 AM - 01:00 PM,BIO101,Biochemistry Paper I"
];
fs.writeFileSync(path.join(hallTicketDir, 'Exam_Timetable.csv'), timetable.join('\n'));

// ---------------------------------------------------------
// 5. Smart Duty Roster (Invigilators)
// ---------------------------------------------------------
const rosterDir = createDir('5_Smart_Duty_Roster');

const faculty = [
  "Faculty ID,Name,Department,Designation",
  "FAC001,Dr. John Doe,Anatomy,Professor",
  "FAC002,Dr. Jane Smith,Physiology,Associate Professor",
  "FAC003,Dr. Alice Brown,Biochemistry,Assistant Professor",
  "FAC004,Dr. Bob White,Pharmacology,Professor",
  "FAC005,Dr. Charlie Black,Pathology,Associate Professor"
];
fs.writeFileSync(path.join(rosterDir, 'Faculty_List.csv'), faculty.join('\n'));

const sessions = [
  "Session ID,Date,Shift,Rooms Required",
  "S1,12/08/2026,Morning,LT-1;LT-2",
  "S2,14/08/2026,Morning,LT-1;LT-2",
  "S3,16/08/2026,Morning,LT-1;LT-2"
];
fs.writeFileSync(path.join(rosterDir, 'Exam_Sessions.csv'), sessions.join('\n'));

// ---------------------------------------------------------
// 6. Double-Blind Evaluation
// ---------------------------------------------------------
const doubleBlindDir = createDir('6_Double_Blind');

const dbStudents = ["Roll No,Name"];
const dbMatrix = ["Roll No,Fictitious Code,Name"];
const dbEvaluated = ["Fictitious Code,Marks"];

for(let i=1; i<=50; i++) {
  const roll = `MBBS24${String(i).padStart(3, '0')}`;
  const name = `Student ${i}`;
  const code = `AK-${Math.random().toString(36).substring(2, 5).toUpperCase()}-${Math.floor(Math.random() * 900) + 100}`;
  const marks = Math.floor(Math.random() * 50) + 50;

  dbStudents.push(`${roll},${name}`);
  dbMatrix.push(`${roll},${code},${name}`);
  dbEvaluated.push(`${code},${marks}`);
}

fs.writeFileSync(path.join(doubleBlindDir, '1_Real_Roll_Numbers.csv'), dbStudents.join('\n'));
fs.writeFileSync(path.join(doubleBlindDir, '2_Decoding_Matrix.csv'), dbMatrix.join('\n'));
fs.writeFileSync(path.join(doubleBlindDir, '3_Evaluated_Sheet_From_Examiner.csv'), dbEvaluated.join('\n'));

// ---------------------------------------------------------
// 7. NMC Compliance Reports
// ---------------------------------------------------------
const nmcDir = createDir('7_NMC_Compliance');

const responses = ["Question ID,Correct Answer,Student A Response,Student B Response,Student C Response,Student D Response"];
for(let i=1; i<=20; i++) {
    const correct = ['A','B','C','D'][Math.floor(Math.random() * 4)];
    const getResponse = () => Math.random() > 0.3 ? correct : ['A','B','C','D'][Math.floor(Math.random() * 4)]; // 70% chance correct
    responses.push(`Q${i},${correct},${getResponse()},${getResponse()},${getResponse()},${getResponse()}`);
}
fs.writeFileSync(path.join(nmcDir, 'Student_MCQ_Responses.csv'), responses.join('\n'));

console.log('Successfully generated beautifully structured sample data for ALL offline tools in /sample_data folder.');
