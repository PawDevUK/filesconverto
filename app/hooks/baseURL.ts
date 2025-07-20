const getBaseUrl = (): string => {
		if (typeof window !== 'undefined') {
			// Client-side: Use window.location
			return `${window.location.protocol}//${window.location.host}`;
		}
		// Fallback for server-side (optional, see below)
		return 'http://localhost:3000'; // Default for development
	};

export default getBaseUrl;