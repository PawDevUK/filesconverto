// lib/pdf-converter/types.ts
export interface ConversionOptions {
  outputFormat: 'png' | 'jpeg' | 'webp' | 'svg';
  quality?: number; // 1-100
  dpi?: number; // Default 150
  scale?: number; // Default 1.0
  pageRange?: {
    start?: number;
    end?: number;
  };
  background?: string; // Background color
  transparent?: boolean;
}

export interface ConversionResult {
  success: boolean;
  data?: Buffer | Buffer[];
  error?: string;
  metadata?: {
    pageCount: number;
    format: string;
    size: {
      width: number;
      height: number;
    };
  };
}

export interface PDFInfo {
  pageCount: number;
  title?: string;
  author?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
  encrypted: boolean;
  size: {
    width: number;
    height: number;
  };
}