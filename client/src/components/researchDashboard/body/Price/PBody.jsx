// ./client\src\components\researchDashboard\body\Revenue\RBody.jsx
import React from 'react'
import './Pmain.css'

import Cards from './Cards'
import PriceCname from './PriceCname'
import PriLiCname from './PriLiCname'

import Market from './Market'
import Regin from './Regin'
import Currency from './Currency'


const PBody = () => {


   
  return (
    <div> 
   <section className="body" id='body'>
        <div className="row">
            <div className="col-lg-10">
                <div className="row">
                  {
                    Cards && Cards.length>0 &&
                    Cards.map(card=><card key={card._id} card={card}/>)
                  }
                  
                    
                </div>
            </div>
            <div className="col-lg-3">
              <Market />
            
              </div>
              
              <div className="col-lg-3">
              <Regin />
              </div>

              <div className="col-lg-3">
              <Currency />
              </div>

            <div className="col-lg-15 r1">
            <PriceCname/>
            </div>
            <div className="col-lg-15 r1">
            <PriLiCname/>
            </div>
        </div>
        
   </section>

   </div>
  )
}

export default PBody
