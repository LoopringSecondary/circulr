import React from 'react';
import {Button} from 'antd';
import routeActions from 'common/utils/routeActions'
import {connect} from "LoopringJS/ethereum/ledger";
import Notification from '../../../common/loopringui/components/Notification';
import intl from 'react-intl-universal'


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
          dispatch({type: 'sockets/unlocked'})
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
    <div className="form-dark">
      <span className="label">{intl.get('wallet.default_address')}:{address}</span>
      <div className="blk"></div>
      <div>
        <Button className="btn btn-primary btn-xlg btn-block" onClick={unlock}>{intl.get('wallet.actions_unlock')}</Button>
        <div className="blk"></div>
        <Button className="btn btn-primary btn-xlg btn-block" onClick={moreAddress}>{intl.get('wallet.actions_other_address')}</Button>
      </div>
    </div>
  )
}

export default Ledgers
