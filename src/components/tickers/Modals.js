import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import ListAllTickers from './ListAllTickers'
function Modals(props) {
  return (
    <div>
      <Containers.Modals id="ListAllTickers">
        <UiContianers.Modals id="ListAllTickers">
          <ListAllTickers />
        </UiContianers.Modals>
      </Containers.Modals>
    </div>
  )
}
export default Modals
