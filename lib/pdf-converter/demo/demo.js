/**
 * Demo script for PDF to DOCX conversion
 * Demonstrates the JavaScript implementation based on PDFLibTool.dll.c analysis
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFToDocxConverter from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Demo configuration
 */
const DEMO_CONFIG = {
    inputPath: path.join(__dirname, 'sample.pdf'),
    outputPath: path.join(__dirname, 'output.docx'),
    logLevel: 'verbose'
};

/**
 * Create a sample PDF for demonstration (mock data)
 */
function createSamplePDF() {
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
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(Sample PDF Content) Tj
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
0000000365 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
446
%%EOF`;

    return Buffer.from(sampleContent, 'utf8');
}

/**
 * Log message with timestamp
 */
function log(message, level = 'info') {
    if (DEMO_CONFIG.logLevel === 'verbose' || level === 'error') {
        const timestamp = new Date().toISOString();
        const prefix = level.toUpperCase().padEnd(7);
        console.log(`[${timestamp}] ${prefix} ${message}`);
    }
}

/**
 * Progress callback for conversion
 */
function onProgress(progress) {
    const bar = '█'.repeat(Math.floor(progress.percentage / 5)) + 
                '░'.repeat(20 - Math.floor(progress.percentage / 5));
    
    process.stdout.write(`\r[${bar}] ${progress.percentage}% - ${progress.message}`);
    
    if (progress.percentage === 100) {
        console.log(); // New line after completion
    }
}

/**
 * Demonstrate basic conversion
 */
async function demonstrateBasicConversion() {
    log('Starting basic PDF to DOCX conversion demonstration');
    
    try {
        // Create converter instance
        const converter = new PDFToDocxConverter({
            preserveFormatting: true,
            extractImages: true,
            includeFonts: false,
            pageBreaks: true,
            quality: 'high'
        });

        // Set progress callback
        converter.setProgressCallback(onProgress);

        // Create sample PDF if it doesn't exist
        if (!fs.existsSync(DEMO_CONFIG.inputPath)) {
            log('Creating sample PDF for demonstration');
            const samplePDF = createSamplePDF();
            fs.writeFileSync(DEMO_CONFIG.inputPath, samplePDF);
        }

        // Read PDF file
        log(`Reading PDF file: ${DEMO_CONFIG.inputPath}`);
        const pdfBuffer = fs.readFileSync(DEMO_CONFIG.inputPath);
        log(`PDF file size: ${pdfBuffer.length} bytes`);

        // Convert to DOCX
        log('Starting conversion process...');
        const docxBuffer = await converter.convertToDocx(pdfBuffer);
        log(`Conversion completed. DOCX size: ${docxBuffer.length} bytes`);

        // Save output file
        log(`Saving DOCX file: ${DEMO_CONFIG.outputPath}`);
        fs.writeFileSync(DEMO_CONFIG.outputPath, docxBuffer);

        // Get conversion progress
        const finalProgress = converter.getProgress();
        log(`Final status: ${finalProgress.stage} - ${finalProgress.message}`);

        log('Basic conversion demonstration completed successfully!');
        return true;

    } catch (error) {
        log(`Conversion failed: ${error.message}`, 'error');
        console.error(error.stack);
        return false;
    }
}

/**
 * Demonstrate advanced conversion options
 */
async function demonstrateAdvancedConversion() {
    log('Starting advanced conversion demonstration');
    
    try {
        // Create converter with advanced options
        const converter = new PDFToDocxConverter({
            preserveFormatting: true,
            extractImages: true,
            includeFonts: true,
            pageBreaks: true,
            quality: 'high',
            generateToc: true,
            embedFonts: false,
            compressImages: true
        });

        // Read PDF file
        const pdfBuffer = fs.readFileSync(DEMO_CONFIG.inputPath);

        // Convert with detailed logging
        log('Processing with advanced options...');
        
        converter.setProgressCallback((progress) => {
            log(`Stage: ${progress.stage} - ${progress.percentage}% - ${progress.message}`);
        });

        const docxBuffer = await converter.convertToDocx(pdfBuffer);

        // Save with different filename
        const advancedOutputPath = path.join(__dirname, 'output_advanced.docx');
        fs.writeFileSync(advancedOutputPath, docxBuffer);

        log(`Advanced conversion saved to: ${advancedOutputPath}`);
        log('Advanced conversion demonstration completed!');
        
        return true;

    } catch (error) {
        log(`Advanced conversion failed: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Demonstrate file-based conversion
 */
async function demonstrateFileConversion() {
    log('Starting file-based conversion demonstration');
    
    try {
        const converter = new PDFToDocxConverter();
        
        const inputFile = DEMO_CONFIG.inputPath;
        const outputFile = path.join(__dirname, 'output_file.docx');

        log(`Converting ${inputFile} to ${outputFile}`);
        
        await converter.convertFile(inputFile, outputFile);
        
        log('File-based conversion completed successfully!');
        
        // Verify output file
        if (fs.existsSync(outputFile)) {
            const stats = fs.statSync(outputFile);
            log(`Output file size: ${stats.size} bytes`);
        }
        
        return true;

    } catch (error) {
        log(`File conversion failed: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Demonstrate error handling
 */
async function demonstrateErrorHandling() {
    log('Starting error handling demonstration');
    
    try {
        const converter = new PDFToDocxConverter();
        
        // Try to convert invalid PDF data
        const invalidPDF = Buffer.from('This is not a PDF file', 'utf8');
        
        try {
            await converter.convertToDocx(invalidPDF);
            log('Unexpected: conversion should have failed', 'error');
        } catch (error) {
            log(`Expected error caught: ${error.message}`);
        }

        // Try to convert non-existent file
        try {
            await converter.convertFile('nonexistent.pdf', 'output.docx');
            log('Unexpected: file conversion should have failed', 'error');
        } catch (error) {
            log(`Expected file error caught: ${error.message}`);
        }

        log('Error handling demonstration completed');
        return true;

    } catch (error) {
        log(`Error handling demo failed: ${error.message}`, 'error');
        return false;
    }
}

/**
 * Display conversion statistics
 */
function displayStatistics() {
    log('Conversion Statistics:');
    
    const outputFiles = [
        'output.docx',
        'output_advanced.docx',
        'output_file.docx'
    ];

    outputFiles.forEach(filename => {
        const filepath = path.join(__dirname, filename);
        if (fs.existsSync(filepath)) {
            const stats = fs.statSync(filepath);
            log(`  ${filename}: ${stats.size} bytes (${(stats.size / 1024).toFixed(2)} KB)`);
        }
    });
}

/**
 * Clean up demo files
 */
function cleanup() {
    log('Cleaning up demo files...');
    
    const filesToClean = [
        'sample.pdf',
        'output.docx',
        'output_advanced.docx',
        'output_file.docx'
    ];

    filesToClean.forEach(filename => {
        const filepath = path.join(__dirname, filename);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            log(`  Removed: ${filename}`);
        }
    });
}

/**
 * Main demo function
 */
async function runDemo() {
    console.log('='.repeat(80));
    console.log('PDF to DOCX Converter - JavaScript Implementation Demo');
    console.log('Based on PDFLibTool.dll.c analysis and conversion');
    console.log('='.repeat(80));
    
    const startTime = Date.now();
    let totalTests = 0;
    let passedTests = 0;

    // Run demonstrations
    const demonstrations = [
        { name: 'Basic Conversion', func: demonstrateBasicConversion },
        { name: 'Advanced Conversion', func: demonstrateAdvancedConversion },
        { name: 'File-based Conversion', func: demonstrateFileConversion },
        { name: 'Error Handling', func: demonstrateErrorHandling }
    ];

    for (const demo of demonstrations) {
        console.log('\n' + '-'.repeat(60));
        log(`Running ${demo.name} demonstration`);
        console.log('-'.repeat(60));
        
        totalTests++;
        const success = await demo.func();
        if (success) {
            passedTests++;
            log(`✅ ${demo.name} passed`);
        } else {
            log(`❌ ${demo.name} failed`, 'error');
        }
    }

    // Display results
    console.log('\n' + '='.repeat(80));
    log('Demo Results Summary');
    console.log('='.repeat(80));
    
    log(`Total demonstrations: ${totalTests}`);
    log(`Passed: ${passedTests}`);
    log(`Failed: ${totalTests - passedTests}`);
    log(`Success rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    const duration = Date.now() - startTime;
    log(`Total execution time: ${duration}ms`);

    // Display statistics
    console.log('\n' + '-'.repeat(60));
    displayStatistics();

    // Cleanup (optional)
    console.log('\n' + '-'.repeat(60));
    const shouldCleanup = process.argv.includes('--cleanup');
    if (shouldCleanup) {
        cleanup();
    } else {
        log('Demo files preserved. Use --cleanup flag to remove them.');
    }

    console.log('\n' + '='.repeat(80));
    log('PDF to DOCX Converter demonstration completed!');
    console.log('='.repeat(80));

    return passedTests === totalTests;
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
    runDemo()
        .then(success => {
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('Demo execution failed:', error);
            process.exit(1);
        });
}

export { runDemo, demonstrateBasicConversion, demonstrateAdvancedConversion };
