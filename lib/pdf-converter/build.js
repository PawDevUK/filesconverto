/**
 * Build script for PDF to DOCX converter
 * Validates the implementation and prepares for distribution
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Build configuration
 */
const BUILD_CONFIG = {
    srcDir: path.join(__dirname, 'src'),
    distDir: path.join(__dirname, 'dist'),
    docsDir: path.join(__dirname, 'docs'),
    outputFile: 'pdf-to-docx-converter.js',
    minify: false,
    includeSource: true
};

/**
 * Validate project structure
 */
function validateProjectStructure() {
    console.log('Validating project structure...');
    
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
        console.error('Missing required files:');
        missingFiles.forEach(file => console.error(`  - ${file}`));
        return false;
    }
    
    console.log('✅ Project structure validated');
    return true;
}

/**
 * Check dependencies
 */
function checkDependencies() {
    console.log('Checking dependencies...');
    
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const dependencies = Object.keys(packageJson.dependencies || {});
        
        console.log(`Found ${dependencies.length} dependencies:`);
        dependencies.forEach(dep => console.log(`  - ${dep}`));
        
        console.log('✅ Dependencies checked');
        return true;
    } catch (error) {
        console.error('❌ Failed to check dependencies:', error.message);
        return false;
    }
}

/**
 * Validate module imports
 */
async function validateModuleImports() {
    console.log('Validating module imports...');
    
    try {
        // Try to import main module
        const { default: PDFToDocxConverter } = await import('./src/index.js');
        
        // Check if constructor works
        const converter = new PDFToDocxConverter();
        
        // Verify key methods exist
        const requiredMethods = ['convertToDocx', 'convertFile', 'getProgress', 'setProgressCallback'];
        const missingMethods = [];
        
        for (const method of requiredMethods) {
            if (typeof converter[method] !== 'function') {
                missingMethods.push(method);
            }
        }
        
        if (missingMethods.length > 0) {
            console.error('Missing required methods:');
            missingMethods.forEach(method => console.error(`  - ${method}`));
            return false;
        }
        
        console.log('✅ Module imports validated');
        return true;
    } catch (error) {
        console.error('❌ Module validation failed:', error.message);
        return false;
    }
}

/**
 * Create distribution directory
 */
function createDistDirectory() {
    console.log('Creating distribution directory...');
    
    if (fs.existsSync(BUILD_CONFIG.distDir)) {
        fs.rmSync(BUILD_CONFIG.distDir, { recursive: true });
    }
    
    fs.mkdirSync(BUILD_CONFIG.distDir, { recursive: true });
    
    console.log('✅ Distribution directory created');
}

/**
 * Copy source files
 */
function copySourceFiles() {
    console.log('Copying source files...');
    
    const sourceFiles = [
        'src/',
        'package.json',
        'README.md'
    ];
    
    sourceFiles.forEach(source => {
        const sourcePath = path.join(__dirname, source);
        const destPath = path.join(BUILD_CONFIG.distDir, source);
        
        if (fs.statSync(sourcePath).isDirectory()) {
            copyDirectoryRecursive(sourcePath, destPath);
        } else {
            fs.copyFileSync(sourcePath, destPath);
        }
    });
    
    console.log('✅ Source files copied');
}

/**
 * Copy directory recursively
 */
