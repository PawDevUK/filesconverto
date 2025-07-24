/**
 * Test suite for PDF to DOCX converter
 * Tests the JavaScript implementation based on PDFLibTool.dll.c
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFToDocxConverter from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Test configuration
 */
const TEST_CONFIG = {
    timeout: 30000,
    verbose: true,
    samplePdfPath: path.join(__dirname, 'sample.pdf'),
    outputDir: path.join(__dirname, 'output')
};

/**
 * Test results tracking
 */
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

/**
 * Create output directory
 */
function setupTestEnvironment() {
    if (!fs.existsSync(TEST_CONFIG.outputDir)) {
        fs.mkdirSync(TEST_CONFIG.outputDir, { recursive: true });
    }
}

/**
 * Create a sample PDF for testing
 */
function createTestPDF() {
    const sampleContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 150
>>
stream
BT
/F1 16 Tf
100 750 Td
(Test Document Title) Tj
/F1 12 Tf
100 700 Td
(This is a sample paragraph for testing.) Tj
100 680 Td
(Another paragraph with more content.) Tj
100 650 Td
(• List item 1) Tj
100 630 Td
(• List item 2) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000271 00000 n 
0000000475 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
546
%%EOF`;

    return Buffer.from(sampleContent, 'utf8');
}

/**
 * Test assertion helper
 */
function assert(condition, message, testName) {
    testResults.total++;
    
    if (condition) {
        testResults.passed++;
        if (TEST_CONFIG.verbose) {
            console.log(`✅ PASS: ${testName} - ${message}`);
        }
        return true;
    } else {
        testResults.failed++;
        const error = `❌ FAIL: ${testName} - ${message}`;
        console.log(error);
        testResults.errors.push(error);
        return false;
    }
}

/**
 * Async test wrapper
 */
async function runTest(testName, testFunction) {
    console.log(`\n--- Testing: ${testName} ---`);
    
    try {
        await testFunction();
        console.log(`✅ ${testName} completed`);
    } catch (error) {
        testResults.total++;
        testResults.failed++;
        const errorMsg = `❌ ERROR in ${testName}: ${error.message}`;
        console.log(errorMsg);
        testResults.errors.push(errorMsg);
    }
}

/**
 * Test basic converter instantiation
 */
async function testConverterInstantiation() {
    const converter = new PDFToDocxConverter();
    
    assert(converter !== null, 'Converter instance created', 'instantiation');
    assert(typeof converter.convertToDocx === 'function', 'convertToDocx method exists', 'instantiation');
    assert(typeof converter.convertFile === 'function', 'convertFile method exists', 'instantiation');
    assert(typeof converter.getProgress === 'function', 'getProgress method exists', 'instantiation');
}

/**
 * Test converter options
 */
async function testConverterOptions() {
    const options = {
        preserveFormatting: true,
        extractImages: true,
        includeFonts: false,
        pageBreaks: true,
        quality: 'high'
    };
    
    const converter = new PDFToDocxConverter(options);
    
    assert(converter.options.preserveFormatting === true, 'preserveFormatting option set', 'options');
    assert(converter.options.extractImages === true, 'extractImages option set', 'options');
    assert(converter.options.includeFonts === false, 'includeFonts option set', 'options');
    assert(converter.options.quality === 'high', 'quality option set', 'options');
}

/**
 * Test PDF parsing
 */
async function testPDFParsing() {
    const converter = new PDFToDocxConverter();
    const testPDF = createTestPDF();
    
    try {
        // Test if parser can handle the PDF
        const result = await converter.parser.parsePDF(testPDF);
        
        assert(result !== null, 'PDF parsing returned result', 'parsing');
        assert(result.pages !== undefined, 'Parsed document has pages', 'parsing');
        assert(Array.isArray(result.pages), 'Pages is an array', 'parsing');
        assert(result.info !== undefined, 'Document has info', 'parsing');
        
    } catch (error) {
        assert(false, `PDF parsing failed: ${error.message}`, 'parsing');
    }
}

/**
 * Test text extraction
 */
async function testTextExtraction() {
    const converter = new PDFToDocxConverter();
    const testPDF = createTestPDF();
    
    try {
        const pdfDocument = await converter.parser.parsePDF(testPDF);
        const textContent = await converter.textExtractor.extractText(pdfDocument);
        
        assert(textContent !== null, 'Text extraction returned result', 'text-extraction');
        assert(textContent.pages !== undefined, 'Text content has pages', 'text-extraction');
        assert(Array.isArray(textContent.pages), 'Text pages is an array', 'text-extraction');
        assert(textContent.documentText !== undefined, 'Document text extracted', 'text-extraction');
        assert(typeof textContent.documentText === 'string', 'Document text is string', 'text-extraction');
        
    } catch (error) {
        assert(false, `Text extraction failed: ${error.message}`, 'text-extraction');
    }
}

/**
 * Test content analysis
 */
async function testContentAnalysis() {
    const converter = new PDFToDocxConverter();
    const testPDF = createTestPDF();
    
    try {
        const pdfDocument = await converter.parser.parsePDF(testPDF);
        const textContent = await converter.textExtractor.extractText(pdfDocument);
        const analyzedContent = await converter.contentAnalyzer.analyzeContent(textContent, pdfDocument);
        
        assert(analyzedContent !== null, 'Content analysis returned result', 'content-analysis');
        assert(analyzedContent.documentStructure !== undefined, 'Document structure analyzed', 'content-analysis');
        assert(Array.isArray(analyzedContent.paragraphs), 'Paragraphs extracted', 'content-analysis');
        assert(analyzedContent.metadata !== undefined, 'Analysis metadata present', 'content-analysis');
        
    } catch (error) {
        assert(false, `Content analysis failed: ${error.message}`, 'content-analysis');
    }
}

/**
 * Test style processing
 */
async function testStyleProcessing() {
    const converter = new PDFToDocxConverter();
    const testPDF = createTestPDF();
    
    try {
        const pdfDocument = await converter.parser.parsePDF(testPDF);
        const textContent = await converter.textExtractor.extractText(pdfDocument);
        const analyzedContent = await converter.contentAnalyzer.analyzeContent(textContent, pdfDocument);
        const styledContent = await converter.styleProcessor.processStyles(analyzedContent);
        
        assert(styledContent !== null, 'Style processing returned result', 'style-processing');
        assert(styledContent.styles !== undefined, 'Styles generated', 'style-processing');
        assert(styledContent.styles instanceof Map, 'Styles is a Map', 'style-processing');
        assert(Array.isArray(styledContent.sections), 'Styled sections created', 'style-processing');
        
    } catch (error) {
        assert(false, `Style processing failed: ${error.message}`, 'style-processing');
    }
}

/**
 * Test document building
 */
async function testDocumentBuilding() {
    const converter = new PDFToDocxConverter();
    const testPDF = createTestPDF();
    
    try {
        const pdfDocument = await converter.parser.parsePDF(testPDF);
        const textContent = await converter.textExtractor.extractText(pdfDocument);
        const analyzedContent = await converter.contentAnalyzer.analyzeContent(textContent, pdfDocument);
        const styledContent = await converter.styleProcessor.processStyles(analyzedContent);
        const docxDocument = await converter.documentBuilder.buildDocument(styledContent);
        
        assert(docxDocument !== null, 'Document building returned result', 'document-building');
        assert(docxDocument.properties !== undefined, 'Document properties set', 'document-building');
        assert(docxDocument.styles !== undefined, 'Document styles included', 'document-building');
        assert(Array.isArray(docxDocument.sections), 'Document sections created', 'document-building');
        
    } catch (error) {
        assert(false, `Document building failed: ${error.message}`, 'document-building');
    }
}

/**
 * Test DOCX generation
 */
async function testDocxGeneration() {
    const converter = new PDFToDocxConverter();
    const testPDF = createTestPDF();
    
    try {
        const pdfDocument = await converter.parser.parsePDF(testPDF);
        const textContent = await converter.textExtractor.extractText(pdfDocument);
        const analyzedContent = await converter.contentAnalyzer.analyzeContent(textContent, pdfDocument);
        const styledContent = await converter.styleProcessor.processStyles(analyzedContent);
        const docxDocument = await converter.documentBuilder.buildDocument(styledContent);
        const docxBuffer = await converter.docxGenerator.generateDocx(docxDocument);
        
        assert(docxBuffer !== null, 'DOCX generation returned result', 'docx-generation');
        assert(Buffer.isBuffer(docxBuffer), 'Result is a Buffer', 'docx-generation');
        assert(docxBuffer.length > 0, 'Buffer has content', 'docx-generation');
        
        // Check for ZIP signature (DOCX is a ZIP file)
        const zipSignature = docxBuffer.slice(0, 4);
        assert(zipSignature[0] === 0x50 && zipSignature[1] === 0x4B, 'Buffer has ZIP signature', 'docx-generation');
        
    } catch (error) {
        assert(false, `DOCX generation failed: ${error.message}`, 'docx-generation');
    }
}

/**
 * Test full conversion pipeline
 */
async function testFullConversion() {
    const converter = new PDFToDocxConverter();
    const testPDF = createTestPDF();
    
    try {
        const docxBuffer = await converter.convertToDocx(testPDF);
        
        assert(docxBuffer !== null, 'Full conversion returned result', 'full-conversion');
        assert(Buffer.isBuffer(docxBuffer), 'Conversion result is Buffer', 'full-conversion');
        assert(docxBuffer.length > 1000, 'DOCX file has reasonable size', 'full-conversion');
        
        // Save test output
        const outputPath = path.join(TEST_CONFIG.outputDir, 'test_output.docx');
        fs.writeFileSync(outputPath, docxBuffer);
        
        assert(fs.existsSync(outputPath), 'Output file saved successfully', 'full-conversion');
        
    } catch (error) {
        assert(false, `Full conversion failed: ${error.message}`, 'full-conversion');
    }
}

/**
 * Test file-based conversion
 */
async function testFileConversion() {
    const converter = new PDFToDocxConverter();
    
    // Create test PDF file
    const testPDF = createTestPDF();
    fs.writeFileSync(TEST_CONFIG.samplePdfPath, testPDF);
    
    try {
        const outputPath = path.join(TEST_CONFIG.outputDir, 'file_conversion_output.docx');
        await converter.convertFile(TEST_CONFIG.samplePdfPath, outputPath);
        
        assert(fs.existsSync(outputPath), 'File conversion created output', 'file-conversion');
        
        const outputStats = fs.statSync(outputPath);
        assert(outputStats.size > 1000, 'Output file has reasonable size', 'file-conversion');
        
    } catch (error) {
        assert(false, `File conversion failed: ${error.message}`, 'file-conversion');
    }
}

/**
 * Test progress tracking
 */
async function testProgressTracking() {
    const converter = new PDFToDocxConverter();
    const testPDF = createTestPDF();
    
    let progressCallbacks = 0;
    let lastProgress = 0;
    
    converter.setProgressCallback((progress) => {
        progressCallbacks++;
        lastProgress = progress.percentage;
        
        assert(typeof progress.stage === 'string', 'Progress has stage', 'progress-tracking');
        assert(typeof progress.percentage === 'number', 'Progress has percentage', 'progress-tracking');
        assert(typeof progress.message === 'string', 'Progress has message', 'progress-tracking');
        assert(progress.percentage >= 0 && progress.percentage <= 100, 'Progress percentage valid', 'progress-tracking');
    });
    
    try {
        await converter.convertToDocx(testPDF);
        
        assert(progressCallbacks > 0, 'Progress callbacks were called', 'progress-tracking');
        assert(lastProgress === 100, 'Final progress is 100%', 'progress-tracking');
        
    } catch (error) {
        assert(false, `Progress tracking test failed: ${error.message}`, 'progress-tracking');
    }
}

/**
 * Test error handling
 */
async function testErrorHandling() {
    const converter = new PDFToDocxConverter();
    
    // Test with invalid PDF data
    const invalidPDF = Buffer.from('This is not a PDF file', 'utf8');
    
    try {
        await converter.convertToDocx(invalidPDF);
        assert(false, 'Should have thrown error for invalid PDF', 'error-handling');
    } catch (error) {
        assert(true, 'Correctly threw error for invalid PDF', 'error-handling');
        assert(error.message.includes('PDF'), 'Error message mentions PDF', 'error-handling');
    }
    
    // Test with non-existent file
    try {
        await converter.convertFile('nonexistent.pdf', 'output.docx');
        assert(false, 'Should have thrown error for non-existent file', 'error-handling');
    } catch (error) {
        assert(true, 'Correctly threw error for non-existent file', 'error-handling');
    }
}

/**
 * Test memory handling with large content
 */
async function testMemoryHandling() {
    const converter = new PDFToDocxConverter();
    
    // Create a larger test PDF (simulated)
    let largePdfContent = createTestPDF().toString();
    
    // Repeat content to simulate larger document
    for (let i = 0; i < 10; i++) {
        largePdfContent += `\nPage ${i + 2} content for memory testing.`;
    }
    
    const largePDF = Buffer.from(largePdfContent, 'utf8');
    
    try {
        const startMemory = process.memoryUsage().heapUsed;
        const docxBuffer = await converter.convertToDocx(largePDF);
        const endMemory = process.memoryUsage().heapUsed;
        
        assert(docxBuffer !== null, 'Large PDF conversion completed', 'memory-handling');
        
        const memoryIncrease = endMemory - startMemory;
        const memoryIncreaseMB = memoryIncrease / (1024 * 1024);
        
        // Memory increase should be reasonable (less than 100MB for test)
        assert(memoryIncreaseMB < 100, `Memory usage reasonable: ${memoryIncreaseMB.toFixed(2)}MB`, 'memory-handling');
        
    } catch (error) {
        assert(false, `Memory handling test failed: ${error.message}`, 'memory-handling');
    }
}

/**
 * Clean up test files
 */
function cleanupTests() {
    if (fs.existsSync(TEST_CONFIG.samplePdfPath)) {
        fs.unlinkSync(TEST_CONFIG.samplePdfPath);
    }
    
    if (fs.existsSync(TEST_CONFIG.outputDir)) {
        const files = fs.readdirSync(TEST_CONFIG.outputDir);
        files.forEach(file => {
            fs.unlinkSync(path.join(TEST_CONFIG.outputDir, file));
        });
        fs.rmdirSync(TEST_CONFIG.outputDir);
    }
}

/**
 * Run all tests
 */
async function runAllTests() {
    console.log('='.repeat(80));
    console.log('PDF to DOCX Converter - Test Suite');
    console.log('Based on PDFLibTool.dll.c JavaScript implementation');
    console.log('='.repeat(80));
    
    const startTime = Date.now();
    
    // Setup test environment
    setupTestEnvironment();
    
    // Run tests
    await runTest('Converter Instantiation', testConverterInstantiation);
    await runTest('Converter Options', testConverterOptions);
    await runTest('PDF Parsing', testPDFParsing);
    await runTest('Text Extraction', testTextExtraction);
    await runTest('Content Analysis', testContentAnalysis);
    await runTest('Style Processing', testStyleProcessing);
    await runTest('Document Building', testDocumentBuilding);
    await runTest('DOCX Generation', testDocxGeneration);
    await runTest('Full Conversion', testFullConversion);
    await runTest('File Conversion', testFileConversion);
    await runTest('Progress Tracking', testProgressTracking);
    await runTest('Error Handling', testErrorHandling);
    await runTest('Memory Handling', testMemoryHandling);
    
    // Display results
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    console.log('\n' + '='.repeat(80));
    console.log('TEST RESULTS SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total tests: ${testResults.total}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    console.log(`Success rate: ${Math.round((testResults.passed / testResults.total) * 100)}%`);
    console.log(`Execution time: ${duration}ms`);
    
    if (testResults.failed > 0) {
        console.log('\nFAILED TESTS:');
        testResults.errors.forEach(error => console.log(error));
    }
    
    // Cleanup
    console.log('\nCleaning up test files...');
    cleanupTests();
    
    console.log('\n' + '='.repeat(80));
    console.log('Test suite completed!');
    console.log('='.repeat(80));
    
    return testResults.failed === 0;
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
    runAllTests()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Test execution failed:', error);
            process.exit(1);
        });
}

export { runAllTests, testResults };
