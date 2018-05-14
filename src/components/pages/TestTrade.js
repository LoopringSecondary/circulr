import React from 'react';
import {connect} from 'react-redux';
import { Containers } from 'modules'
import PlaceOrderForm from '../orders/PlaceOrderForm'

const Test = ({dispatch})=>{
  dispatch({
    type:'placeOrder/pairChangeEffects', payload:{pair:'EOS-WETH'}
  })
  dispatch({
    type:'placeOrder/sideChangeEffects', payload:{side:'sell'}
  })

  return (
    <div>
      <Containers.PlaceOrder>
        <PlaceOrderForm />
      </Containers.PlaceOrder>
    </div>
  )
}
export default connect()(Test)
