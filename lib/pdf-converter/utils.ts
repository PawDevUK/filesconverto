import { ConversionOptions } from './types';

/**
 * Validate if buffer is a valid PDF
 */
export function validatePDF(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 4) return false;
  
  // Check PDF header
  const header = buffer.slice(0, 4).toString();
  return header === '%PDF';
}

/**
 * Create canvas for rendering
 */
export function createCanvas(width: number, height: number, options: ConversionOptions): any {
  // This would typically use node-canvas or similar
  // Placeholder implementation
  return {
    width,
    height,
    getContext: () => ({
      fillStyle: options.background || 'white',
      fillRect: (x: number, y: number, w: number, h: number) => {},
      drawImage: (img: any, x: number, y: number, w: number, h: number) => {}
    })
  };
}

/**
 * Optimize image buffer
 */
export async function optimizeImage(buffer: Buffer, options: ConversionOptions): Promise<Buffer> {
  // This would typically use sharp or similar for image optimization
  // For now, return the original buffer
  return buffer;
}

/**
 * Get MIME type for format
 */
export function getMimeType(format: string): string {
  const mimeTypes: Record<string, string> = {
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'pdf': 'application/pdf'
  };
  
  return mimeTypes[format] || 'application/octet-stream';
}

/**
 * Generate unique filename
 */
export function generateFilename(originalName: string, format: string, pageNumber?: number): string {
  const timestamp = Date.now();
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const pageStr = pageNumber ? `_page_${pageNumber}` : '';
  
  return `${baseName}${pageStr}_${timestamp}.${format}`;
}

/**
 * Calculate optimal DPI based on output size
 */
export function calculateOptimalDPI(width: number, height: number, targetWidth?: number): number {
  if (!targetWidth) return 150; // Default DPI
  
  const scale = targetWidth / width;
  return Math.max(72, Math.min(300, Math.round(150 * scale)));
}

/**
 * Validate conversion options
 */
export function validateOptions(options: ConversionOptions): string[] {
  const errors: string[] = [];
  
  if (options.quality && (options.quality < 1 || options.quality > 100)) {
    errors.push('Quality must be between 1 and 100');
  }
  
  if (options.dpi && (options.dpi < 72 || options.dpi > 600)) {
    errors.push('DPI must be between 72 and 600');
  }
  
  if (options.scale && (options.scale <= 0 || options.scale > 5)) {
    errors.push('Scale must be between 0 and 5');
  }
  
  if (options.pageRange) {
    const { start, end } = options.pageRange;
    if (start && start < 1) {
      errors.push('Start page must be >= 1');
    }
    if (end && start && end < start) {
      errors.push('End page must be >= start page');
    }
  }
  
  return errors;
}