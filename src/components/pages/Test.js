import React from 'react';
import Orders from 'modules/orders/containers'

const TestComp = (props)=>{
	return (
		<div>
			{props.title}
		</div>
	)
}
const Test = (props)=>{
  return (
    <div>
    	<Orders.ListContainer>
        <TestComp title="Orders List"/>
      </Orders.ListContainer>
      <Orders.PlaceOrderContainer>
    		<TestComp title="PlaceOrder Form" />
    	</Orders.PlaceOrderContainer>
    </div>
  )
}
export default Test
