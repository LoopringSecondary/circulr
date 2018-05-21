import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Detail from './Detail'
function Modals(props) {
  return (
    <div>
      <Containers.Modals id="ringDetail">
        <UiContianers.Modals id="ringDetail">
          <Detail />
        </UiContianers.Modals>
      </Containers.Modals>
    </div>
  )
}
export default Modals
