import { useState, useCallback } from 'react';
import axios from 'axios';

// API endpoint
const API_URL = 'http://127.0.0.1:5000/convert';

type fileStateT = {
	file: null | File;
	isLoading: boolean;
	error: string | null;
	response: Blob | object | null;
};

function useFileUpload() {
	// State for file, loading, error, and response
	const [state, setState] = useState<fileStateT>({
		file: null,
		isLoading: false,
		error: null,
		response: null,
	});

	// Memoized function to handle file upload
	const uploadFile = useCallback(async (file: File) => {
		setState((prev) => ({ ...prev, isLoading: true, error: null, file }));

		try {
			// Create FormData for file upload
			const formData = new FormData();
			formData.append('file', file);

			// Make API call
			const response = await axios.post(API_URL, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
			if (response.status !== 200) {
				const error = await response.data.error;
				if (error.code === 'ECONNREFUSED' || error.message.includes('ERR_CONNECTION_REFUSED')) {
					setState((prev) => ({
						...prev,
						isLoading: false,
						error: 'Cannot connect to server. Is it running?',
						response: null,
					}));
				}

				setState((prev) => ({
					...prev,
					error: error,
				}));

				throw new Error(state.error || 'Upload failed.');
			}

			// Update state with response
			setState((prev) => ({
				...prev,
				isLoading: false,
				response: response.data,
				error: null,
			}));
		} catch (error: unknown | object) {
			// Handle error
			if (axios.isAxiosError(error)){
				const errorMessage = error.response?.data?.message || error.message || 'An unexpected error occurred';
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
					response: null,
				}));
			}
		}
    return state;
	}, []);
	return { state, uploadFile };
}

export default useFileUpload;
