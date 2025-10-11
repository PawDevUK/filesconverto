'use client';

import React, { useState, useRef, useEffect } from 'react';
import { store } from '@/app/store/data';
import { DropDownProps } from '@/app/types/dropDown.types';
const { documentFormatsDisplay } = store;

const DropDown: React.FC<DropDownProps> = ({ onSelectFormat, onLeave, lableText }) => {
	const [open, setOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
    
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		}
		if (open) {
			document.addEventListener('mousedown', handleClickOutside);
		} else {
			document.removeEventListener('mousedown', handleClickOutside);
		}
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [open]);

	return (
		<div className='relative inline-block' ref={menuRef}>
			<button
				type='button'
				className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-0.5 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500'
				onClick={() => setOpen((v) => !v)}
				aria-haspopup='true'
				aria-expanded={open}>
				{lableText}
				<svg className='-mr-1 h-5 w-5 text-gray-400' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24' aria-hidden='true'>
					<path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
				</svg>
			</button>
			{open && (
				<div className='absolute right-0 z-10 mt-2 w-20 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none animate-fade-in' role='menu'>
					<div className='py-1' onMouseLeave={() => onLeave?.()}>
						{documentFormatsDisplay.map((format: string, i: number) => (
							<button key={i} onClick={() => onSelectFormat(format)} className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'>
								{format}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default DropDown;
