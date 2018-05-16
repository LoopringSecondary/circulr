import React from 'react';
import {Input, Button, Select} from 'antd';
import routeActions from 'common/utils/routeActions'


function UnlockByTrezor(props) {
  const {hardwareWallet, dispatch} = props;
  const {address, dpath, publicKey, chainCode,walletType} = hardwareWallet;

  const unlock = () => {
    dispatch({type: 'wallet/unlockTrezorWallet', payload: {dpath: `${dpath}/0`, address}});
    hardwareWallet.reset();
    routeActions.gotoPath('/wallet')
  };

  const moreAddress = () => {
    props.dispatch({type: 'determineWallet/setHardwareWallet', payload: {publicKey,chainCode, dpath,walletType}});
    hardwareWallet.reset();
    routeActions.gotoPath('/unlock/determineWallet');
  };
  return (
    <div>
      <div className="card bg-white">
        <div className="card-body notice">
          <div><i className="icon-warning"/></div>
        </div>
        <div>
          Address:{address}
        </div>
        <div>
          <Button type='primary' onClick={unlock}>解锁默认地址</Button>
          <Button type='primary' onClick={moreAddress}>选择更多地址</Button>
        </div>
      </div>
    </div>
  )
}

export default UnlockByTrezor
