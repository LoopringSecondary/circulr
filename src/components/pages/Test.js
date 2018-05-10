import React from 'react'
import {Button} from 'antd'
import Orders from 'modules/orders/containers'
import ModalContainer from 'modules/modals/container'

const TestComp = (props)=>{
  console.log(props.title,props)
  const showModal =()=>{
    window.STORE.dispatch({
      type:'modals/showModal',
      payload:{
        id:'test'
      }
    })
  }
  return (
    <div className="p10">
      {props.title}
      <Button type="primary" onClick={showModal}>Show Modal</Button>
    </div>
  )
}
const TestModal = (props)=>{
  console.log('TestModal',props)
	return (
		<div className="p10">
			TestModal
      <Button type="primary">Show Modal</Button>
		</div>
	)
}

const Test = (props)=>{
  return (
    <div>
      <ModalContainer apisOnly={true}>
      	<Orders.ListContainer id="orders/trade">
          <TestComp title="Orders List"/>
        </Orders.ListContainer>
      </ModalContainer>
      <Orders.PlaceOrderContainer>
    		<TestComp title="PlaceOrder Form" />
      </Orders.PlaceOrderContainer>
      <ModalContainer id="test">
        <TestModal />
      </ModalContainer>
    </div>
  )
}
export default Test
