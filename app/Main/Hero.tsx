'use client';

import React, { useState, useEffect } from 'react';
import DropzoneComponent from './Dropzone';
import ServiceInfoCards from './ServiceInfoCards';
import FileFormat from './FileFormats';
import HowItWorks from './HowItWorks';
import UploadsList from './UploadsList';
import About from './About';

import { UploadsInfoTypes } from '@/app/types/upload.types';
import { store } from '@/app/store/data';
import { getIndexedDB } from '../utils/IndexedDB';

type DropzoneProps = { onUpload?: () => Promise<void> };
const Dropzone = DropzoneComponent as React.ComponentType<DropzoneProps>;

const Hero: React.FC = () => {
	const [uploads, setUploads] = useState<UploadsInfoTypes[]>([]);

	useEffect(() => {
		(async () => {
			const result = await getIndexedDB();
			setUploads(result);
		})();
	}, []);

	const handleUpdate = async () => {
		const result = await getIndexedDB();
		setUploads(result);
	};

	return (
		<>
			<section className='text-center pb-5 w-[95vw] md:w-[60vw]'>
				<h2 className='text-3xl font-bold mb-4'>Convert Files</h2>
				<p className='text-lg text-gray-600 mb-6'>Fast, free, and secure files conversion to multiple formats.</p>
				<Dropzone
					onUpload={async () => {
						handleUpdate();
					}}
				/>
				{uploads.length === 0 ? '' : <UploadsList uploads={uploads} onUpdate={handleUpdate} />}
			</section>
			<section id='how-it-works' className='py-8 px-6 bg-white text-center'>
				<HowItWorks></HowItWorks>
			</section>
			<section>
				<About></About>
			</section>
			<section>
				<ServiceInfoCards></ServiceInfoCards>
			</section>
			<section>
				<FileFormat supportedFormats={store.pdfToOtherFormats.slice(0, 12)} />
			</section>
		</>
	);
};

export default Hero;
