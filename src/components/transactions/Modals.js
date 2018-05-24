import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Detail from './Detail'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="txDetail">
        <UiContianers.Panels id="txDetail" position="right" width="450px">
          <Detail />
        </UiContianers.Panels>
      </Containers.Layers>
    </div>
  )
}
export default Modals
