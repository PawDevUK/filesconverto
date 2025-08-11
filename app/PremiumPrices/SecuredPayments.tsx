import React from 'react'
import Image from 'next/image';
import stripe from './assets/securedPayments/stripe.svg'
import paypal from './assets/securedPayments/paypal.svg'
import lock from './assets/securedPayments/lock.svg'
import './premium.css'

const SecuredPayments: React.FC = () => (
  <div className="secured-Pay flex flex-col items-center justify-center py-8 mt-3">
    <h3 className="flex items-center text-lg font-semibold mb-4">
      <Image src={lock} alt='lock'></Image>
      <span>Payments are secured with</span>
    </h3>
    <div className="flex flex-wrap justify-center items-center gap-4">
      <Image src={stripe} alt='stripe'></Image>
      <Image src={paypal} alt='paypal'></Image>
    </div>
  </div>
);

export default SecuredPayments;
