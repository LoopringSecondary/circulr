import React from 'react'
import {Containers} from 'modules'
import UnlockByKeystore from '../unlock/UnlockByKeystore';


export default function UnlockKeystoreContainer(props) {
  return (
    <div>
    <Containers.Keystore>
      <UnlockByKeystore/>
    </Containers.Keystore>
    </div>
  )
}
