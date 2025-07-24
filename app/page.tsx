'use client';
import React from 'react';
import Hero from './components/Hero';

const Home: React.FC = () => {
	return (
		<div className='min-h-screen bg-gray-50 text-gray-800'>
			<Hero></Hero>
		</div>
	);
};

export default Home;
