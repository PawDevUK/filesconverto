'use client';
import React from 'react';
import Hero from './Main/Hero';
import MainPage from './pages/main';

const Home: React.FC = () => {
	return (
		<MainPage>
			<Hero></Hero>
		</MainPage>
	);
};

export default Home;
