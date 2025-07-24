// lib/pdf-converter/error-handler.ts
export class PDFConversionError extends Error {
  public code: string;
  public details?: Record<string, unknown>;

  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'PDFConversionError';
    this.code = code;
    this.details = details;
  }
}

export class ErrorHandler {
  private errorCodes = {
    INVALID_PDF: 'INVALID_PDF',
    CONVERSION_FAILED: 'CONVERSION_FAILED',
    UNSUPPORTED_FORMAT: 'UNSUPPORTED_FORMAT',
    INVALID_PAGE_RANGE: 'INVALID_PAGE_RANGE',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    MEMORY_ERROR: 'MEMORY_ERROR',
    PERMISSION_DENIED: 'PERMISSION_DENIED',
    CORRUPTED_FILE: 'CORRUPTED_FILE'
  };

  public handleError(error: unknown, context: string): PDFConversionError {
    console.error(`Error in ${context}:`, error);

    if (error instanceof PDFConversionError) {
      return error;
    }

    // Safely extract message property if it exists
    const errorMessage =
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as { message?: string }).message
        : undefined;

    // Map common errors to specific codes
    if (errorMessage?.includes('Invalid PDF')) {
      return new PDFConversionError(
        'The provided file is not a valid PDF',
        this.errorCodes.INVALID_PDF,
        { context, originalError: errorMessage }
      );
    }

    if (errorMessage?.includes('password') || errorMessage?.includes('encrypted')) {
      return new PDFConversionError(
        'PDF is password protected or encrypted',
        this.errorCodes.PERMISSION_DENIED,
        { context, originalError: errorMessage }
      );
    }

    if (errorMessage?.includes('memory') || errorMessage?.includes('heap')) {
      return new PDFConversionError(
        'Insufficient memory to process the PDF',
        this.errorCodes.MEMORY_ERROR,
        { context, originalError: errorMessage }
      );
    }

    // Default error
    return new PDFConversionError(
      `PDF conversion failed: ${errorMessage || 'Unknown error'}`,
      this.errorCodes.CONVERSION_FAILED,
      { context, originalError: errorMessage }
    );
  }

  public isRetryableError(error: PDFConversionError): boolean {
    const retryableCodes = [
      this.errorCodes.MEMORY_ERROR,
      this.errorCodes.CONVERSION_FAILED
    ];
    
    return retryableCodes.includes(error.code);
  }
}