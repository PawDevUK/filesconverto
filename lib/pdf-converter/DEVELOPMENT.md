# PDF to DOCX Converter - Development Guide

## Project Overview

This JavaScript implementation provides a complete PDF to DOCX conversion solution extracted from PDFLibTool.dll.c. The converter uses a modular architecture to parse PDF files, extract content, and generate DOCX documents.

## Architecture

### Core Components

1. **PDFParser** (`src/core/PDFParser.js`)
   - Parses PDF structure and metadata
   - Extracts document information
   - Handles PDF versions and compatibility

2. **TextExtractor** (`src/core/TextExtractor.js`)
   - Extracts text content with positioning
   - Maintains formatting information
   - Handles different text encodings

3. **ContentAnalyzer** (`src/core/ContentAnalyzer.js`)
   - Analyzes document structure
   - Detects paragraphs, headers, lists
   - Identifies images and tables

4. **StyleProcessor** (`src/docx/StyleProcessor.js`)
   - Converts PDF formatting to DOCX styles
   - Handles fonts, colors, and layouts
   - Maintains style consistency

5. **DocumentBuilder** (`src/docx/DocumentBuilder.js`)
   - Creates DOCX document structure
   - Organizes content elements
   - Manages document properties

6. **DOCXGenerator** (`src/docx/DOCXGenerator.js`)
   - Generates final DOCX file
   - Handles XML structure
   - Creates downloadable output

## Development Setup

### Prerequisites

- Node.js 16+ with ES modules support
- npm or yarn package manager
- Modern JavaScript environment

### Installation

```bash
# Clone or extract the project
cd js_pdf_to_docx

# Install dependencies
npm install

# Run the demo
npm run demo

# Run tests
npm test

# Build the project
npm run build
```

### Project Structure

```
js_pdf_to_docx/
├── src/
│   ├── index.js              # Main entry point
│   ├── core/                 # Core PDF processing
│   │   ├── PDFParser.js
│   │   ├── TextExtractor.js
│   │   └── ContentAnalyzer.js
│   └── docx/                 # DOCX generation
│       ├── StyleProcessor.js
│       ├── DocumentBuilder.js
│       └── DOCXGenerator.js
├── demo/
│   ├── demo.js              # Demonstration script
│   └── sample.pdf           # Sample PDF file
├── test/
│   └── test.js              # Test suite
├── docs/                    # Generated documentation
├── dist/                    # Build output
├── package.json
├── README.md
├── build.js                 # Build script
└── DEVELOPMENT.md           # This file
```

## Development Workflow

### Adding New Features

1. **Identify the Component**: Determine which module should handle the new feature
2. **Update Interfaces**: Modify class interfaces and method signatures
3. **Implement Logic**: Add the feature implementation
4. **Update Tests**: Add test cases for the new functionality
5. **Update Documentation**: Document the new feature

### Code Style Guidelines

#### ES6+ Standards
```javascript
// Use modern JavaScript features
import { promises as fs } from 'fs';
import path from 'path';

// Use arrow functions for callbacks
const processData = (data) => {
    return data.map(item => transformItem(item));
};

// Use async/await for promises
async function convertFile(inputPath) {
    try {
        const data = await fs.readFile(inputPath);
        return await processData(data);
    } catch (error) {
        throw new Error(`Processing failed: ${error.message}`);
    }
}
```

#### Class Structure
```javascript
class ExampleProcessor {
    constructor(options = {}) {
        this.options = {
            defaultOption: true,
            ...options
        };
        
        this.state = {
            initialized: false,
            progress: 0
        };
    }
    
    /**
     * Process input data
     * @param {Buffer} input - Input data
     * @param {Object} options - Processing options
     * @returns {Promise<Buffer>} Processed output
     */
    async process(input, options = {}) {
        this.validateInput(input);
        
        try {
            this.state.initialized = true;
            return await this.performProcessing(input, options);
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    
    validateInput(input) {
        if (!Buffer.isBuffer(input)) {
            throw new Error('Input must be a Buffer');
        }
    }
    
    handleError(error) {
        console.error('Processing error:', error.message);
        this.state.initialized = false;
    }
}
```

