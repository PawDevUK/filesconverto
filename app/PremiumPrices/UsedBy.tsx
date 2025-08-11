import React from 'react';
import Image from 'next/image';
import logos from './assets/usedBy/logos'

const UsedBy: React.FC = () => (
  <div className="max-w-6xl mx-auto text-center py-8 px-4">
    <h2 className="text-2xl md:text-3xl font-bold mb-6">Employees of these companies use our service</h2>
    <div className="flex flex-wrap justify-center items-center gap-6 select-none">
      {logos.map((logo,i) => (
        <Image key={i} src={logo.src} alt={logo.alt} width={160} height={64} className="h-12 md:h-16 object-contain" />
      ))}
    </div>
  </div>
);

export default UsedBy;
