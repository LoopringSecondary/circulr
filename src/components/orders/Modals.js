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
      <Containers.Modals id="orderDetail">
        <UiContianers.Modals id="orderDetail">
          <Detail />
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="placeOrderConfirm">
        <UiContianers.Modals id="placeOrderConfirm">
          <Containers.Settings>
            <Containers.Wallet>
              <Containers.Modals>
                <Containers.PlaceOrder>
                  <Containers.Sockets id="balance">
                    <Containers.Sockets id="marketcap">
                      <Containers.Sockets id="pendingTx">
                        <PlaceOrderConfirm />
                      </Containers.Sockets>
                    </Containers.Sockets>
                  </Containers.Sockets>
                </Containers.PlaceOrder>
              </Containers.Modals>
            </Containers.Wallet>
          </Containers.Settings>
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
      <Containers.Modals id="cancelOrderConfirm">
        <UiContianers.Modals id="cancelOrderConfirm" wrapClassName="">
          <Containers.Settings>
            <Containers.Wallet>
          <CancelOrderConfirm />
            </Containers.Wallet>
          </Containers.Settings>
        </UiContianers.Modals>
      </Containers.Modals>
    </div>
  )
}
export default Modals
