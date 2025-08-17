import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import useFileUpload from '@/app/hooks/useFileUpload';

export default function Dropzone() {
	const [selectedFormat] = useState<string>('docx');
	const [quality] = useState<number>(90);
	const [dpi] = useState<number>(150);
	const { uploadFile, state } = useFileUpload();

	const onDrop = async (acceptedFiles: File[]) => {
		if (acceptedFiles.length === 0) {
			console.error('No files accepted');
			return;
		}

		await uploadFile(acceptedFiles[0], {
			format: selectedFormat,
			quality,
			dpi,
		});
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			'application/pdf': ['.pdf'],
		},
		maxFiles: 1,
		multiple: false,
		maxSize: 50 * 1024 * 1024, // 50MB limit
	});
	return (
		<div
			{...getRootProps()}
			className={`cursor-pointer border-2 border-dashed border-blue-400 px-6 py-12 rounded-lg bg-white max-w-xl mx-auto transition hover:bg-blue-50 ${
				state.isLoading ? 'opacity-50 pointer-events-none' : ''
			} ${isDragActive ? 'border-blue-600 bg-blue-50' : ''}`}>
			<input {...getInputProps()} />
			<div className='flex flex-col items-center justify-center text-blue-600'>
				<Upload className={`h-8 w-8 mb-3 ${state.isLoading ? 'animate-pulse' : ''}`} />
				{state.isLoading ? (
					<div className='flex flex-col items-center'>
						<p className='text-lg font-medium'>Converting to {selectedFormat.toUpperCase()}...</p>
						<div className='mt-3 w-48 bg-gray-200 rounded-full h-2'>
							<div className='bg-blue-600 h-2 rounded-full animate-pulse w-3/4'></div>
						</div>
						<p className='text-sm text-gray-500 mt-2'>Please wait, this may take a moment</p>
					</div>
				) : isDragActive ? (
					<p className='text-lg font-medium'>Drop the file here...</p>
				) : (
					<div className='text-center'>
						<p className='text-lg font-medium mb-2'>Drag & drop a file here, or click to select</p>
						{/* <p className='text-sm text-gray-500'>
                                    Will convert to <strong>{formatOptions.find(f => f.value === selectedFormat)?.label}</strong>
                                </p> */}
						<p className='text-xs text-gray-400 mt-1'>Supports files up to 50MB</p>
					</div>
				)}
			</div>
		</div>
	);
}
