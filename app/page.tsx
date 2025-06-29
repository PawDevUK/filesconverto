'use client';
import React from 'react';
import Hero from './components/Hero';

type HomeProps = {
	companyName: string;
};

const Home: React.FC<HomeProps> = () => {
	return (
		<div className='min-h-screen bg-gray-50 text-gray-800'>
			<Hero></Hero>
		</div>
	);
};

export default Home;
