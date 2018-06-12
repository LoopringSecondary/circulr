import React from 'react';
import {Button, Modal, Steps} from 'antd';
import {connect} from 'dva'
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'
import intl from 'react-intl-universal';
import QRCode from 'qrcode.react';
import CountDown from 'LoopringUI/components/CountDown';
import moment from 'moment'
import uuidv4 from 'uuid/v4'

function UnlockByLoopr(props) {
  const {scanAddress, dispatch} = props
  let targetTime = moment().valueOf() + 600000;

  const refresh = () => {
    const uuid = uuidv4()
    props.dispatch({type:'scanAddress/uuidChanged', payload:{UUID:uuid.substring(0, 8)}})
    props.dispatch({type:'sockets/extraChange',payload:{id:'addressUnlock', extra:{UUID:uuid.substring(0, 8)}}});
    props.dispatch({type:'sockets/fetch',payload:{id:'addressUnlock'}});
    targetTime = moment().valueOf() + 600000;
  }

  const unlock = () => {
    const address = scanAddress.address
    if(!address) {
      return
    }
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
      {
        scanAddress.address &&
        <div>
          <div>Address: {scanAddress.address}</div>
          <div><Button className="mt15" type="default" onClick={unlock}> Unlock In Watch Only Mode </Button></div>
        </div>
      }
      {
        !scanAddress.address &&
        <div>
          <div style={{width:"320px"}} className="m-auto bg-white text-center p10">
            {scanAddress && scanAddress.UUID && <QRCode value={JSON.stringify({type:'UUID', value:scanAddress.UUID})} size={300} level='H'/>}
          </div>
          <CountDown style={{ fontSize: 20 }} target={targetTime} onEnd={refresh}/>
        </div>
      }

      <div style={{width:"320px"}} className="pt15 pb15 text-left m-auto" >
        1. 下载 Loopr IOS 版
        <br />
        2. xxx
        <br />
        * 二维码有效时间10分钟，请尽快扫描确认。过期后请重新扫描
        <br />
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
