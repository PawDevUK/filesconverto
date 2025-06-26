// pages/index.tsx
"use client" 
import Head from 'next/head';
import Header from './layout/header';
import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function Home() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Dropped files:', acceptedFiles);
    // Handle file processing here
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Head>
        <title>Free Files Converter</title>
      </Head>

      {/* Header */}
     <Header>

     </Header>

      {/* Hero Section with Drag and Drop */}
      <section className="text-center py-20 bg-gradient-to-b from-white to-gray-100">
        <h2 className="text-4xl font-bold mb-4">Convert Files Effortlessly</h2>
        <p className="text-lg text-gray-600 mb-6">Fast, free, and secure file conversions in seconds.</p>

        <div
          {...getRootProps()}
          className="cursor-pointer border-2 border-dashed border-blue-400 px-6 py-12 rounded-lg bg-white max-w-xl mx-auto transition hover:bg-blue-50"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-blue-600">
            <Upload className="h-8 w-8 mb-3" />
            {
              isDragActive ? (
                <p className="text-lg font-medium">Drop the files here ...</p>
              ) : (
                <p className="text-lg font-medium">Drag & drop files here, or click to select</p>
              )
            }
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 max-w-5xl mx-auto text-center">
        <h3 className="text-2xl font-semibold mb-6">Supported Formats</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm text-gray-700">
          <div>PDF</div>
          <div>JPG</div>
          <div>MP4</div>
          <div>MP3</div>
          <div>PNG</div>
          <div>DOCX</div>
          <div>GIF</div>
          <div>AVI</div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-6 bg-white text-center">
        <h3 className="text-2xl font-semibold mb-6">How It Works</h3>
        <ol className="space-y-4 max-w-xl mx-auto text-left list-decimal list-inside">
          <li>Select the file you want to convert</li>
          <li>Choose the output format</li>
          <li>Click Convert and wait a few seconds</li>
          <li>Download your converted file</li>
        </ol>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-200 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} FreeConvert. All rights reserved.
      </footer>
    </div>
  );
}