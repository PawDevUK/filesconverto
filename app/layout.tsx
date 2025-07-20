import '@/app/styles/globals.css';
import React from 'react';
import Head from 'next/head';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

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
				<Header companyName={companyName}></Header>
				{children}
				<Footer companyName={companyName}></Footer>
			</body>
		</html>
	);
}
