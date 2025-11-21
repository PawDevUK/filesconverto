'use client';

import React, { createContext, useContext, useState } from 'react';

type MenuRoute = 'Convert' | 'Compress' | 'Tools' | 'API' | null;

type JumboCardContextType = {
	isOpen: boolean;
	activeRoute: MenuRoute;
	open: (route: MenuRoute) => void;
	close: () => void;
	toggle: (route: MenuRoute) => void;
};

const JumboCardContext = createContext<JumboCardContextType | undefined>(undefined);

export const JumboCardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [activeRoute, setActiveRoute] = useState<MenuRoute>(null);

	const open = (route: MenuRoute) => {
		setActiveRoute(route);
		setIsOpen(true);
	};

	const close = () => {
		setActiveRoute(null);
		setIsOpen(false);
	};

	const toggle = (route: MenuRoute) => {
		// If clicking same route and open -> close
		if (activeRoute === route && isOpen) {
			close();
			return;
		}
		// Otherwise open with new route
		open(route);
	};

	return <JumboCardContext.Provider value={{ isOpen, activeRoute, open, close, toggle }}>{children}</JumboCardContext.Provider>;
};

export function useJumboCard() {
	const ctx = useContext(JumboCardContext);
	if (!ctx) throw new Error('useJumboCard must be used within JumboCardProvider');
	return ctx;
}
