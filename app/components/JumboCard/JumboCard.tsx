import React from 'react';

type DataItem = {
	header: string;
	convertTypes?: string[];
	compressTypes?: string[];
	tools?: string[];
};

type JumboCardProps = {
	data: DataItem[];
	title: string;
	routeType: 'Convert' | 'Compress' | 'Tools' | 'API';
};

export default function JumboCard({ data, title, routeType }: JumboCardProps) {
	// Determine which property to access based on route type
	const getItems = (item: DataItem): string[] => {
		if (routeType === 'Convert') return item.convertTypes || [];
		if (routeType === 'Compress') return item.compressTypes || [];
		if (routeType === 'Tools') return item.tools || [];
		return [];
	};

	if (routeType === 'API') {
		return (
			<div className='px-4 sm:px-6 lg:px-8 py-8'>
				<h2 className='text-2xl font-bold text-gray-900 mb-6'>{title}</h2>
				<p className='text-gray-700'>API documentation coming soon...</p>
			</div>
		);
	}

	return (
		<div className='px-4 sm:px-6 lg:px-8 py-8'>
			<h2 className='text-2xl font-bold text-gray-900 mb-6'>{title}</h2>
			<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0'>
				{data.map((item, index) => (
					<div key={index} className='flex flex-col space-y-3'>
						<h3 className='text-lg font-semibold text-gray-900 border-b-2 border-r-2 border-gray-200 pb-2'>{item.header}</h3>
						<ul className='space-y-2 border-r-2 border-gray-200 h-[150px] overflow-y-auto'>
							{getItems(item).map((type: string, typeIndex: number) => (
								<li key={typeIndex}>
									<button className='text-sm text-gray-700 hover:text-blue-600 hover:underline text-left w-full transition-colors'>{type}</button>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	);
}
