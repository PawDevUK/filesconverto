import React from 'react'
import Image from 'next/image';
import stripe from './assets/securedPayments/stripe.svg'
import paypal from './assets/securedPayments/paypal.svg'
import lock from './assets/securedPayments/lock.svg'
import H3 from '@/app/typography/Headers'
import './premium.css'

const SecuredPayments: React.FC = () => (
  <div className="secured-Pay flex flex-col items-center justify-center py-8 mt-3">
    <H3 className="flex items-center">
      <Image src={lock} alt='lock'></Image>
      <span className='text-1xl md:text-2xl font-light ml-3'>Payments are secured with</span>
    </H3>
    <div className="flex flex-wrap justify-center items-center gap-4 opacity-70">
      <Image src={stripe} alt='stripe'></Image>
      <Image src={paypal} alt='paypal'></Image>
    </div>
  </div>
);

export default SecuredPayments;
