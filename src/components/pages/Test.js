import React from 'react';
import Orders from 'modules/orders/containers'

const OrderList = (props)=>{
	console.log('OrderList props',props)
	return (
		<div>
			Orders List		
		</div>
	)
}
console.log('orders',Orders)
const Test = (props)=>{
  return (
    <div>
    	<Orders.ListContainer>
    		<OrderList />
    	</Orders.ListContainer>
    </div>
  )
}
export default Test
