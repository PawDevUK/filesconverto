// Upload-related type definitions
// export type UploadStatus = 'pending' | 'converting' | 'completed' | 'failed';

export interface UploadMetadata {
  pageCount?: number;
  format?: string;
  size?: {
    width: number;
    height: number;
  };
}

export interface ConversionResponse {
  pageCount?: number;
  metadata?: UploadMetadata;
  message?: string;
  fileUrl?: string;
  fileUrls?: string[];
}

export interface UploadState {
  isLoading: boolean;
  error?: string;
  response?: ConversionResponse;
}

// export interface Upload {
//   id: string;
//   fileName: string;
//   originalFormat: string;
//   targetFormat: string;
//   status: UploadStatus;
//   progress?: number;
//   downloadUrl?: string;
//   uploadTime: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

export interface UploadOptions {
  format: string;
  quality: number;
  dpi: number;
}

// Component Props Types
export interface UploadsListProps {
  uploads: UploadsInfoTypes[];
  onDownload?: (upload: UploadsInfoTypes) => void;
  onRetry?: (uploadId: string) => void;
  onDelete?: (uploadId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export interface UploadsInfoTypes {
  id: string;
  fileName: string;
  originalFormat: string;
  targetFormat: string;
  status: 'pending' | 'converting' | 'completed' | 'failed';
  progress?: number;
  downloadUrl?: string;
  uploadTime: string;
  createdAt:Date;
  updatedAt?:Date
}