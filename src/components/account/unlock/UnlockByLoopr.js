import React from 'react';
import {connect} from 'dva'
import intl from 'react-intl-universal';
import QRCode from 'qrcode.react';
import CountDown from 'LoopringUI/components/CountDown';
import moment from 'moment'
import uuidv4 from 'uuid/v4'

function UnlockByLoopr(props) {
  const {scanAddress, dispatch} = props
  let targetTime = moment().valueOf() + 600000;

  const refresh = () => {
    const uuid = uuidv4();
    dispatch({type:'scanAddress/uuidChanged', payload:{UUID:uuid.substring(0, 8)}});
    dispatch({type:'sockets/extraChange',payload:{id:'addressUnlock', extra:{UUID:uuid.substring(0, 8)}}});
    dispatch({type:'sockets/fetch',payload:{id:'addressUnlock'}});
    targetTime = moment().valueOf() + 600000;
  }

  return (
    <div className="d-flex justify-content-center">
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
