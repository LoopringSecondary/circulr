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
    <div className="d-flex justify-content-center">
      {
        false && scanAddress.address &&
        <div>
          <div>Address: {scanAddress.address}</div>
          <div><Button className="mt15" type="default" onClick={unlock}> Unlock In Watch Only Mode </Button></div>
        </div>
      }
      {
        !scanAddress.address &&
        <div className="">
          <div className="loopr-qrcode">
            {scanAddress && scanAddress.UUID && <QRCode value={JSON.stringify({type:'UUID', value:scanAddress.UUID})} size={160} level='H'/>}
            <CountDown style={{ fontSize: 20 }} target={targetTime} onEnd={refresh}/>
            </div>
        </div>
      }

      <div className="loopr-notice" >
        <p>1. {intl.get('unlock_by_loopr.instruction_download')}</p>
        <p>
        2. {intl.get('unlock_by_loopr.instruction_scan')}
        </p>
        {intl.get('unlock_by_loopr.instruction_warn')}
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
