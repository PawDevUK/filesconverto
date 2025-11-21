'use client';

import React, { useEffect, useRef } from 'react';
import { useJumboCard } from '@/app/hooks/jumboCardContext';
import { DataItem, JumboCardProps } from './JumboCard.types';

export default function JumboCard({ data, title, routeType }: JumboCardProps) {
	const { close } = useJumboCard();
	const rootRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		function handlePointerDown(e: PointerEvent) {
			const el = rootRef.current;
			if (!el) return;
			const target = e.target as HTMLElement | null;
			if (!target) return;

			// Check if click is inside the JumboCard
			if (el.contains(target)) return;

			// Check if click is on a navigation button/link (menu items)
			const isNavButton = target.closest('nav button') || target.closest('nav a');
			if (isNavButton) return;

			// Click is outside JumboCard and not on nav - close it
			close();
		}

		document.addEventListener('pointerdown', handlePointerDown);
		return () => document.removeEventListener('pointerdown', handlePointerDown);
	}, [close]);

	// Determine which property to access based on route type

	const getItems = (item: DataItem): string[] => {
		if (routeType === 'Convert') return item.convertTypes || [];
		if (routeType === 'Compress') return item.compressTypes || [];
		if (routeType === 'Tools') return item.tools || [];
		if (routeType === 'API') return item.apiTypes || [];
		return [];
	};

	return (
		<div ref={rootRef} className='px-4 sm:px-6 lg:px-8 py-8'>
			<h2 className='heading-3 mb-6'>{title}</h2>
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 h-[400px]'>
				{data.map((item, index) => (
					<div key={index} className={`flex flex-col space-y-3 ${index !== data.length - 1 ? 'border-r-2 border-gray-200' : ''}`}>
						<h3 className='pl-2 heading-5 border-b-2 border-gray-200 pb-2'>{item.header}</h3>
						<ul className='space-y-2'>
							{getItems(item).map((type: string, typeIndex: number) => (
								<li key={typeIndex}>
									<button className='pl-2 body-small hover:text-blue-600 hover:underline text-left w-full transition-colors'>{type}</button>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
