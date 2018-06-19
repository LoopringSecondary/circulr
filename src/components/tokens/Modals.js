import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Receive from './Receive'
import Transfer from './TransferForm'
import Convert from './ConvertForm'
import TransferConfirm from './TransferConfirm'
import ConvertConfirm from './ConvertConfirm'


function Modals(props) {
  return (
    <div>
      <Containers.Layers id="receiveToken">
        <Containers.Sockets id="balance">
          <UiContianers.Modals id="receiveToken" width="450px" wrapClassName="theme-blue">
            <Receive/>
          </UiContianers.Modals>
        </Containers.Sockets>
      </Containers.Layers>
      <Containers.Layers id="transferToken">
        <UiContianers.Panels id="transferToken" position="right" width="450px">
          <Containers.Sockets id="balance">
            <Containers.Sockets id="marketcap">
              <Containers.Wallet>
                <Containers.Transfer>
                    <Containers.Gas>
                      <Transfer />
                    </Containers.Gas>
                </Containers.Transfer>
              </Containers.Wallet>
            </Containers.Sockets>
          </Containers.Sockets>
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="transferConfirm">
        <UiContianers.Panels id="transferConfirm" position="right" width="450px">
          <Containers.Sockets id="marketcap">
            <Containers.Wallet>
              <Containers.Settings>
                <TransferConfirm />
              </Containers.Settings>
            </Containers.Wallet>
          </Containers.Sockets>
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="convertToken" >
        <UiContianers.Panels id="convertToken" position="right" width="450px">
                <Containers.Convert >
                  <Convert/>
                </Containers.Convert>
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="convertConfirm">
          <UiContianers.Modals id="convertConfirm"  className="rs" wrapClassName="theme-blue">
            <ConvertConfirm/>
          </UiContianers.Modals>
      </Containers.Layers>
    </div>
  )
}
export default Modals
