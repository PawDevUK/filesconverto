// components/ui/button.tsx
'use client';

import { ButtonHTMLAttributes, FC } from 'react';
import Link from 'next/link';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'default' | 'outline' | 'ghost';
	closeJumbo?: () => void;
};

export const Button: FC<ButtonProps> = ({ children, className, variant = 'default', ...props }) => {
	const baseStyles = 'px-4 py-2 rounded font-medium transition focus:outline-none focus:ring-2';
	const variantStyles = {
		default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300',
		outline: 'border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-300',
		ghost: 'text-blue-600 hover:bg-blue-100 focus:ring-blue-300',
	};

	return (
		<button className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
			{children}
		</button>
	);
};

// Alternative: Flexible GreenButton that can be either Link or Button
type GreenButtonProps = {
	className?: string;
	children: React.ReactNode;
	closeJumbo?: () => void;
} & ({ href: string; type?: never; onClick?: never } | { href?: never; type?: 'button' | 'submit' | 'reset'; onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void });

export const GreenButton: FC<GreenButtonProps> = ({ closeJumbo, children, className = '', href, type }) => {
	const baseStyles = '[background:var(--color-primary)] text-white rounded px-4 py-2 hover:[background:var(--color-primary-hover)]';

	if (href) {
		// If caller provided a closeJumboCard handler, attach it to the Link's onClick
		// so clicking the link will also run the handler (e.g. close overlays) while
		// preserving native link behavior (middle-click/new-tab).
		return (
			<Link
				href={href}
				onClick={() => {
					if (closeJumbo) closeJumbo();
				}}
				className={`${baseStyles} ${className}`.trim()}>
				{children}
			</Link>
		);
	}

	return (
		<button type={type || 'button'} onClick={closeJumbo} className={`${baseStyles} ${className}`.trim()}>
			{children}
		</button>
	);
};
