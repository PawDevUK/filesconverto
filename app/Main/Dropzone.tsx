import React from 'react';
import { UploadsInfoTypes } from '@/app/types/upload.types';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { set } from 'idb-keyval';
import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export default function Dropzone({ onUpload }: { onUpload?: () => void }) {
	const onDrop = async (acceptedFiles: File[]) => {
		if (acceptedFiles.length === 0) {
			console.error('No files accepted');
			return;
		}
		const file = acceptedFiles[0];
		const uploadedFile: UploadsInfoTypes = {
			id: uuidv4(),
			file: file,
			fileName: file.name,
			fileSize: file.size,
			originalFormat: getFileExt(file.name),
			targetFormat: '',
			status: 'uploaded',
			progress: 30,
			downloadUrl: '',
			uploadTime: format(new Date(), 'HH:mm:ss'),
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		await set(uploadedFile.id, uploadedFile);
		if (onUpload) onUpload();
	};
	const getFileExt = (filename: string): string => {
		return filename.split('.').pop()?.toUpperCase() || '';
	};
	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			'application/pdf': ['.pdf'],
		},
		maxFiles: 1,
		multiple: false,
		maxSize: 50 * 1024 * 1024, // 50MB limit
	});
	return (
		<div {...getRootProps()} className={`cursor-pointer border-2 border-dashed border-blue-400 px-6 py-12 rounded-lg bg-white max-w-xl mx-auto transition hover:bg-blue-50`}>
			<input {...getInputProps()} />
			<div className='flex flex-col items-center justify-center text-blue-600'>
				<Upload className={`h-8 w-8 mb-3`} />
				<div className='text-center'>
					<p className='text-lg font-medium mb-2'>Drag & drop a file here, or click to select</p>
					<p className='text-xs text-gray-400 mt-1'>Supports files up to 50MB</p>
				</div>
			</div>
		</div>
	);
}
