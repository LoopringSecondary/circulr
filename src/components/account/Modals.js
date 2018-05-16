import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import UserCenter from './UserCenter'
function Modals(props) {
  return (
    <div>
      <Containers.Modals id="userCenter">
        <UiContianers.Modals id="userCenter" width="20%">
          <UserCenter />
        </UiContianers.Modals>
      </Containers.Modals>
    </div>
  )
}
export default Modals
