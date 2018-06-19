import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import UserCenter from './UserCenter'
import ExportKeystore from './ExportKeystore'
import SignByLoopr from './sign/SignByLoopr'
import SignByMetaMask from './sign/SignByMetaMask'
import SignByLedger from './sign/SignByLedger'
import ChooseLedgerAddress from './unlock/ChooseLedgerAddress'


function Modals(props) {
  return (
    <div>
      <Containers.Layers id="userCenter">
        <UiContianers.Panels id="userCenter" position="right" width="300px">
          <Containers.Wallet>
            <UserCenter />
          </Containers.Wallet>
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="export">
        <UiContianers.Modals id="export" >
          <ExportKeystore />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="signByLoopr">
        <UiContianers.Modals id="signByLoopr" >
          <SignByLoopr />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="signByMetaMask">
        <UiContianers.Modals id="signByMetaMask" >
          <SignByMetaMask />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="signByLedger">
        <UiContianers.Modals id="signByLedger" >
          <SignByLedger />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="chooseLedgerAddress">
        <UiContianers.Modals id="chooseLedgerAddress" >
          <ChooseLedgerAddress />
        </UiContianers.Modals>
      </Containers.Layers>
    </div>
  )
}
export default Modals
