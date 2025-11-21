import React from 'react';
import Image from 'next/image';
import logos from './assets/usedBy/logos';
import H3 from '@/app/typography/Headers'

const UsedBy: React.FC = () => (
  <div className="max-w-6xl mx-auto text-center py-8 px-4">
    <H3 className="">Employees of these companies use our service</H3>
    <div className="flex flex-wrap justify-center items-center gap-6 select-none">
      {logos.map((logo,i) => (
        <Image key={i} src={logo.src} alt={logo.alt} width={120} height={48} className="h-12 md:h-16 object-contain opacity-60" />
      ))}
    </div>
  </div>
);

export default UsedBy;
