/**
 * Simple test to debug the hanging issue
 */

import PDFToDocxConverter from './src/index.js';

import fs from 'fs';

console.log('Starting simple test...');

const converter = new PDFToDocxConverter();
console.log('Converter created');

// Use existing test PDF
const testPDFPath = './test/data/05-versions-space.pdf';
const pdfBuffer = fs.readFileSync(testPDFPath);
console.log('Test PDF loaded from:', testPDFPath);

try {
    const result = await converter.convertToDocx(pdfBuffer);
    console.log('Conversion completed successfully!');
    console.log('Result type:', typeof result);
    console.log('Result length:', result?.length || 'null');
} catch (error) {
    console.error('Conversion failed:', error.message);
    console.error('Stack:', error.stack);
}

console.log('Test completed');
