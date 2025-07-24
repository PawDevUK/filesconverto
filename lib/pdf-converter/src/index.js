/**
 * Main entry point for PDF to DOCX conversion
 * Based on analysis of PDFLibTool.dll.c structures
 */

import PDFParser from './core/PDFParser.js';
import TextExtractor from './core/TextExtractor.js';
import ContentAnalyzer from './core/ContentAnalyzer.js';
import DOCXGenerator from './docx/DOCXGenerator.js';
import DocumentBuilder from './docx/DocumentBuilder.js';
import StyleProcessor from './docx/StyleProcessor.js';

/**
 * Main PDF to DOCX converter class
 * Inspired by CPdfExport and CPdfExportOptions from original C code
 */
class PDFToDocxConverter {
    constructor(options = {}) {
        this.options = {
            preserveFormatting: options.preserveFormatting || true,
            extractImages: options.extractImages || true,
            includeFonts: options.includeFonts || false,
            pageBreaks: options.pageBreaks || true,
            quality: options.quality || 'high',
            ...options
        };
        
        this.parser = new PDFParser();
        this.textExtractor = new TextExtractor();
        this.contentAnalyzer = new ContentAnalyzer();
        this.docxGenerator = new DOCXGenerator();
        this.documentBuilder = new DocumentBuilder();
        this.styleProcessor = new StyleProcessor();
    }

    /**
     * Convert PDF buffer to DOCX buffer
     * Main conversion method inspired by CPdfExport::export_to_file
     */
    async convertToDocx(pdfBuffer) {
        try {
            // Step 1: Parse PDF structure (based on CPdfDocument classes)
            console.log('Parsing PDF structure...');
            const pdfDocument = await this.parser.parsePDF(pdfBuffer);

            // Step 2: Extract text content (based on CPdfTextChunk, CPdfPageContentProcessor)
            console.log('Extracting text content...');
            const textContent = await this.textExtractor.extractText(pdfDocument);

            // Step 3: Analyze content structure (based on CPageContentAnalizer2)
            console.log('Analyzing content structure...');
            const analyzedContent = await this.contentAnalyzer.analyzeContent(textContent, pdfDocument);

            // Step 4: Process styles and formatting (based on CPdfGraphicState, CPdfTextState)
            console.log('Processing styles and formatting...');
            const styledContent = await this.styleProcessor.processStyles(analyzedContent);

            // Step 5: Build DOCX document structure
            console.log('Building DOCX document...');
            const docxDocument = await this.documentBuilder.buildDocument(styledContent, this.options);

            // Step 6: Generate final DOCX buffer
            console.log('Generating DOCX file...');
            const docxBuffer = await this.docxGenerator.generateDocx(docxDocument);

            return docxBuffer;

        } catch (error) {
            throw new Error(`PDF to DOCX conversion failed: ${error.message}`);
        }
    }

    /**
     * Convert PDF file to DOCX file
     */
    async convertFile(inputPath, outputPath) {
        const fs = await import('fs');
        const pdfBuffer = fs.readFileSync(inputPath);
        const docxBuffer = await this.convertToDocx(pdfBuffer);
        fs.writeFileSync(outputPath, docxBuffer);
        return outputPath;
    }

    /**
     * Get conversion progress (inspired by CPdfProgress)
     */
    getProgress() {
        return {
            stage: this.currentStage || 'idle',
            percentage: this.progressPercentage || 0,
            message: this.statusMessage || 'Ready'
        };
    }

    /**
     * Set progress callback
     */
    setProgressCallback(callback) {
        this.progressCallback = callback;
    }

    /**
     * Update progress internally
     */
    _updateProgress(stage, percentage, message) {
        this.currentStage = stage;
        this.progressPercentage = percentage;
        this.statusMessage = message;
        
        if (this.progressCallback) {
            this.progressCallback({
                stage,
                percentage,
                message
            });
        }
    }
}

export default PDFToDocxConverter;
