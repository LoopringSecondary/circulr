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
          Notification.open({type: 'success', message: intl.get('notifications.title.unlock_suc'),});
          hardwareWallet.reset();
          dispatch({type: 'sockets/unlocked'})
          routeActions.gotoPath('/trade')
          dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})
        }
      });
    } else {
      Notification.open({type: 'error', message: intl.get('notifications.title.unlock_fail'), description: intl.get('unlock.connect_ledger_tip')})
    }
  };

  const moreAddress = () => {
    if (address) {
      props.dispatch({type: 'determineWallet/setHardwareWallet', payload: {publicKey, chainCode, dpath, walletType}});
      hardwareWallet.reset();
      routeActions.gotoPath('/unlock/determineWallet');
    } else {
      Notification.open({type: 'error',  description:intl.get('unlock.connect_ledger_tip')})
    }
  };
  return (
    <div className="form-dark">
      <span className="label">{intl.get('wallet_determine.default_address')}:{address}</span>
      <div className="blk"/>
      <div style={{width:"460px"}}>
        <Button className="btn btn-primary btn-xxlg btn-block" onClick={unlock}>{intl.get('unlock.actions_unlock')}</Button>
        <div className="blk"/>
        <Button className="btn btn-primary btn-xxlg btn-block" onClick={moreAddress}>{intl.get('wallet_determine.actions_other_address')}</Button>
      </div>
    </div>
  )
}

export default Ledgers
