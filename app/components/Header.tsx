'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import getBaseUrl from '../hooks/baseURL';

import {GreenButton} from '@/app/components/ui/Button'

import { store } from "../store/data";

type HeaderProps = {
	companyName?: string;
};

const Header: React.FC<HeaderProps> = ({}) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
	const [baseUrl, setBaseUrl] = useState<string>('');

	useEffect(() => {
		setBaseUrl(getBaseUrl());
	}, []);

	const Menu: React.FC = () => {
		return (
			<>
				{store.routes.map((route) => (
					<Link key={route.href} href={`${baseUrl}${route.href}`} className='text-gray-700 hover:[color:var(--color-primary)]'>
						{route.route}
					</Link>
				))}
			</>
		);
	};

	return (
		<header className='bg-white shadow-sm fixed top-0 left-0 right-0 z-50 font-sans'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16'>
				<div className='flex-shrink-0 flex flex-row items-center logo'>
					<Link href='/' className='flex items-center space-x-2'>
						<Image src='/favicon.ico' alt='Logo' width={30} height={30} />
						<span className='text-2xl font-bold text-gray-900'>{store.companyName}</span>
					</Link>
				</div>
				<nav className='hidden md:flex space-x-8'>
					<Menu></Menu>
				</nav>
				<div className='hidden md:flex items-center space-x-4'>
					<Link href='/Login' className='text-gray-700 hover:text-blue-600 border border-gray-300 rounded px-4 py-2 hover:border-blue-600'>
						Log In
					</Link>
					<GreenButton href='/PremiumPrices'>
						Go Premium
					</GreenButton>
				</div>
				<div className='md:hidden'>
					<button onClick={() => setIsMenuOpen(!isMenuOpen)} className='text-gray-700 focus:outline-none'>
						<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
						</svg>
					</button>
				</div>
			</div>
			{isMenuOpen && (
				<div className='md:hidden bg-white border-t'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-4'>
						<Menu></Menu>
						<Link href='/Login' className='text-gray-700 hover:text-blue-600'>
							Log In
						</Link>
						<GreenButton href='/PremiumPrices'>
							Go Premium
						</GreenButton>
					</div>
				</div>
			)}
		</header>
	);
};

export default Header;
