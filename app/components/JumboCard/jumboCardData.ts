import { JumboItem, Tools, CompressItem, API } from './JumboCard.types';

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
export const APIdata: API[] = [
	{
		header: 'Documentation',
		apiTypes: ['API Job Builder', 'API Documentation'],
	},
	{
		header: 'Conversion APIs',
		apiTypes: [
			'File Conversion API',
			'Image Conversion API',
			'Audio Conversion API',
			'Document Conversion API',
			'PDF Conversion API',
			'MP4 Conversion API',
			'Video Conversion API',
		],
	},
	{
		header: 'Specific APIs',
		apiTypes: [
			'JPG to PDF API',
			'Video to MP3 API',
			'HEIC to JPG API',
			'PDF to JPG API',
			'Webp to PNG API',
			'PDF to WORD API',
			'MP4 to MP3 API',
			'Webp to JPG API',
			'WORD to PDF API',
			'HTML to PDF API',
			'Website Screenshot API',
		],
	},
	{
		header: 'Compression APIs',
		apiTypes: ['Video Compression API', 'Compress PDF API', 'Image Compression API'],
	},
];
