import React from 'react'
import {Button} from 'antd'
import { Containers } from 'modules'
import UiContianers from 'LoopringUI/containers'
const TestComp = (props)=>{
  const showModal =()=>{
    props.dispatch({
      type:'modals/showModal',
      payload:{
        id:'test'
      }
    })
  }
  return (
    <div className="p10" style={{padding:'10px'}}>
      {props.title}
      <Button type="primary" onClick={showModal}>Show Modal</Button>
    </div>
  )
}
const TestModal = (props)=>{
  return (
    <div className="group-span" style={{padding:'10px'}}>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'gasFee'})}>Gas Fee</Button>
      </span>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'placeOrderLRCFee'})}>LRC Fee</Button>
      </span>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'placeOrderTTL'})}>TTL</Button>
      </span>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'placeOrderSteps'})}>placeOrderSteps</Button>
      </span>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'placeOrderByLoopr'})}>placeOrderByLoopr</Button>
      </span>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'placeOrderByMetamask'})}>placeOrderByMetamask</Button>
      </span>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'placeOrderByLedger'})}>placeOrderByLedger</Button>
      </span>

      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'tradeByP2P'})}>TradeByP2P</Button>
      </span>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'placeOrderConfirm'})}>PlaceOrderConfirm</Button>
      </span>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'unlock'})}>Unlock</Button>
      </span>


    </div>
  )
}
const TestScokets = (props)=>{
	return (
		<div className="p10" style={{padding:'10px'}}>
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
      <Containers.Modals>
        <Containers.Layers>
          <TestModal />
        </Containers.Layers>
      </Containers.Modals>
    </div>
  )
}
export default Test
