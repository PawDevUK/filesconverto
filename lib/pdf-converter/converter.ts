// lib/pdf-converter/converter.ts
import { PDFProcessor } from './pdf-processor';
import { ConversionOptions, ConversionResult, PDFInfo } from './types';
import { validateOptions, getMimeType, generateFilename } from './utils';
import { PDFConversionError, ErrorHandler } from './error-handler';

export class PDFConverter {
  private processor: PDFProcessor;
  private errorHandler: ErrorHandler;
  private maxFileSize: number = 50 * 1024 * 1024; // 50MB

  constructor() {
    this.processor = PDFProcessor.getInstance();
    this.errorHandler = new ErrorHandler();
  }

  /**
   * Main conversion method
   */
  public async convert(
    pdfBuffer: Buffer,
    options: ConversionOptions
  ): Promise<ConversionResult> {
    try {
      // Validate file size
      if (pdfBuffer.length > this.maxFileSize) {
        throw new PDFConversionError(
          'File size exceeds maximum limit',
          'FILE_TOO_LARGE'
        );
      }

      // Validate options
      const validationErrors = validateOptions(options);
      if (validationErrors.length > 0) {
        throw new PDFConversionError(
          `Invalid options: ${validationErrors.join(', ')}`,
          'INVALID_OPTIONS'
        );
      }

      // Convert to images
      return await this.processor.convertToImages(pdfBuffer, options);
    } catch (error) {
      return {
        success: false,
        error: this.errorHandler.handleError(error, 'convert').message
      };
    }
  }

  /**
   * Get PDF information
   */
  public async getInfo(pdfBuffer: Buffer): Promise<PDFInfo> {
    return await this.processor.extractPDFInfo(pdfBuffer);
  }

  /**
   * Split PDF
   */
  public async split(
    pdfBuffer: Buffer,
    pageRanges: Array<{ start: number; end: number }>
  ): Promise<ConversionResult> {
    return await this.processor.splitPDF(pdfBuffer, { pageRanges });
  }

  /**
   * Merge PDFs
   */
  public async merge(pdfBuffers: Buffer[]): Promise<ConversionResult> {
    return await this.processor.mergePDFs(pdfBuffers);
  }

  /**
   * Convert single page
   */
  public async convertPage(
    pdfBuffer: Buffer,
    pageNumber: number,
    options: ConversionOptions
  ): Promise<ConversionResult> {
    const pageOptions = {
      ...options,
      pageRange: { start: pageNumber, end: pageNumber }
    };
    
    return await this.convert(pdfBuffer, pageOptions);
  }

  /**
   * Batch convert multiple PDFs
   */
  public async batchConvert(
    files: Array<{ buffer: Buffer; name: string }>,
    options: ConversionOptions
  ): Promise<Array<ConversionResult & { fileName: string }>> {
    const results: Array<ConversionResult & { fileName: string }> = [];

    for (const file of files) {
      const result = await this.convert(file.buffer, options);
      results.push({
        ...result,
        fileName: generateFilename(file.name, options.outputFormat)
      });
    }

    return results;
  }

  /**
   * Set maximum file size
   */
  public setMaxFileSize(size: number): void {
    this.maxFileSize = size;
  }
}

// Export singleton instance
export const pdfConverter = new PDFConverter();