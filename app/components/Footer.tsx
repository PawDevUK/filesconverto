"use client";

import React from 'react';
import {GreenButton} from '@/app/components/ui/Button'

type FooterProps = {
	companyName: string;
};

const Footer: React.FC<FooterProps> = ({ companyName }) => {

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log(e);
	}

	return (
		<footer className="pt-8 pb-4 mt-auto relative bg-no-repeat bg-center">
			<div className="container mx-auto px-4 relative z-10">
				<div className="flex flex-col-reverse lg:flex-row">
					{/* Links Section */}
					<div className="w-full lg:w-2/3">
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
							{/* Info */}
							<div>
								<h5 className="font-bold text-sm uppercase mb-2">Info</h5>
								<ul className="space-y-1">
									<li><a className=" font-light text-sm " href="/formats">Formats</a></li>
									<li><a className=" font-light text-sm " href="/compression">Compression</a></li>
									<li><a className=" font-light text-sm " href="/pricing">Pricing</a></li>
								</ul>
							</div>

							{/* Help */}
							<div>
								<h5 className="font-bold text-sm uppercase mb-2">Help</h5>
								<ul className="space-y-1">
									<li><a className=" font-light text-sm " href="/faq">FAQ</a></li>
									<li><a className=" font-light text-sm " href="/status">Status</a></li>
								</ul>
							</div>

							{/* Resources */}
							<div>
								<h5 className="font-bold text-sm uppercase mb-2">Resources</h5>
								<ul className="space-y-1">
									<li><a className=" font-light text-sm " href="/api">Developer API</a></li>
									<li><a className=" font-light text-sm " href="/tools">Tools</a></li>
									<li><a className=" font-light text-sm " href="/blog">Blog</a></li>
								</ul>
							</div>

							{/* Company */}
							<div>
								<h5 className="font-bold text-sm uppercase mb-2">Company</h5>
								<ul className="space-y-1">
									<li><a className=" font-light text-sm " href="/about">About Us</a></li>
									<li><a className=" font-light text-sm " href="/sustainability">Sustainability</a></li>
									<li><a className=" font-light text-sm " href="/terms">Terms of Service</a></li>
									<li><a className=" font-light text-sm " href="/privacy">Privacy</a></li>
								</ul>
							</div>
						</div>
					</div>

					{/* Newsletter and Social Section */}
					<div className="w-full lg:w-1/3 mb-8 lg:mb-0 lg:pl-8">
						{/* Newsletter */}
						<div className="mb-6">
							<h3 className="text-sm mb-3">Subscribe to our email newsletter</h3>
							<form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubmit}>
								<div className="flex-1">
									<label htmlFor="footer-subscribe-email" className="sr-only">Your email address</label>
									<input 
										id="footer-subscribe-email" 
										className="w-full px-3 py-2 text-sm border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-white placeholder-gray-400" 
										name="EMAIL" 
										placeholder="Your email" 
										type="email"
									/>
								</div>
								<GreenButton
									type="submit" 
								>
									Subscribe
								</GreenButton>
							</form>
						</div>

						{/* Social Media */}
						<div className="flex space-x-3">
							<a 
								className="hover:opacity-80 transition-opacity" 
								href="https://www.facebook.com/filesconverto" 
								title={`Like ${companyName} on Facebook`} 
								target="_blank" 
								rel="noopener noreferrer"
							>
								<div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
									<span className="text-white text-sm font-bold">f</span>
								</div>
							</a>

							<a 
								className="hover:opacity-80 transition-opacity" 
								href="https://twitter.com/filesconverto" 
								title={`Follow ${companyName} on X (formerly Twitter)`} 
								target="_blank" 
								rel="noopener noreferrer"
							>
								<div className="w-8 h-8 bg-black rounded flex items-center justify-center">
									<span className="text-white text-sm font-bold">𝕏</span>
								</div>
							</a>

							<a 
								className="hover:opacity-80 transition-opacity" 
								href="https://www.instagram.com/filesconverto/" 
								title={`Check out ${companyName} on Instagram`} 
								target="_blank" 
								rel="noopener noreferrer"
							>
								<div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-500 rounded flex items-center justify-center">
									<span className="text-white text-sm font-bold">📷</span>
								</div>
							</a>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 pt-4 border-t border-gray-700">
					<div className="text-center lg:text-left">
						<small className="text-gray-400">
							Copyright © 2006 - {new Date().getFullYear()} {companyName}{' '}
							<span className="hidden sm:inline">-</span>{' '}
							<span className="block sm:inline">All Rights Reserved</span>
						</small>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
