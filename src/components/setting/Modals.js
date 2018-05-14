import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Setting from './Setting'
function Modals(props) {
  return (
    <div>
      <Containers.Modals id="setting">
        <UiContianers.Modals>
          <Setting />
        </UiContianers.Modals>
      </Containers.Modals>
    </div>
  )
}
export default Modals