function copyDirectoryRecursive(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    
    files.forEach(file => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        
        if (fs.statSync(srcPath).isDirectory()) {
            copyDirectoryRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
}

/**
 * Generate documentation
 */
function generateDocumentation() {
    console.log('Generating documentation...');
    
    if (!fs.existsSync(BUILD_CONFIG.docsDir)) {
        fs.mkdirSync(BUILD_CONFIG.docsDir, { recursive: true });
    }
    
    // Create API documentation
    const apiDoc = generateAPIDocumentation();
    fs.writeFileSync(path.join(BUILD_CONFIG.docsDir, 'API.md'), apiDoc);
    
    // Create examples documentation
    const examplesDoc = generateExamplesDocumentation();
    fs.writeFileSync(path.join(BUILD_CONFIG.docsDir, 'EXAMPLES.md'), examplesDoc);
    
    console.log('✅ Documentation generated');
}

/**
 * Generate API documentation
 */
function generateAPIDocumentation() {
    return `# PDF to DOCX Converter - API Documentation

## Class: PDFToDocxConverter

Main converter class for PDF to DOCX conversion.

### Constructor

\`\`\`javascript
new PDFToDocxConverter(options)
\`\`\`

**Parameters:**
- \`options\` (Object) - Conversion options
  - \`preserveFormatting\` (boolean) - Preserve original formatting (default: true)
  - \`extractImages\` (boolean) - Extract and convert images (default: true)
  - \`includeFonts\` (boolean) - Include font information (default: false)
  - \`pageBreaks\` (boolean) - Maintain page breaks (default: true)
  - \`quality\` (string) - Conversion quality: 'low', 'medium', 'high' (default: 'high')

### Methods

#### convertToDocx(pdfBuffer)

Convert PDF buffer to DOCX buffer.

**Parameters:**
- \`pdfBuffer\` (Buffer) - PDF file content as Buffer

**Returns:**
- Promise<Buffer> - DOCX file content as Buffer

**Example:**
\`\`\`javascript
const pdfBuffer = fs.readFileSync('input.pdf');
const docxBuffer = await converter.convertToDocx(pdfBuffer);
fs.writeFileSync('output.docx', docxBuffer);
\`\`\`

#### convertFile(inputPath, outputPath)

Convert PDF file to DOCX file.

**Parameters:**
- \`inputPath\` (string) - Path to input PDF file
- \`outputPath\` (string) - Path for output DOCX file

**Returns:**
- Promise<string> - Path to output file

**Example:**
\`\`\`javascript
await converter.convertFile('input.pdf', 'output.docx');
\`\`\`

#### getProgress()

Get current conversion progress.

**Returns:**
- Object - Progress information
  - \`stage\` (string) - Current processing stage
  - \`percentage\` (number) - Completion percentage (0-100)
  - \`message\` (string) - Status message

#### setProgressCallback(callback)

Set progress callback function.

**Parameters:**
- \`callback\` (Function) - Progress callback function

**Example:**
\`\`\`javascript
converter.setProgressCallback((progress) => {
    console.log(\`\${progress.stage}: \${progress.percentage}%\`);
});
\`\`\`

## Conversion Process

The conversion process consists of the following stages:

1. **PDF Parsing** - Parse PDF structure and extract document information
2. **Text Extraction** - Extract text content with positioning and formatting
3. **Content Analysis** - Analyze content structure and detect elements
4. **Style Processing** - Convert PDF formatting to DOCX styles
5. **Document Building** - Create DOCX document structure
6. **DOCX Generation** - Generate final DOCX file

## Error Handling

All methods may throw errors for various conditions:

- Invalid PDF format
- Corrupted PDF data
- File system errors
- Memory allocation errors
- Processing timeouts

Always wrap conversion calls in try-catch blocks:

\`\`\`javascript
try {
    const docxBuffer = await converter.convertToDocx(pdfBuffer);
    // Handle success
} catch (error) {
    console.error('Conversion failed:', error.message);
    // Handle error
}
\`\`\`
`;
}

/**
 * Generate examples documentation
 */
function generateExamplesDocumentation() {
    return `# PDF to DOCX Converter - Examples

## Basic Usage

### Simple Conversion

\`\`\`javascript
import PDFToDocxConverter from 'pdf-to-docx-converter';
import fs from 'fs';

const converter = new PDFToDocxConverter();

// Convert PDF buffer to DOCX buffer
const pdfBuffer = fs.readFileSync('document.pdf');
const docxBuffer = await converter.convertToDocx(pdfBuffer);
fs.writeFileSync('document.docx', docxBuffer);
\`\`\`

### File-based Conversion

\`\`\`javascript
const converter = new PDFToDocxConverter();

// Convert files directly
await converter.convertFile('input.pdf', 'output.docx');
console.log('Conversion complete!');
\`\`\`

## Advanced Usage

### Custom Options

\`\`\`javascript
const converter = new PDFToDocxConverter({
    preserveFormatting: true,
    extractImages: true,
    includeFonts: false,
    pageBreaks: true,
    quality: 'high'
});

const docxBuffer = await converter.convertToDocx(pdfBuffer);
\`\`\`

### Progress Tracking

\`\`\`javascript
const converter = new PDFToDocxConverter();

converter.setProgressCallback((progress) => {
    const bar = '█'.repeat(Math.floor(progress.percentage / 5));
    const spaces = '░'.repeat(20 - Math.floor(progress.percentage / 5));
    
    process.stdout.write(\`\\r[\${bar}\${spaces}] \${progress.percentage}% - \${progress.message}\`);
    
    if (progress.percentage === 100) {
        console.log('\\nConversion complete!');
    }
});

await converter.convertToDocx(pdfBuffer);
\`\`\`

### Error Handling

\`\`\`javascript
const converter = new PDFToDocxConverter();

try {
    const docxBuffer = await converter.convertToDocx(pdfBuffer);
    console.log('Conversion successful');
} catch (error) {
    if (error.message.includes('PDF parsing')) {
        console.error('Invalid PDF format');
    } else if (error.message.includes('memory')) {
        console.error('Insufficient memory for conversion');
    } else {
        console.error('Conversion failed:', error.message);
    }
}
\`\`\`

## Batch Processing

### Convert Multiple Files

\`\`\`javascript
import path from 'path';
import { promises as fs } from 'fs';

const converter = new PDFToDocxConverter();

async function convertBatch(inputDir, outputDir) {
    const files = await fs.readdir(inputDir);
    const pdfFiles = files.filter(file => file.endsWith('.pdf'));
    
    for (const pdfFile of pdfFiles) {
        const inputPath = path.join(inputDir, pdfFile);
        const outputPath = path.join(outputDir, pdfFile.replace('.pdf', '.docx'));
        
        try {
            await converter.convertFile(inputPath, outputPath);
            console.log(\`✅ Converted: \${pdfFile}\`);
        } catch (error) {
            console.error(\`❌ Failed: \${pdfFile} - \${error.message}\`);
        }
    }
}

await convertBatch('./input', './output');
\`\`\`

### Parallel Processing

\`\`\`javascript
async function convertParallel(pdfFiles) {
    const converters = pdfFiles.map(() => new PDFToDocxConverter());
    
    const promises = pdfFiles.map(async (pdfFile, index) => {
        const converter = converters[index];
        const pdfBuffer = await fs.readFile(pdfFile);
        return converter.convertToDocx(pdfBuffer);
    });
    
    const docxBuffers = await Promise.all(promises);
    
    // Save results
    for (let i = 0; i < docxBuffers.length; i++) {
        const outputPath = pdfFiles[i].replace('.pdf', '.docx');
        await fs.writeFile(outputPath, docxBuffers[i]);
    }
}
\`\`\`

## Integration Examples

### Express.js Web Service

\`\`\`javascript
import express from 'express';
import multer from 'multer';
import PDFToDocxConverter from 'pdf-to-docx-converter';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const converter = new PDFToDocxConverter();

app.post('/convert', upload.single('pdf'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file provided' });
        }
        
        const docxBuffer = await converter.convertToDocx(req.file.buffer);
        
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');
        res.send(docxBuffer);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('PDF to DOCX service running on port 3000');
});
\`\`\`

### Command Line Tool

\`\`\`javascript
#!/usr/bin/env node

import PDFToDocxConverter from 'pdf-to-docx-converter';
import { program } from 'commander';

program
    .argument('<input>', 'Input PDF file')
    .argument('<output>', 'Output DOCX file')
    .option('-q, --quality <quality>', 'Conversion quality (low, medium, high)', 'high')
    .option('-f, --formatting', 'Preserve formatting', true)
    .option('-i, --images', 'Extract images', true)
    .action(async (input, output, options) => {
        const converter = new PDFToDocxConverter({
            quality: options.quality,
            preserveFormatting: options.formatting,
            extractImages: options.images
        });
        
        converter.setProgressCallback((progress) => {
            console.log(\`\${progress.stage}: \${progress.percentage}%\`);
        });
        
        try {
            await converter.convertFile(input, output);
            console.log('Conversion completed successfully!');
        } catch (error) {
            console.error('Conversion failed:', error.message);
            process.exit(1);
        }
    });

program.parse();
\`\`\`

## Performance Tips

### Memory Management

\`\`\`javascript
// For large files, consider processing in chunks
const converter = new PDFToDocxConverter({
    quality: 'medium' // Lower quality uses less memory
});

// Monitor memory usage
const initialMemory = process.memoryUsage().heapUsed;
const docxBuffer = await converter.convertToDocx(pdfBuffer);
const finalMemory = process.memoryUsage().heapUsed;

console.log(\`Memory used: \${(finalMemory - initialMemory) / 1024 / 1024} MB\`);
\`\`\`

### Optimization Settings

\`\`\`javascript
// For fastest conversion (lower quality)
const fastConverter = new PDFToDocxConverter({
    quality: 'low',
    extractImages: false,
    preserveFormatting: false
});

// For best quality (slower)
const qualityConverter = new PDFToDocxConverter({
    quality: 'high',
    extractImages: true,
    preserveFormatting: true,
    includeFonts: true
});
\`\`\`
`;
}

/**
 * Validate build output
 */
function validateBuildOutput() {
    console.log('Validating build output...');
    
    const requiredFiles = [
        'package.json',
        'README.md',
        'src/index.js'
    ];
    
    for (const file of requiredFiles) {
        const filePath = path.join(BUILD_CONFIG.distDir, file);
        if (!fs.existsSync(filePath)) {
            console.error(`❌ Missing file in dist: ${file}`);
            return false;
        }
    }
    
    console.log('✅ Build output validated');
    return true;
}

/**
 * Generate build summary
 */
function generateBuildSummary() {
    console.log('\n' + '='.repeat(80));
    console.log('BUILD SUMMARY');
    console.log('='.repeat(80));
    
    const distStats = fs.statSync(BUILD_CONFIG.distDir);
    console.log(`Distribution directory: ${BUILD_CONFIG.distDir}`);
    console.log(`Created: ${distStats.birthtime}`);
    
    const files = getAllFiles(BUILD_CONFIG.distDir);
    console.log(`Total files: ${files.length}`);
    
    const totalSize = files.reduce((sum, file) => {
        return sum + fs.statSync(file).size;
    }, 0);
    
    console.log(`Total size: ${(totalSize / 1024).toFixed(2)} KB`);
    
    console.log('\nGenerated files:');
    files.forEach(file => {
        const relativePath = path.relative(__dirname, file);
        const size = fs.statSync(file).size;
        console.log(`  ${relativePath} (${size} bytes)`);
    });
    
    console.log('\n✅ Build completed successfully!');
}

/**
 * Get all files recursively
 */
function getAllFiles(dir) {
    const files = [];
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
        const itemPath = path.join(dir, item);
        
        if (fs.statSync(itemPath).isDirectory()) {
            files.push(...getAllFiles(itemPath));
        } else {
            files.push(itemPath);
        }
    });
    
    return files;
}

/**
 * Main build function
 */
async function build() {
    console.log('='.repeat(80));
    console.log('PDF to DOCX Converter - Build Process');
    console.log('='.repeat(80));
    
    const startTime = Date.now();
    
    try {
        // Validation steps
        if (!validateProjectStructure()) {
            process.exit(1);
        }
        
        if (!checkDependencies()) {
            process.exit(1);
        }
        
        if (!await validateModuleImports()) {
            process.exit(1);
        }
        
        // Build steps
        createDistDirectory();
        copySourceFiles();
        generateDocumentation();
        
        if (!validateBuildOutput()) {
            process.exit(1);
        }
        
        const endTime = Date.now();
        const duration = endTime - startTime;
        
        generateBuildSummary();
        console.log(`\nBuild time: ${duration}ms`);
        
        return true;
        
    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Handle command line execution
if (import.meta.url === `file://${process.argv[1]}`) {
    build()
        .then(() => {
            console.log('\nBuild process completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('Build process failed:', error);
            process.exit(1);
        });
}

export { build, BUILD_CONFIG };
