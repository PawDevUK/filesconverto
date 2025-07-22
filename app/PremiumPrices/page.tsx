"use client"
import React, {useEffect} from 'react';
import MainPage from '../pages/main';
import PricingCard from '../components/ui/card';

function PremiumPrices() {
  useEffect(()=>{

  },[])
  // const [state, setState] = useState()
  return (
   <MainPage>
    {<div>
      <PricingCard></PricingCard>
    </div>}
   </MainPage>
  )
}

export default PremiumPrices;