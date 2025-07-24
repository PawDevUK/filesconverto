// lib/pdf-converter/index.ts
export { PDFConverter, pdfConverter } from './converter';
export { PDFProcessor } from './pdf-processor';
export { ErrorHandler, PDFConversionError } from './error-handler';
export * from './types';
export * from './utils';

// Default export for easy importing
import { pdfConverter } from './converter';
export default pdfConverter;