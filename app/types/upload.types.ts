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
	file: File;
	fileName: string;
	fileSize: number;
	originalFormat: string;
	targetFormat: string;
	status: 'converting' | 'completed' | 'failed' | 'uploaded';
	progress?: number;
	downloadUrl?: string;
	uploadTime: string;
	createdAt: Date;
	updatedAt?: Date;
}
