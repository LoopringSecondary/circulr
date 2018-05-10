import React from 'react';
import Orders from 'modules/orders/containers'
import ModalContainer from 'modules/modals/container'

const TestComp = (props)=>{
  console.log(props.title,props)
	return (
		<div>
			{props.title}
		</div>
	)
}
const Test = (props)=>{
  return (
    <div>
    	<Orders.ListContainer id="orders/trade">
        <TestComp title="Orders List"/>
      </Orders.ListContainer>
      <Orders.PlaceOrderContainer>
    		<TestComp title="PlaceOrder Form" />
      </Orders.PlaceOrderContainer>
      <ModalContainer id="test">
        <TestComp title="PlaceOrder Form" />
      </ModalContainer>
    </div>
  )
}
export default Test
