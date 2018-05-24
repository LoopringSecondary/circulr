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
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'placeOrderSteps'})}>Steps</Button>
      </span>
      <span>
        <Button className="" type="primary" onClick={props.layers.showLayer.bind(this,{id:'placeOrderLRCFee'})}>LRC Fee</Button>
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
    	<Containers.Orders id="MyOpenOrders">
        <TestComp />
      </Containers.Orders>
      <Containers.Modals>
        <Containers.Layers>
        <TestModal />
      </Containers.Layers>
      </Containers.Modals>
      <Containers.Sockets>
        <TestScokets />
      </Containers.Sockets>

      {
        true &&
        <Containers.Tabs id="MyOpenOrders" initState={{activeKey:'orders'}} render={(props)=>{
            return (
                <div>
                  <div className="tabs-header">
                    <span className="tab" onClick={props.MyOpenOrders.activeKeyChange.bind(this,{activeKey:'orders'})}>Orders</span>
                    <span className="tab" onClick={props.MyOpenOrders.activeKeyChange.bind(this,{activeKey:'fills'})}>Fills</span>
                  </div>
                  <div className="tabs-body">
                    {
                      props.MyOpenOrders.activeKey === 'orders' &&
                      <span className="">Orders</span>
                    }
                    {
                      props.MyOpenOrders.activeKey === 'fills' &&
                      <span className="">Fills</span>
                    }
                  </div>
                </div>
            )
        }}/>
      }
    </div>
  )
}
export default Test
