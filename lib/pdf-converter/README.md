# PDF to DOCX Converter - JavaScript Implementation

This directory contains a JavaScript implementation for converting PDF files to DOCX format, based on the analysis and extraction of logic from `PDFLibTool.dll.c`.

## Overview

This JavaScript implementation extracts and recreates the PDF to DOCX conversion logic found in the original C library, organized into modular components that handle different aspects of the conversion process.

## Architecture

The implementation is structured based on the original C library components:

### Core Components

- **PDFParser** (`src/core/PDFParser.js`) - Based on `CPdfDocument`, `CPdfDocumentImpl`, `CPdfReader`
- **TextExtractor** (`src/core/TextExtractor.js`) - Based on `CPdfTextChunk`, `CPDFTextAdvancer`, `CPdfPageContentProcessor`
- **ContentAnalyzer** (`src/core/ContentAnalyzer.js`) - Based on `CPageContentAnalizer2`, content analysis classes
- **StyleProcessor** (`src/docx/StyleProcessor.js`) - Based on `CPdfGraphicState`, `CPdfTextState`, styling classes
- **DocumentBuilder** (`src/docx/DocumentBuilder.js`) - Based on `CPdfExport`, `CPdfWriter`, document building patterns
- **DOCXGenerator** (`src/docx/DOCXGenerator.js`) - Based on export and file generation classes

### Main Converter

- **PDFToDocxConverter** (`src/index.js`) - Main converter class inspired by `CPdfExport` and `CPdfExportOptions`

## Features

### PDF Processing Capabilities
- PDF document structure parsing
- Text content extraction with positioning
- Content analysis and structuring
- Graphics and formatting detection
- Multi-page document support

### DOCX Generation Features
- Complete DOCX file structure generation
- Style definitions and formatting
- Paragraph and text run creation
- Table structure generation
- List and numbering support
- Document properties and metadata

### Conversion Options
- Preserve original formatting
- Extract and convert images
- Handle fonts and typography
- Maintain document hierarchy
- Support for headers and sections

## Installation

```bash
# Install dependencies
npm install
```

## Usage

### Basic Usage

```javascript
import PDFToDocxConverter from './src/index.js';

const converter = new PDFToDocxConverter();

// Convert PDF buffer to DOCX buffer
const pdfBuffer = fs.readFileSync('input.pdf');
const docxBuffer = await converter.convertToDocx(pdfBuffer);
fs.writeFileSync('output.docx', docxBuffer);

// Or convert files directly
await converter.convertFile('input.pdf', 'output.docx');
```

### Advanced Usage

```javascript
const converter = new PDFToDocxConverter({
    preserveFormatting: true,
    extractImages: true,
    includeFonts: false,
    pageBreaks: true,
    quality: 'high'
});

// Set progress callback
converter.setProgressCallback((progress) => {
    console.log(`${progress.stage}: ${progress.percentage}% - ${progress.message}`);
});

const docxBuffer = await converter.convertToDocx(pdfBuffer);
```

## File Structure

```
js_pdf_to_docx/
├── src/
│   ├── index.js                 # Main converter class
│   ├── core/
│   │   ├── PDFParser.js         # PDF document parsing
│   │   ├── TextExtractor.js     # Text content extraction
│   │   └── ContentAnalyzer.js   # Content structure analysis
│   └── docx/
│       ├── StyleProcessor.js    # Style conversion and processing
│       ├── DocumentBuilder.js   # DOCX document structure building
│       └── DOCXGenerator.js     # Final DOCX file generation
├── demo/
│   └── demo.js                  # Demonstration script
├── package.json                 # Node.js project configuration
└── README.md                    # This file
```

## Component Details

### PDFParser
Handles PDF document structure parsing, inspired by:
- `CPdfDocument` - Document representation
- `CPdfDocumentImpl` - Document implementation
- `CPdfDocPage` - Page handling
- `CPdfReader` - File reading and parsing

### TextExtractor
Extracts text content with positioning and formatting, based on:
- `CPdfTextChunk` - Text chunk handling
- `CPDFTextAdvancer` - Text positioning
- `CPdfPageContentProcessor` - Page content processing

### ContentAnalyzer
Analyzes and structures extracted content, inspired by:
- `CPageContentAnalizer2` - Content analysis
- Document structure detection
- Section and hierarchy building

### StyleProcessor
Processes and converts styling information, based on:
- `CPdfGraphicState` - Graphics state management
- `CPdfTextState` - Text state handling
- Font mapping and style conversion

### DocumentBuilder
Builds DOCX document structure, inspired by:
- `CPdfExport` - Export functionality
- `CPdfWriter` - Document writing
- Document structure building patterns

### DOCXGenerator
Generates the final DOCX file, based on:
- Export and file generation classes
- XML structure creation
- ZIP file assembly

## Dependencies

- `pdf-parse` - PDF parsing library
- `officegen` - Office document generation
- `jszip` - ZIP file creation
- `xml2js` - XML processing

## Running the Demo

```bash
# Run basic demo
npm run demo

# Run with cleanup
npm run demo -- --cleanup

# Or run directly
node demo/demo.js
```

The demo script demonstrates:
- Basic PDF to DOCX conversion
- Advanced conversion options
- File-based conversion
- Error handling
- Progress tracking

## Conversion Process

1. **PDF Parsing** - Parse PDF structure and extract basic document information
2. **Text Extraction** - Extract text content with positioning and formatting data
3. **Content Analysis** - Analyze content structure, detect headers, paragraphs, lists, tables
4. **Style Processing** - Convert PDF formatting to DOCX-compatible styles
5. **Document Building** - Create DOCX document structure with proper elements
6. **DOCX Generation** - Generate final DOCX file with XML structure and ZIP packaging

## Limitations

This is a JavaScript implementation based on structural analysis of the original C library. While it provides a complete conversion pipeline, some advanced PDF processing features may require additional implementation:

- Complex graphics rendering
- Advanced font subsetting
- Encrypted PDF handling
- Complex table structures
- Embedded multimedia content

## Original C Library Mapping

This implementation maps the following C structures and classes:

| C Component | JavaScript Equivalent | Purpose |
|-------------|----------------------|---------|
| `CPdfDocument` | `PDFDocument` | Document representation |
| `CPdfTextChunk` | `TextElement` | Text content handling |
| `CPdfExportOptions` | Converter options | Export configuration |
| `CPdfWriter` | `DOCXGenerator` | File generation |
| `CPageContentAnalizer2` | `ContentAnalyzer` | Content analysis |
| `CPdfGraphicState` | Style processing | Graphics state |

## Development

To extend or modify the converter:

1. **Adding new features** - Extend the appropriate component class
2. **Modifying conversion logic** - Update the relevant processor
3. **Changing output format** - Modify the `DOCXGenerator`
4. **Adding file format support** - Extend the `PDFParser`

## Testing

The demo script includes comprehensive testing of:
- Basic conversion functionality
- Advanced options handling
- Error conditions
- File I/O operations
- Progress tracking

Run tests with:
```bash
npm test
```

## Performance

The converter is designed for efficiency with:
- Streaming processing where possible
- Memory-conscious text extraction
- Optimized DOCX generation
- Configurable quality vs. speed trade-offs

## License

This implementation is provided as a demonstration of PDF to DOCX conversion logic extracted from the analysis of `PDFLibTool.dll.c`.
