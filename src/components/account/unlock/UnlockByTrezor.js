import React from 'react';
import {Input, Button, Select} from 'antd';
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'
import intl from 'react-intl-universal'



function UnlockByTrezor(props) {
  const {hardwareWallet, dispatch} = props;
  const {address, dpath, publicKey, chainCode, walletType} = hardwareWallet;

  const unlock = () => {
    if (address) {
      dispatch({type: 'wallet/unlockTrezorWallet', payload: {dpath: `${dpath}/0`, address}});
      Notification.open({type: 'success', message:intl.get('notifications.title.unlock_suc')});
      hardwareWallet.reset();
      dispatch({type: 'sockets/unlocked'})
      routeActions.gotoPath('/wallet')
      dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})
    } else {
      Notification.open({type: 'error', message:intl.get('notifications.title.unlock_fail'), description: intl.get('unlock.connect_trezor_tip')})
    }

  };

  const moreAddress = () => {
    if(address){
      props.dispatch({type: 'determineWallet/setHardwareWallet', payload: {publicKey, chainCode, dpath, walletType}});
      hardwareWallet.reset();
      routeActions.gotoPath('/unlock/determineWallet');
    }else {
      Notification.open({type: 'error',  description: intl.get('unlock.connect_trezor_tip')})
    }
  };
  return (
    <div>
      <b>{intl.get('wallet_determine.default_address')}：{address}</b>
      <div className="blk"></div>
      <div>
        <Button className="btn btn-primary btn-xlg btn-block" onClick={unlock}>{intl.get('unlock.actions_unlock')}</Button>
        <div className="blk"></div>
        <Button className="btn btn-primary btn-xlg btn-block" onClick={moreAddress}>{intl.get('wallet_determine.actions_other_address')}</Button>
      </div>
    </div>
  )
}

export default UnlockByTrezor
