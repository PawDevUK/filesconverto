import React from 'react';

type FooterProps = {
	companyName: string;
};

const Footer: React.FC<FooterProps> = ({ companyName }) => {
	return (
		<footer className='py-8 px-6 bg-gray-200 text-center text-sm text-gray-600'>
			&copy; {new Date().getFullYear()} {companyName}. All rights reserved.
		</footer>
	);
};

export default Footer;
