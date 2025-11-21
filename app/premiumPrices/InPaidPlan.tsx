import React, { useState } from 'react';
import H3 from '@/app/typography/Headers'

const InPaidPlan: React.FC = () => {
	const [InPlan] = useState([
		'High priority processing',
		'All bandwidth included',
		'Can merge 100 files at a time',
		'Use for Web and API',
		'No Ads',
		'Data Processing Agreement',
	]);

	return (
		<div className='text-center'>
			<H3>In All Paid Plans</H3>
			<ul className='flex flex-wrap justify-center items-center gap-4'>
				{InPlan.map((perk,i)=>
                    (<li key={i}className='flex items-center space-x-2'>
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
					<span>{perk}</span>
				</li>))
                }
			</ul>
		</div>
	);
};

export default InPaidPlan;
