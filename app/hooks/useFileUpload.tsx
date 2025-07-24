import { useState, useCallback } from 'react';
import axios from 'axios';

// const Python_API_URL = 'http://127.0.0.1:5000/convert';
const API_URL = '/api/uploads';

type fileStateT = {
	file: null | File;
	isLoading: boolean;
	error: string | null;
	response: Blob | object | null;
};

function useFileUpload() {
	const [state, setState] = useState<fileStateT>({
		file: null,
		isLoading: false,
		error: null,
		response: null,
	});

	const uploadFile = useCallback(async (file: File) => {
		setState((prev) => ({ ...prev, isLoading: true, error: null, file }));

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await axios.post(API_URL, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			setState((prev) => ({
				...prev,
				isLoading: false,
				response: response.data,
				error: null,
			}));
		} catch (error: unknown) {
			if (axios.isAxiosError(error)) {
				if (
					error.code === 'ERR_NETWORK' ||
					error.message.toLowerCase().includes('network error') ||
					error.message.includes('ERR_CONNECTION_REFUSED')
				) {
					setState((prev) => ({
						...prev,
						isLoading: false,
						error: 'Cannot connect to server. Is it running?',
						response: null,
					}));
				}
				const errorMessage =
					error.response?.data?.message || error.message || 'An unexpected error occurred';
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: errorMessage,
					response: null,
				}));
			} else {
				setState((prev) => ({
					...prev,
					isLoading: false,
					error: 'An unknown error occurred',
					response: null,
				}));
			}
		}
	}, []);

	return { state, uploadFile };
}

export default useFileUpload;
