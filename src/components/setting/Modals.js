import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Setting from './Setting'
import GasFee from './GasFee'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="setting">
        <UiContianers.Panels id="setting" position="right" width="450px">
          <Setting />
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="gasFee">
        <UiContianers.Modals id="gasFee" className="rs">
          <Containers.Gas>
            <GasFee />
          </Containers.Gas>
        </UiContianers.Modals>
      </Containers.Layers>

    </div>
  )
}
export default Modals
