import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import { join } from "path";
import { pdfConverter } from "@/lib/pdf-converter";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";

export async function POST(req: NextRequest) {
  try {
    const uploadDir = join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    // Get the uploaded file and options
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const outputFormat = (formData.get("format") as string) || 'docx';
    const quality = parseInt(formData.get("quality") as string) || 90;
    const dpi = parseInt(formData.get("dpi") as string) || 150;
    
    if (!file || file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Please upload a PDF file" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Handle different output formats
    if (outputFormat === 'docx') {
      // Enhanced DOCX conversion with exact PDF formatting
      const docxContent = await createDOCXFromPDF(buffer, file.name);
      
      const timestamp = Date.now();
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const fileName = `${baseName}_${timestamp}.docx`;
      const filePath = join(uploadDir, fileName);
      
      await fs.writeFile(filePath, docxContent);

      const fileUrl = `/uploads/${fileName}`;
      return NextResponse.json({
        message: "PDF converted to DOCX successfully",
        fileUrl,
        metadata: {
          format: 'docx',
          originalFormat: 'pdf',
          fileName: fileName
        }
      });
    } else {
      // For image formats (png, jpeg, webp, svg)
      const result = await pdfConverter.convert(buffer, {
        outputFormat: outputFormat as 'png' | 'jpeg' | 'webp' | 'svg',
        quality,
        dpi,
        scale: 1.0,
        background: 'white'
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.error || "Conversion failed" },
          { status: 500 }
        );
      }

      // Save the converted image(s)
      const timestamp = Date.now();
      const baseName = file.name.replace(/\.[^/.]+$/, '');

      if (Buffer.isBuffer(result.data)) {
        // Single page conversion
        const fileName = `${baseName}_${timestamp}.${outputFormat}`;
        const filePath = join(uploadDir, fileName);
        await fs.writeFile(filePath, result.data);

        const fileUrl = `/uploads/${fileName}`;
        return NextResponse.json({
          message: `PDF converted to ${outputFormat.toUpperCase()} successfully`,
          fileUrl,
          metadata: result.metadata
        });
      } else if (Array.isArray(result.data)) {
        // Multiple pages conversion
        const fileUrls: string[] = [];
        
        for (let i = 0; i < result.data.length; i++) {
          const fileName = `${baseName}_page_${i + 1}_${timestamp}.${outputFormat}`;
          const filePath = join(uploadDir, fileName);
          await fs.writeFile(filePath, result.data[i]);
          fileUrls.push(`/uploads/${fileName}`);
        }

        return NextResponse.json({
          message: `PDF converted to ${outputFormat.toUpperCase()} successfully`,
          fileUrls,
          pageCount: fileUrls.length,
          metadata: result.metadata
        });
      }
    }

    throw new Error("Unexpected conversion result format");

  } catch (error) {
    console.error("Conversion error:", error);
    return NextResponse.json(
      { error: "Failed to convert PDF" },
      { status: 500 }
    );
  }
}

// Fixed interfaces with proper types
interface PDFTextRun {
  T: string; // Text content (URL encoded)
  S: number; // Style index
  TS?: [number, number, number, number]; // [font_face, font_size, bold, italic]
}

interface PDFTextElement {
  x: number;
  y: number;
  w: number;
  sw?: number;
  A?: string;
  R: PDFTextRun[];
}

interface PDFLine {
  x: number;
  y: number;
  w: number;
  l: number;
}

interface PDFPage {
  Width: number;
  Height: number;
  HLines?: PDFLine[];
  VLines?: PDFLine[];
  Fills?: any[];
  Texts: PDFTextElement[];
}

interface PDFData {
  Pages: PDFPage[];
  Meta?: {
    PDFFormatVersion?: string;
    IsAcroFormPresent?: boolean;
    IsXFAPresent?: boolean;
  };
  Info?: {
    Title?: string;
    Author?: string;
    Subject?: string;
    Creator?: string;
    Producer?: string;
    CreationDate?: string;
    ModDate?: string;
  };
}

