import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Setting from './Setting'
import GasFee from './GasFee'
function Modals(props) {
  return (
    <div>
      <Containers.Modals id="setting">
        <UiContianers.Modals id="setting">
          <Setting />
        </UiContianers.Modals>
      </Containers.Modals>
      <Containers.Modals id="gasFee">
        <UiContianers.Modals id="gasFee">
          <GasFee />
        </UiContianers.Modals>
      </Containers.Modals>

    </div>
  )
}
export default Modals
