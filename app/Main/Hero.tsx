import React, { useState, useEffect } from 'react';
import DropzoneComponent from './Dropzone';
import ServiceInfoCards from './ServiceInfoCards';
import FileFormat from './FileFormats';
import HowItWorks from './HowItWorks';
import UploadsList from './Uploads';

import { UploadsInfoTypes } from '@/app/types/upload.types';
// import { mockUploads } from '@/app/store/mockUploads';
import { store } from '@/app/store/data';
import { getIndexedDB } from '../utils/IndexedDB';

type DropzoneProps = { onUpload?: () => Promise<void> };
const Dropzone = DropzoneComponent as React.ComponentType<DropzoneProps>;

const Hero: React.FC = () => {
	const [uploads, setUploads] = useState<UploadsInfoTypes[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const result = await getIndexedDB();
				setUploads(result);
			} catch {
				setUploads([]);
			}
		})();
	}, []);

	const handleDelete = async () => {
		const result = await getIndexedDB();
		setUploads(result);
	};

	return (
		<>
			<section className='text-center pb-5'>
				<h2 className='text-4xl font-bold mb-4'>Convert Files</h2>
				<p className='text-lg text-gray-600 mb-6'>Fast, free, and secure files conversion to multiple formats.</p>

				<Dropzone
					onUpload={async () => {
						const result = await getIndexedDB();
						setUploads(result);
					}}
				/>

				{uploads.length === 0 ? '' : <UploadsList uploads={uploads} onDelete={handleDelete} />}
			</section>
			<section id='how-it-works' className='py-8 px-6 bg-white text-center'>
				<HowItWorks></HowItWorks>
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