### Testing Strategy

#### Unit Tests
```javascript
describe('PDFParser', () => {
    let parser;
    
    beforeEach(() => {
        parser = new PDFParser();
    });
    
    test('should parse valid PDF', async () => {
        const mockPDF = createMockPDFBuffer();
        const result = await parser.parse(mockPDF);
        
        expect(result).toHaveProperty('metadata');
        expect(result.pages).toHaveLength(1);
    });
    
    test('should handle invalid PDF', async () => {
        const invalidPDF = Buffer.from('invalid data');
        
        await expect(parser.parse(invalidPDF))
            .rejects
            .toThrow('Invalid PDF format');
    });
});
```

#### Integration Tests
```javascript
describe('Full Conversion Pipeline', () => {
    test('should convert PDF to DOCX', async () => {
        const converter = new PDFToDocxConverter();
        const pdfBuffer = await fs.readFile('test/sample.pdf');
        
        const docxBuffer = await converter.convertToDocx(pdfBuffer);
        
        expect(Buffer.isBuffer(docxBuffer)).toBe(true);
        expect(docxBuffer.length).toBeGreaterThan(0);
        
        // Verify DOCX structure
        const docxContent = await verifyDOCXStructure(docxBuffer);
        expect(docxContent.hasValidStructure).toBe(true);
    });
});
```

### Debugging

#### Logging
```javascript
// Use structured logging
const debug = {
    pdf: require('debug')('converter:pdf'),
    docx: require('debug')('converter:docx'),
    perf: require('debug')('converter:performance')
};

// In your code
debug.pdf('Parsing PDF with %d pages', pageCount);
debug.perf('Text extraction took %dms', duration);
```

#### Performance Monitoring
```javascript
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
    }
    
    startTimer(name) {
        this.metrics.set(name, {
            startTime: process.hrtime.bigint(),
            startMemory: process.memoryUsage().heapUsed
        });
    }
    
    endTimer(name) {
        const metric = this.metrics.get(name);
        if (!metric) return;
        
        const endTime = process.hrtime.bigint();
        const endMemory = process.memoryUsage().heapUsed;
        
        const duration = Number(endTime - metric.startTime) / 1000000; // ms
        const memoryDelta = endMemory - metric.startMemory;
        
        console.log(`${name}: ${duration.toFixed(2)}ms, ${memoryDelta} bytes`);
    }
}
```

### Error Handling

#### Custom Error Classes
```javascript
class PDFParseError extends Error {
    constructor(message, code = 'PDF_PARSE_ERROR') {
        super(message);
        this.name = 'PDFParseError';
        this.code = code;
    }
}

class DOCXGenerationError extends Error {
    constructor(message, code = 'DOCX_GENERATION_ERROR') {
        super(message);
        this.name = 'DOCXGenerationError';
        this.code = code;
    }
}
```

#### Error Recovery
```javascript
async function robustConversion(pdfBuffer) {
    const maxRetries = 3;
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await this.attemptConversion(pdfBuffer);
        } catch (error) {
            lastError = error;
            
            if (this.isRecoverableError(error) && attempt < maxRetries) {
                console.log(`Attempt ${attempt} failed, retrying...`);
                await this.delay(1000 * attempt); // Exponential backoff
                continue;
            }
            
            throw error;
        }
    }
    
    throw lastError;
}
```

### Performance Optimization

