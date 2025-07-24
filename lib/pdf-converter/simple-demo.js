/**
 * Simple working demo for PDF to DOCX conversion
 */

import fs from 'fs';
import PDFToDocxConverter from './src/index.js';

// Path import removed as unused
// const __filename = fileURLToPath(import.meta.url);
// __dirname defined for potential future use
// const __dirname = path.dirname(__filename);

console.log('='.repeat(60));
console.log('PDF to DOCX Converter - Simple Demo');
console.log('='.repeat(60));

async function runDemo() {
    try {
        // Create converter instance
        console.log('1. Creating converter...');
        const converter = new PDFToDocxConverter({
            preserveFormatting: true,
            extractImages: true,
            pageBreaks: true,
            quality: 'high'
        });
        console.log('✅ Converter created');

        // Use the test PDF we know works
        const inputPath = './test/data/05-versions-space.pdf';
        const outputPath = './demo-output.docx';

        console.log('2. Reading input PDF...');
        const pdfBuffer = fs.readFileSync(inputPath);
        console.log(`✅ PDF read (${pdfBuffer.length} bytes)`);

        console.log('3. Converting PDF to DOCX...');
        const docxBuffer = await converter.convertToDocx(pdfBuffer);
        console.log(`✅ Conversion completed (${docxBuffer.length} bytes)`);

        console.log('4. Writing output file...');
        fs.writeFileSync(outputPath, docxBuffer);
        console.log(`✅ Output written to: ${outputPath}`);

        // Show file stats
        const stats = fs.statSync(outputPath);
        console.log(`✅ File size: ${stats.size} bytes`);

        console.log('\n' + '='.repeat(60));
        console.log('Demo completed successfully!');
        console.log('='.repeat(60));

        return true;

    } catch (error) {
        console.error('❌ Demo failed:', error.message);
        console.error('Stack:', error.stack);
        return false;
    }
}

// Run the demo
runDemo()
    .then(success => {
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('Demo execution failed:', error);
        process.exit(1);
    });
