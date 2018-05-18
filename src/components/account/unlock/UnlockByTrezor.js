import React from 'react';
import {Input, Button, Select} from 'antd';
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'

function UnlockByTrezor(props) {
  const {hardwareWallet, dispatch} = props;
  const {address, dpath, publicKey, chainCode, walletType} = hardwareWallet;

  const unlock = () => {
    if (address) {
      dispatch({type: 'wallet/unlockTrezorWallet', payload: {dpath: `${dpath}/0`, address}});
      Notification.open({type: 'success', message: '解锁成功', description: 'unlock'});
      hardwareWallet.reset();
      routeActions.gotoPath('/wallet')
    } else {
      Notification.open({type: 'error', message: 'unlock failed', description: 'Connect to your TREZOR'})
    }

  };

  const moreAddress = () => {
    if(address){
      props.dispatch({type: 'determineWallet/setHardwareWallet', payload: {publicKey, chainCode, dpath, walletType}});
      hardwareWallet.reset();
      routeActions.gotoPath('/unlock/determineWallet');
    }else {
      Notification.open({type: 'error', message: 'unlock failed', description: 'Connect to your TREZOR'})
    }
  };
  return (
    <div>
      <b>Address：{address}</b>
      <div className="blk"></div>
      <div>
        <Button className="btn btn-primary btn-xlg btn-block" onClick={unlock}>解锁默认地址</Button>
        <div className="blk"></div>
        <Button className="btn btn-primary btn-xlg btn-block" onClick={moreAddress}>选择更多地址</Button>
      </div>
    </div>
  )
}

export default UnlockByTrezor
