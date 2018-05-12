import React from 'react'
import {Button} from 'antd'
import { Containers } from 'modules'
console.log('Containers',Containers)
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
        <Button type="primary" onClick={props.sockets.urlChange.bind(this,{url:"//pre-relay1.loopring.io"})}>Change Relay</Button>
      </div>
		</div>
	)
}

const Test = (props)=>{
  return (
    <div>
    	<Containers.Orders id="orders/trade">
        <TestComp title="Orders List"/>
      </Containers.Orders>
      <Containers.PlaceOrder>
    		<TestComp title="PlaceOrder Form" />
      </Containers.PlaceOrder>
      <Containers.Modals id="test">
        <TestModal />
      </Containers.Modals>
      <Containers.Sockets>
        <TestScokets />
      </Containers.Sockets>
    </div>
  )
}
export default Test
