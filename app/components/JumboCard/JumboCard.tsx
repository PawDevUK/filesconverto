'use client';

import React, { useEffect, useRef } from 'react';
import { useJumboCard } from '@/app/hooks/jumboCardContext';

type DataItem = {
	header: string;
	convertTypes?: string[];
	compressTypes?: string[];
	tools?: string[];
};

type JumboCardProps = {
	data: DataItem[];
	title: string;
	routeType: 'Convert' | 'Compress' | 'Tools' | 'API';
};

export default function JumboCard({ data, title, routeType }: JumboCardProps) {
	// close behavior: when the JumboCard is mounted, listen for clicks outside
	// this component and close the overlay via context.close(). This keeps the
	// close logic localized to the JumboCard (no other components need to
	// programmatically call close()).
	const { close } = useJumboCard();
	const rootRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handlePointerDown(e: PointerEvent) {
			const el = rootRef.current;
			if (!el) return;
			const target = e.target as Node | null;
			if (target && !el.contains(target)) {
				// Click happened outside the JumboCard — close it
				close();
			}
		}

		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	}, [close]);
	// Determine which property to access based on route type
	const getItems = (item: DataItem): string[] => {
		if (routeType === 'Convert') return item.convertTypes || [];
		if (routeType === 'Compress') return item.compressTypes || [];
		if (routeType === 'Tools') return item.tools || [];
		return [];
	};

	if (routeType === 'API') {
		return (
			<div ref={rootRef} className='px-4 sm:px-6 lg:px-8 py-8'>
				<h2 className='heading-3 mb-6'>{title}</h2>
				<p className='body-base'>API documentation coming soon...</p>
			</div>
		);
	}

	return (
		<div ref={rootRef} className='px-4 sm:px-6 lg:px-8 py-8'>
			<h2 className='heading-3 mb-6'>{title}</h2>
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 h-[400px]'>
				{data.map((item, index) => (
					<div key={index} className='flex flex-col space-y-3'>
						<h3 className='heading-5 border-b-2 border-r-2 border-gray-200 pb-2'>{item.header}</h3>
						<ul className='space-y-2 border-r-2 border-gray-200'>
							{getItems(item).map((type: string, typeIndex: number) => (
								<li key={typeIndex}>
									<button className='body-small hover:text-blue-600 hover:underline text-left w-full transition-colors'>{type}</button>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
