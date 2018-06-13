 import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Detail from './Detail'
import PlaceOrderConfirm from './PlaceOrderConfirm'
import PlaceOrderSteps from './PlaceOrderSteps'
import PlaceOrderByLoopr from './PlaceOrderByLoopr'
import PlaceOrderByMetamask from './PlaceOrderByMetamask'
import PlaceOrderByLedger from './PlaceOrderByLedger'
import PlaceOrderSign from './PlaceOrderSign'
import TradeByP2P from './TradeByP2P'
import PlaceOrderLRCFee from './PlaceOrderLRCFee'
import PlaceOrderTTL from './PlaceOrderTTL'
import CancelOrderConfirm  from './CancelOrderConfirm'
import FlexCancelOrder from './FlexCancelOrder'


function Modals(props) {
  return (
    <div>
      <Containers.Layers id="orderDetail">
        <UiContianers.Panels id="orderDetail" position="right" width="450px">
          <Detail />
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="placeOrderConfirm">
        <UiContianers.Modals id="placeOrderConfirm" position="left" width="600px"  className="rs" wrapClassName="theme-blue">
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
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="placeOrderSteps">
        <UiContianers.Modals id="placeOrderSteps" width="650px" wrapClassName="" className="rs">
          <PlaceOrderSteps />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="placeOrderByLoopr">
        <UiContianers.Modals id="placeOrderByLoopr" width="650px" wrapClassName="" className="rs">
          <PlaceOrderByLoopr />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="placeOrderByMetamask">
        <UiContianers.Modals id="placeOrderByMetamask" width="650px" wrapClassName="" className="rs">
          <PlaceOrderByMetamask />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="placeOrderByLedger">
        <UiContianers.Modals id="placeOrderByLedger" width="650px" wrapClassName="" className="rs">
          <PlaceOrderByLedger />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="placeOrderSign">
        <UiContianers.Modals id="placeOrderSign" width="650px">
          <PlaceOrderSign />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="tradeByP2P">
        <UiContianers.Modals id="tradeByP2P" width="500px">
          <TradeByP2P />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="placeOrderLRCFee">
        <UiContianers.Modals id="placeOrderLRCFee" className="rs">
          <Containers.LrcFee>
            <PlaceOrderLRCFee />
          </Containers.LrcFee>
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="placeOrderTTL">
        <UiContianers.Modals id="placeOrderTTL" className="rs">
          <Containers.Ttl>
            <PlaceOrderTTL />
          </Containers.Ttl>
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="cancelOrderConfirm">
        <UiContianers.Modals id="cancelOrderConfirm" className="rs">
          <Containers.Settings>
            <Containers.Wallet>
            <Containers.Gas>
              <CancelOrderConfirm />
            </Containers.Gas>
            </Containers.Wallet>
          </Containers.Settings>
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="flexCancelOrder">
        <UiContianers.Modals id="flexCancelOrder" className="rs">
                <FlexCancelOrder />
        </UiContianers.Modals>
      </Containers.Layers>
    </div>
  )
}
export default Modals
