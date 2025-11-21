import React from 'react';

type H3Props = {
	children: React.ReactNode;
	className?: string;
};

function H3({ children, className = '' }: H3Props) {
	return <h3 className={`text-xl md:text-2xl font-light mb-4 mt-6 ${className}`.trim()}>{children}</h3>;
}

export default H3;
