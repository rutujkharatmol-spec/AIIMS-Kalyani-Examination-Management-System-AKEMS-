const XLSX = require('xlsx');
const fs = require('fs');

const data = fs.readFileSync('sample-item-analysis.csv');
const workbook = XLSX.read(data);
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = jsonData[0].map(h => String(h).toLowerCase().trim());
const qIndices = headers.reduce((acc, h, idx) => {
  if (h.match(/^(q|que|question)[\.\s]*\d+$/i) || h.match(/^\d+[\.]?$/)) acc.push(idx);
  return acc;
}, []);

console.log("Headers:", headers);
console.log("Q Indices:", qIndices);

const extractedData = [];
for (let j = 1; j < jsonData.length; j++) {
  if (!jsonData[j] || !jsonData[j][0]) continue;
  
  const questions = {};
  qIndices.forEach(idx => {
    const h = String(jsonData[0][idx]).toUpperCase().trim();
    const val = Number(jsonData[j][idx]);
    questions[h] = isNaN(val) ? 0 : val;
  });

  extractedData.push({
    rollNo: String(jsonData[j][0]).trim(),
    name: 'Unknown',
    marks: Number(jsonData[j][2]) || 0,
    questions
  });
}

console.log("Sample extracted data row:", extractedData[0]);

const tempItemAnalysis = new Map();
[{ data: extractedData }].forEach(sheet => {
  sheet.data.forEach(row => {
    if (row.questions) {
      Object.entries(row.questions).forEach(([q, val]) => {
        if (!tempItemAnalysis.has(q)) {
          tempItemAnalysis.set(q, { correct: 0, total: 0 });
        }
        const stats = tempItemAnalysis.get(q);
        stats.total += 1;
        if (val > 0) stats.correct += 1; 
      });
    }
  });
});

console.log("Temp Item Analysis Map Size:", tempItemAnalysis.size);
console.log(Array.from(tempItemAnalysis.entries()));
