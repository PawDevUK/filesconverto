import React from 'react';

const InPaidPlan: React.FC = () => (
	<div className='text-center'>
		<h3 className='text-lg font-semibold mb-4'>In All Paid Plans</h3>
		<ul className='flex flex-wrap justify-center items-center gap-4'>
			<li className='flex items-center space-x-2'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='1.6em'
					height='1.6em'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
					style={{ color: 'var(--color-primary)' }}>
					<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
					<polyline points='22 4 12 14.01 9 11.01' />
				</svg>
				<span>High priority processing</span>
			</li>
			<li className='flex items-center space-x-2'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='1.6em'
					height='1.6em'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
					style={{ color: 'var(--color-primary)' }}>
					<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
					<polyline points='22 4 12 14.01 9 11.01' />
				</svg>
				<span>All bandwidth included</span>
			</li>
			<li className='flex items-center space-x-2'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='1.6em'
					height='1.6em'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
					style={{ color: 'var(--color-primary)' }}>
					<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
					<polyline points='22 4 12 14.01 9 11.01' />
				</svg>
				<span>Can merge 100 files at a time</span>
			</li>
			<li className='flex items-center space-x-2'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='1.6em'
					height='1.6em'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
					style={{ color: 'var(--color-primary)' }}>
					<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
					<polyline points='22 4 12 14.01 9 11.01' />
				</svg>
				<span>Use for Web and API</span>
			</li>
			<li className='flex items-center space-x-2'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='1.6em'
					height='1.6em'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
					style={{ color: 'var(--color-primary)' }}>
					<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
					<polyline points='22 4 12 14.01 9 11.01' />
				</svg>
				<span>No Ads</span>
			</li>
			<li className='flex items-center space-x-2'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					width='1.6em'
					height='1.6em'
					viewBox='0 0 24 24'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					strokeLinecap='round'
					strokeLinejoin='round'
					style={{ color: 'var(--color-primary)' }}>
					<path d='M22 11.08V12a10 10 0 1 1-5.93-9.14' />
					<polyline points='22 4 12 14.01 9 11.01' />
				</svg>
				<span>Data Processing Agreement</span>
			</li>
		</ul>
	</div>
);

export default InPaidPlan;
