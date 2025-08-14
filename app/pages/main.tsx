'use client';
import React, { ReactNode } from 'react';
import './main.css';

type props = {
	children: ReactNode;
};

const MainPage: React.FC<props> = ({ children }) => {
	return <div className='flex flex-col items-center justify-center mainWrapper min-h-screen bg-gray-50 text-gray-600'>{children}</div>;
};
export default MainPage;
