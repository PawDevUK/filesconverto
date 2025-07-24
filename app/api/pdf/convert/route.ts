import { pdfAPIHandler } from '@/lib/pdf-converter/api-handler';
import { NextRequest } from 'next/server';

export async function POST(request: Request) {
  const nextRequest = new NextRequest(request);
  return pdfAPIHandler.handleConvert(nextRequest);
}