import React from 'react'
import H3 from '@/app/typography/Headers';
import { FileText} from 'lucide-react';

const FileFormat: React.FC<{ supportedFormats: Array<string> }> = ({ supportedFormats }) => (
		<section id='features' className='py-8 px-6 max-w-5xl mx-auto text-center'>
			<H3 className='mb-6'>Supported Conversions</H3>
			<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-gray-700'>
				{supportedFormats.map((format) => (
					<div key={format} className='bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition'>
						<FileText className='h-6 w-6 mx-auto mb-2 text-gray-600' />
						<span className='font-medium'>{format}</span>
					</div>
				))}
			</div>
		</section>
	);

export default FileFormat;