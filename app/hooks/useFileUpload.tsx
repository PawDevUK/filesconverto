import { useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = '/api/uploads';

type FileStateT = {
    file: null | File;
    isLoading: boolean;
    error: string | null;
    response: {
        message?: string;
        fileUrl?: string;
        fileUrls?: string[];
        pageCount?: number;
        metadata?: unknown;
    } | null;
};

type UploadOptions = {
    format?: string;
    quality?: number;
    dpi?: number;
};

function useFileUpload() {
    const [state, setState] = useState<FileStateT>({
        file: null,
        isLoading: false,
        error: null,
        response: null,
    });

    const uploadFile = useCallback(async (file: File, options: UploadOptions = {}) => {
        setState((prev) => ({ ...prev, isLoading: true, error: null, file }));

        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Add format options
            if (options.format) formData.append('format', options.format);
            if (options.quality) formData.append('quality', options.quality.toString());
            if (options.dpi) formData.append('dpi', options.dpi.toString());

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

            // Auto-download the converted file(s)
            if (response.data.fileUrl) {
                // Single file download
                downloadFile(response.data.fileUrl);
            } else if (response.data.fileUrls && Array.isArray(response.data.fileUrls)) {
                // Multiple files download
                response.data.fileUrls.forEach((url: string, index: number) => {
                    setTimeout(() => downloadFile(url), index * 500); // Stagger downloads
                });
            }

            return response.data;
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
                } else {
                    const errorMessage =
                        error.response?.data?.error || 
                        error.response?.data?.message || 
                        error.message || 
                        'An unexpected error occurred';
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                        error: errorMessage,
                        response: null,
                    }));
                }
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

    const downloadFile = (url: string) => {
        const link = document.createElement("a");
        link.href = url;
        link.download = "";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return { state, uploadFile };
}

export default useFileUpload;
