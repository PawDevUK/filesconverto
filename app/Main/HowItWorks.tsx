import React from 'react';
import H3 from '@/app/typography/Headers';

export default function HowItWorks() {
	return (
		<>
			<H3 className='mb-6'>How It Works</H3>
			<div className='grid md:grid-cols-4 gap-6 max-w-4xl mx-auto'>
				<div className='flex flex-col items-center'>
					<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
						<span className='text-blue-600 font-bold'>1</span>
					</div>
					<h4 className='font-semibold mb-2'>Upload PDF</h4>
					<p className='text-gray-600 text-sm'>Drag & drop or click to select your file.</p>
				</div>
				<div className='flex flex-col items-center'>
					<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
						<span className='text-blue-600 font-bold'>2</span>
					</div>
					<h4 className='font-semibold mb-2'>Choose Format</h4>
					<p className='text-gray-600 text-sm'>Select your desired output format.</p>
				</div>
				<div className='flex flex-col items-center'>
					<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
						<span className='text-blue-600 font-bold'>3</span>
					</div>
					<h4 className='font-semibold mb-2'>Convert</h4>
					<p className='text-gray-600 text-sm'>Our system processes your file.</p>
				</div>
				<div className='flex flex-col items-center'>
					<div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
						<span className='text-blue-600 font-bold'>4</span>
					</div>
					<h4 className='font-semibold mb-2'>Download</h4>
					<p className='text-gray-600 text-sm'>Download your converted file.</p>
				</div>
			</div>
		</>
	);
}
