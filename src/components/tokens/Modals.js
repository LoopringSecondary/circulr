import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Receive from './Receive'
import Transfer from './TransferForm'
import Convert from './ConvertForm'
import TransferConfirm from './TransferConfirm'

function Modals(props) {
  return (
    <div>
      <Containers.Modals id="receive">
        <UiContianers.Modals id="receive">
          <Receive/>
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="transfer">
        <UiContianers.Modals id="transfer">
          <Containers.Sockets id="balance">
            <Containers.Sockets id="marketcap">
              <Containers.Wallet>
                <Containers.Transfer initState={{}}>
                  <Containers.Modals>
                    <Transfer />
                  </Containers.Modals>
                </Containers.Transfer>
              </Containers.Wallet>
            </Containers.Sockets>
          </Containers.Sockets>
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="transferConfirm">
        <UiContianers.Modals id="transferConfirm">
          <Containers.Sockets id="marketcap">
            <Containers.Wallet>
              <Containers.Modals>
                <TransferConfirm />
              </Containers.Modals>
            </Containers.Wallet>
          </Containers.Sockets>
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="convert" >
        <UiContianers.Modals id="convert">
          <Containers.Sockets id="balance">
            <Containers.Sockets id="marketcap">
              <Containers.Wallet>
                <Containers.Convert >
                  <Convert/>
                </Containers.Convert>
              </Containers.Wallet>
            </Containers.Sockets>
          </Containers.Sockets>
        </UiContianers.Modals>
      </Containers.Modals>
    </div>
  )
}
export default Modals
