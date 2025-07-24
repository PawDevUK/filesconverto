import { NextRequest, NextResponse } from 'next/server';
import { pdfConverter } from './converter';
import { ConversionOptions } from './types';
import { getMimeType } from './utils';

export class PDFAPIHandler {
	/**
	 * Handle PDF conversion API request
	 */
	public async handleConvert(request: NextRequest): Promise<NextResponse> {
		try {
			const formData = await request.formData();
			const file = formData.get('file') as File;
			const options = this.parseOptions(formData);

			if (!file) {
				return NextResponse.json({ error: 'No file provided' }, { status: 400 });
			}

			const buffer = Buffer.from(await file.arrayBuffer());
			const result = await pdfConverter.convert(buffer, options);

			if (!result.success) {
				return NextResponse.json({ error: result.error }, { status: 400 });
			}

			// Return single image or zip for multiple pages
			if (Buffer.isBuffer(result.data)) {
				return new NextResponse(result.data, {
					headers: {
						'Content-Type': getMimeType(options.outputFormat),
						'Content-Disposition': `attachment; filename="converted.${options.outputFormat}"`,
					},
				});
			} else {
				// Multiple pages - return as JSON with base64 data
				const pages = (result.data as Buffer[]).map((buffer, index) => ({
					page: index + 1,
					data: buffer.toString('base64'),
					mimeType: getMimeType(options.outputFormat),
				}));

				return NextResponse.json({
					success: true,
					pages,
					metadata: result.metadata,
				});
			}
		} catch (error) {
			console.error('API Error:', error);
			return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
		}
	}

	/**
	 * Handle PDF info API request
	 */
	public async handleInfo(request: NextRequest): Promise<NextResponse> {
		try {
			const formData = await request.formData();
			const file = formData.get('file') as File;

			if (!file) {
				return NextResponse.json({ error: 'No file provided' }, { status: 400 });
			}

			const buffer = Buffer.from(await file.arrayBuffer());
			const info = await pdfConverter.getInfo(buffer);

			return NextResponse.json({ success: true, info });
		} catch (error) {
			console.error('API Error:', error);
			return NextResponse.json({ error: 'Failed to extract PDF info' }, { status: 400 });
		}
	}

	private parseOptions(formData: FormData): ConversionOptions {
		return {
			outputFormat: (formData.get('format') as any) || 'png',
			quality: formData.get('quality') ? parseInt(formData.get('quality') as string) : 90,
			dpi: formData.get('dpi') ? parseInt(formData.get('dpi') as string) : 150,
			scale: formData.get('scale') ? parseFloat(formData.get('scale') as string) : 1.0,
			background: (formData.get('background') as string) || 'white',
			transparent: formData.get('transparent') === 'true',
			pageRange: this.parsePageRange(formData.get('pageRange') as string),
		};
	}

	private parsePageRange(pageRange: string | null): { start?: number; end?: number } | undefined {
		if (!pageRange) return undefined;

		const [start, end] = pageRange.split('-').map((n) => parseInt(n.trim()));
		return { start, end };
	}
}

export const pdfAPIHandler = new PDFAPIHandler();
