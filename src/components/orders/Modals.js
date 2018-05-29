import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Detail from './Detail'
import PlaceOrderConfirm from './PlaceOrderConfirm'
import PlaceOrderSteps from './PlaceOrderSteps'
import PlaceOrderLRCFee from './PlaceOrderLRCFee'
import CancelOrderConfirm  from './CancelOrderConfirm'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="orderDetail">
        <UiContianers.Panels id="orderDetail" position="right" width="450px">
          <Detail />
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="placeOrderConfirm">
        <UiContianers.Panels id="placeOrderConfirm" position="right" width="450px">
          <Containers.Settings>
            <Containers.Wallet>
              <Containers.Layers>
                <Containers.PlaceOrder>
                  <Containers.Sockets id="balance">
                    <Containers.Sockets id="marketcap">
                      <Containers.Sockets id="pendingTx">
                        <PlaceOrderConfirm />
                      </Containers.Sockets>
                    </Containers.Sockets>
                  </Containers.Sockets>
                </Containers.PlaceOrder>
              </Containers.Layers>
            </Containers.Wallet>
          </Containers.Settings>
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="placeOrderSteps">
        <UiContianers.Modals id="placeOrderSteps" width="650px">
          <PlaceOrderSteps />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="placeOrderLRCFee">
        <UiContianers.Modals id="placeOrderLRCFee">
          <PlaceOrderLRCFee />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="cancelOrderConfirm">
        <UiContianers.Panels id="cancelOrderConfirm" position="right" width="450px">
          <Containers.Settings>
            <Containers.Wallet>
            <Containers.Gas>
              <CancelOrderConfirm />
            </Containers.Gas>
            </Containers.Wallet>
          </Containers.Settings>
        </UiContianers.Panels>
      </Containers.Layers>
    </div>
  )
}
export default Modals
