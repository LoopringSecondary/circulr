import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import Detail from './Detail'
import Resend from './Resend'
import Cancel from './Cancel'

function Modals(props) {
  return (
    <div>
      <Containers.Layers id="txDetail">
        <UiContianers.Panels id="txDetail" position="right" width="450px">
          <Detail />
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="resend">
        <UiContianers.Modals id="resend">
          <Resend />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="cancel">
        <UiContianers.Modals id="cancel">
          <Cancel />
        </UiContianers.Modals>
      </Containers.Layers>
    </div>
  )
}
export default Modals
