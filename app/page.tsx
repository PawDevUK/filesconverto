'use client';
import React from 'react';
import Hero from './Main/Hero';
import MainPage from './pages/main';

type HomeProps = {
	companyName: string;
};

const Home: React.FC<HomeProps> = () => {
	return (
		<MainPage>
			<Hero></Hero>
		</MainPage>
	);
};

export default Home;
