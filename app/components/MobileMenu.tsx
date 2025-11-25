'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { store } from '../store/data';
import { ConvertData, CompressData, ToolsData, APIdata } from './JumboCard/jumboCardData';
import { DataItem } from './JumboCard/JumboCard.types';

type MenuRoute = 'Convert' | 'Compress' | 'Tools' | 'API' | null;

type MobileMenuProps = {
	isOpen: boolean;
	onClose: () => void;
};

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
	const [activeSubmenu, setActiveSubmenu] = useState<MenuRoute>(null);

	const jumboRoutes: MenuRoute[] = ['Convert', 'Compress', 'Tools', 'API'];

	const getSubmenuData = (route: MenuRoute): DataItem[] => {
		switch (route) {
			case 'Convert':
				return ConvertData;
			case 'Compress':
				return CompressData;
			case 'Tools':
				return ToolsData;
			case 'API':
				return APIdata;
			default:
				return [];
		}
	};

	const getItems = (item: DataItem, routeType: MenuRoute): string[] => {
		if (routeType === 'Convert') return item.convertTypes || [];
		if (routeType === 'Compress') return item.compressTypes || [];
		if (routeType === 'Tools') return item.tools || [];
		if (routeType === 'API') return item.apiTypes || [];
		return [];
	};

	const handleMenuItemClick = (routeName: string) => {
		if (jumboRoutes.includes(routeName as MenuRoute)) {
			setActiveSubmenu(routeName as MenuRoute);
		} else {
			onClose();
		}
	};

	const handleBackClick = () => {
		setActiveSubmenu(null);
	};

	const handleClose = () => {
		setActiveSubmenu(null);
		onClose();
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-[100] bg-white'>
			{/* Header */}
			<div className='flex items-center justify-between h-16 px-4 border-b border-gray-200'>
				{activeSubmenu ? (
					<button
						onClick={handleBackClick}
						className='flex items-center text-gray-700 hover:text-gray-900'
						aria-label='Back to main menu'>
						<svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M15 19l-7-7 7-7' />
						</svg>
						<span className='font-medium'>{activeSubmenu}</span>
					</button>
				) : (
					<span className='font-semibold text-gray-900'>Menu</span>
				)}
				<button onClick={handleClose} className='text-gray-700 hover:text-gray-900' aria-label='Close menu'>
					<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
					</svg>
				</button>
			</div>

			{/* Menu Content */}
			<div className='overflow-y-auto h-[calc(100vh-4rem)]'>
				{!activeSubmenu ? (
					/* Main Menu */
					<div className='flex flex-col'>
						{store.routes.map((route) => {
							const isJumboRoute = jumboRoutes.includes(route.route as MenuRoute);

							return (
								<button
									key={route.href}
									onClick={() => handleMenuItemClick(route.route)}
									className='flex items-center justify-between px-4 py-4 text-left text-gray-700 hover:bg-gray-50 border-b border-gray-100'>
									<span className='text-base font-medium'>{route.route}</span>
									{isJumboRoute && (
										<svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
										</svg>
									)}
								</button>
							);
						})}

						{/* Login and Premium buttons */}
						<div className='px-4 py-4 border-t border-gray-200 mt-4'>
							<Link
								href='/login'
								onClick={handleClose}
								className='block w-full text-center py-3 text-gray-700 hover:text-blue-600 border border-gray-300 rounded mb-3'>
								Log In
							</Link>
							<Link
								href='/premiumPrices'
								onClick={handleClose}
								className='block w-full text-center py-3 [background:var(--color-primary)] text-white rounded hover:[background:var(--color-primary-hover)]'>
								Go Premium
							</Link>
						</div>
					</div>
				) : (
					/* Submenu */
					<div className='flex flex-col'>
						{getSubmenuData(activeSubmenu).map((category, categoryIndex) => (
							<div key={categoryIndex} className='border-b border-gray-100'>
								<div className='px-4 py-3 bg-gray-50'>
									<span className='text-sm font-semibold text-gray-500 uppercase tracking-wide'>{category.header}</span>
								</div>
								<div className='flex flex-col'>
									{getItems(category, activeSubmenu).map((item, itemIndex) => (
										<button
											key={itemIndex}
											onClick={handleClose}
											className='px-4 py-3 text-left text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors'>
											<span className='text-base'>{item}</span>
										</button>
									))}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default MobileMenu;
