"use client"
import React, {useEffect} from 'react';
import MainPage from '../pages/main';
import PricingCard from '../components/ui/card';
import InPaidPlan from '@/app/PremiumPrices/InPaidPlan';
import FairPricing from '@/app/PremiumPrices/FairPricing';
import{ price_Plans, pricePlans }from 'app/store/data'
import './premium.css'

const PremiumPrices:React.FC<price_Plans>=() =>{
  useEffect(()=>{

  },[])
  // const [state, setState] = useState()
  return (
   <MainPage>
    <FairPricing></FairPricing>
    <div className="cards-wrapper grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 justify-items-center">
      {pricePlans.map((plan, index) => (
        <PricingCard key={index} {...plan} />
      ))}
    </div>
    <InPaidPlan></InPaidPlan>
   </MainPage>
  )
}

export default PremiumPrices;