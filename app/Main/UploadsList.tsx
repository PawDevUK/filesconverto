'use client';

import React from 'react';
import { Download, RotateCcw, Clock, CheckCircle, AlertCircle, FileUp, Trash2 } from 'lucide-react';
import { UploadsInfoTypes } from '@/app/types/upload.types';
import { removeFile } from '../utils/IndexedDB';
import DropDown from '../components/ui/DropDown';
import { set, get } from 'idb-keyval';

const UploadsList: React.FC<{ uploads: UploadsInfoTypes[]; onUpdate: () => void }> = ({ uploads, onUpdate }) => {
	const getStatusIcon = (status: UploadsInfoTypes['status']) => {
		switch (status) {
			case 'converting':
				return <Clock className='w-5 h-5 text-blue-500 animate-pulse' />;
			case 'completed':
				return <CheckCircle className='w-5 h-5 text-green-500' />;
			case 'failed':
				return <AlertCircle className='w-5 h-5 text-red-500' />;
		}
	};

	const getStatusText = (status: UploadsInfoTypes['status']) => {
		switch (status) {
			case 'converting':
				return 'Converting...';
			case 'completed':
				return 'Completed';
			case 'failed':
				return 'Failed';
		}
	};

	const handleDownload = (upload: UploadsInfoTypes) => {
		if (upload.downloadUrl) {
			window.open(upload.downloadUrl, '_blank');
		}
	};

	const handleDeleteClick = async (fileId: string) => {
		await removeFile(fileId);
		if (onUpdate) await onUpdate();
	};

	const handleTargetFormatChange = async (uploadId: string, newFormat: string) => {
		const updatedFile = await get(uploadId);
		updatedFile.targetFormat = newFormat;
		await set(uploadId, updatedFile);
		if (onUpdate) await onUpdate();
	};

	const shortenName = (name: string): string => {
		if (!name) throw new Error('File name is missing. All files must have a name.');

		const nameLength = name.length;
		const nameLengthTarget = 11;
		const nameLengthTargetMAX = 15;
		const dotIndex = name.lastIndexOf('.');

		if (nameLength > nameLengthTargetMAX) {
			const base = name.slice(0, nameLengthTarget);
			const ext = name.slice(dotIndex);
			return `${base}..${ext}`;
		}
		return name;
	};

	const returnSize = (file: UploadsInfoTypes) => {
		if (!file || typeof file.fileSize !== 'number' || isNaN(file.fileSize)) return '';
		const sizeInKB = file.fileSize / 1024;
		if (sizeInKB >= 1024) {
			return `${(sizeInKB / 1024).toFixed(2)} MB`;
		}
		return `${sizeInKB.toFixed(2)} KB`;
	};

	const handleConvertion = async (id: string) => {
		console.log('Starting conversion for:', id);

		// Set initial converting status
		const file = await get(id);
		if (!file) return;

		// Random failure simulation (1 in 15 chance of failure)
		const shouldFail = Math.random() < 1 / 15;

		if (shouldFail) {
			console.log('Conversion failed for:', id);
			file.status = 'failed';
			file.progress = 0;
			await set(id, file);
			if (onUpdate) await onUpdate();
			return;
		}

		file.status = 'converting';
		file.progress = 0;
		await set(id, file);
		if (onUpdate) await onUpdate();

		// Simulate progress with random intervals
		await simulateProgress(id);
	};

	const simulateProgress = async (id: string): Promise<void> => {
		return new Promise(async (resolve) => {
			let currentProgress = 0;
			const totalDuration = 5000 + Math.random() * 5000; // 5-10 seconds total
			const startTime = Date.now();

			const updateProgress = async () => {
				const elapsed = Date.now() - startTime;
				const progressRatio = elapsed / totalDuration;

				// Use easing function for more realistic progress
				// Progress faster at the beginning, slower near the end
				const easedProgress = 100 * (1 - Math.pow(1 - progressRatio, 3));

				// Add some randomness (±5%)
				const randomOffset = (Math.random() - 0.5) * 10;
				currentProgress = Math.min(95, Math.max(currentProgress, easedProgress + randomOffset));

				// Update the file in IndexedDB
				const file = await get(id);
				if (file) {
					file.progress = Math.floor(currentProgress);
					await set(id, file);
					if (onUpdate) await onUpdate();
				}

				if (progressRatio >= 1) {
					// Complete the conversion
					const finalFile = await get(id);
					if (finalFile) {
						finalFile.status = 'completed';
						finalFile.progress = 100;
						finalFile.downloadUrl = 'https://example.com/download/' + id; // Placeholder
						await set(id, finalFile);
						if (onUpdate) await onUpdate();
					}
					resolve();
				} else {
					// Random interval between updates (100-500ms)
					const nextInterval = 100 + Math.random() * 400;
					setTimeout(updateProgress, nextInterval);
				}
			};

			updateProgress();
		});
	};

	const handleFormatChange = async (uploadId: string, newFormat: string) => {
		await handleTargetFormatChange(uploadId, newFormat);
	};

	const handleFormatChangeAll = async (newFormat: string) => {
		try {
			// Get all keys from IndexedDB
			const keys = await import('idb-keyval').then((m) => m.keys());

			// Update each upload with the new target format
			for (const key of keys) {
				const upload = await get(key);
				if (upload && upload.id) {
					upload.targetFormat = newFormat;
					await set(key, upload);
				}
			}

			// Trigger UI update
			if (onUpdate) await onUpdate();
		} catch (error) {
			console.error('Error updating all formats:', error);
		}
	};

	const handleConvertAll = async () => {
		try {
			// Get all keys from IndexedDB
			const keys = await import('idb-keyval').then((m) => m.keys());

			// Loop over uploaded files and convert those that are ready
			for (const key of keys) {
				const upload = await get(key);

				// Check if file has target format selected and status is 'uploaded'
				if (upload && upload.id && upload.targetFormat && upload.status === 'uploaded') {
					// Trigger conversion for this file
					handleConvertion(upload.id);

					// Add small delay between conversions to avoid overwhelming the system
					await new Promise((resolve) => setTimeout(resolve, 200));
				}
			}

			// Trigger UI update
			if (onUpdate) await onUpdate();
		} catch (error) {
			console.error('Error converting all files:', error);
		}
	};

	const checkIfMultiUploaded = () => {
		return uploads.filter((upload) => upload.status === 'uploaded').length < 2;
	};

	return (
		<div className='w-full mx-auto py-6'>
			<div className='bg-white rounded-xl shadow-lg border border-gray-200'>
				<div className='divide-y divide-gray-200'>
					{uploads.length === 0 ? (
						<div className='px-6 py-12 text-center'>
							<div className='w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
								<FileUp className='w-8 h-8 text-gray-400' />
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-2'>No uploads yet</h3>
							<p className='text-gray-600'>Upload your first file to get started</p>
						</div>
					) : (
						uploads.map((upload: UploadsInfoTypes) => (
							<div key={upload.id} className='px-6 py-4 hover:bg-gray-50 transition-colors'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center space-x-4 flex-1'>
										{/* Status Icon */}
										<div className='flex-shrink-0'>{getStatusIcon(upload.status)}</div>

										{/* File Info */}
										<div className='flex-1 min-w-0'>
											<div className='flex items-center space-x-2 mb-1'>
												<h3 className='text-sm font-medium text-gray-900 truncate'>{shortenName(upload.fileName)}</h3>
												<span>{returnSize(upload)}</span>
											</div>

											<div className='px-0 flex items-center space-x-4 text-sm text-gray-500'>
												{upload.status === 'uploaded' ? (
													<span className='w-[125px] h-[25.49px] '>
														<DropDown
															disabled={false}
															lableText={`${upload.originalFormat} → ${upload.targetFormat}`}
															onSelectFormat={(newFormat) => handleFormatChange(upload.id, newFormat)}
														/>
													</span>
												) : (
													<></>
												)}
												<span>{getStatusText(upload.status)}</span>
											</div>

											{/* Progress Bar for Converting */}
											{upload.status === 'converting' && upload.progress && (
												<div className='mt-2'>
													<div className='w-full bg-gray-200 rounded-full h-2'>
														<div
															className='bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out'
															style={{ width: `${upload.progress}%` }}></div>
													</div>
													<span className='text-xs text-gray-500 mt-1'>{upload.progress}% complete</span>
												</div>
											)}
										</div>
									</div>

									{/* Actions */}
									<div className='flex items-center space-x-2 ml-4'>
										{upload.status === 'completed' && upload.downloadUrl && (
											<button
												onClick={() => handleDownload(upload)}
												className='inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors'>
												<Download className='w-4 h-4 mr-1' />
												Download
											</button>
										)}
										{upload.status === 'failed' && (
											<>
												<button
													onClick={() => handleConvertion(upload.id)}
													className='inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors'>
													<RotateCcw className='w-4 h-4 mr-1' />
													Retry
												</button>
											</>
										)}
										{upload.status === 'uploaded' && (
											<>
												<button
													onClick={() => handleConvertion(upload.id)}
													disabled={!upload.targetFormat}
													className={`inline-flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-md transition-colors ${
														upload.targetFormat ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' : 'bg-gray-400 cursor-not-allowed opacity-50'
													}`}>
													Convert
												</button>
											</>
										)}
										{
											<button
												onClick={() => handleDeleteClick(upload.id)}
												className='inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-400 bg-white hover:bg-gray-100 rounded-md transition-colors'>
												<Trash2 className='w-4 h-4 mr-1' />
											</button>
										}
									</div>
								</div>
							</div>
						))
					)}
				</div>

				{uploads.length > 1 && (
					<div className='flex px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-xl justify-between'>
						<div className='flex items-center text-sm text-gray-600'>
							<span className='mx-[20px]'>
								<DropDown disabled={checkIfMultiUploaded()} lableText='Convert all to' onSelectFormat={handleFormatChangeAll} />
							</span>
							<span>
								{uploads.length} upload{uploads.length !== 1 ? 's' : ''}
							</span>
						</div>
						<div className=''>
							<button
								onClick={handleConvertAll}
								disabled={checkIfMultiUploaded()}
								className={`inline-flex items-center mr-[55px] px-3 py-1.5 text-sm font-medium text-white rounded-md transition-colors ${
									checkIfMultiUploaded() ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
								}`}>
								Convert all
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default UploadsList;
