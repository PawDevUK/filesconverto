export type DataItem = {
	header: string;
	convertTypes?: string[];
	compressTypes?: string[];
	tools?: string[];
	apiTypes?: string[];
};

export type JumboCardProps = {
	data: DataItem[];
	title: string;
	routeType: 'Convert' | 'Compress' | 'Tools' | 'API';
};

export type JumboItem = {
	header: string;
	convertTypes: string[];
};
export type Tools = {
	header: string;
	tools: string[];
};

export type CompressItem = {
	header: string;
	compressTypes: string[];
};

export type API = {
	header: string;
	apiTypes: string[];
};
