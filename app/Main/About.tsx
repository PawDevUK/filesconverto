import React from 'react';
import H3 from '@/app/typography/Headers';

const About: React.FC = () => {
	return (
		<section className='py-12 px-6 bg-gray-50'>
			<div className='max-w-4xl mx-auto text-center'>
				<H3 className='mb-6'>About FilesConverto</H3>
				<div className='grid md:grid-cols-2 gap-8 text-left'>
					<div>
						<h4 className='heading-5 mb-3'>What is FilesConverto?</h4>
						<p className='body-base mb-4'>
							FilesConverto is a free online file conversion service that allows you to convert your files between different formats quickly and securely. Whether you
							need to convert documents, images, videos, or audio files, we&apos;ve got you covered.
						</p>
						<p className='body-base'>
							Our platform supports hundreds of file formats and performs all conversions in the cloud, so you don&apos;t need to install any software on your device.
						</p>
					</div>
					<div>
						<h4 className='heading-5 mb-3'>Why Choose FilesConverto?</h4>
						<ul className='body-base space-y-2'>
							<li className='flex items-start'>
								<span className='text-blue-600 mr-2'>•</span>
								<span>Fast and reliable conversions in under 2 minutes</span>
							</li>
							<li className='flex items-start'>
								<span className='text-blue-600 mr-2'>•</span>
								<span>No software installation required</span>
							</li>
							<li className='flex items-start'>
								<span className='text-blue-600 mr-2'>•</span>
								<span>Your files are automatically deleted after 24 hours</span>
							</li>
							<li className='flex items-start'>
								<span className='text-blue-600 mr-2'>•</span>
								<span>Support for 300+ file formats</span>
							</li>
							<li className='flex items-start'>
								<span className='text-blue-600 mr-2'>•</span>
								<span>Works on all devices and platforms</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About;
