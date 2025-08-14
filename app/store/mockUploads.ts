import { UploadsInfoTypes } from '@/app/types/upload.types';

/**
 * Mock upload data for development and testing
 */
export const mockUploads: UploadsInfoTypes[] = [
  {
    id: 'upload_1692123456789_abc123',
    fileName: 'document.pdf',
    originalFormat: 'PDF',
    targetFormat: 'DOCX',
    status: 'completed',
    downloadUrl: '/downloads/document.docx',
    uploadTime: '2 mins ago',
    createdAt: new Date(Date.now() - 2 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 1000)
  },
  {
    id: 'upload_1692123456790_def456',
    fileName: 'presentation.pptx',
    originalFormat: 'PPTX',
    targetFormat: 'PDF',
    status: 'converting',
    progress: 65,
    uploadTime: '1 min ago',
    createdAt: new Date(Date.now() - 1 * 60 * 1000),
    updatedAt: new Date()
  },
  {
    id: 'upload_1692123456791_ghi789',
    fileName: 'image.png',
    originalFormat: 'PNG',
    targetFormat: 'JPG',
    status: 'failed',
    uploadTime: '5 mins ago',
    createdAt: new Date(Date.now() - 5 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 60 * 1000)
  },
  {
    id: 'upload_1692123456792_jkl012',
    fileName: 'report.docx',
    originalFormat: 'DOCX',
    targetFormat: 'PDF',
    status: 'pending',
    uploadTime: '10 mins ago',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 'upload_1692123456792_jkl012',
    fileName: 'report.docx',
    originalFormat: 'DOCX',
    targetFormat: 'PDF',
    status: 'pending',
    uploadTime: '10 mins ago',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 'upload_1692123456792_jkl012',
    fileName: 'report.docx',
    originalFormat: 'DOCX',
    targetFormat: 'PDF',
    status: 'pending',
    uploadTime: '10 mins ago',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 'upload_1692123456792_jkl012',
    fileName: 'report.docx',
    originalFormat: 'DOCX',
    targetFormat: 'PDF',
    status: 'pending',
    uploadTime: '10 mins ago',
    createdAt: new Date(Date.now() - 10 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000)
  },
];

/**
 * Simulate uploading a file
 */
export const simulateUpload = (
  fileName: string,
  originalFormat: string,
  targetFormat: string
): UploadsInfoTypes => {
  return {
    id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    fileName,
    originalFormat: originalFormat.toUpperCase(),
    targetFormat: targetFormat.toUpperCase(),
    status: 'pending',
    uploadTime: 'Just now',
    createdAt: new Date(),
    updatedAt: new Date()
  };
};
