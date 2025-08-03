"use client"
import React, {useEffect} from 'react';
import MainPage from '../pages/main';
import PricingCard from '../components/ui/card';
import{ price_Plans, pricePlans }from 'app/store/data'
import './premium.css'

const PremiumPrices:React.FC<price_Plans>=() =>{
  useEffect(()=>{

  },[])
  // const [state, setState] = useState()
  return (
   <MainPage>
    <div className='cards-wrapper'>
      {
      pricePlans.map((plan, index)=>{
      return <PricingCard key={index}
      {...plan} ></PricingCard>
      })
      }
    </div>
   </MainPage>
  )
}

export default PremiumPrices;