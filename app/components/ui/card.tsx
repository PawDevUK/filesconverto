import React from 'react';
import { price_Plans } from '@/app/store/data';
import Infinity_Icon from '@/public/infinity1.svg';
import Image from 'next/image';

const PricingCard = (props: price_Plans) => {
	return (
		<div className='max-w-sm w-full rounded-xl border border-gray-200 bg-white p-6 shadow-md'>
			<div className='mb-4'>
				<h3 className='text-xl font-semibold text-gray-700'>{props.plan}</h3>
			</div>

			<div className='mb-6 flex items-baseline space-x-2 text-gray-900'>
				<span className='text-3xl font-semibold'>£</span>
				<span className='text-5xl font-extrabold'>{props.price}</span>
				<span className='text-xl font-normal text-gray-500'>/month</span>
			</div>

			<ul className='mb-6 space-y-4 text-gray-500'>
				{props.perks.map((perk, key) => (
					<li className='flex items-center' key={key}>
						<CheckIcon active />
						<span className='ml-3'>
							{perk === "Unlimited concurrent conversions" ? (
								<>
									<Image src={Infinity_Icon} alt="infinity" className="inline w-6 h-8 mr-1" />
									concurrent conversions.
								</>
							) : (
								perk
							)}
						</span>
					</li>
				))}
			</ul>

			<button
				type='button'
				className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 rbg-blue-600'>
				Choose plan
			</button>
		</div>
	);
};

const CheckIcon = ({ active = false }: { active?: boolean }) => (
	<svg
		className='h-4 w-4 shrink-0'
		style={active ? { color: 'var(--color-primary)' } : { color: '#9ca3af' }} // #9ca3af is Tailwind's gray-400
		aria-hidden='true'
		xmlns='http://www.w3.org/2000/svg'
		fill='currentColor'
		viewBox='0 0 20 20'>
		<path
			d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 
    4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 
    1.414-1.414L9 10.586l3.293-3.293a1 1 
    0 0 1 1.414 1.414Z'
		/>
	</svg>
);

export default PricingCard;
