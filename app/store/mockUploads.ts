import { UploadsInfoTypes } from '@/app/types/upload.types';

/**
 * Mock upload data for development and testing
 */
export const mockUploads: UploadsInfoTypes[] = [
	{
		id: 'upload_1692123456789_abc123',
		file: new File([], 'document.pdf'),
		fileName: 'document.pdf',
		fileSize: 2048576, // 2MB
		originalFormat: 'PDF',
		targetFormat: 'DOCX',
		status: 'completed',
		downloadUrl: '/downloads/document.docx',
		uploadTime: '2 mins ago',
		createdAt: new Date(Date.now() - 2 * 60 * 1000),
		updatedAt: new Date(Date.now() - 1 * 60 * 1000),
	},
	{
		id: 'upload_1692123456790_def456',
		file: new File([], 'presentation.pptx'),
		fileName: 'presentation.pptx',
		fileSize: 5242880, // 5MB
		originalFormat: 'PPTX',
		targetFormat: 'PDF',
		status: 'converting',
		progress: 65,
		uploadTime: '1 min ago',
		createdAt: new Date(Date.now() - 1 * 60 * 1000),
		updatedAt: new Date(),
	},
	{
		id: 'upload_1692123456791_ghi789',
		file: new File([], 'image.png'),
		fileName: 'image.png',
		fileSize: 1048576, // 1MB
		originalFormat: 'PNG',
		targetFormat: 'JPG',
		status: 'failed',
		uploadTime: '5 mins ago',
		createdAt: new Date(Date.now() - 5 * 60 * 1000),
		updatedAt: new Date(Date.now() - 4 * 60 * 1000),
	},
	{
		id: 'upload_1692123456792jkl012',
		file: new File([], 'report.docx'),
		fileName: 'report.docx',
		fileSize: 3145728, // 3MB
		originalFormat: 'DOCX',
		targetFormat: 'PDF',
		status: 'converting',
		uploadTime: '10 mins ago',
		createdAt: new Date(Date.now() - 10 * 60 * 1000),
		updatedAt: new Date(Date.now() - 10 * 60 * 1000),
	},
	{
		id: 'upload_1692123456792_jkl01',
		file: new File([], 'report.docx'),
		fileName: 'report.docx',
		fileSize: 2621440, // 2.5MB
		originalFormat: 'DOCX',
		targetFormat: 'PDF',
		status: 'converting',
		uploadTime: '10 mins ago',
		createdAt: new Date(Date.now() - 10 * 60 * 1000),
		updatedAt: new Date(Date.now() - 10 * 60 * 1000),
	},
	{
		id: 'upload_169123456792_jkl012',
		file: new File([], 'report.docx'),
		fileName: 'report.docx',
		fileSize: 1572864, // 1.5MB
		originalFormat: 'DOCX',
		targetFormat: 'PDF',
		status: 'converting',
		uploadTime: '10 mins ago',
		createdAt: new Date(Date.now() - 10 * 60 * 1000),
		updatedAt: new Date(Date.now() - 10 * 60 * 1000),
	},
	{
		id: 'upload_169212345692_jkl012',
		file: new File([], 'report.docx'),
		fileName: 'report.docx',
		fileSize: 4194304, // 4MB
		originalFormat: 'DOCX',
		targetFormat: 'PDF',
		status: 'converting',
		uploadTime: '10 mins ago',
		createdAt: new Date(Date.now() - 10 * 60 * 1000),
		updatedAt: new Date(Date.now() - 10 * 60 * 1000),
	},
];

/**
 * Simulate uploading a file
 */
export const simulateUpload = (fileName: string, originalFormat: string, targetFormat: string): UploadsInfoTypes => {
	return {
		id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
		file: new File([], fileName),
		fileName,
		fileSize: Math.floor(Math.random() * 5242880) + 1048576, // Random size between 1MB and 5MB
		originalFormat: originalFormat.toUpperCase(),
		targetFormat: targetFormat.toUpperCase(),
		status: 'converting',
		uploadTime: 'Just now',
		createdAt: new Date(),
		updatedAt: new Date(),
	};
};
