import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import UnlockWallet from '../../account/unlock/UnlockWallet'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="unlock">
        <UiContianers.Modals id="unlock" width="750px" className="rs">
          <UnlockWallet />
        </UiContianers.Modals>
      </Containers.Layers>
    </div>
  )
}
export default Modals
