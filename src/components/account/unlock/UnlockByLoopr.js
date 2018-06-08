import React from 'react';
import {Button, Modal, Steps} from 'antd';
import {connect} from 'dva'
import {MetaMaskAccount,} from "LoopringJS/ethereum/account";
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'
import intl from 'react-intl-universal';
import QRCode from 'qrcode.react';

function UnlockByLoopr(props) {
  const {scanAddress, dispatch} = props

  const generateUUID = () => {
    dispatch({type:'scanAddress/uuidChanged', payload:{UUID:'12345'}})
  }

  const mockAddress = () => {
    const address = '0x987654321'
    dispatch({type:'scanAddress/addressChanged', payload:{address}})
    dispatch({type:"wallet/unlockAddressWallet",payload:{address}});
    Notification.open({type:'success',message:intl.get('notifications.title.unlock_suc')});
    dispatch({type: 'sockets/unlocked'});
    routeActions.gotoPath('/wallet');
    dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})
    dispatch({type:'scanAddress/reset', payload:{}})
  }

  return (
    <div className="text-center">
      <div style={{width:"320px"}} className="m-auto bg-white text-center p10">
        {scanAddress.UUID && <QRCode value={JSON.stringify({type:'loginUUID', value:scanAddress.UUID})} size={300} level='H'/>}
      </div>
      Address: {scanAddress && scanAddress.address}
      <div style={{width:"320px"}} className="pt15 pb15 text-left m-auto" >
        1. 下载 Loopr IOS 版
        <br />
        2. xxx
        <Button className="mt15" type="default" onClick={generateUUID}> Generate UUID </Button>
        <Button className="mt15" type="default" onClick={mockAddress}> Mock address </Button>
      </div>
    </div>
  )
}

function mapToProps(state) {
  return {
    scanAddress:state.scanAddress
  }
}
export default connect(mapToProps)(UnlockByLoopr)
