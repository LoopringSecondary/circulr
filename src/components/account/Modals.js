import React from 'react'
import {Containers} from 'modules'
import UiContianers from 'LoopringUI/containers'
import UserCenter from './UserCenter'
import ExportKeystore from './ExportKeystore'
import SignByLoopr from './sign/SignByLoopr'


function Modals(props) {
  return (
    <div>
      <Containers.Layers id="userCenter">
        <UiContianers.Panels id="userCenter" position="right" width="300px">
          <UserCenter />
        </UiContianers.Panels>
      </Containers.Layers>
      <Containers.Layers id="export">
        <UiContianers.Modals id="export" >
          <ExportKeystore />
        </UiContianers.Modals>
      </Containers.Layers>
      <Containers.Layers id="signByLoopr">
        <UiContianers.Modals id="signByLoopr" >
          <SignByLoopr />
        </UiContianers.Modals>
      </Containers.Layers>
    </div>
  )
}
export default Modals