#### Memory Management
```javascript
class MemoryEfficientProcessor {
    constructor() {
        this.chunkSize = 1024 * 1024; // 1MB chunks
        this.maxMemoryUsage = 100 * 1024 * 1024; // 100MB limit
    }
    
    async processLargeFile(filePath) {
        const fileSize = (await fs.stat(filePath)).size;
        
        if (fileSize > this.maxMemoryUsage) {
            return await this.processInChunks(filePath);
        }
        
        return await this.processInMemory(filePath);
    }
    
    async processInChunks(filePath) {
        const results = [];
        const fileHandle = await fs.open(filePath, 'r');
        
        try {
            let position = 0;
            const buffer = Buffer.allocUnsafe(this.chunkSize);
            
            while (position < fileSize) {
                const { bytesRead } = await fileHandle.read(buffer, 0, this.chunkSize, position);
                const chunk = buffer.slice(0, bytesRead);
                
                const result = await this.processChunk(chunk);
                results.push(result);
                
                position += bytesRead;
                
                // Force garbage collection if available
                if (global.gc) {
                    global.gc();
                }
            }
        } finally {
            await fileHandle.close();
        }
        
        return this.combineResults(results);
    }
}
```

#### Async Processing
```javascript
class AsyncProcessor {
    constructor(concurrency = 4) {
        this.concurrency = concurrency;
        this.queue = [];
        this.processing = new Set();
    }
    
    async processMany(items) {
        return new Promise((resolve, reject) => {
            const results = [];
            let completed = 0;
            
            const processNext = async () => {
                if (this.queue.length === 0 && this.processing.size === 0) {
                    resolve(results);
                    return;
                }
                
                if (this.processing.size >= this.concurrency || this.queue.length === 0) {
                    return;
                }
                
                const item = this.queue.shift();
                const taskId = Symbol('task');
                this.processing.add(taskId);
                
                try {
                    const result = await this.processItem(item);
                    results[item.index] = result;
                    completed++;
                } catch (error) {
                    reject(error);
                    return;
                } finally {
                    this.processing.delete(taskId);
                }
                
                processNext();
            };
            
            // Initialize queue
            items.forEach((item, index) => {
                this.queue.push({ ...item, index });
            });
            
            // Start processing
            for (let i = 0; i < this.concurrency; i++) {
                processNext();
            }
        });
    }
}
```

### Building and Distribution

#### Build Process
The build script (`build.js`) performs:

1. **Validation**: Check project structure and dependencies
2. **Module Validation**: Verify imports and exports work correctly
3. **Documentation Generation**: Create API and example docs
4. **Distribution Packaging**: Copy files to dist directory
5. **Output Validation**: Verify build completeness

#### Distribution

```bash
# Build for distribution
npm run build

# The dist/ directory contains:
# - All source files
# - Generated documentation
# - Package metadata
# - Ready for npm publishing or deployment
```

### Contributing Guidelines

1. **Fork and Branch**: Create feature branches from main
2. **Code Quality**: Maintain high code quality with linting and formatting
3. **Testing**: Add comprehensive tests for new features
4. **Documentation**: Update docs for any API changes
5. **Performance**: Consider performance impact of changes
6. **Backward Compatibility**: Maintain API compatibility when possible

### Release Process

1. **Version Bump**: Update version in package.json
2. **Changelog**: Update CHANGELOG.md with changes
3. **Build**: Run full build and test suite
4. **Tag**: Create git tag for the release
5. **Publish**: Publish to npm registry if applicable

## Troubleshooting

### Common Issues

#### Memory Issues
- Reduce chunk size for large files
- Enable garbage collection
- Monitor memory usage during development

#### PDF Parsing Issues
- Verify PDF structure is valid
- Check for password protection
- Handle different PDF versions

#### DOCX Generation Issues
- Validate XML structure
- Check file permissions
- Verify output directory exists

#### Performance Issues
- Profile with Node.js tools
- Use streaming for large files
- Implement proper caching

### Debug Mode

Enable debug logging:
```bash
DEBUG=converter:* npm run demo
```

### Testing Large Files

```javascript
// Create test with large PDF
const largePDFBuffer = await createLargePDF(100); // 100 pages
const startTime = Date.now();
const result = await converter.convertToDocx(largePDFBuffer);
const duration = Date.now() - startTime;

console.log(`Conversion took ${duration}ms for ${largePDFBuffer.length} bytes`);
```

This development guide should help you understand the codebase structure and contribute effectively to the PDF to DOCX converter project.
