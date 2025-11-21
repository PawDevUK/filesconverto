'use client';

import { useRouter } from 'next/navigation';

export default function NotFound() {
	const router = useRouter();

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<div className='text-center'>
				<h1 className='heading-1 mb-4'>404</h1>
				<h2 className='heading-3 mb-4'>Page Not Found</h2>
				<p className='body-base mb-8'>The page you&apos;re looking for doesn&apos;t exist.</p>
				<button onClick={() => router.push('/')} className='bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors'>
					Go Home
				</button>
			</div>
		</div>
	);
}