// Enhanced DOCX creation with exact PDF formatting preservation
async function createDOCXFromPDF(pdfBuffer: Buffer, originalFileName: string): Promise<Buffer> {
  try {
    // Dynamic import with proper error handling
    const pdf2json = await import('pdf2json');
    const PDFParser = pdf2json.default;
    
    const pdfParser = new PDFParser(null, 1); // null for no external handler, 1 for detailed parsing

    const pdfData: PDFData = await new Promise((resolve, reject) => {
      // Set up error handler
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF parsing error:", errData);
        reject(new Error(`PDF parsing failed: ${errData.parserError?.message || 'Unknown error'}`));
      });

      // Set up success handler
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        console.log("PDF parsed successfully, pages:", pdfData?.Pages?.length || 0);
        resolve(pdfData as PDFData);
      });

      // Parse the buffer
      try {
        pdfParser.parseBuffer(pdfBuffer);
      } catch (parseError) {
        reject(new Error(`Failed to start parsing: ${parseError}`));
      }
    });

    // Validate parsed data
    if (!pdfData || !pdfData.Pages || pdfData.Pages.length === 0) {
      throw new Error("No pages found in PDF or parsing failed");
    }

    // Get document metadata
    const title = pdfData.Info?.Title || originalFileName.replace('.pdf', '');
    const author = pdfData.Info?.Author || '';
    const creator = pdfData.Info?.Creator || '';

    console.log(`Processing ${pdfData.Pages.length} pages from PDF: ${title}`);

    // Process each page with exact formatting
    const documentChildren: (Paragraph | Table)[] = [];

    // Add document header (simplified to avoid issues)
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: title,
            bold: true,
            size: 28,
            color: "2F5496",
          }),
        ],
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    // Process each page
    for (let pageIndex = 0; pageIndex < pdfData.Pages.length; pageIndex++) {
      const page = pdfData.Pages[pageIndex];
      
      console.log(`Processing page ${pageIndex + 1}, texts found: ${page.Texts?.length || 0}`);

      // Add page break (except for first page)
      if (pageIndex > 0) {
        documentChildren.push(
          new Paragraph({
            children: [new TextRun({ text: "" })],
            pageBreakBefore: true,
          })
        );
      }

      // Skip empty pages
      if (!page.Texts || page.Texts.length === 0) {
        documentChildren.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `[Page ${pageIndex + 1} - No text content found]`,
                italics: true,
                color: "999999",
              }),
            ],
            spacing: { after: 200 },
          })
        );
        continue;
      }

      // Group texts by vertical position to create lines
      const textsByLine = groupTextsByLine(page.Texts);
      
      console.log(`Page ${pageIndex + 1} grouped into ${textsByLine.length} lines`);

      // Convert each line to DOCX paragraph with preserved formatting
      for (const lineTexts of textsByLine) {
        try {
          const paragraph = createFormattedParagraph(lineTexts, page.Width);
          documentChildren.push(paragraph);
        } catch (paragraphError) {
          console.error("Error creating paragraph:", paragraphError);
          // Add fallback paragraph
          documentChildren.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: "[Text formatting error]",
                  italics: true,
                  color: "FF0000",
                }),
              ],
            })
          );
        }
      }

      // Add tables if structured data is detected
      try {
        const tables = detectTables(page);
        for (const table of tables) {
          documentChildren.push(table);
        }
      } catch (tableError) {
        console.error("Error detecting tables:", tableError);
      }
    }

    // Add footer
    documentChildren.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Document converted from PDF: ${originalFileName} | Conversion Date: ${new Date().toLocaleDateString()}`,
            size: 16,
            italics: true,
            color: "999999",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 },
      })
    );

    // Create DOCX document
    const doc = new Document({
      creator: creator || "PDF Converter",
      title: title,
      description: `Converted from PDF: ${originalFileName}`,
      sections: [{
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: documentChildren,
      }],
    });

    console.log("Creating DOCX buffer...");
    const buffer = await Packer.toBuffer(doc);
    console.log("DOCX conversion completed successfully");
    
    return buffer;
  } catch (error) {
    console.error("Enhanced DOCX creation failed:", error);
    return createFallbackDOCX(originalFileName);
  }
}

// Fixed grouping function with better error handling
function groupTextsByLine(texts: PDFTextElement[]): PDFTextElement[][] {
  if (!texts || texts.length === 0) {
    return [];
  }

  const tolerance = 3; // Increased tolerance for better grouping
  const lines: PDFTextElement[][] = [];

  // Sort texts by Y position (top to bottom) - PDF coordinates are bottom-up
  const sortedTexts = [...texts].sort((a, b) => b.y - a.y);

  for (const text of sortedTexts) {
    // Skip texts without content
    if (!text.R || text.R.length === 0) {
      continue;
    }

    // Find existing line with similar Y position
    let addedToLine = false;
    for (const line of lines) {
      if (Math.abs(line[0].y - text.y) <= tolerance) {
        line.push(text);
        addedToLine = true;
        break;
      }
    }

    // Create new line if no suitable line found
    if (!addedToLine) {
      lines.push([text]);
    }
  }

  // Sort texts within each line by X position (left to right)
  for (const line of lines) {
    line.sort((a, b) => a.x - b.x);
  }

  return lines;
}

// Fixed paragraph creation with better text handling
function createFormattedParagraph(lineTexts: PDFTextElement[], pageWidth: number): Paragraph {
  const textRuns: TextRun[] = [];
  let alignment: AlignmentType = AlignmentType.LEFT;
  let lastTextContent = ''; // Track the last text content manually

  // Determine alignment based on text position
  if (lineTexts.length > 0) {
    const firstText = lineTexts[0];
    const lastText = lineTexts[lineTexts.length - 1];
    const lineStart = firstText.x;
    const lineEnd = lastText.x + (lastText.w || 0);
    const lineCenter = (lineStart + lineEnd) / 2;
    const pageCenter = pageWidth / 2;

    if (Math.abs(lineCenter - pageCenter) < pageWidth * 0.15) {
      alignment = AlignmentType.CENTER;
    } else if (lineStart > pageWidth * 0.6) {
      alignment = AlignmentType.RIGHT;
    }
  }

  // Process each text element in the line
  for (let i = 0; i < lineTexts.length; i++) {
    const textElement = lineTexts[i];
    
    if (!textElement.R || textElement.R.length === 0) {
      continue;
    }

    for (const textRun of textElement.R) {
      try {
        // Decode the text content
        let decodedText = '';
        if (textRun.T) {
          decodedText = decodeURIComponent(textRun.T.replace(/\+/g, ' '));
        }

        // Skip empty text
        if (!decodedText.trim()) {
          continue;
        }

        // Extract formatting information with defaults
        const fontSize = textRun.TS && textRun.TS[1] ? Math.max(16, Math.round(textRun.TS[1] * 1.5)) : 22;
        const isBold = textRun.TS ? textRun.TS[2] === 1 : false;
        const isItalic = textRun.TS ? textRun.TS[3] === 1 : false;

        // Add appropriate spacing using our tracked last text content
        if (textRuns.length > 0 && lastTextContent && !decodedText.startsWith(' ')) {
          if (!lastTextContent.endsWith(' ') && !lastTextContent.endsWith('\n')) {
            decodedText = ' ' + decodedText;
          }
        }

        // Create the text run
        const newTextRun = new TextRun({
          text: decodedText,
          size: fontSize,
          bold: isBold,
          italics: isItalic,
          font: "Calibri", // Use Calibri for better compatibility
        });

        textRuns.push(newTextRun);
        
        // Update our tracked last text content
        lastTextContent = decodedText;

      } catch (textError) {
        console.error("Error processing text run:", textError);
        // Add placeholder for problematic text
        const errorTextRun = new TextRun({
          text: "[Text decode error]",
          size: 20,
          italics: true,
          color: "FF0000",
        });
        textRuns.push(errorTextRun);
        lastTextContent = "[Text decode error]";
      }
    }
  }

  // If no text runs were created, create a placeholder
  if (textRuns.length === 0) {
    textRuns.push(new TextRun({ text: " " }));
  }

  return new Paragraph({
    children: textRuns,
    alignment: alignment,
    spacing: { after: 150 },
  });
}

// Simplified table detection
function detectTables(page: PDFPage): Table[] {
  const tables: Table[] = [];
  
  try {
    // Only create tables if we have clear horizontal and vertical lines
    if (page.HLines && page.VLines && page.HLines.length >= 2 && page.VLines.length >= 2) {
      // Sort lines
      const hLines = [...page.HLines].sort((a, b) => b.y - a.y);
      const vLines = [...page.VLines].sort((a, b) => a.x - b.x);

      // Limit table size for performance
      const maxRows = Math.min(5, hLines.length - 1);
      const maxCols = Math.min(4, vLines.length - 1);

      if (maxRows > 0 && maxCols > 0) {
        const rows: TableRow[] = [];
        
        for (let r = 0; r < maxRows; r++) {
          const cells: TableCell[] = [];
          
          for (let c = 0; c < maxCols; c++) {
            // Find texts in this cell area
            const cellTexts = page.Texts.filter(text => {
              const inRow = text.y <= hLines[r].y && (r + 1 < hLines.length ? text.y >= hLines[r + 1].y : true);
              const inCol = text.x >= vLines[c].x && (c + 1 < vLines.length ? text.x <= vLines[c + 1].x : true);
              return inRow && inCol;
            });

            let cellContent = ' ';
            if (cellTexts.length > 0) {
              cellContent = cellTexts
                .map(text => text.R.map(r => {
                  try {
                    return decodeURIComponent(r.T.replace(/\+/g, ' '));
                  } catch {
                    return r.T;
                  }
                }).join('')).join(' ').trim() || ' ';
            }

            cells.push(
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: cellContent,
                        size: 20,
                      }),
                    ],
                  }),
                ],
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1 },
                  bottom: { style: BorderStyle.SINGLE, size: 1 },
                  left: { style: BorderStyle.SINGLE, size: 1 },
                  right: { style: BorderStyle.SINGLE, size: 1 },
                },
              })
            );
          }

          if (cells.length > 0) {
            rows.push(new TableRow({ children: cells }));
          }
        }

        if (rows.length > 0) {
          tables.push(
            new Table({
              rows: rows,
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
            })
          );
        }
      }
    }
  } catch (tableError) {
    console.error("Table detection error:", tableError);
  }

  return tables;
}

// Fallback DOCX creation when PDF parsing fails
async function createFallbackDOCX(originalFileName: string): Promise<Buffer> {
  console.log("Creating fallback DOCX for:", originalFileName);
  
  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: "PDF Conversion Notice",
              bold: true,
              size: 28,
              color: "D32F2F",
            }),
          ],
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Unable to extract formatted content from: ${originalFileName}`,
              size: 22,
            }),
          ],
          spacing: { before: 400 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "This PDF may contain:",
              bold: true,
              size: 20,
            }),
          ],
          spacing: { before: 300, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Complex layouts requiring manual adjustment",
              size: 20,
            }),
          ],
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Scanned images instead of selectable text",
              size: 20,
            }),
          ],
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Encrypted or password-protected content",
              size: 20,
            }),
          ],
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "• Special fonts or graphics that need OCR processing",
              size: 20,
            }),
          ],
          bullet: { level: 0 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `Conversion attempted on: ${new Date().toLocaleString()}`,
              italics: true,
              size: 18,
              color: "666666",
            }),
          ],
          spacing: { before: 400 },
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  return await Packer.toBuffer(doc);
}