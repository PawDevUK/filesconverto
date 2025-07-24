/**
 * Debug test runner to find which test is hanging
 */

import PDFToDocxConverter from './src/index.js';
import fs from 'fs';

const TEST_TIMEOUT = 5000; // 5 seconds per test

// Test results tracking
let testResults = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

// Test assertion helper
function assert(condition, message, testName) {
    testResults.total++;
    
    if (condition) {
        testResults.passed++;
        console.log(`✅ PASS: ${testName} - ${message}`);
        return true;
    } else {
        testResults.failed++;
        const error = `❌ FAIL: ${testName} - ${message}`;
        console.log(error);
        testResults.errors.push(error);
        return false;
    }
}

// Timeout wrapper for tests
function withTimeout(promise, timeout) {
    return Promise.race([
        promise,
        new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Test timeout')), timeout)
        )
    ]);
}

// Individual tests
async function testConverterInstantiation() {
    console.log('Testing converter instantiation...');
    const converter = new PDFToDocxConverter();
    
    assert(converter !== null, 'Converter instance created', 'instantiation');
    assert(typeof converter.convertToDocx === 'function', 'convertToDocx method exists', 'instantiation');
    assert(typeof converter.convertFile === 'function', 'convertFile method exists', 'instantiation');
    assert(typeof converter.getProgress === 'function', 'getProgress method exists', 'instantiation');
}

async function testConverterOptions() {
    console.log('Testing converter options...');
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

async function testPDFParsing() {
    console.log('Testing PDF parsing...');
    const converter = new PDFToDocxConverter();
    
    // Use existing test PDF
    const testPDFPath = './test/data/05-versions-space.pdf';
    const pdfBuffer = fs.readFileSync(testPDFPath);
    
    const pdfDocument = await converter.parser.parsePDF(pdfBuffer);
    
    assert(pdfDocument !== null, 'PDF document parsed', 'pdf-parsing');
    assert(pdfDocument.pages.length > 0, 'PDF has pages', 'pdf-parsing');
    assert(typeof pdfDocument.info === 'object', 'PDF info extracted', 'pdf-parsing');
}

async function testTextExtraction() {
    console.log('Testing text extraction...');
    const converter = new PDFToDocxConverter();
    
    // Use existing test PDF
    const testPDFPath = './test/data/05-versions-space.pdf';
    const pdfBuffer = fs.readFileSync(testPDFPath);
    
    const pdfDocument = await converter.parser.parsePDF(pdfBuffer);
    const textContent = await converter.textExtractor.extractText(pdfDocument);
    
    assert(textContent !== null, 'Text content extracted', 'text-extraction');
    assert(textContent.pages.length > 0, 'Text has pages', 'text-extraction');
}

async function testContentAnalysis() {
    console.log('Testing content analysis...');
    const converter = new PDFToDocxConverter();
    
    // Use existing test PDF
    const testPDFPath = './test/data/05-versions-space.pdf';
    const pdfBuffer = fs.readFileSync(testPDFPath);
    
    const pdfDocument = await converter.parser.parsePDF(pdfBuffer);
    const textContent = await converter.textExtractor.extractText(pdfDocument);
    const analyzedContent = await converter.contentAnalyzer.analyzeContent(textContent, pdfDocument);
    
    assert(analyzedContent !== null, 'Content analyzed', 'content-analysis');
}

async function testFullConversion() {
    console.log('Testing full conversion...');
    const converter = new PDFToDocxConverter();
    
    // Use existing test PDF
    const testPDFPath = './test/data/05-versions-space.pdf';
    const pdfBuffer = fs.readFileSync(testPDFPath);
    
    const docxBuffer = await converter.convertToDocx(pdfBuffer);
    
    assert(docxBuffer !== null, 'DOCX buffer created', 'full-conversion');
    assert(Buffer.isBuffer(docxBuffer), 'Result is buffer', 'full-conversion');
    assert(docxBuffer.length > 0, 'Buffer has content', 'full-conversion');
}

// Run tests with individual timeouts
async function runAllTests() {
    console.log('Starting debug test suite...');
    
    const tests = [
        { name: 'Converter Instantiation', func: testConverterInstantiation },
        { name: 'Converter Options', func: testConverterOptions },
        { name: 'PDF Parsing', func: testPDFParsing },
        { name: 'Text Extraction', func: testTextExtraction },
        { name: 'Content Analysis', func: testContentAnalysis },
        { name: 'Full Conversion', func: testFullConversion }
    ];
    
    for (const test of tests) {
        console.log(`\n--- Running: ${test.name} ---`);
        try {
            await withTimeout(test.func(), TEST_TIMEOUT);
            console.log(`✅ ${test.name} completed`);
        } catch (error) {
            console.log(`❌ ${test.name} failed: ${error.message}`);
            testResults.failed++;
            testResults.errors.push(`${test.name}: ${error.message}`);
        }
    }
    
    // Display results
    console.log('\n' + '='.repeat(50));
    console.log('DEBUG TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`Total tests run: ${tests.length}`);
    console.log(`Passed: ${testResults.passed}`);
    console.log(`Failed: ${testResults.failed}`);
    
    if (testResults.errors.length > 0) {
        console.log('\nErrors:');
        testResults.errors.forEach(error => console.log(error));
    }
    
    console.log('\nDebug test completed!');
}

runAllTests().catch(console.error);
