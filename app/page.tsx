'use client';
import React from 'react';
import Head from 'next/head';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';

type HomeProps = {
  companyName: string,
};

const Home: React.FC<HomeProps> = ({ companyName="FilesConverto" }) => {
	return (
		<div className='min-h-screen bg-gray-50 text-gray-800'>
			<Head>
				<title>Free Files Converter</title>
			</Head>

			<Header companyName={companyName}></Header>
			<Hero></Hero>

			{/* Features Section */}

			{/* Footer */}
			<Footer companyName={companyName}></Footer>
		</div>
	);
}

export default Home;
