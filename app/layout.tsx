import '@/app/styles/globals.css';
import React from 'react';
import Head from 'next/head';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { JumboCardProvider } from '@/app/hooks/jumboCardContext';

import { store } from '@/app/store/data';
const companyName = store.companyName || 'FilesConverto';
export const metadata = {
	title: 'Files Converter',
	icons: {
		icon: '/favicon.ico',
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`antialiased`}>
				<Head>
					<title>Free Files Converter</title>
				</Head>
				{/* Provide JumboCard state to Header, Footer and descendants */}
				<JumboCardProvider>
					<Header companyName={companyName}></Header>
					{children}
					<Footer companyName={companyName}></Footer>
				</JumboCardProvider>
			</body>
		</html>
	);
}
