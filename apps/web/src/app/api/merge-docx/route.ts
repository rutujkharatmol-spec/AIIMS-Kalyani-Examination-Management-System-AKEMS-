import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import PizZip from 'pizzip';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';

export async function POST(req: NextRequest) {
  try {
    const { questionsBase64 } = await req.json();

    if (!questionsBase64) {
      return NextResponse.json({ error: 'questionsBase64 is required' }, { status: 400 });
    }

    // Read the template
    const templatePath = path.join(process.cwd(), 'public', 'assets', 'FINAL_FOR_PRINT.docx');
    
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ error: 'FINAL_FOR_PRINT.docx template not found in public/assets' }, { status: 404 });
    }

    const templateBuffer = fs.readFileSync(templatePath);
    const questionsBuffer = Buffer.from(questionsBase64, 'base64');

    // Load Zips
    const templateZip = new PizZip(templateBuffer);
    const questionsZip = new PizZip(questionsBuffer);

    // Read XML
    const templateXml = templateZip.file("word/document.xml")?.asText();
    const questionsXml = questionsZip.file("word/document.xml")?.asText();

    if (!templateXml || !questionsXml) {
      return NextResponse.json({ error: 'Invalid docx files' }, { status: 400 });
    }

    const parser = new DOMParser();
    const templateDoc = parser.parseFromString(templateXml, "text/xml");
    const questionsDoc = parser.parseFromString(questionsXml, "text/xml");

    const templateBody = templateDoc.getElementsByTagName("w:body")[0];
    const questionsBody = questionsDoc.getElementsByTagName("w:body")[0];

    // Find the last sectPr in template
    const sectPrs = templateBody.getElementsByTagName("w:sectPr");
    const lastSectPr = sectPrs.length > 0 ? sectPrs[sectPrs.length - 1] : null;

    // Append all children of questionsBody (except sectPr) to templateBody
    for (let i = 0; i < questionsBody.childNodes.length; i++) {
      const node = questionsBody.childNodes[i];
      if (node.nodeName !== "w:sectPr") {
        if (lastSectPr) {
          templateBody.insertBefore(node.cloneNode(true), lastSectPr);
        } else {
          templateBody.appendChild(node.cloneNode(true));
        }
      }
    }

    const serializer = new XMLSerializer();
    const newTemplateXml = serializer.serializeToString(templateDoc);

    // Write back and generate Buffer
    templateZip.file("word/document.xml", newTemplateXml);
    const mergedBuffer = templateZip.generate({ type: "uint8array", compression: "DEFLATE" });

    return new NextResponse(mergedBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': 'attachment; filename="Merged_Paper.docx"',
      },
    });
  } catch (error) {
    console.error('Merge DOCX Error:', error);
    return NextResponse.json({ error: 'Failed to merge docx files' }, { status: 500 });
  }
}
