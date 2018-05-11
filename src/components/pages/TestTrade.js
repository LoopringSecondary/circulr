import React from 'react';
import {connect} from 'react-redux';
import Orders from 'modules/orders/containers'
import PlaceOrderForm from '../orders/PlaceOrderForm'

const Test = ({dispatch})=>{
  dispatch({
    type:'placeOrder/pairChangeEffects', payload:{pair:'EOS-WETH'}
  })

  return (
    <div>
    	<Orders.PlaceOrderContainer>
        <PlaceOrderForm />
      </Orders.PlaceOrderContainer>
    </div>
  )
}
export default connect()(Test)
