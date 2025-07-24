/**
 * Debug build script to find where it hangs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting build debug...');

// Step 1: Validate project structure
console.log('Step 1: Validating project structure...');
const requiredFiles = [
    'src/index.js',
    'src/core/PDFParser.js',
    'src/core/TextExtractor.js',
    'src/core/ContentAnalyzer.js',
    'src/docx/StyleProcessor.js',
    'src/docx/DocumentBuilder.js',
    'src/docx/DOCXGenerator.js',
    'package.json',
    'README.md'
];

const missingFiles = [];
for (const file of requiredFiles) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) {
        missingFiles.push(file);
    }
}

if (missingFiles.length > 0) {
    console.error('Missing files:', missingFiles);
} else {
    console.log('✅ All required files found');
}

// Step 2: Check dependencies
console.log('Step 2: Checking dependencies...');
try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    console.log(`✅ Found ${dependencies.length} dependencies`);
} catch (error) {
    console.error('❌ Failed to check dependencies:', error.message);
}

// Step 3: Try to import main module
console.log('Step 3: Importing main module...');
try {
    const { default: PDFToDocxConverter } = await import('./src/index.js');
    console.log('✅ Main module imported');
    
    console.log('Step 4: Creating converter instance...');
    const converter = new PDFToDocxConverter();
    console.log('✅ Converter instance created');
    
    console.log('Step 5: Checking methods...');
    const requiredMethods = ['convertToDocx', 'convertFile', 'getProgress', 'setProgressCallback'];
    for (const method of requiredMethods) {
        if (typeof converter[method] !== 'function') {
            console.error(`❌ Missing method: ${method}`);
        } else {
            console.log(`✅ Method found: ${method}`);
        }
    }
    
} catch (error) {
    console.error('❌ Module import failed:', error.message);
}

console.log('Build debug completed!');
