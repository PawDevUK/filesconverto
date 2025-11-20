'use client';

import React, { useState } from 'react';
import { useJumboCard } from '@/app/hooks/jumboCardContext';

import Link from 'next/link';
import Image from 'next/image';

import { GreenButton } from '@/app/components/ui/Button';
import JumboCard from '@/app/components/JumboCard/JumboCard';

import { store } from '../store/data';
import { ConvertData, CompressData, ToolsData } from './JumboCard/jumboCardData';

type HeaderProps = {
	companyName?: string;
};

type MenuRoute = 'Convert' | 'Compress' | 'Tools' | 'API' | null;

const Header: React.FC<HeaderProps> = ({}) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	// Use shared jumbo card state from context
	const { isOpen: isJumboCardOpen, activeRoute, close, toggle } = useJumboCard();

	const Menu: React.FC<{ closeMenu?: () => void }> = ({ closeMenu }) => {
		const handleMenuClick = (routeName: string) => {
			const jumboRoutes: MenuRoute[] = ['Convert', 'Compress', 'Tools', 'API'];

			if (jumboRoutes.includes(routeName as MenuRoute)) {
				// toggle via context
				toggle(routeName as MenuRoute);
			} else {
				// For other routes, close JumboCard
				close();
			}

			if (closeMenu) closeMenu();
		};

		return (
			<>
				{store.routes.map((route) => {
					const isJumboRoute = ['Convert', 'Compress', 'Tools', 'API'].includes(route.route);

					return isJumboRoute ? (
						<button
							key={route.href}
							onClick={() => handleMenuClick(route.route)}
							className={`text-gray-700 hover:[color:var(--color-primary)] ${activeRoute === route.route ? 'font-semibold [color:var(--color-primary)]' : ''}`}>
							{route.route}
						</button>
					) : (
						<Link key={route.href} href={route.href} className='text-gray-700 hover:[color:var(--color-primary)]' onClick={() => handleMenuClick(route.route)}>
							{route.route}
						</Link>
					);
				})}
			</>
		);
	};

	return (
		<header className='bg-white shadow-sm fixed top-0 left-0 right-0 z-50 w-screen'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16'>
				<div className='flex-shrink-0 flex flex-row items-center logo'>
					<Link href='/' className='flex items-center space-x-1'>
						<Image src='/favicon.ico' alt='Logo' className='sm:w-[20px] sm:h-[20px] md:w-[25px] md:h-[25px]' width={20} height={20} />
						<span className='text-md md:text-lg font-bold text-gray-900'>{store.companyName}</span>
					</Link>
				</div>
				<nav className='hidden md:flex space-x-8'>
					<Menu />
				</nav>
				<div className='hidden md:flex items-center space-x-4'>
					<Link href='/login' className='text-gray-700 hover:text-blue-600 border border-gray-300 rounded px-4 py-2 hover:border-blue-600'>
						Log In
					</Link>
					<GreenButton closeJumbo={close} href='/premiumPrices'>
						Go Premium
					</GreenButton>
				</div>
				<div className='md:hidden'>
					<button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label='button' className='text-gray-700 focus:outline-none'>
						<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
						</svg>
					</button>
				</div>
			</div>
			{isMenuOpen && (
				<div className='md:hidden bg-white border-t border-gray-200'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-4'>
						<Menu closeMenu={() => setIsMenuOpen(false)} />

						<Link href='/login' className='text-gray-700 hover:text-blue-600'>
							Log In
						</Link>

						<GreenButton href='/premiumPrices' closeJumbo={close}>
							Go Premium
						</GreenButton>
					</div>
				</div>
			)}{' '}
			{/* JumboCard Overlay */}
			{isJumboCardOpen && (
				<div className='fixed top-16 left-0 right-0 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto bg-white shadow-2xl border-t border-gray-200'>
					<div className='relative'>
						{/* Close Button */}
						<button
							onClick={() => {
								close();
							}}
							className='absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10'
							aria-label='Close'>
							<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
							</svg>
						</button>
						<JumboCard
							data={activeRoute === 'Convert' ? ConvertData : activeRoute === 'Compress' ? CompressData : activeRoute === 'Tools' ? ToolsData : []}
							title={
								activeRoute === 'Convert'
									? 'All Conversion Types'
									: activeRoute === 'Compress'
									? 'All Compression Types'
									: activeRoute === 'Tools'
									? 'All Tools'
									: activeRoute === 'API'
									? 'API Documentation'
									: ''
							}
							routeType={activeRoute || 'Convert'}
						/>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
