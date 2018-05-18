import React from 'react';
import {Input, Button, Select} from 'antd';
import routeActions from 'common/utils/routeActions'
import {connect} from "LoopringJS/ethereum/ledger";
import Notification from '../../../common/loopringui/components/Notification';

function Ledgers(props) {

  const {hardwareWallet, dispatch} = props;
  const {address, dpath, publicKey, chainCode, walletType} = hardwareWallet;

  const unlock = () => {
    if (address) {
      connect().then(res => {
        if (!res.error) {
          const ledger = res.result;
          dispatch({type: 'wallet/unlockLedgerWallet', payload: {ledger, dpath: `${dpath}/0`}});
          Notification.open({type: 'success', message: '解锁成功', description: 'unlock'});
          hardwareWallet.reset();
          routeActions.gotoPath('/wallet')
        }
      });
    } else {
      Notification.open({type: 'error', message: 'unlock failed', description: 'Connect to your ledger wallet '})
    }
  };

  const moreAddress = () => {
    if (address) {
      props.dispatch({type: 'determineWallet/setHardwareWallet', payload: {publicKey, chainCode, dpath, walletType}});
      hardwareWallet.reset();
      routeActions.gotoPath('/unlock/determineWallet');
    } else {
      Notification.open({type: 'error', message: 'unlock failed', description: 'Connect to your ledger wallet '})
    }
  };
  return (
    <div>
      <b>Default Address:{address}</b>
      <div className="blk"></div>
      <div>
        <Button className="btn btn-primary btn-xlg btn-block" onClick={unlock}>解锁</Button>
        <div className="blk"></div>
        <Button className="btn btn-primary btn-xlg btn-block" onClick={moreAddress}>More Addresses</Button>
      </div>
    </div>
  )
}

export default Ledgers
