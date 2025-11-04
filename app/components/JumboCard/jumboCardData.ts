export type JumboItem = {
	header: string;
	convertTypes: string[];
};

export const ConvertData: JumboItem[] = [
	{
		header: 'Video & Audio',
		convertTypes: ['Video Converter', 'Audio Converter', 'MP3 Converter', 'MP4 to MP3', 'Video to MP3', 'MP4 Converter', 'MOV to MP4', 'MP3 to OGG'],
	},
	{
		header: 'Image',
		convertTypes: ['Image Converter', 'WEBP to PNG', 'JFIF to PNG', 'PNG to SVG', 'HEIC to JPG', 'HEIC to PNG', 'WEBP to JPG', 'SVG Converter'],
	},
	{
		header: 'PDF & Documents',
		convertTypes: [
			'PDF Converter',
			'Document Converter',
			'Ebook Converter',
			'PDF to Word',
			'PDF to JPG',
			'PDF to EPUB',
			'EPUB to PDF',
			'HEIC to PDF',
			'DOCX to PDF',
			'JPG to PDF',
		],
	},
	{
		header: 'GIF',
		convertTypes: ['Video to GIF', 'MP4 to GIF', 'WEBM to GIF', 'APNG to GIF', 'GIF to MP4', 'GIF to APNG', 'Image to GIF', 'MOV to GIF', 'AVI to GIF'],
	},
	{
		header: 'Others',
		convertTypes: ['Unit Converter', 'Time Converter', 'Archive Converter'],
	},
];

type CompressItem = {
	header: string;
	compressTypes: string[];
};

export const CompressData: CompressItem[] = [
	{
		header: 'Video & Audio',
		compressTypes: ['Video Compressor', 'MP3 Compressor', 'WAV Compressor'],
	},
	{
		header: 'Image',
		compressTypes: ['Image Compressor', 'JPEG Compressor', 'PNG Compressor'],
	},
	{
		header: 'PDF & Documents',
		compressTypes: ['PDF Compressor'],
	},
	{
		header: 'GIF',
		compressTypes: ['GIF Compressor'],
	},
];

type Tools = {
	header: string;
	tools: string[];
};

export const ToolsData: Tools[] = [
	{
		header: 'Video Tools',
		tools: ['Crop Video', 'Trim Video'],
	},
	{
		header: 'Image Tools',
		tools: ['GIF Maker', 'Resize Image', 'Crop Image', 'Color Picker', 'Rotate Image', 'Flip Image', 'Image Enlarger'],
	},
	{
		header: 'PDF Tools',
		tools: [
			'PDF Merge',
			'PDF Split',
			'Flatten PDF',
			'Resize PDF',
			'Unlock PDF',
			'Rotate PDF',
			'Protect PDF',
			'Crop PDF',
			'Organize PDF',
			'Extract image from PDF',
			'PDF page remover',
			'Extract Pages from PDF',
		],
	},
];
