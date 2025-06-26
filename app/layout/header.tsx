"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
		<header className='bg-white shadow-sm fixed top-0 left-0 right-0 z-50 font-sans'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16'>
				{/* Logo */}
				<div className='flex-shrink-0 flex flex-row items-center logo'>
					<Link href='/' className='flex items-center space-x-2'>
						<Image src='/favicon.ico' alt='Logo' width={30} height={30} />
						<span className='text-2xl font-bold text-gray-900'>FilesConverto</span>
					</Link>
				</div>

				{/* Desktop Navigation */}
				<nav className='hidden md:flex space-x-8'>
					<Link href='/convert' className='text-gray-700 hover:text-blue-600 hover:underline'>
						Convert
					</Link>
					<Link href='/compress' className='text-gray-700 hover:text-blue-600 hover:underline'>
						Tools
					</Link>
					<Link href='/tools' className='text-gray-700 hover:text-blue-600 hover:underline'>
						Tools
					</Link>
					<Link href='/pricing' className='text-gray-700 hover:text-blue-600 hover:underline'>
						Pricing
					</Link>
					<Link href='/api' className='text-gray-700 hover:text-blue-600 hover:underline'>
						API
					</Link>
				</nav>

				{/* Right Side: Language, Login, Go Premium */}
				<div className='hidden md:flex items-center space-x-4'>
					<Link href='/login' className='text-gray-700 hover:text-blue-600 border border-gray-300 rounded px-4 py-2 hover:border-blue-600'>
						Log In
					</Link>
					<Link href='/premium' className='[background:var(--color-primary)] text-white rounded px-4 py-2 hover:[background:var(--color-primary-hover)]'>
						Go Premium
					</Link>
				</div>

				{/* Mobile Hamburger Menu */}
				<div className='md:hidden'>
					<button onClick={() => setIsMenuOpen(!isMenuOpen)} className='text-gray-700 focus:outline-none'>
						<svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
						</svg>
					</button>
				</div>
			</div>

			{/* Mobile Menu (Collapsible) */}
			{isMenuOpen && (
				<div className='md:hidden bg-white border-t'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col space-y-4'>
						<Link href='/tools' className='text-gray-700 hover:text-blue-600'>
							Tools
						</Link>
						<Link href='/pricing' className='text-gray-700 hover:text-blue-600'>
							Pricing
						</Link>
						<Link href='/api' className='text-gray-700 hover:text-blue-600'>
							API
						</Link>
						<button className='text-gray-700 hover:text-blue-600 text-left'>EN</button>
						<Link href='/login' className='text-gray-700 hover:text-blue-600'>
							Log In
						</Link>
						<Link href='/premium' className='bg-blue-600 text-white rounded px-4 py-2 text-center hover:bg-blue-700'>
							Go Premium
						</Link>
					</div>
				</div>
			)}
		</header>
  );
}