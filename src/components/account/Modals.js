import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import UserCenter from './UserCenter'
function Modals(props) {
  return (
    <div>
      <Containers.Layers id="userCenter">
        <UiContianers.Panels id="userCenter" position="right" width="300px">
          <UserCenter />
        </UiContianers.Panels>
      </Containers.Layers>
    </div>
  )
}
export default Modals
