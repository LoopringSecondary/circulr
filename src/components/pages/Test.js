import React from 'react'
import {Button} from 'antd'
import Orders from 'modules/orders/containers'
import ModalContainer from 'modules/modals/container'
import Sockets from 'modules/sockets/container'

const TestComp = (props)=>{
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
      <Button type="primary" onClick={props.test.hideModal}>hide Modal</Button>
    </div>
  )
}
const TestScokets = (props)=>{
	return (
		<div className="p10">
      <div>
        <Button type="primary" onClick={props.sockets.connect}>connect</Button>
        <Button type="primary" onClick={props.sockets.fetch.bind(this,{id:'prices'})}>get prices</Button>
        <Button type="primary" onClick={props.sockets.urlChange.bind(this,{url:"pre-relay1.loopring.io"})}>Change Relay</Button>
      </div>
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
        <TestModal />
      </ModalContainer>
      <Sockets.SocketsContainer>
        <TestScokets />
      </Sockets.SocketsContainer>
    </div>
  )
}
export default Test
