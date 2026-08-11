const fs = require('fs');
const DocxMerger = require('docx-merger');
const { Document, Packer, Paragraph, TextRun, SectionType } = require('docx');

async function test() {
  const doc = new Document({
    sections: [
      {
        properties: { type: SectionType.NEXT_PAGE },
        children: [
          new Paragraph({ children: [new TextRun({ text: "This is a test question", size: 24 })] })
        ]
      }
    ]
  });

  const generatedBuffer = await Packer.toBuffer(doc);
  const templateBuffer = fs.readFileSync('public/assets/FINAL_FOR_PRINT.docx');

  try {
    const merger = new DocxMerger({}, [
      templateBuffer.toString('binary'), 
      generatedBuffer.toString('binary')
    ]);

    merger.save('nodebuffer', function (data) {
      fs.writeFileSync('merged.docx', data);
      console.log("Merged successfully");
    });
  } catch (err) {
    console.error("Merge error:", err);
  }
}

test().catch(console.error);
