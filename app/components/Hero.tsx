import useFileUpload from "@/app/hooks/useFileUpload";
import { useDropzone } from 'react-dropzone';
import { store } from '@/app/store/data';
import { Upload, FileText, CheckCircle, AlertCircle, Download, Settings } from 'lucide-react';
import React, { useState } from 'react';

type Metadata = {
    pageCount?: number;
    format?: string;
    size?: {
        width: number;
        height: number;
    };
};

type Response = {
    pageCount?: number;
    metadata?: Metadata;
    message?: string;
    fileUrl?: string;
    fileUrls?: string[];
};

type State = {
    isLoading: boolean;
    error?: string;
    response?: Response;
};

const Hero: React.FC = () => {
    type UploadOptions = {
        format: string;
        quality: number;
        dpi: number;
    };
    const { uploadFile, state } = useFileUpload() as { uploadFile: (file: File, options?: UploadOptions) => Promise<void>, state: State };
    const [selectedFormat, setSelectedFormat] = useState<string>('docx');
    const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
    const [quality, setQuality] = useState<number>(90);
    const [dpi, setDpi] = useState<number>(150);
    
    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) {
            console.error('No files accepted');
            return;
        }
        
        await uploadFile(acceptedFiles[0], {
            format: selectedFormat,
            quality,
            dpi
        });
    };

    const formatOptions = [
        { value: 'docx', label: 'DOCX (Word Document)', icon: '📝' },
        { value: 'png', label: 'PNG (Image)', icon: '🖼️' },
        { value: 'jpeg', label: 'JPEG (Image)', icon: '📷' },
        { value: 'webp', label: 'WebP (Image)', icon: '🎨' },
        // { value: 'svg', label: 'SVG (Vector)', icon: '🎯' }
    ];

    const FileFormat: React.FC<{ supportedFormats: Array<string> }> = ({ supportedFormats }) => (
        <section id='features' className='py-16 px-6 max-w-5xl mx-auto text-center'>
            <h3 className='text-2xl font-semibold mb-6'>Supported Conversions</h3>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-gray-700'>
                {supportedFormats.map((format) => (
                    <div key={format} className='bg-gray-100 p-4 rounded-lg shadow-sm hover:bg-gray-200 transition'>
                        <FileText className='h-6 w-6 mx-auto mb-2 text-gray-600' />
                        <span className='font-medium'>{format}</span>
                    </div>
                ))}
            </div>
        </section>
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'application/pdf': ['.pdf']
        },
        maxFiles: 1,
        multiple: false,
        maxSize: 50 * 1024 * 1024 // 50MB limit
    });

    return (
        <>
            <section className='text-center py-20 bg-gradient-to-b from-white to-gray-100'>
                <h2 className='text-4xl font-bold mb-4'>Convert PDF Files</h2>
                <p className='text-lg text-gray-600 mb-6'>Fast, free, and secure PDF conversion to multiple formats.</p>
                
                {/* Format Selection */}
                <div className='max-w-xl mx-auto mb-6'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Choose Output Format:
                    </label>
                    <select
                        value={selectedFormat}
                        onChange={(e) => setSelectedFormat(e.target.value)}
                        className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        disabled={state.isLoading}
                    >
                        {formatOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.icon} {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Advanced Options */}
                <div className='max-w-xl mx-auto mb-6'>
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className='flex items-center mx-auto text-sm text-gray-600 hover:text-gray-800'
                        disabled={state.isLoading}
                    >
                        <Settings className='h-4 w-4 mr-1' />
                        Advanced Options
                    </button>
                    
                    {showAdvanced && selectedFormat !== 'docx' && (
                        <div className='mt-4 p-4 bg-gray-50 rounded-lg'>
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                                        Quality: {quality}%
                                    </label>
                                    <input
                                        type='range'
                                        min='50'
                                        max='100'
                                        value={quality}
                                        onChange={(e) => setQuality(parseInt(e.target.value))}
                                        className='w-full'
                                        disabled={state.isLoading}
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-medium text-gray-700 mb-1'>
                                        DPI: {dpi}
                                    </label>
                                    <select
                                        value={dpi}
                                        onChange={(e) => setDpi(parseInt(e.target.value))}
                                        className='w-full p-1 border border-gray-300 rounded text-sm'
                                        disabled={state.isLoading}
                                    >
                                        <option value={72}>72 (Web)</option>
                                        <option value={150}>150 (Standard)</option>
                                        <option value={300}>300 (High Quality)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Dropzone */}
                <div
                    {...getRootProps()}
                    className={`cursor-pointer border-2 border-dashed border-blue-400 px-6 py-12 rounded-lg bg-white max-w-xl mx-auto transition hover:bg-blue-50 ${
                        state.isLoading ? 'opacity-50 pointer-events-none' : ''
                    } ${isDragActive ? 'border-blue-600 bg-blue-50' : ''}`}
                >
                    <input {...getInputProps()} />
                    <div className='flex flex-col items-center justify-center text-blue-600'>
                        <Upload className={`h-8 w-8 mb-3 ${state.isLoading ? 'animate-pulse' : ''}`} />
                        {state.isLoading ? (
                            <div className='flex flex-col items-center'>
                                <p className='text-lg font-medium'>Converting to {selectedFormat.toUpperCase()}...</p>
                                <div className='mt-3 w-48 bg-gray-200 rounded-full h-2'>
                                    <div className='bg-blue-600 h-2 rounded-full animate-pulse w-3/4'></div>
                                </div>
                                <p className='text-sm text-gray-500 mt-2'>Please wait, this may take a moment</p>
                            </div>
                        ) : isDragActive ? (
                            <p className='text-lg font-medium'>Drop the PDF file here...</p>
                        ) : (
                            <div className='text-center'>
                                <p className='text-lg font-medium mb-2'>Drag & drop a PDF file here, or click to select</p>
                                <p className='text-sm text-gray-500'>
                                    Will convert to <strong>{formatOptions.find(f => f.value === selectedFormat)?.label}</strong>
                                </p>
                                <p className='text-xs text-gray-400 mt-1'>Supports PDF files up to 50MB</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Error Display */}
                {state.error && (
                    <div className='mt-6 p-4 bg-red-50 border border-red-200 rounded-lg max-w-xl mx-auto'>
                        <div className='flex items-center justify-center'>
                            <AlertCircle className='h-5 w-5 text-red-500 mr-2' />
                            <p className='text-red-700 font-medium'>Conversion Failed</p>
                        </div>
                        <p className='text-red-600 mt-2 text-sm'>{state.error}</p>
                    </div>
                )}

                {/* Success Display */}
                {state.response && !state.error && (
                    <div className='mt-6 p-4 bg-green-50 border border-green-200 rounded-lg max-w-xl mx-auto'>
                        <div className='flex items-center justify-center mb-2'>
                            <CheckCircle className='h-5 w-5 text-green-500 mr-2' />
                            <p className='text-green-700 font-medium'>Conversion Successful!</p>
                        </div>
                        
                        <p className='text-green-600 text-sm text-center mb-2'>
                            {state.response.message || `PDF converted to ${selectedFormat.toUpperCase()} successfully`}
                        </p>

                        {state.response.pageCount && state.response.pageCount > 1 ? (
                            <div className='text-center'>
                                <p className='text-green-600 text-sm'>
                                    Converted {state.response.pageCount} pages. Downloads started automatically.
                                </p>
                                <div className='flex items-center justify-center mt-2 text-xs text-gray-500'>
                                    <Download className='h-4 w-4 mr-1' />
                                    Multiple files will download separately
                                </div>
                            </div>
                        ) : (
                            <div className='flex items-center justify-center mt-2 text-xs text-gray-500'>
                                <Download className='h-4 w-4 mr-1' />
                                File downloaded automatically
                            </div>
                        )}

                        {state.response.metadata && (
                            <div className='mt-3 text-xs text-gray-600 bg-white rounded p-2'>
                                <p>Pages: {state.response.metadata.pageCount}</p>
                                <p>Format: {state.response.metadata.format?.toUpperCase()}</p>
                                {state.response.metadata.size && (
                                    <p>Size: {Math.round(state.response.metadata.size.width)} × {Math.round(state.response.metadata.size.height)} px</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </section>

            <FileFormat supportedFormats={store.pdfToOtherFormats.slice(0, 12)} />
            
            <section id='how-it-works' className='py-16 px-6 bg-white text-center'>
                <h3 className='text-2xl font-semibold mb-6'>How It Works</h3>
                <div className='grid md:grid-cols-4 gap-6 max-w-4xl mx-auto'>
                    <div className='flex flex-col items-center'>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                            <span className='text-blue-600 font-bold'>1</span>
                        </div>
                        <h4 className='font-semibold mb-2'>Upload PDF</h4>
                        <p className='text-gray-600 text-sm'>Drag & drop or click to select your PDF file</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                            <span className='text-blue-600 font-bold'>2</span>
                        </div>
                        <h4 className='font-semibold mb-2'>Choose Format</h4>
                        <p className='text-gray-600 text-sm'>Select your desired output format</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                            <span className='text-blue-600 font-bold'>3</span>
                        </div>
                        <h4 className='font-semibold mb-2'>Convert</h4>
                        <p className='text-gray-600 text-sm'>Our system processes your file</p>
                    </div>
                    <div className='flex flex-col items-center'>
                        <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4'>
                            <span className='text-blue-600 font-bold'>4</span>
                        </div>
                        <h4 className='font-semibold mb-2'>Download</h4>
                        <p className='text-gray-600 text-sm'>Download your converted file</p>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Hero;
