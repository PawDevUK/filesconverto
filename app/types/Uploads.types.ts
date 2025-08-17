export type Metadata = {
	pageCount?: number;
	format?: string;
	size?: {
		width: number;
		height: number;
	};
};

export type Response = {
	pageCount?: number;
	metadata?: Metadata;
	message?: string;
	fileUrl?: string;
	fileUrls?: string[];
};