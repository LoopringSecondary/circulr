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
        <UiContianers.Modals>
          <Receive />
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="transfer">
        <UiContianers.Modals>
          <Transfer />
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="transferConfirm">
        <UiContianers.Modals>
          <TransferConfirm />
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="convert">
        <UiContianers.Modals>
          <Convert />
        </UiContianers.Modals>
      </Containers.Modals>
    </div>
  )
}
export default Modals
