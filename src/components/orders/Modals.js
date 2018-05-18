import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Detail from './Detail'
import PlaceOrderConfirm from './PlaceOrderConfirm'
import PlaceOrderSteps from './PlaceOrderSteps'
import PlaceOrderLRCFee from './PlaceOrderLRCFee'
function Modals(props) {
  return (
    <div>
      <Containers.Modals id="orderDetail">
        <UiContianers.Modals id="orderDetail">
          <Detail />
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="placeOrderConfirm">
        <UiContianers.Modals id="placeOrderConfirm">
          <PlaceOrderConfirm />
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="placeOrderSteps">
        <UiContianers.Modals id="placeOrderSteps" wrapClassName="">
          <PlaceOrderSteps />
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="placeOrderLRCFee">
        <UiContianers.Modals id="placeOrderLRCFee" wrapClassName="">
          <PlaceOrderLRCFee />
        </UiContianers.Modals>
      </Containers.Modals>
    </div>
  )
}
export default Modals
