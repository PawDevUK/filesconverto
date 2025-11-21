export type State = {
	isLoading: boolean;
	error?: string;
	response?: Response;
};

export type UploadOptions = {
	format: string;
	quality: number;
	dpi: number;
};
